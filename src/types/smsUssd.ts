import { z } from 'zod';
import { RiskLevelSchema } from './triage';

export const SMSDispatchPayloadSchema = z.object({
  recipientPhone: z.string(),
  compressedText: z.string().max(160, 'SMS payload must fit within standard 160 GSM-7 characters'),
  charCount: z.number().max(160),
  isWithinSingleSMS: z.boolean(),
  smsUri: z.string(),
});
export type SMSDispatchPayload = z.infer<typeof SMSDispatchPayloadSchema>;

export interface USSDMenuOption {
  key: string;
  label: string;
  nextMenuId?: string;
  action?: 'emergency_call' | 'triage_maternal' | 'triage_malaria' | 'triage_bp' | 'view_stats';
}

export interface USSDMenuNode {
  id: string;
  title: string;
  prompt: string;
  options: USSDMenuOption[];
}

export interface USSDSessionState {
  sessionId: string;
  currentMenuId: string;
  screenText: string;
  isTerminal: boolean;
  history: string[];
}
