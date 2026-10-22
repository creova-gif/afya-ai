import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Users,
  Heart,
  Droplet,
  Footprints,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Pill,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { FamilyCircleService } from '../../services/familyCircleService';
import { CircleMember, FamilyCircle } from '../../types/familyCircle';

export const FamilyCircleView: React.FC = () => {
  const [circle, setCircle] = useState<FamilyCircle>(() => FamilyCircleService.getFamilyCircle());

  const handleToggleMedication = (memberId: string) => {
    const updated = FamilyCircleService.toggleElderMedication(memberId);
    setCircle(updated);
    toast.success('Taarifa ya dawa za Mzee zimesasishwa!');
  };

  const handleSendCheer = (member: CircleMember) => {
    const msg = FamilyCircleService.generateCheerMessage(member);
    toast.success(msg);
  };

  const { stepsPercent, waterPercent, nutritionPercent } = circle.collectiveRings;

  return (
    <div className="space-y-4">
      {/* Collective Household Rings Card */}
      <Card className="rounded-3xl border bg-gradient-to-br from-card via-card/80 to-muted/30 shadow-lg overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Mzunguko wa Afya ya Nyumba
                </Badge>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {circle.householdName}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Concentric Progress Bars (Apple Health style) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Steps Ring */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-emerald-600" />
                  Hatua za Familia
                </span>
                <span>{stepsPercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-emerald-500/20 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${stepsPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Lengo la hatua za wote kwa pamoja</p>
            </div>

            {/* Water Ring */}
            <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  Maji ya Familia
                </span>
                <span>{waterPercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-blue-500/20 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Kunywa maji ya kutosha nyumbani</p>
            </div>

            {/* Nutrition Ring */}
            <div className="p-3.5 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-orange-700 dark:text-orange-300">
                <span className="flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-orange-600" />
                  Milo Iliyorekodiwa
                </span>
                <span>{nutritionPercent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-orange-500/20 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-700"
                  style={{ width: `${nutritionPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Kufuatilia lishe ya kila mtu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elder Care Alert Card (Special Focus on Wazee) */}
      {circle.members.some((m) => m.role === 'elder' && m.medicationCheckin) && (
        <Card className="rounded-3xl border border-amber-500/30 bg-amber-500/10 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    Uangalizi wa Wazee (Elder Care Monitor)
                  </span>
                  <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]">
                    Afya ya Mzee
                  </Badge>
                </div>
                {circle.members
                  .filter((m) => m.role === 'elder' && m.medicationCheckin)
                  .map((elder) => (
                    <p key={elder.id} className="text-xs text-muted-foreground">
                      {elder.name}:{' '}
                      <span className="font-medium text-foreground">
                        {elder.medicationCheckin?.medicationName} ({elder.medicationCheckin?.timeScheduled})
                      </span>{' '}
                      -{' '}
                      {elder.medicationCheckin?.taken ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Zimeshamezwa ✓
                        </span>
                      ) : (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">
                          Bado hajazimeza!
                        </span>
                      )}
                    </p>
                  ))}
              </div>
            </div>

            {circle.members
              .filter((m) => m.role === 'elder' && m.medicationCheckin)
              .map((elder) => (
                <Button
                  key={elder.id}
                  size="sm"
                  onClick={() => handleToggleMedication(elder.id)}
                  className={`rounded-xl text-xs font-semibold gap-1.5 shadow ${
                    elder.medicationCheckin?.taken
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {elder.medicationCheckin?.taken ? 'Imeripotiwa: Zimezwa' : 'Weka Alama: Zimezwa'}
                </Button>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Household Members Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Wanafamilia Kwenye Mzunguko Huu
          </span>
          <span className="text-xs text-muted-foreground">{circle.members.length} wanafamilia</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {circle.members.map((member) => (
            <Card
              key={member.id}
              className="rounded-2xl border bg-card/60 hover:bg-card/90 transition-all p-3.5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-muted/60 flex items-center justify-center text-xl shadow-inner">
                    {member.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{member.name}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {member.role === 'elder'
                        ? 'Mzee wa Familia'
                        : member.role === 'child'
                        ? 'Mtoto'
                        : member.role === 'parent'
                        ? 'Mzazi'
                        : 'Kijana'}
                    </p>
                  </div>
                </div>

                <Badge
                  className={`text-[10px] px-2 py-0.5 capitalize ${
                    member.status === 'goal_reached'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                      : member.status === 'needs_checkin'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {member.status === 'goal_reached'
                    ? 'Lengo Limetimia'
                    : member.status === 'needs_checkin'
                    ? 'Inahitaji Uangalizi'
                    : 'Anaendelea'}
                </Badge>
              </div>

              {/* Progress Counters */}
              <div className="grid grid-cols-3 gap-1.5 text-center bg-muted/30 p-2 rounded-xl text-xs">
                <div>
                  <span className="font-extrabold text-foreground">{member.steps.toLocaleString()}</span>
                  <p className="text-[10px] text-muted-foreground">Hatua</p>
                </div>
                <div>
                  <span className="font-extrabold text-foreground">{member.waterGlasses} glasi</span>
                  <p className="text-[10px] text-muted-foreground">Maji</p>
                </div>
                <div>
                  <span className="font-extrabold text-foreground">{member.mealsLogged}</span>
                  <p className="text-[10px] text-muted-foreground">Milo</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] text-muted-foreground">{member.lastActive}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSendCheer(member)}
                  className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10 rounded-lg gap-1 px-2 font-medium"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Mtie Moyo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
