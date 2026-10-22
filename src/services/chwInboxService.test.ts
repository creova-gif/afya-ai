import { describe, it, expect, beforeEach } from 'bun:test';
import { CHWInboxService } from './chwInboxService';
import { TriageResult } from '../types/triage';

describe('CHWInboxService Suite', () => {
  beforeEach(() => {
    CHWInboxService.resetToDefaults();
  });

  it('should load initial default cases for East African dispensaries', () => {
    const cases = CHWInboxService.getCases();
    expect(cases.length).toBe(4);

    const redCases = cases.filter((c) => c.riskLevel === 'RED');
    const yellowCases = cases.filter((c) => c.riskLevel === 'YELLOW');
    const greenCases = cases.filter((c) => c.riskLevel === 'GREEN');

    expect(redCases.length).toBe(1);
    expect(yellowCases.length).toBe(2);
    expect(greenCases.length).toBe(1);
  });

  it('should compute queue statistics accurately', () => {
    const stats = CHWInboxService.getStats();
    expect(stats.totalCases).toBe(4);
    expect(stats.criticalRedCount).toBe(1);
    expect(stats.urgentYellowCount).toBe(2);
    // Green case 4 is already marked 'resolved' in defaults, so active green count should be 0, resolvedToday 1
    expect(stats.routineGreenCount).toBe(0);
    expect(stats.resolvedTodayCount).toBe(1);
  });

  it('should update case status, notes, and referral facility', () => {
    const updated = CHWInboxService.updateCaseStatus(
      'chw-case-001',
      'referred',
      'Gari la wagonjwa limetumwa na mgonjwa amepokelewa Amana.',
      'Hospitali ya Taifa ya Muhimbili'
    );

    const modifiedCase = updated.find((c) => c.id === 'chw-case-001');
    expect(modifiedCase).toBeDefined();
    expect(modifiedCase?.status).toBe('referred');
    expect(modifiedCase?.clinicalNotes).toContain('Gari la wagonjwa');
    expect(modifiedCase?.referralFacility).toBe('Hospitali ya Taifa ya Muhimbili');
  });

  it('should ingest incoming triage evaluations into the inbox', () => {
    const sampleTriageResult: TriageResult = {
      transcript: 'Mtoto ana degedege na homa kali sana tangu mchana.',
      riskLevel: 'RED',
      chiefComplaint: 'Degedege na Homa Kali kwa Mtoto',
      patient: {
        name: 'Baraka John',
        age: 3,
        gender: 'Mvulana / Male',
        location: 'Ilala Boma, Dar es Salaam',
        chwPhone: '+255768999888',
      },
      sbarNote: {
        situation: 'Mtoto wa miaka 3 ana degedege na joto kali.',
        background: 'Homa ilianza jana, hakupatiwa dawa.',
        assessment: 'DHARURA KUBWA (RED / CRITICAL): Febrile convulsion au cerebral malaria.',
        recommendation: 'Leta zahanati mara moja kwa huduma ya kwanza na rufaa.',
        urgency: 'RED',
      },
      compactWhatsAppText: 'DHARURA KUBWA: Mtoto Baraka John...',
      audioFormatUsed: 'audio/webm',
    };

    const created = CHWInboxService.addIncomingTriage(sampleTriageResult);
    expect(created.patientName).toBe('Baraka John');
    expect(created.riskLevel).toBe('RED');
    expect(created.status).toBe('pending');

    const cases = CHWInboxService.getCases();
    expect(cases.length).toBe(5);
    expect(cases[0].id).toBe(created.id);

    const stats = CHWInboxService.getStats();
    expect(stats.criticalRedCount).toBe(2);
  });

  it('should support deleting and resetting cases', () => {
    const remaining = CHWInboxService.deleteCase('chw-case-001');
    expect(remaining.length).toBe(3);
    expect(remaining.find((c) => c.id === 'chw-case-001')).toBeUndefined();

    const reset = CHWInboxService.resetToDefaults();
    expect(reset.length).toBe(4);
    expect(reset.find((c) => c.id === 'chw-case-001')).toBeDefined();
  });
});
