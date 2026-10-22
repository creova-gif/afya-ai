import { describe, it, expect } from 'bun:test';
import { FamilyCircleService } from './familyCircleService';

describe('FamilyCircleService Suite', () => {
  it('should return initial family circle with collective rings', () => {
    const circle = FamilyCircleService.getFamilyCircle();
    expect(circle.circleId).toBeDefined();
    expect(circle.members.length).toBeGreaterThanOrEqual(4);
    expect(circle.collectiveRings.stepsPercent).toBeGreaterThanOrEqual(0);
    expect(circle.collectiveRings.waterPercent).toBeGreaterThanOrEqual(0);
    expect(circle.collectiveRings.nutritionPercent).toBeGreaterThanOrEqual(0);
  });

  it('should correctly toggle elder medication check-in', () => {
    const initialCircle = FamilyCircleService.getFamilyCircle();
    const elder = initialCircle.members.find((m) => m.role === 'elder');
    expect(elder).toBeDefined();

    if (elder) {
      const updatedCircle = FamilyCircleService.toggleElderMedication(elder.id);
      const updatedElder = updatedCircle.members.find((m) => m.id === elder.id);
      expect(updatedElder?.medicationCheckin?.taken).toBe(true);
      expect(updatedElder?.status).toBe('active');
    }
  });

  it('should generate warm Swahili cheer message for family members', () => {
    const circle = FamilyCircleService.getFamilyCircle();
    const member = circle.members[0];
    const cheer = FamilyCircleService.generateCheerMessage(member);
    expect(cheer).toContain(member.name);
    expect(cheer.length).toBeGreaterThan(15);
  });
});
