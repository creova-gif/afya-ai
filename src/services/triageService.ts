// Swahili-First Voice Triage & CHW Clinical Handoff Service
import {
  PatientMetadata,
  PresetScenario,
  RiskLevel,
  SBARNote,
  TriageResult,
  TriageResultSchema,
} from '../types/triage';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'malaria-severe',
    titleSwahili: 'Homa Kali na Kutetemeka (Malaria Inayoshukiwa)',
    titleEnglish: 'Severe Fever & Chills (Suspected Acute Malaria)',
    category: 'malaria',
    sampleTranscript:
      'Nimekuwa na homa kali sana tangu juzi, ninatetemeka na kuhisi baridi kali. Kichwa kinauma sana na leo asubuhi nimeanza kutapika. Siwezi kula chochote.',
    expectedRisk: 'YELLOW',
    patient: {
      name: 'Juma Hassan',
      age: 28,
      gender: 'Mwanaume / Male',
      location: 'Kigoma, Tanzania',
      chwPhone: '+255712345678',
    },
  },
  {
    id: 'maternal-danger',
    titleSwahili: 'Mama Mjamzito - Maumivu & Matone ya Damu',
    titleEnglish: 'Maternal Red Flags (Abdominal Pain & Bleeding)',
    category: 'maternal',
    sampleTranscript:
      'Mimi ni mjamzito wa miezi 7. Tangu asubuhi nina maumivu makali ya tumbo na nimeona matone ya damu. Pia macho yananitia giza na kichwa kinauma sana.',
    expectedRisk: 'RED',
    patient: {
      name: 'Amina Bakari',
      age: 24,
      gender: 'Mwanamke / Female',
      location: 'Mbagala, Dar es Salaam',
      chwPhone: '+255754987654',
    },
  },
  {
    id: 'hypertension-crisis',
    titleSwahili: 'Shinikizo la Damu & Kizunguzungu',
    titleEnglish: 'Hypertensive Symptoms & Dizziness',
    category: 'hypertension',
    sampleTranscript:
      'Ninahisi kizunguzungu kikali na moyo unanipiga kwa kasi. Niliacha kumeza dawa zangu za presha wiki iliyopita kwa sababu ziliisha. Shingo pia inanikaza.',
    expectedRisk: 'YELLOW',
    patient: {
      name: 'Mzee Rashidi',
      age: 58,
      gender: 'Mwanaume / Male',
      location: 'Arusha, Tanzania',
      chwPhone: '+255784112233',
    },
  },
];

/**
 * Cross-platform Audio Recording helper
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mimeType: string = 'audio/webm';

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && !!navigator?.mediaDevices?.getUserMedia;
  }

  public async start(): Promise<void> {
    if (!AudioRecorder.isSupported()) {
      throw new Error('Kinasa sauti hakitumiki kwenye kivinjari hiki (MediaRecorder unsupported)');
    }

    // Cross-platform MIME type negotiation (Chrome/Android = webm, iOS/Safari = mp4)
    if (typeof MediaRecorder.isTypeSupported === 'function') {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        this.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        this.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        this.mimeType = 'audio/mp4';
      } else {
        this.mimeType = '';
      }
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    this.audioChunks = [];
    const options = this.mimeType ? { mimeType: this.mimeType } : undefined;
    this.mediaRecorder = new MediaRecorder(stream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(250);
  }

  public async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Hakuna kinasa sauti kilichoanza'));
      }

      this.mediaRecorder.onstop = () => {
        const finalBlob = new Blob(this.audioChunks, {
          type: this.mimeType || 'audio/webm',
        });
        // Stop audio tracks to release microphone hardware indicator
        this.mediaRecorder?.stream?.getTracks().forEach((track) => track.stop());
        resolve(finalBlob);
      };

      this.mediaRecorder.stop();
    });
  }
}

/**
 * Clinical Triage Evaluation & Handoff Engine
 */
export class TriageService {
  /**
   * Run triage evaluation on transcript or audio
   */
  public static async evaluateTriage(params: {
    transcript: string;
    patient: PatientMetadata;
    audioDurationSeconds?: number;
  }): Promise<TriageResult> {
    const text = params.transcript.toLowerCase();
    const patient = params.patient;

    // Detect Clinical Red Flags (Emergency Escalation)
    const isMaternalEmergency =
      text.includes('mjamzito') && (text.includes('damu') || text.includes('maumivu makali') || text.includes('giza'));
    const isBreathingEmergency =
      text.includes('anapumua kwa shida') || text.includes('kubanwa pumzi') || text.includes('kukosa hewa');
    const isUnconscious = text.includes('kuzimia') || text.includes('kupoteza fahamu');

    let riskLevel: RiskLevel = 'GREEN';
    if (isMaternalEmergency || isBreathingEmergency || isUnconscious) {
      riskLevel = 'RED';
    } else if (
      text.includes('homa') ||
      text.includes('kutapika') ||
      text.includes('presha') ||
      text.includes('kizunguzungu') ||
      text.includes('kutetemeka')
    ) {
      riskLevel = 'YELLOW';
    }

    let chiefComplaint = 'Magonjwa ya kawaida / General ailment';
    let swahiliSummary = '';
    let immediateActions: string[] = [];
    let dangerSignsToWatch: string[] = [];
    let sbar: SBARNote;

    if (riskLevel === 'RED') {
      chiefComplaint = isMaternalEmergency
        ? 'Dharura ya Uzazi: Maumivu na Kuvuja Damu (Maternal Emergency)'
        : 'Dharura ya Kupumua / Fahamu (Severe Acute Distress)';

      swahiliSummary = isMaternalEmergency
        ? 'Hali hii inahitaji uangalizi wa haraka wa daktari wa kituo cha afya kutokana na dalili za hatari katika ujauzito.'
        : 'Dalili hizi zinaashiria hali ya dharura inayohitaji kufika zahanati au hospitali mara moja.';

      immediateActions = [
        'Keti au lala kwa utulivu upande wa kushoto (hasa kwa wajawazito).',
        'Wasiliana na mhudumu wa afya (CHW) au chukua usafiri wa haraka kuelekea kituo cha afya kilicho karibu.',
        'Usinywe dawa yoyote ya kienyeji au kutuliza maumivu bila maelekezo ya daktari.',
      ];

      dangerSignsToWatch = [
        'Kuvuja damu nyingi.',
        'Kupoteza fahamu au kifafa cha mimba.',
        'Kushindwa kabisa kupumua.',
      ];

      sbar = {
        situation: `DHARURA YA HARAKA: ${patient.name} (${patient.age}y, ${patient.location}) anaripoti ${params.transcript.slice(0, 150)}...`,
        background: `Mgonjwa ana historia ya dalili hizi kuanzia leo. Hali ya hatari imetambuliwa kulingana na miongozo ya huduma ya msingi Tanzania.`,
        assessment: `HATARI KUBWA (RED / CRITICAL). Tuhuma za dharura ya kiafya inayohitaji rufaa ya haraka.`,
        recommendation: `Tafadhali CHW / Kituo cha afya: Andaa rufaa ya haraka, fuatilia upatikanaji wa usafiri wa dharura (Bajaji/Gari la wagonjwa).`,
        urgency: 'RED',
      };
    } else if (riskLevel === 'YELLOW') {
      const isMalariaLike = text.includes('homa') || text.includes('kutetemeka') || text.includes('kutapika');
      chiefComplaint = isMalariaLike
        ? 'Homa Kali Inayoshukiwa kuwa Malaria (Suspected Malaria)'
        : 'Shinikizo la Damu / Dalili za Kisukari (Hypertension/Chronic Check)';

      swahiliSummary = isMalariaLike
        ? 'Dalili za homa, kutetemeka na kutapika zinaashiria uwezekano wa maambukizi kama Malaria. Unahitaji kupima kipimo cha haraka (mRDT) kituo cha afya.'
        : 'Kizunguzungu na kubana kwa shingo kunaweza kuhusiana na shinikizo la damu. Ni muhimu kupima presha bila kuchelewa.';

      immediateActions = [
        'Kunywa maji mengi safi na vinywaji vya kuongeza nguvu (maji ya dafu, supu).',
        'Pumzika mahali penye hewa ya kutosha.',
        'Panga kumwona mhudumu wa afya wa ngazi ya jamii (CHW) ndani ya saa 24 kwa kipimo cha mRDT / Presha.',
      ];

      dangerSignsToWatch = [
        'Homa kupanda zaidi ya 39°C au kuanza degedege.',
        'Kutapika kila kitu unachokunywa.',
        'Kizunguzungu kikali kinachosababisha kushindwa kusimama.',
      ];

      sbar = {
        situation: `ANGALIZO / URGENT: ${patient.name} (${patient.age}y, ${patient.location}) analalamika ${chiefComplaint}.`,
        background: `Dalili zimeripotiwa: "${params.transcript.slice(0, 120)}".`,
        assessment: `HATARI YA KATI (YELLOW / MODERATE). Inahitaji uchunguzi wa maabara (mRDT/Blood Pressure).`,
        recommendation: `CHW awasiliane na mgonjwa kumpima presha au kumwelekeza zahanati iliyo karibu kwa kipimo cha Malaria leo.`,
        urgency: 'YELLOW',
      };
    } else {
      chiefComplaint = 'Dalili za Kawaida / Ushauri wa Afya (Mild Symptoms)';
      swahiliSummary =
        'Hali yako inaonekana kuwa ya kawaida bila dalili za dharura kwa sasa. Endelea kuzingatia lishe bora na mapumziko.';
      immediateActions = [
        'Kunywa maji ya kutosha (lita 2-3 kwa siku).',
        'Pumzika kwa saa 8 usiku.',
        'Kula vyakula vyenye virutubisho kama mboga za majani na matunda.',
      ];
      dangerSignsToWatch = [
        'Homa kuanza ghafla au maumivu makali ya kichwa.',
        'Dalili kuendelea zaidi ya siku 3.',
      ];

      sbar = {
        situation: `USHAURI WA KAWAIDA: ${patient.name} (${patient.age}y, ${patient.location}) ameripoti dalili hafifu.`,
        background: `Mgonjwa anajisikia vizuri kiasi bila dalili hatarishi.`,
        assessment: `HALI YA KAWAIDA (GREEN / MILD). Hakuna viashiria vya dharura.`,
        recommendation: `Ushauri wa nyumbani na uangalizi wa kawaida. Mgonjwa arudi iwapo dalili zitabadilika.`,
        urgency: 'GREEN',
      };
    }

    // Build Compact Truncation-Safe WhatsApp String (< 600 chars)
    const compactWhatsAppText = [
      `*AFYA AI - TAARIFA YA MGONJWA (SBAR)*`,
      `*Mgonjwa:* ${patient.name} (${patient.age}y, ${patient.gender})`,
      `*Mahali:* ${patient.location}`,
      `*Hatari:* ${riskLevel === 'RED' ? '🔴 DHARURA KUBWA' : riskLevel === 'YELLOW' ? '🟡 ANGALIZO LA HARAKA' : '🟢 KAWAIDA'}`,
      `-----------------------`,
      `*S (Hali):* ${sbar.situation.slice(0, 110)}`,
      `*B (Historia):* ${sbar.background.slice(0, 90)}`,
      `*A (Tathmini):* ${sbar.assessment.slice(0, 90)}`,
      `*R (Ushauri):* ${sbar.recommendation.slice(0, 100)}`,
      `-----------------------`,
      `Afya AI Tanzania`,
    ].join('\n');

    const result: TriageResult = {
      id: `trg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      patient,
      chiefComplaint,
      reportedSymptoms: params.transcript,
      riskLevel,
      patientGuidance: {
        swahiliSummary,
        immediateActions,
        dangerSignsToWatch,
      },
      sbarNote: sbar,
      compactWhatsAppText,
    };

    // Runtime validate through Zod
    return TriageResultSchema.parse(result);
  }

  /**
   * Format WhatsApp Direct Dispatch URL
   */
  public static getWhatsAppDispatchUrl(phone: string, text: string): string {
    // Sanitize phone number (strip whitespace, ensure proper international country code)
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '255' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.slice(1);
    }

    const encodedText = encodeURIComponent(text);
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
  }
}
