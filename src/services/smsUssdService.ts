// SMS & USSD Low-Bandwidth Dispatch Service for East African Primary Care
import { SMSDispatchPayload, SMSDispatchPayloadSchema, USSDMenuNode, USSDSessionState } from '../types/smsUssd';
import { TriageResult } from '../types/triage';

export const USSD_MENUS: Record<string, USSDMenuNode> = {
  root: {
    id: 'root',
    title: 'Afya AI Boma Bridge (*152*05*23#)',
    prompt: 'Chagua huduma ya zahanati:',
    options: [
      { key: '1', label: 'Ripoti Dharura ya Uzazi', nextMenuId: 'maternal' },
      { key: '2', label: 'Homa Kali / Malaria', nextMenuId: 'malaria' },
      { key: '3', label: 'Shinikizo la Damu / Kizunguzungu', nextMenuId: 'hypertension' },
      { key: '4', label: 'Kagua Foleni ya Zahanati', nextMenuId: 'queue' },
      { key: '5', label: 'Piga Namba ya Dharura (112)', action: 'emergency_call' },
    ],
  },
  maternal: {
    id: 'maternal',
    title: 'Dharura ya Uzazi (Maternal Alert)',
    prompt: 'Mama mjamzito ana dalili gani?',
    options: [
      { key: '1', label: 'Kuvuja damu au maji mengi', action: 'triage_maternal' },
      { key: '2', label: 'Uchungu mkali kabla ya mwezi wa 9', action: 'triage_maternal' },
      { key: '3', label: 'Kifafa cha mimba / Kizunguzungu', action: 'triage_maternal' },
      { key: '0', label: 'Rudi menyu kuu', nextMenuId: 'root' },
    ],
  },
  malaria: {
    id: 'malaria',
    title: 'Homa / Tuhuma za Malaria',
    prompt: 'Mgonjwa ana umri gani na hali gani?',
    options: [
      { key: '1', label: 'Mtoto chini ya miaka 5 (Degedege/Kutapika)', action: 'triage_malaria' },
      { key: '2', label: 'Mtu mzima (Homa siku 2+ & Kutetemeka)', action: 'triage_malaria' },
      { key: '0', label: 'Rudi menyu kuu', nextMenuId: 'root' },
    ],
  },
  hypertension: {
    id: 'hypertension',
    title: 'Shinikizo la Damu (Hypertension)',
    prompt: 'Chagua hali ya mgonjwa:',
    options: [
      { key: '1', label: 'Presha zaidi ya 160/100 na maumivu ya kichwa', action: 'triage_bp' },
      { key: '2', label: 'Ameishiwa vidonge vya presha', action: 'triage_bp' },
      { key: '0', label: 'Rudi menyu kuu', nextMenuId: 'root' },
    ],
  },
  queue: {
    id: 'queue',
    title: 'Kituo cha Afya - Hali ya Foleni',
    prompt: 'Zahanati: Kesi 4 zipo kwenye mfumo (1 Dharura Kubwa, 2 Angalizo).',
    options: [
      { key: '1', label: 'Orodha ya wagonjwa wa dharura', action: 'view_stats' },
      { key: '0', label: 'Rudi menyu kuu', nextMenuId: 'root' },
    ],
  },
};

export class SMSUssdService {
  /**
   * Compresses a full clinical SBAR triage note into a single GSM-7 SMS (<160 chars)
   */
  public static compressTriageToSMS(
    triage: TriageResult,
    targetPhone?: string
  ): SMSDispatchPayload {
    const phone = targetPhone || triage.patient.chwPhone || '+255700000000';
    const tag = `[AFYA-${triage.riskLevel}]`;
    const patientTag = `${triage.patient.name.split(' ')[0]} ${triage.patient.age}y${triage.patient.gender.charAt(0).toUpperCase()}`;
    const locationTag = triage.patient.location.split(',')[0].trim();

    // Condensed clinical summary
    let condensedComplaint = triage.chiefComplaint
      .replace(/Dharura ya Uzazi:/i, 'Uzazi:')
      .replace(/Homa Kali na Kutetemeka \(Tuhuma za Malaria\)/i, 'Homa/Malaria')
      .replace(/Kizunguzungu & Shinikizo la Damu Kubwa/i, 'Presha Kubwa')
      .trim();

    // Recommendation snippet
    const recSnippet = triage.sbarNote.recommendation.split('.')[0].trim();

    // Build raw SMS draft
    let rawSMS = `${tag} ${patientTag}, ${locationTag}. ${condensedComplaint}. Ushauri: ${recSnippet}. Simu: ${triage.patient.chwPhone || phone}`;

    // Ensure it strictly never exceeds 160 characters
    if (rawSMS.length > 160) {
      const allowedTextLength = 160 - `${tag} ${patientTag}, ${locationTag}. . Simu: ${phone}`.length;
      const truncatedSummary = condensedComplaint.slice(0, Math.max(10, allowedTextLength - 3)) + '...';
      rawSMS = `${tag} ${patientTag}, ${locationTag}. ${truncatedSummary}. Simu: ${phone}`;
      
      // Strict fallback clamp
      if (rawSMS.length > 160) {
        rawSMS = rawSMS.slice(0, 157) + '...';
      }
    }

    const payload: SMSDispatchPayload = {
      recipientPhone: phone,
      compressedText: rawSMS,
      charCount: rawSMS.length,
      isWithinSingleSMS: rawSMS.length <= 160,
      smsUri: this.getSMSDispatchUri(phone, rawSMS),
    };

    return SMSDispatchPayloadSchema.parse(payload);
  }

  /**
   * Generates cross-platform SMS URI
   * iOS uses `sms:phone&body=text` while Android uses `sms:phone?body=text`
   */
  public static getSMSDispatchUri(phone: string, text: string): string {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const isIOS =
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent || '');

    const separator = isIOS ? '&' : '?';
    return `sms:${cleanPhone}${separator}body=${encodeURIComponent(text)}`;
  }

  /**
   * Initializes a new USSD session on standard Tanzania MoH code *152*05*23#
   */
  public static initUSSDSession(): USSDSessionState {
    const rootMenu = USSD_MENUS['root'];
    const screenText = this.formatUSSDScreen(rootMenu);
    return {
      sessionId: `ussd-${Date.now()}`,
      currentMenuId: 'root',
      screenText,
      isTerminal: false,
      history: ['root'],
    };
  }

  /**
   * Processes a keypad input selection in a USSD session
   */
  public static processUSSDInput(
    currentState: USSDSessionState,
    input: string
  ): { state: USSDSessionState; terminalMessage?: string; actionTriggered?: string } {
    const currentMenu = USSD_MENUS[currentState.currentMenuId];
    if (!currentMenu) {
      return {
        state: { ...currentState, isTerminal: true },
        terminalMessage: 'Menyu haijulikani. Tafadhali piga tena *152*05*23#.',
      };
    }

    const trimmed = input.trim();
    const matchedOption = currentMenu.options.find((opt) => opt.key === trimmed);

    if (!matchedOption) {
      const errorText = `${currentMenu.prompt}\n(Chaguo batili: ${input})\n` +
        currentMenu.options.map((o) => `${o.key}. ${o.label}`).join('\n');
      return {
        state: { ...currentState, screenText: errorText },
      };
    }

    // Check if an action is triggered (terminal response)
    if (matchedOption.action) {
      let responseMessage = '';
      if (matchedOption.action === 'emergency_call') {
        responseMessage = 'DHARURA YA TAIFA: Piga simu ya bure 112 au 115 mara moja kwa gari la wagonjwa.';
      } else if (matchedOption.action === 'triage_maternal') {
        responseMessage = 'TAHADHARI YA UZAZI: Taarifa imetumwa kwa mhudumu wa afya (CHW). Mgonjwa asitembee, asafirishwe zahanati mara moja.';
      } else if (matchedOption.action === 'triage_malaria') {
        responseMessage = 'TAARIFA YA HOMA: Fika kituo cha afya kilicho karibu kwa kipimo cha mRDT cha damu kabla ya kutumia dawa.';
      } else if (matchedOption.action === 'triage_bp') {
        responseMessage = 'SHINIKIZO LA DAMU: Mgonjwa apumzike mahali pa utulivu. CHW amearifiwa kupima presha upya.';
      } else if (matchedOption.action === 'view_stats') {
        responseMessage = 'ZAHANATI INBOX: Kesi 1 ya Dharura (RED) inasubiri daktari. Kesi 2 za Angalizo (YELLOW) zimepokelewa.';
      }

      return {
        state: {
          ...currentState,
          isTerminal: true,
          screenText: responseMessage,
        },
        terminalMessage: responseMessage,
        actionTriggered: matchedOption.action,
      };
    }

    // Menu transition
    if (matchedOption.nextMenuId && USSD_MENUS[matchedOption.nextMenuId]) {
      const nextMenu = USSD_MENUS[matchedOption.nextMenuId];
      const newHistory = [...currentState.history, nextMenu.id];
      return {
        state: {
          ...currentState,
          currentMenuId: nextMenu.id,
          screenText: this.formatUSSDScreen(nextMenu),
          history: newHistory,
        },
      };
    }

    return {
      state: { ...currentState, isTerminal: true },
      terminalMessage: 'Kikao cha USSD kimekamilika. Asante.',
    };
  }

  private static formatUSSDScreen(menu: USSDMenuNode): string {
    const lines = [
      menu.title,
      '------------------------',
      menu.prompt,
      '',
      ...menu.options.map((o) => `${o.key}. ${o.label}`),
    ];
    return lines.join('\n');
  }
}
