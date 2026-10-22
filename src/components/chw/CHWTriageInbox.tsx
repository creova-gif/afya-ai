import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Share2,
  ArrowLeft,
  Filter,
  User,
  Clock,
  Sparkles,
  RefreshCw,
  Building2,
  FileText,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { CHWInboxService } from '../../services/chwInboxService';
import { CHWCaseStatus, TriageQueueItem } from '../../types/chwInbox';
import { RiskLevel } from '../../types/triage';
import { TriageService } from '../../services/triageService';

interface CHWTriageInboxProps {
  onBack: () => void;
}

export const CHWTriageInbox: React.FC<CHWTriageInboxProps> = ({ onBack }) => {
  const [cases, setCases] = useState<TriageQueueItem[]>(() => CHWInboxService.getCases());
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<CHWCaseStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<TriageQueueItem | null>(null);

  // Modal edit fields
  const [editStatus, setEditStatus] = useState<CHWCaseStatus>('pending');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [referralFacility, setReferralFacility] = useState('');

  const stats = CHWInboxService.getStats();

  const handleOpenEdit = (item: TriageQueueItem) => {
    setSelectedCase(item);
    setEditStatus(item.status);
    setClinicalNotes(item.clinicalNotes || '');
    setReferralFacility(item.referralFacility || '');
  };

  const handleSaveStatus = () => {
    if (!selectedCase) return;
    const updated = CHWInboxService.updateCaseStatus(
      selectedCase.id,
      editStatus,
      clinicalNotes,
      referralFacility
    );
    setCases(updated);
    setSelectedCase(null);
    toast.success(`Hali ya mgonjwa ${selectedCase.patientName} imesasishwa kuwa: ${editStatus}`);
  };

  const handleResetDefaults = () => {
    const res = CHWInboxService.resetToDefaults();
    setCases(res);
    toast.info('Mfumo wa kesi umerudishwa kwenye mifano ya awali.');
  };

  const filteredCases = cases.filter((c) => {
    const matchesRisk = filterRisk === 'all' || c.riskLevel === filterRisk;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      {/* Clinic Portal Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-2xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0">
                  <Building2 className="w-3 h-3 mr-1" />
                  Kituo cha Afya & CHW
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Tanzania Clinic Portal</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Dispensary Triage Inbox
              </h1>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="rounded-xl text-xs gap-1.5 h-8 text-muted-foreground hover:text-foreground"
            title="Rudisha orodha ya mfano"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rejesha Mifano</span>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Real-time Triage Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Critical Red Cases */}
          <div
            onClick={() => setFilterRisk(filterRisk === 'RED' ? 'all' : 'RED')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              filterRisk === 'RED'
                ? 'bg-destructive/15 border-destructive ring-2 ring-destructive/40'
                : 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                Dharura Kubwa
              </span>
              <ShieldAlert className="w-5 h-5 text-destructive animate-pulse" />
            </div>
            <div className="text-3xl font-black text-destructive">{stats.criticalRedCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">RED / Urgent Hospital Care</p>
          </div>

          {/* Urgent Yellow Cases */}
          <div
            onClick={() => setFilterRisk(filterRisk === 'YELLOW' ? 'all' : 'YELLOW')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              filterRisk === 'YELLOW'
                ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/40'
                : 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Angalizo la Haraka
              </span>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {stats.urgentYellowCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">YELLOW / Dispensary Lab/Visit</p>
          </div>

          {/* Routine Green Cases */}
          <div
            onClick={() => setFilterRisk(filterRisk === 'GREEN' ? 'all' : 'GREEN')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              filterRisk === 'GREEN'
                ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/40'
                : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Kawaida
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.routineGreenCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">GREEN / Home Care / Monitor</p>
          </div>

          {/* Resolved Count */}
          <div className="p-4 rounded-3xl border bg-muted/20 border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Zilizotatuliwa
              </span>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-black text-foreground">{stats.resolvedTodayCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Kesi zilizokamilika leo</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tafuta jina la mgonjwa, eneo au ugonjwa..."
              className="pl-10 h-10 rounded-2xl text-xs"
            />
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'in_review', 'referred', 'resolved'] as const).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
                className="h-9 rounded-xl text-xs whitespace-nowrap capitalize"
              >
                {status === 'all'
                  ? 'Kesi Zote'
                  : status === 'pending'
                  ? 'Zinazosubiri'
                  : status === 'in_review'
                  ? 'Inafuatiliwa'
                  : status === 'referred'
                  ? 'Rufaa'
                  : 'Imetatuliwa'}
              </Button>
            ))}
          </div>
        </div>

        {/* Triage Queue List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Orodha ya Wagonjwa Kwenye Foleni ({filteredCases.length})
            </span>
          </div>

          {filteredCases.length === 0 ? (
            <Card className="rounded-3xl border p-12 text-center bg-card/40">
              <p className="text-muted-foreground text-sm">Hakuna kesi inayolingana na vigezo vilivyochaguliwa.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredCases.map((item) => {
                const isRed = item.riskLevel === 'RED';
                const isYellow = item.riskLevel === 'YELLOW';

                return (
                  <Card
                    key={item.id}
                    className={`rounded-3xl border transition-all p-4 sm:p-5 shadow-sm space-y-3 ${
                      isRed
                        ? 'border-destructive/30 bg-destructive/5 hover:border-destructive/60'
                        : isYellow
                        ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60'
                        : 'border-border bg-card/60 hover:border-primary/40'
                    }`}
                  >
                    {/* Top Row: Patient Info & Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            isRed
                              ? 'bg-destructive/20 text-destructive'
                              : isYellow
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isRed ? (
                            <ShieldAlert className="w-5 h-5 animate-pulse" />
                          ) : isYellow ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-foreground">{item.patientName}</h3>
                            <span className="text-xs text-muted-foreground">
                              ({item.patientAge}y, {item.patientGender})
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.patientLocation}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs px-2.5 py-0.5 uppercase font-mono font-bold ${
                            isRed
                              ? 'bg-destructive/20 text-destructive border-destructive/30'
                              : isYellow
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {item.riskLevel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs px-2.5 py-0.5 capitalize ${
                            item.status === 'resolved'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : item.status === 'referred'
                              ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                              : item.status === 'in_review'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.status === 'pending'
                            ? 'Inasubiri'
                            : item.status === 'in_review'
                            ? 'Inafuatiliwa'
                            : item.status === 'referred'
                            ? 'Imepewa Rufaa'
                            : 'Imetatuliwa'}
                        </Badge>
                      </div>
                    </div>

                    {/* Chief Complaint Banner */}
                    <div className="p-3 rounded-2xl bg-background/80 border text-xs space-y-1">
                      <span className="font-bold text-foreground">{item.chiefComplaint}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1 text-[11px] font-mono">
                        <p>
                          <span className="text-primary font-bold">[S]:</span> {item.sbar.situation}
                        </p>
                        <p>
                          <span className="text-primary font-bold">[A]:</span> {item.sbar.assessment}
                        </p>
                      </div>
                      <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 pt-0.5">
                        <span className="font-bold">[R - Ushauri]:</span> {item.sbar.recommendation}
                      </p>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.submittedAt}
                        </span>
                        {item.referralFacility && (
                          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                            <Building2 className="w-3.5 h-3.5" />
                            {item.referralFacility}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${item.patientPhone}`)}
                          className="h-8 rounded-xl text-xs gap-1 flex-1 sm:flex-none"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Piga Simu
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const url = TriageService.getWhatsAppDispatchUrl(
                              item.patientPhone,
                              `Habari ${item.patientName}, ninakutumia ujumbe kutoka Kituo cha Afya kuhusiana na taarifa yako ya afya.`
                            );
                            window.open(url, '_blank');
                          }}
                          className="h-8 rounded-xl text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 rounded-xl text-xs font-semibold gap-1 flex-1 sm:flex-none"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Sasisha Hali
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Case Edit / Follow-up Dialog */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
          <DialogContent className="max-w-lg p-5 sm:p-6 bg-background rounded-3xl border shadow-2xl">
            <DialogHeader className="space-y-1">
              <Badge variant="outline" className="w-fit mb-1 text-xs">
                Usimamizi wa Kesi
              </Badge>
              <DialogTitle className="text-xl font-bold">
                Sasisha Taarifa: {selectedCase.patientName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Rekodi hatua zilizochukuliwa na mhudumu wa afya au rufaa iliyotolewa.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Hali ya Kesi (Status):</Label>
                <div className="grid grid-cols-2 gap-2 pt-1.5">
                  {(['pending', 'in_review', 'referred', 'resolved'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setEditStatus(status)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left capitalize transition-all ${
                        editStatus === status
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      {status === 'pending'
                        ? '🟡 Inasubiri'
                        : status === 'in_review'
                        ? '🔵 Inafuatiliwa'
                        : status === 'referred'
                        ? '🟣 Imepewa Rufaa'
                        : '🟢 Imetatuliwa'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="referral-facility" className="text-xs font-semibold text-muted-foreground">
                  Kituo cha Rufaa (Hospital / Dispensary Name):
                </Label>
                <Input
                  id="referral-facility"
                  value={referralFacility}
                  onChange={(e) => setReferralFacility(e.target.value)}
                  placeholder="Mfano: Hospitali ya Wilaya ya Mbagala"
                  className="h-9 rounded-xl text-xs mt-1"
                />
              </div>

              <div>
                <Label htmlFor="clinical-notes" className="text-xs font-semibold text-muted-foreground">
                  Maelezo ya CHW / Muuguzi (Clinical Notes):
                </Label>
                <Textarea
                  id="clinical-notes"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Andika maelezo ya hatua zilizochukuliwa, usafiri, au majibu ya vipimo..."
                  className="min-h-[90px] rounded-xl text-xs mt-1 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)} className="rounded-xl h-9 text-xs">
                  Ghairi
                </Button>
                <Button size="sm" onClick={handleSaveStatus} className="rounded-xl h-9 text-xs font-bold bg-primary">
                  Hifadhi Mabadiliko
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
