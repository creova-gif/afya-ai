// Family Health Circle & Collective Wellness Service
import { CircleMember, FamilyCircle, FamilyCircleSchema } from '../types/familyCircle';

const DEFAULT_FAMILY_MEMBERS: CircleMember[] = [
  {
    id: 'fam-1',
    name: 'Baba (You)',
    role: 'parent',
    avatar: '👨🏾',
    steps: 7420,
    stepsTarget: 10000,
    waterGlasses: 6,
    waterTarget: 8,
    mealsLogged: 2,
    status: 'active',
    lastActive: 'Dakika 15 zilizopita',
  },
  {
    id: 'fam-2',
    name: 'Mama Amina',
    role: 'parent',
    avatar: '👩🏾',
    steps: 9200,
    stepsTarget: 8000,
    waterGlasses: 8,
    waterTarget: 8,
    mealsLogged: 3,
    status: 'goal_reached',
    lastActive: 'Saa 1 lililopita',
  },
  {
    id: 'fam-3',
    name: 'Mzee Rashidi (72y)',
    role: 'elder',
    avatar: '👴🏾',
    steps: 3200,
    stepsTarget: 4000,
    waterGlasses: 4,
    waterTarget: 6,
    mealsLogged: 2,
    medicationCheckin: {
      required: true,
      taken: false,
      medicationName: 'Dawa ya Presha (Amlodipine 5mg)',
      timeScheduled: 'Asubuhi / 8:00 AM',
    },
    status: 'needs_checkin',
    lastActive: 'Saa 3 zilizopita',
  },
  {
    id: 'fam-4',
    name: 'Baraka (Mtoto 10y)',
    role: 'child',
    avatar: '👦🏾',
    steps: 11400,
    stepsTarget: 8000,
    waterGlasses: 7,
    waterTarget: 6,
    mealsLogged: 3,
    status: 'goal_reached',
    lastActive: 'Hivi punde',
  },
];

export class FamilyCircleService {
  private static STORAGE_KEY = 'afya_ai_family_circle';
  private static memoryMembers: CircleMember[] | null = null;

  public static getFamilyCircle(): FamilyCircle {
    let members = this.memoryMembers || DEFAULT_FAMILY_MEMBERS;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          members = JSON.parse(stored);
        }
      }
    } catch {
      // fallback to memory
    }

    // Compute collective rings percentages
    const totalSteps = members.reduce((sum, m) => sum + m.steps, 0);
    const targetSteps = members.reduce((sum, m) => sum + m.stepsTarget, 0);
    const stepsPercent = Math.min(100, Math.round((totalSteps / (targetSteps || 1)) * 100));

    const totalWater = members.reduce((sum, m) => sum + m.waterGlasses, 0);
    const targetWater = members.reduce((sum, m) => sum + m.waterTarget, 0);
    const waterPercent = Math.min(100, Math.round((totalWater / (targetWater || 1)) * 100));

    // Assume 3 meals target per member
    const totalMeals = members.reduce((sum, m) => sum + m.mealsLogged, 0);
    const targetMeals = members.length * 3;
    const nutritionPercent = Math.min(100, Math.round((totalMeals / (targetMeals || 1)) * 100));

    const circle: FamilyCircle = {
      circleId: 'circle-kinondoni-01',
      householdName: 'Mzunguko wa Afya ya Familia (Hassan Household)',
      members,
      collectiveRings: {
        stepsPercent,
        waterPercent,
        nutritionPercent,
      },
    };

    return FamilyCircleSchema.parse(circle);
  }

  public static toggleElderMedication(memberId: string): FamilyCircle {
    const circle = this.getFamilyCircle();
    const updatedMembers = circle.members.map((m) => {
      if (m.id === memberId && m.medicationCheckin) {
        const nextTaken = !m.medicationCheckin.taken;
        return {
          ...m,
          medicationCheckin: {
            ...m.medicationCheckin,
            taken: nextTaken,
          },
          status: nextTaken ? ('active' as const) : ('needs_checkin' as const),
        };
      }
      return m;
    });

    this.memoryMembers = updatedMembers;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMembers));
      }
    } catch {
      // ignore in SSR
    }

    return this.getFamilyCircle();
  }

  public static generateCheerMessage(member: CircleMember): string {
    const cheers = [
      `Hongera sana ${member.name}! Familia inajivunia jinsi unavyotunza afya yako leo! 🔥`,
      `Kazi nzuri ${member.name}! Umekaribia sana kukamilisha malengo yako ya leo! 💪🏾`,
      `Mungu azidi kukupa afya njema ${member.name}. Hatua zako zinaiweka familia yetu pamoja! ❤️`,
    ];
    return cheers[Math.floor(Math.random() * cheers.length)];
  }
}
