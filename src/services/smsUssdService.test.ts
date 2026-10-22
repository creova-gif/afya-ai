import { describe, it, expect } from 'bun:test';
import { SMSUssdService } from './smsUssdService';
import { PRESET_SCENARIOS, TriageService } from './triageService';

describe('SMSUssdService Suite', () => {
  it('should compress Severe Maternal Triage into a single SMS under 160 characters', async () => {
    const maternalPreset = PRESET_SCENARIOS.find((p) => p.id === 'maternal-danger')!;
    const triageResult = await TriageService.evaluateTriage({
      transcript: maternalPreset.sampleTranscript,
      patient: maternalPreset.patient,
    });

    const sms = SMSUssdService.compressTriageToSMS(triageResult);
    expect(sms.compressedText.length).toBeLessThanOrEqual(160);
    expect(sms.isWithinSingleSMS).toBe(true);
    expect(sms.compressedText).toContain('[AFYA-RED]');
    expect(sms.compressedText).toContain('Amina');
    expect(sms.smsUri).toContain('sms:');
  });

  it('should compress Malaria and Hypertension into single SMS under 160 characters', async () => {
    for (const preset of PRESET_SCENARIOS) {
      const triageResult = await TriageService.evaluateTriage({
        transcript: preset.sampleTranscript,
        patient: preset.patient,
      });

      const sms = SMSUssdService.compressTriageToSMS(triageResult);
      expect(sms.compressedText.length).toBeLessThanOrEqual(160);
      expect(sms.isWithinSingleSMS).toBe(true);
    }
  });

  it('should generate valid SMS URI with phone and body', () => {
    const uri = SMSUssdService.getSMSDispatchUri('+255712345678', 'Afya AI Test SMS');
    expect(uri).toContain('sms:+255712345678');
    expect(uri).toContain('body=Afya%20AI%20Test%20SMS');
  });

  it('should manage interactive USSD session states and transitions', () => {
    // 1. Init
    const session = SMSUssdService.initUSSDSession();
    expect(session.currentMenuId).toBe('root');
    expect(session.isTerminal).toBe(false);
    expect(session.screenText).toContain('*152*05*23#');

    // 2. Transition from Root -> Maternal
    const step1 = SMSUssdService.processUSSDInput(session, '1');
    expect(step1.state.currentMenuId).toBe('maternal');
    expect(step1.state.screenText).toContain('Dharura ya Uzazi');
    expect(step1.state.isTerminal).toBe(false);

    // 3. Selection in Maternal -> Trigger Action
    const step2 = SMSUssdService.processUSSDInput(step1.state, '1');
    expect(step2.state.isTerminal).toBe(true);
    expect(step2.actionTriggered).toBe('triage_maternal');
    expect(step2.terminalMessage).toContain('TAHADHARI YA UZAZI');
  });

  it('should trigger national emergency 112 option from root USSD menu', () => {
    const session = SMSUssdService.initUSSDSession();
    const result = SMSUssdService.processUSSDInput(session, '5');
    expect(result.state.isTerminal).toBe(true);
    expect(result.actionTriggered).toBe('emergency_call');
    expect(result.terminalMessage).toContain('112');
  });

  it('should handle invalid keypad input gracefully without crashing', () => {
    const session = SMSUssdService.initUSSDSession();
    const result = SMSUssdService.processUSSDInput(session, '99');
    expect(result.state.isTerminal).toBe(false);
    expect(result.state.screenText).toContain('Chaguo batili: 99');
  });
});
