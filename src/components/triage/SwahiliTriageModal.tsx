import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Mic,
  MicOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Share2,
  Copy,
  User,
  HeartPulse,
  Sparkles,
  PhoneCall,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AudioRecorder,
  PRESET_SCENARIOS,
  TriageService,
} from '../../services/triageService';
import { PatientMetadata, PresetScenario, TriageResult } from '../../types/triage';

interface SwahiliTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwahiliTriageModal: React.FC<SwahiliTriageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [activeTab, setActiveTab] = useState<'patient' | 'clinician'>('patient');

  // Patient metadata for handoff
  const [patient, setPatient] = useState<PatientMetadata>({
    name: 'Mgonjwa / Patient',
    age: 28,
    gender: 'Mwanamke / Female',
    location: 'Dar es Salaam, Tanzania',
    chwPhone: '+255712345678',
  });

  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        recorderRef.current = new AudioRecorder();
        await recorderRef.current.start();
        setIsRecording(true);
        toast.info('Kinasa sauti kinafanya kazi... Ongea dalili zako kwa Kiswahili.');
      } catch (err: any) {
        console.error('Recording start failed:', err);
        toast.error(err.message || 'Haikuweza kuanzisha maikrofoni. Tafadhali andika dalili.');
      }
    } else {
      try {
        setIsRecording(false);
        if (recorderRef.current) {
          await recorderRef.current.stop();
          // Simulated voice transcript helper if empty
          if (!transcript.trim()) {
            setTranscript(
              'Ninajisikia homa kali kuanzia jana usiku, mwili mzima unaniuma na ninatetemeka. Kichwa pia kinauma sana upande wa mbele.'
            );
          }
          toast.success('Sauti imerekodiwa kikamilifu!');
        }
      } catch (err: any) {
        console.error('Recording stop failed:', err);
        toast.error('Hitilafu wakati wa kusimamisha kinasa sauti.');
      }
    }
  };

  const handleApplyPreset = (preset: PresetScenario) => {
    setTranscript(preset.sampleTranscript);
    setPatient(preset.patient);
    setTriageResult(null);
    toast.info(`Mfano wa ${preset.titleSwahili} umepakiwa.`);
  };

  const handleRunTriage = async () => {
    if (!transcript.trim()) {
      toast.warning('Tafadhali rekodi au andika dalili unazohisi kwanza.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await TriageService.evaluateTriage({
        transcript,
        patient,
      });
      setTriageResult(result);
      setActiveTab('patient');
      toast.success('Uchunguzi umekamilika!');
    } catch (err: any) {
      console.error('Triage analysis failed:', err);
      toast.error('Hitilafu ya uchunguzi. Tafadhali jaribu tena.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyWhatsAppText = () => {
    if (!triageResult) return;
    navigator.clipboard.writeText(triageResult.compactWhatsAppText);
    toast.success('Taarifa ya SBAR imenakiliwa kwenye ubao (clipboard)!');
  };

  const handleOpenWhatsApp = () => {
    if (!triageResult) return;
    const url = TriageService.getWhatsAppDispatchUrl(
      patient.chwPhone,
      triageResult.compactWhatsAppText
    );
    window.open(url, '_blank');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-background rounded-3xl border shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2.5 py-0.5">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-primary animate-pulse" />
              Afya AI Triage Engine
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Swahili & Clinician Handoff
            </Badge>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Uchunguzi wa Haraka wa Dalili
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Ongea au andika kwa Kiswahili kupata tathmini ya haraka na taarifa rasmi ya SBAR kwa mhudumu wa afya (CHW).
          </DialogDescription>
        </DialogHeader>

        {/* Quick Test Presets */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Mifano ya Haraka ya Kujaribu (Quick Test Presets)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/50 hover:border-primary/40 transition-all text-xs space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground group-hover:text-primary">
                    {preset.category === 'malaria'
                      ? '🦟 Homa / Malaria'
                      : preset.category === 'maternal'
                      ? '🤰 Mjamzito / Hatari'
                      : '💓 Presha / Kizunguzungu'}
                  </span>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 ${
                      preset.expectedRisk === 'RED'
                        ? 'bg-destructive/15 text-destructive border-destructive/20'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {preset.expectedRisk}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-1">{preset.titleSwahili}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Recording & Input Area */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="symptoms-input" className="text-sm font-medium">
              Dalili Zako (Sauti au Maandishi)
            </Label>
            {isRecording && (
              <span className="flex items-center text-xs font-mono text-destructive animate-pulse">
                <span className="w-2 h-2 rounded-full bg-destructive mr-1.5" />
                Inarekodi: {formatTimer(recordingSeconds)}
              </span>
            )}
          </div>

          <div className="relative">
            <Textarea
              id="symptoms-input"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Eleza dalili zako hapa... (Mfano: Nina homa kali na maumivu ya kichwa tangu jana, na leo ninatapika...)"
              className="min-h-[100px] resize-none pr-12 rounded-2xl text-sm"
            />
            <Button
              type="button"
              variant={isRecording ? 'destructive' : 'secondary'}
              size="icon"
              onClick={toggleRecording}
              className={`absolute right-3 bottom-3 rounded-full transition-transform ${
                isRecording ? 'scale-110 animate-bounce' : 'hover:scale-105'
              }`}
              title={isRecording ? 'Simamisha kurekodi' : 'Bonyeza kurekodi sauti'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-primary" />}
            </Button>
          </div>

          {/* Collapsible Patient Metadata Bar */}
          <div className="bg-muted/30 border rounded-2xl p-3 space-y-2 text-xs">
            <div className="flex items-center text-muted-foreground font-medium">
              <User className="w-3.5 h-3.5 mr-1" />
              Taarifa za Mgonjwa na Namba ya CHW (Local Metadata)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Jina</Label>
                <Input
                  value={patient.name}
                  onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  className="h-8 text-xs rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Umri</Label>
                <Input
                  value={patient.age}
                  onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                  className="h-8 text-xs rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Mahali / Eneo</Label>
                <Input
                  value={patient.location}
                  onChange={(e) => setPatient({ ...patient, location: e.target.value })}
                  className="h-8 text-xs rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Namba ya CHW / WhatsApp</Label>
                <Input
                  value={patient.chwPhone}
                  onChange={(e) => setPatient({ ...patient, chwPhone: e.target.value })}
                  className="h-8 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <Button
            onClick={handleRunTriage}
            disabled={isAnalyzing || isRecording}
            className="w-full h-11 rounded-2xl font-semibold shadow-md gap-2"
          >
            {isAnalyzing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Inachambua dalili kulingana na miongozo ya kitabibu...
              </>
            ) : (
              <>
                <HeartPulse className="w-4 h-4" />
                Chunguza Dalili & Tengeneza Taarifa ya SBAR
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Triage Results Display */}
        {triageResult && (
          <div className="mt-4 space-y-4 pt-4 border-t">
            {/* Risk Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                triageResult.riskLevel === 'RED'
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : triageResult.riskLevel === 'YELLOW'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {triageResult.riskLevel === 'RED' ? (
                <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-destructive" />
              ) : triageResult.riskLevel === 'YELLOW' ? (
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm tracking-wide">
                    {triageResult.riskLevel === 'RED'
                      ? 'DHARURA YA HARAKA (CRITICAL EMERGENCY)'
                      : triageResult.riskLevel === 'YELLOW'
                      ? 'ANGALIZO LA KITABIBU (URGENT CHW REVIEW)'
                      : 'HALI YA KAWAIDA (MILD / HOME CARE)'}
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    Risk: {triageResult.riskLevel}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed opacity-95">
                  {triageResult.chiefComplaint}
                </p>
                {triageResult.riskLevel === 'RED' && (
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 rounded-xl text-xs gap-1 shadow"
                      onClick={() => window.open('tel:112')}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Piga Nambari ya Dharura (112)
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* View Tabs: Patient Card vs Clinician SBAR */}
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'patient' | 'clinician')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 rounded-2xl p-1 bg-muted/60">
                <TabsTrigger value="patient" className="rounded-xl text-xs font-semibold">
                  Mgonjwa (Ushauri wa Kiswahili)
                </TabsTrigger>
                <TabsTrigger value="clinician" className="rounded-xl text-xs font-semibold">
                  Mhudumu / CHW (Taarifa ya SBAR)
                </TabsTrigger>
              </TabsList>

              {/* Patient Guidance Tab */}
              <TabsContent value="patient" className="space-y-3 pt-3">
                <Card className="rounded-2xl border bg-card/60">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Muhtasari wa Hali Yako
                      </h4>
                      <p className="text-sm font-medium leading-relaxed">
                        {triageResult.patientGuidance.swahiliSummary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Hatua za Haraka za Kufanya (Immediate Actions)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {triageResult.patientGuidance.immediateActions.map((action, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary mr-1.5 font-bold">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-destructive mb-1">
                        Dalili za Hatari za Kuchunguza (Danger Signs)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {triageResult.patientGuidance.dangerSignsToWatch.map((danger, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-destructive mr-1.5 font-bold">⚠️</span>
                            <span>{danger}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Clinician SBAR Note Tab */}
              <TabsContent value="clinician" className="space-y-3 pt-3">
                <Card className="rounded-2xl border bg-card/60">
                  <CardContent className="p-4 space-y-2 text-xs font-mono">
                    <div className="bg-muted/40 p-3 rounded-xl space-y-1.5 border leading-relaxed">
                      <p className="text-primary font-bold">
                        [S] SITUATION: {triageResult.sbarNote.situation}
                      </p>
                      <p className="text-muted-foreground">
                        [B] BACKGROUND: {triageResult.sbarNote.background}
                      </p>
                      <p className="font-semibold text-foreground">
                        [A] ASSESSMENT: {triageResult.sbarNote.assessment}
                      </p>
                      <p className="text-primary font-bold">
                        [R] RECOMMENDATION: {triageResult.sbarNote.recommendation}
                      </p>
                    </div>

                    {/* WhatsApp & Copy Dispatch Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleOpenWhatsApp}
                        className="flex-1 h-9 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Tuma kwa WhatsApp ya CHW ({patient.chwPhone})
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCopyWhatsAppText}
                        className="h-9 rounded-xl text-xs gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Nakili Nakala (Copy Text)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
