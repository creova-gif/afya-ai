import { z } from 'zod';

export const RiskLevelSchema = z.enum(['GREEN', 'YELLOW', 'RED']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const PatientMetadataSchema = z.object({
  name: z.string().default('Mgonjwa / Patient'),
  age: z.union([z.number(), z.string()]).default(30),
  gender: z.string().default('Hajatajwa'),
  location: z.string().default('Tanzania'),
  chwPhone: z.string().default('+255700000000'),
});
export type PatientMetadata = z.infer<typeof PatientMetadataSchema>;

export const SBARNoteSchema = z.object({
  situation: z.string(),
  background: z.string(),
  assessment: z.string(),
  recommendation: z.string(),
  urgency: RiskLevelSchema,
});
export type SBARNote = z.infer<typeof SBARNoteSchema>;

export const PatientGuidanceSchema = z.object({
  swahiliSummary: z.string(),
  immediateActions: z.array(z.string()),
  dangerSignsToWatch: z.array(z.string()),
});
export type PatientGuidance = z.infer<typeof PatientGuidanceSchema>;

export const TriageResultSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  patient: PatientMetadataSchema,
  chiefComplaint: z.string(),
  reportedSymptoms: z.string(),
  riskLevel: RiskLevelSchema,
  patientGuidance: PatientGuidanceSchema,
  sbarNote: SBARNoteSchema,
  compactWhatsAppText: z.string(),
});
export type TriageResult = z.infer<typeof TriageResultSchema>;

export interface PresetScenario {
  id: string;
  titleSwahili: string;
  titleEnglish: string;
  category: 'malaria' | 'maternal' | 'hypertension' | 'respiratory';
  sampleTranscript: string;
  expectedRisk: RiskLevel;
  patient: PatientMetadata;
}
