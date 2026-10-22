import { z } from 'zod';
import { RiskLevelSchema } from './triage';

export const CHWCaseStatusSchema = z.enum(['pending', 'in_review', 'referred', 'resolved']);
export type CHWCaseStatus = z.infer<typeof CHWCaseStatusSchema>;

export const TriageQueueItemSchema = z.object({
  id: z.string(),
  patientName: z.string(),
  patientAge: z.number(),
  patientGender: z.string(),
  patientLocation: z.string(),
  patientPhone: z.string(),
  chiefComplaint: z.string(),
  riskLevel: RiskLevelSchema,
  sbar: z.object({
    situation: z.string(),
    background: z.string(),
    assessment: z.string(),
    recommendation: z.string(),
  }),
  submittedAt: z.string(),
  status: CHWCaseStatusSchema,
  assignedWorkerName: z.string().optional(),
  clinicalNotes: z.string().optional(),
  referralFacility: z.string().optional(),
});
export type TriageQueueItem = z.infer<typeof TriageQueueItemSchema>;

export interface CHWQueueStats {
  totalCases: number;
  criticalRedCount: number;
  urgentYellowCount: number;
  routineGreenCount: number;
  resolvedTodayCount: number;
}
