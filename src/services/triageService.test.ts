import { describe, it, expect } from 'bun:test';
import { TriageService, PRESET_SCENARIOS } from './triageService';

describe('TriageService Clinical Protocol Suite', () => {
  it('should have 3 properly defined clinical presets', () => {
    expect(PRESET_SCENARIOS.length).toBe(3);
    const ids = PRESET_SCENARIOS.map((p) => p.id);
    expect(ids).toContain('malaria-severe');
    expect(ids).toContain('maternal-danger');
    expect(ids).toContain('hypertension-crisis');
  });

  it('should accurately triage Maternal Danger Signs as RED emergency', async () => {
    const maternalPreset = PRESET_SCENARIOS.find((p) => p.id === 'maternal-danger')!;
    const result = await TriageService.evaluateTriage({
      transcript: maternalPreset.sampleTranscript,
      patient: maternalPreset.patient,
    });

    expect(result.riskLevel).toBe('RED');
    expect(result.chiefComplaint).toContain('Uzazi');
    expect(result.sbarNote.urgency).toBe('RED');
    expect(result.compactWhatsAppText).toContain('DHARURA KUBWA');
    expect(result.compactWhatsAppText.length).toBeLessThan(750);
  });

  it('should accurately triage Suspected Malaria as YELLOW risk', async () => {
    const malariaPreset = PRESET_SCENARIOS.find((p) => p.id === 'malaria-severe')!;
    const result = await TriageService.evaluateTriage({
      transcript: malariaPreset.sampleTranscript,
      patient: malariaPreset.patient,
    });

    expect(result.riskLevel).toBe('YELLOW');
    expect(result.chiefComplaint).toContain('Malaria');
    expect(result.sbarNote.urgency).toBe('YELLOW');
    expect(result.compactWhatsAppText).toContain('ANGALIZO');
  });

  it('should format clean WhatsApp dispatch URLs with Tanzanian country codes', () => {
    const localPhone = '0712345678';
    const internationalPhone = '+255712345678';
    const sampleText = 'Afya AI Test SBAR';

    const url1 = TriageService.getWhatsAppDispatchUrl(localPhone, sampleText);
    const url2 = TriageService.getWhatsAppDispatchUrl(internationalPhone, sampleText);

    expect(url1).toContain('https://wa.me/255712345678');
    expect(url1).toContain(encodeURIComponent(sampleText));
    expect(url2).toContain('https://wa.me/255712345678');
  });
});
