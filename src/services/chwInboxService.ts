// Community Health Worker (CHW) Dispensary Triage Inbox Service
import { CHWCaseStatus, CHWQueueStats, TriageQueueItem, TriageQueueItemSchema } from '../types/chwInbox';
import { RiskLevel, TriageResult } from '../types/triage';

const DEFAULT_CHW_CASES: TriageQueueItem[] = [
  {
    id: 'chw-case-001',
    patientName: 'Amina Bakari',
    patientAge: 24,
    patientGender: 'Mwanamke / Female',
    patientLocation: 'Mbagala Kuu, Dar es Salaam',
    patientPhone: '+255754987654',
    chiefComplaint: 'Dharura ya Uzazi: Maumivu na Matone ya Damu',
    riskLevel: 'RED',
    sbar: {
      situation: 'Mjamzito wa miezi 7 mwenye maumivu makali ya tumbo na matone ya damu tangu asubuhi.',
      background: 'Mimba ya pili, historia ya shinikizo la damu kwenye mimba ya kwanza.',
      assessment: 'DHARURA KUBWA (RED / CRITICAL). Hatari ya uchungu kabla ya wakati au kupasuka kwa chupa.',
      recommendation: 'Andaa rufaa ya haraka kwenda Hospitali ya Rufaa ya Mbagala / Amana mara moja.',
    },
    submittedAt: 'Dakika 10 zilizopita',
    status: 'pending',
    referralFacility: 'Hospitali ya Wilaya ya Mbagala',
  },
  {
    id: 'chw-case-002',
    patientName: 'Juma Hassan',
    patientAge: 28,
    patientGender: 'Mwanaume / Male',
    patientLocation: 'Kigoma Mjini',
    patientPhone: '+255712345678',
    chiefComplaint: 'Homa Kali na Kutetemeka (Tuhuma za Malaria)',
    riskLevel: 'YELLOW',
    sbar: {
      situation: 'Homa kali (39.2°C) kwa siku 2, anatapika kila akila, maumivu ya viungo.',
      background: 'Hajawahi kutumia chandarua kwa wiki 2 zilizopita, alikuwa safarini vijijini.',
      assessment: 'HATARI YA KATI (YELLOW). Uwezekano mkubwa wa Acute Plasmodium Falciparum Malaria.',
      recommendation: 'Kipimo cha mRDT cha haraka zahanati na kuanzishiwa ALU au Dawa mbadala.',
    },
    submittedAt: 'Saa 1 lililopita',
    status: 'in_review',
    assignedWorkerName: 'Mhudumu Neema Mwamba (CHW)',
  },
  {
    id: 'chw-case-003',
    patientName: 'Mzee Rashidi',
    patientAge: 58,
    patientGender: 'Mwanaume / Male',
    patientLocation: 'Ngaramtoni, Arusha',
    patientPhone: '+255784112233',
    chiefComplaint: 'Kizunguzungu & Shinikizo la Damu Kubwa',
    riskLevel: 'YELLOW',
    sbar: {
      situation: 'Kizunguzungu kikali, shingo kukaza, presha imepimwa nyumbani 175/105 mmHg.',
      background: 'Mgonjwa wa muda mrefu wa presha, aliishiwa vidonge vya Amlodipine siku 5 zilizopita.',
      assessment: 'HATARI YA KATI (YELLOW). Hypertensive urgency kutokana na kuacha dawa.',
      recommendation: 'Pima tena presha na kumpa rufaa ya kuongeza dawa za kliniki ya moyo.',
    },
    submittedAt: 'Saa 3 zilizopita',
    status: 'referred',
    referralFacility: 'Kituo cha Afya cha Ngaramtoni',
    clinicalNotes: 'Mgonjwa amepigiwa simu na kuelekezwa kupumzika huku gari la zahanati likimfuata.',
  },
  {
    id: 'chw-case-004',
    patientName: 'Fatuma Omari',
    patientAge: 32,
    patientGender: 'Mwanamke / Female',
    patientLocation: 'Kurasini, Dar es Salaam',
    patientPhone: '+255713445566',
    chiefComplaint: 'Kikohozi cha Kawaida na Uchovu',
    riskLevel: 'GREEN',
    sbar: {
      situation: 'Kikohozi kavu kwa siku 2 bila homa wala kupumua kwa shida.',
      background: 'Afya nzuri kwa ujumla, hakuna magonjwa ya kudumu.',
      assessment: 'HALI YA KAWAIDA (GREEN). Maambukizi ya kawaida ya mfumo wa juu wa hewa.',
      recommendation: 'Ushauri wa unywaji maji ya uvuguvugu na asali, pumziko na ufuatiliaji.',
    },
    submittedAt: 'Jana jioni',
    status: 'resolved',
    assignedWorkerName: 'Mhudumu John Mussa (CHW)',
    clinicalNotes: 'Ametumia maji ya joto na limau, hali inaridhisha bila homa.',
  },
];

export class CHWInboxService {
  private static STORAGE_KEY = 'afya_ai_chw_inbox_cases';
  private static memoryCases: TriageQueueItem[] | null = null;

  public static getCases(): TriageQueueItem[] {
    if (this.memoryCases) {
      return this.memoryCases;
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.memoryCases = parsed;
          return parsed;
        }
      }
    } catch {
      // fallback
    }

    this.memoryCases = DEFAULT_CHW_CASES;
    return DEFAULT_CHW_CASES;
  }

  public static getStats(): CHWQueueStats {
    const cases = this.getCases();
    return {
      totalCases: cases.length,
      criticalRedCount: cases.filter((c) => c.riskLevel === 'RED' && c.status !== 'resolved').length,
      urgentYellowCount: cases.filter((c) => c.riskLevel === 'YELLOW' && c.status !== 'resolved').length,
      routineGreenCount: cases.filter((c) => c.riskLevel === 'GREEN' && c.status !== 'resolved').length,
      resolvedTodayCount: cases.filter((c) => c.status === 'resolved').length,
    };
  }

  public static updateCaseStatus(
    id: string,
    status: CHWCaseStatus,
    clinicalNotes?: string,
    referralFacility?: string
  ): TriageQueueItem[] {
    const cases = this.getCases();
    const updated = cases.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status,
          ...(clinicalNotes !== undefined && { clinicalNotes }),
          ...(referralFacility !== undefined && { referralFacility }),
        };
      }
      return item;
    });

    this.memoryCases = updated;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }

    return updated;
  }

  public static addIncomingTriage(triageResult: TriageResult): TriageQueueItem {
    const newCase: TriageQueueItem = {
      id: `chw-case-${Date.now()}`,
      patientName: triageResult.patient.name,
      patientAge: Number(triageResult.patient.age) || 30,
      patientGender: triageResult.patient.gender,
      patientLocation: triageResult.patient.location,
      patientPhone: triageResult.patient.chwPhone || '+255700000000',
      chiefComplaint: triageResult.chiefComplaint,
      riskLevel: triageResult.riskLevel,
      sbar: triageResult.sbarNote,
      submittedAt: 'Hivi punde (Just now)',
      status: 'pending',
    };

    const validated = TriageQueueItemSchema.parse(newCase);
    const cases = [validated, ...this.getCases()];
    this.memoryCases = cases;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cases));
      }
    } catch {
      // ignore
    }

    return validated;
  }

  public static deleteCase(id: string): TriageQueueItem[] {
    const cases = this.getCases().filter((c) => c.id !== id);
    this.memoryCases = cases;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cases));
      }
    } catch {
      // ignore
    }

    return cases;
  }

  public static resetToDefaults(): TriageQueueItem[] {
    this.memoryCases = DEFAULT_CHW_CASES;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    return DEFAULT_CHW_CASES;
  }
}
