import { z } from 'zod';

export const CircleMemberStatusSchema = z.enum(['active', 'needs_checkin', 'goal_reached']);
export type CircleMemberStatus = z.infer<typeof CircleMemberStatusSchema>;

export const MedicationCheckinSchema = z.object({
  required: z.boolean(),
  taken: z.boolean(),
  medicationName: z.string().optional(),
  timeScheduled: z.string().optional(),
});
export type MedicationCheckin = z.infer<typeof MedicationCheckinSchema>;

export const CircleMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['parent', 'child', 'elder', 'teen', 'adult']),
  avatar: z.string(),
  steps: z.number(),
  stepsTarget: z.number(),
  waterGlasses: z.number(),
  waterTarget: z.number(),
  mealsLogged: z.number(),
  medicationCheckin: MedicationCheckinSchema.optional(),
  status: CircleMemberStatusSchema,
  lastActive: z.string(),
});
export type CircleMember = z.infer<typeof CircleMemberSchema>;

export const FamilyCircleSchema = z.object({
  circleId: z.string(),
  householdName: z.string(),
  members: z.array(CircleMemberSchema),
  collectiveRings: z.object({
    stepsPercent: z.number(),
    waterPercent: z.number(),
    nutritionPercent: z.number(),
  }),
});
export type FamilyCircle = z.infer<typeof FamilyCircleSchema>;
