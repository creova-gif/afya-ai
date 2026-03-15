/**
 * AfyaAI TZA — Patient Wellness Module
 * Integrated into AfyaAI TZA design system
 * Features: Onboarding · Food · Habits · Progress · Family · Workout
 */

import { useState, useEffect, useCallback } from "react";

// ─── Design Tokens (matches AfyaAI TZA system) ────────────────────────────
const T = {
  primary:    "#0F3D56",
  teal:       "#1B998B",
  tealLight:  "#E8F5F3",
  tealMid:    "#0D7A6E",
  tealDark:   "#096358",
  red:        "#C84B31",
  redLight:   "#FDF0ED",
  amber:      "#D97706",
  amberLight: "#FEF3C7",
  green:      "#2E7D32",
  greenLight: "#EDF7EE",
  blue:       "#1565C0",
  blueLight:  "#E8F0FB",
  purple:     "#6B21A8",
  purpleLight:"#F3E8FF",
  n50:        "#F7F9FC",
  n100:       "#EEF1F6",
  n200:       "#D8DDE8",
  n300:       "#B4BAC8",
  n400:       "#8A93A8",
  n600:       "#4A5568",
  n700:       "#2D3748",
  n800:       "#1E2433",
  white:      "#FFFFFF",
};

// ─── i18n (EN / SW) ───────────────────────────────────────────────────────
const I18N = {
  en: {
    wellness: "Wellness",
    overview: "Overview",
    food: "Nutrition",
    habits: "Daily Habits",
    progress: "Progress",
    family: "Family",
    workout: "Activity",
    settings: "Settings",
    back: "Back",
    save: "Save",
    done: "Done",
    today: "Today",
    week: "This week",
    calories: "Calories",
    water: "Water",
    sleep: "Sleep",
    steps: "Steps",
    weight: "Weight",
    height: "Height",
    age: "Age",
    name: "Full name",
    addMeal: "Log a meal",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    addProfile: "Add family member",
    startWorkout: "Start activity",
    wellbeingScore: "Wellbeing score",
    great: "Great",
    good: "Good",
    fair: "Fair",
    note: "This module supports your overall health. It does not replace clinical care.",
    onboard1: "Your health, in your hands.",
    onboard1sub: "Track daily habits, nutrition, and activity to support your care.",
    onboard2: "Built for Tanzania.",
    onboard2sub: "Works offline. Available in Kiswahili and English.",
    onboard3: "Private and secure.",
    onboard3sub: "Your wellness data stays on your device unless you choose to share it.",
    getStarted: "Get started",
    next: "Next",
    skip: "Skip",
    selectGoals: "What would you like to focus on?",
    goal1: "Manage a health condition",
    goal2: "Improve nutrition",
    goal3: "Be more active",
    goal4: "Better sleep & hydration",
    goal5: "Support my family's health",
    selectActivity: "How active are you currently?",
    act1: "Mostly sitting",
    act2: "Light movement",
    act3: "Moderately active",
    act4: "Very active",
    glasses: "glasses",
    hours: "hours",
    kcal: "kcal",
    target: "Target",
    consumed: "Consumed",
    remaining: "Remaining",
    logWater: "Log water",
    logSleep: "Log sleep",
    logSteps: "Log steps",
    workouts: "Activities this week",
    meals: "Meals today",
    noMeals: "No meals logged yet",
    noWorkouts: "No activities yet",
    addFood: "Add food",
    foodName: "Food or dish name",
    portion: "Portion / amount",
    caloriesEst: "Estimated calories",
    activityType: "Activity type",
    duration: "Duration (minutes)",
    intensity: "Intensity",
    low: "Low",
    medium: "Moderate",
    high: "High",
    relationship: "Relationship",
    child: "Child",
    parent: "Parent",
    partner: "Partner",
    elder: "Elder / grandparent",
    switchTo: "Switch to",
    viewing: "Viewing",
    profile: "Profile",
    weeklyTrend: "Weekly trend",
    avgCalories: "Avg. daily calories",
    avgSleep: "Avg. sleep",
    avgWater: "Avg. water",
    totalWorkouts: "Activities this week",
    disclaimer: "Wellness data is for personal tracking only. Consult your care team for medical decisions.",
  },
  sw: {
    wellness: "Afya ya Kila Siku",
    overview: "Muhtasari",
    food: "Lishe",
    habits: "Tabia za Kila Siku",
    progress: "Maendeleo",
    family: "Familia",
    workout: "Shughuli",
    settings: "Mipangilio",
    back: "Rudi",
    save: "Hifadhi",
    done: "Imekamilika",
    today: "Leo",
    week: "Wiki hii",
    calories: "Kalori",
    water: "Maji",
    sleep: "Usingizi",
    steps: "Hatua",
    weight: "Uzito",
    height: "Urefu",
    age: "Umri",
    name: "Jina kamili",
    addMeal: "Rekodi mlo",
    breakfast: "Kiamsha kinywa",
    lunch: "Chakula cha mchana",
    dinner: "Chakula cha jioni",
    snack: "Vitafunio",
    addProfile: "Ongeza mwanafamilia",
    startWorkout: "Anza shughuli",
    wellbeingScore: "Alama ya afya",
    great: "Nzuri sana",
    good: "Nzuri",
    fair: "Wastani",
    note: "Moduli hii inasaidia afya yako ya jumla. Haichukui nafasi ya huduma ya kliniki.",
    onboard1: "Afya yako, mikononi mwako.",
    onboard1sub: "Fuatilia tabia za kila siku, lishe, na shughuli ili kusaidia huduma yako.",
    onboard2: "Imejengwa kwa Tanzania.",
    onboard2sub: "Inafanya kazi bila mtandao. Inapatikana kwa Kiswahili na Kiingereza.",
    onboard3: "Faragha na usalama.",
    onboard3sub: "Data yako inabaki kwenye kifaa chako isipokuwa ukichagua kushiriki.",
    getStarted: "Anza",
    next: "Ifuatayo",
    skip: "Ruka",
    selectGoals: "Unataka kuzingatia nini?",
    goal1: "Kusimamia hali ya kiafya",
    goal2: "Kuboresha lishe",
    goal3: "Kuwa na shughuli zaidi",
    goal4: "Usingizi na maji bora",
    goal5: "Kusaidia afya ya familia",
    selectActivity: "Unashughulika kiasi gani sasa hivi?",
    act1: "Kukaa zaidi",
    act2: "Harakati ndogo",
    act3: "Shughuli za wastani",
    act4: "Shughuli nyingi sana",
    glasses: "vikombe",
    hours: "masaa",
    kcal: "kcal",
    target: "Lengo",
    consumed: "Uliyokula",
    remaining: "Kilichobaki",
    logWater: "Rekodi maji",
    logSleep: "Rekodi usingizi",
    logSteps: "Rekodi hatua",
    workouts: "Shughuli wiki hii",
    meals: "Milo leo",
    noMeals: "Hakuna milo iliyorekodiwa",
    noWorkouts: "Hakuna shughuli bado",
    addFood: "Ongeza chakula",
    foodName: "Jina la chakula",
    portion: "Kiasi / sehemu",
    caloriesEst: "Kalori zinazokadiriwa",
    activityType: "Aina ya shughuli",
    duration: "Muda (dakika)",
    intensity: "Nguvu",
    low: "Ndogo",
    medium: "Wastani",
    high: "Kubwa",
    relationship: "Uhusiano",
    child: "Mtoto",
    parent: "Mzazi",
    partner: "Mwenzi",
    elder: "Mzee / babu/bibi",
    switchTo: "Badili kwa",
    viewing: "Unaona",
    profile: "Wasifu",
    weeklyTrend: "Mwenendo wa wiki",
    avgCalories: "Wastani wa kalori za kila siku",
    avgSleep: "Wastani wa usingizi",
    avgWater: "Wastani wa maji",
    totalWorkouts: "Shughuli wiki hii",
    disclaimer: "Data ya ustawi ni kwa ufuatiliaji wa kibinafsi tu. Wasiliana na timu yako ya utunzaji kwa maamuzi ya kimatibabu.",
  },
};

// ─── Shared primitives ─────────────────────────────────────────────────────
const css = (base, extra = {}) => ({ ...base, ...extra });

function Btn({ children, onClick, variant = "primary", size = "md", style: sx = {}, disabled }) {
  const base = {
    border: "none", cursor: disabled ? "default" : "pointer", borderRadius: 10,
    fontWeight: 500, transition: "opacity 0.15s, transform 0.12s",
    opacity: disabled ? 0.45 : 1, fontFamily: "inherit",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 13 }, lg: { padding: "14px 28px", fontSize: 15 } };
  const variants = {
    primary:   { background: T.teal,    color: "#fff" },
    secondary: { background: T.n100,    color: T.n700 },
    danger:    { background: T.red,     color: "#fff" },
    ghost:     { background: "transparent", color: T.teal, border: `1px solid ${T.teal}` },
    dark:      { background: T.primary, color: "#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...sx }}>
      {children}
    </button>
  );
}

function Card({ children, style: sx = {}, onClick }) {
  return (
    <div onClick={onClick} style={css({
      background: T.white, borderRadius: 14, border: `1px solid ${T.n200}`,
      padding: "16px 18px", cursor: onClick ? "pointer" : "default",
    }, sx)}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 600, color: T.n400, textTransform: "uppercase", letterSpacing: 0.8 }}>
      {children}
    </p>
  );
}

function RingProgress({ value, max, size = 64, color = T.teal, label, sub }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(circ, (value / max) * circ);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.n100} strokeWidth={7} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
        {label && <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700} fill={T.n800}>{label}</text>}
      </svg>
      {sub && <span style={{ fontSize: 11, color: T.n400 }}>{sub}</span>}
    </div>
  );
}

function BarChart({ data, color = T.teal, height = 80 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{
            width: "100%", borderRadius: "4px 4px 0 0",
            background: d.today ? color : T.n100,
            height: Math.max(4, (d.value / max) * (height - 20)),
            transition: "height 0.3s",
          }} />
          <span style={{ fontSize: 10, color: T.n400 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function MetricPill({ label, value, unit, color = T.teal, icon }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
      borderRadius: 12, background: T.n50, border: `1px solid ${T.n200}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: T.n400 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.n800 }}>
          {value} <span style={{ fontSize: 12, fontWeight: 400, color: T.n400 }}>{unit}</span>
        </p>
      </div>
    </div>
  );
}

function BackBar({ title, onBack, lang, onLangToggle, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "14px 18px", borderBottom: `1px solid ${T.n200}`,
      background: T.white, position: "sticky", top: 0, zIndex: 10,
    }}>
      <button onClick={onBack} style={{
        background: T.n100, border: "none", borderRadius: 8, width: 34, height: 34,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.n600} strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.n800, flex: 1 }}>{title}</h2>
      {right}
      {onLangToggle && (
        <button onClick={onLangToggle} style={{
          padding: "4px 10px", borderRadius: 6, border: `1px solid ${T.n200}`,
          background: T.n50, fontSize: 11, fontWeight: 600, color: T.n600, cursor: "pointer",
        }}>
          {lang === "en" ? "SW" : "EN"}
        </button>
      )}
    </div>
  );
}

function Disclaimer({ t }) {
  return (
    <p style={{
      fontSize: 11, color: T.n400, textAlign: "center",
      padding: "12px 20px", borderTop: `1px solid ${T.n100}`, margin: 0,
    }}>{t.disclaimer}</p>
  );
}

// ─── ONBOARDING ────────────────────────────────────────────────────────────
function WellnessOnboarding({ onComplete, lang, t }) {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState([]);
  const [activity, setActivity] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", weight: "", height: "" });

  const slides = [
    { icon: "◎", title: t.onboard1, sub: t.onboard1sub, bg: T.tealLight },
    { icon: "◈", title: t.onboard2, sub: t.onboard2sub, bg: T.blueLight },
    { icon: "◇", title: t.onboard3, sub: t.onboard3sub, bg: T.purpleLight },
  ];
  const goalList = [t.goal1, t.goal2, t.goal3, t.goal4, t.goal5];
  const actList  = [t.act1, t.act2, t.act3, t.act4];

  const toggleGoal = (g) => setGoals(gs => gs.includes(g) ? gs.filter(x => x !== g) : [...gs, g]);

  const canComplete = form.name && form.age && goals.length > 0 && activity !== null;

  const handleComplete = () => {
    onComplete({
      id: Date.now().toString(),
      name: form.name,
      age: parseInt(form.age) || 30,
      weight: parseFloat(form.weight) || 65,
      height: parseFloat(form.height) || 165,
      goals,
      activity,
      language: lang,
      dailyCalorieTarget: 2000,
      profileType: "adult",
    });
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: T.white }}>
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "20px 0 0" }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6, borderRadius: 3,
            background: i <= step ? T.teal : T.n200, transition: "all 0.2s",
          }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: "24px 22px", overflowY: "auto" }}>

        {/* Slides 0–2 */}
        {step <= 2 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 24, background: slides[step].bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px", fontSize: 42, color: T.teal,
            }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={T.teal} strokeWidth="1.5">
                {step === 0 && <path d="M22 12h-4l-3 9L9 3l-3 9H2" />}
                {step === 1 && <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
                {step === 2 && <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: T.n800, margin: "0 0 10px" }}>{slides[step].title}</h2>
            <p style={{ fontSize: 14, color: T.n600, lineHeight: 1.6, margin: 0 }}>{slides[step].sub}</p>
            <p style={{ fontSize: 12, color: T.n400, marginTop: 16 }}>{t.note}</p>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: T.n800, marginBottom: 18 }}>{t.selectGoals}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {goalList.map((g, i) => (
                <div key={i} onClick={() => toggleGoal(g)} style={{
                  padding: "13px 16px", borderRadius: 12, cursor: "pointer",
                  border: `1.5px solid ${goals.includes(g) ? T.teal : T.n200}`,
                  background: goals.includes(g) ? T.tealLight : T.white,
                  display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s",
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    border: `1.5px solid ${goals.includes(g) ? T.teal : T.n300}`,
                    background: goals.includes(g) ? T.teal : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {goals.includes(g) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: T.n700 }}>{g}</span>
                </div>
              ))}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: T.n800, margin: "24px 0 14px" }}>{t.selectActivity}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {actList.map((a, i) => (
                <div key={i} onClick={() => setActivity(i)} style={{
                  padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                  border: `1.5px solid ${activity === i ? T.teal : T.n200}`,
                  background: activity === i ? T.tealLight : T.white,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 12, color: T.n700, fontWeight: activity === i ? 500 : 400 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Basic info */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: T.n800, marginBottom: 6 }}>Your basic information</h2>
            <p style={{ fontSize: 13, color: T.n600, marginBottom: 24 }}>Used to personalise your wellness plan. Optional fields can be skipped.</p>
            {[
              { key: "name", label: t.name, type: "text", required: true, placeholder: lang === "sw" ? "Jina lako kamili" : "Your full name" },
              { key: "age",  label: t.age,  type: "number", required: true, placeholder: lang === "sw" ? "Mfano: 32" : "e.g. 32" },
              { key: "weight", label: `${t.weight} (kg)`, type: "number", placeholder: "e.g. 68" },
              { key: "height", label: `${t.height} (cm)`, type: "number", placeholder: "e.g. 165" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.n600, marginBottom: 5 }}>
                  {f.label} {f.required && <span style={{ color: T.red }}>*</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10,
                    border: `1px solid ${T.n200}`, fontSize: 14, color: T.n800,
                    background: T.n50, boxSizing: "border-box", fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: "16px 22px 24px", borderTop: `1px solid ${T.n100}`, display: "flex", justifyContent: "space-between", gap: 10 }}>
        {step > 0
          ? <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>{lang === "sw" ? "Rudi" : "Back"}</Btn>
          : <div />
        }
        {step < 4
          ? <Btn onClick={() => setStep(s => s + 1)}>{t.next}</Btn>
          : <Btn onClick={handleComplete} disabled={!canComplete}>{t.getStarted}</Btn>
        }
      </div>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────
function WellnessOverview({ profile, habits, meals, workouts, t, onNavigate }) {
  const todayCal  = meals.reduce((s, m) => s + m.totalCalories, 0);
  const calTarget = profile.dailyCalorieTarget || 2000;
  const score = Math.round(
    (habits.water / 8 * 25) +
    (Math.min(habits.sleep, 8) / 8 * 25) +
    (Math.min(habits.steps, 8000) / 8000 * 25) +
    (Math.min(workouts.length, 3) / 3 * 25)
  );
  const scoreLabel = score >= 75 ? t.great : score >= 45 ? t.good : t.fair;
  const scoreColor = score >= 75 ? T.green : score >= 45 ? T.teal : T.amber;

  const weekDays = ["M","T","W","T","F","S","S"];
  const today = new Date().getDay();
  const weekData = weekDays.map((l, i) => ({
    label: l, value: i === (today === 0 ? 6 : today - 1) ? habits.steps : Math.floor(Math.random() * 6000 + 2000), today: i === (today === 0 ? 6 : today - 1),
  }));

  return (
    <div style={{ padding: "18px 18px 100px", overflowY: "auto" }}>
      {/* Wellbeing score */}
      <Card sx={{ marginBottom: 14, background: `linear-gradient(135deg, ${T.primary} 0%, ${T.tealDark} 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{t.wellbeingScore}</p>
            <p style={{ margin: "0 0 2px", fontSize: 36, fontWeight: 800, color: "#fff" }}>{score}<span style={{ fontSize: 16, fontWeight: 400, marginLeft: 2 }}>/100</span></p>
            <p style={{ margin: 0, fontSize: 13, color: scoreColor === T.green ? "#86EFAC" : scoreColor === T.teal ? "#99F6E4" : "#FCD34D", fontWeight: 500 }}>{scoreLabel}</p>
          </div>
          <RingProgress value={score} max={100} size={80} color="#fff" label={score} />
        </div>
      </Card>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <MetricPill label={t.water} value={habits.water} unit={t.glasses} color={T.blue} icon="💧" />
        <MetricPill label={t.sleep} value={habits.sleep} unit={t.hours}   color={T.purple} icon="🌙" />
        <MetricPill label={t.steps} value={habits.steps.toLocaleString()} unit=""    color={T.green} icon="👣" />
        <MetricPill label={t.calories} value={todayCal} unit={t.kcal}     color={T.amber} icon="🍽" />
      </div>

      {/* Activity trend */}
      <Card sx={{ marginBottom: 14 }}>
        <SectionLabel>{t.weeklyTrend}</SectionLabel>
        <BarChart data={weekData} color={T.teal} height={80} />
      </Card>

      {/* Quick nav cards */}
      <SectionLabel>Quick access</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { id: "food",    icon: "🍽", label: t.food,    color: T.amber  },
          { id: "habits",  icon: "◉",  label: t.habits,  color: T.teal   },
          { id: "workout", icon: "◈",  label: t.workout, color: T.green  },
          { id: "progress",icon: "↗",  label: t.progress,color: T.blue   },
          { id: "family",  icon: "◎",  label: t.family,  color: T.purple },
        ].map(item => (
          <Card key={item.id} onClick={() => onNavigate(item.id)} sx={{
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer", padding: "14px 16px",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: T.n700 }}>{item.label}</span>
          </Card>
        ))}
      </div>
      <Disclaimer t={t} />
    </div>
  );
}

// ─── FOOD TRACKING ─────────────────────────────────────────────────────────
function FoodModule({ profile, meals, onAddMeal, t }) {
  const [showForm, setShowForm] = useState(false);
  const [mealType, setMealType] = useState("lunch");
  const [foods, setFoods] = useState([{ name: "", portion: "", calories: "" }]);

  const target  = profile.dailyCalorieTarget || 2000;
  const consumed = meals.reduce((s, m) => s + m.totalCalories, 0);
  const remaining = Math.max(0, target - consumed);

  const addFoodRow = () => setFoods(f => [...f, { name: "", portion: "", calories: "" }]);
  const updateFood = (i, key, val) => setFoods(f => f.map((x, idx) => idx === i ? { ...x, [key]: val } : x));

  const submit = () => {
    const items = foods.filter(f => f.name).map(f => ({
      name: f.name, portion: f.portion || "1 serving",
      calories: parseInt(f.calories) || 0,
    }));
    if (!items.length) return;
    onAddMeal({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: mealType,
      foods: items,
      totalCalories: items.reduce((s, f) => s + f.calories, 0),
    });
    setFoods([{ name: "", portion: "", calories: "" }]);
    setShowForm(false);
  };

  const mealGroups = ["breakfast", "lunch", "dinner", "snack"].map(type => ({
    type, label: t[type], items: meals.filter(m => m.type === type),
  }));

  const inputStyle = {
    padding: "9px 12px", borderRadius: 9, border: `1px solid ${T.n200}`,
    fontSize: 13, color: T.n800, background: T.n50,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "18px 18px 80px", overflowY: "auto" }}>
      {/* Calorie summary */}
      <Card sx={{ marginBottom: 18, background: `linear-gradient(135deg, ${T.amber}18, ${T.amberLight})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 11, color: T.n400 }}>{t.today}</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: T.n800 }}>{consumed}<span style={{ fontSize: 13, fontWeight: 400, color: T.n400, marginLeft: 3 }}>{t.kcal}</span></p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: T.n400 }}>{t.remaining}</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: remaining > 0 ? T.green : T.red }}>{remaining} {t.kcal}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 12, background: "rgba(0,0,0,0.08)", borderRadius: 4, height: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, consumed / target * 100)}%`, background: consumed > target ? T.red : T.amber, borderRadius: 4, transition: "width 0.4s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: T.n400 }}>{t.consumed}: {consumed}</span>
          <span style={{ fontSize: 10, color: T.n400 }}>{t.target}: {target}</span>
        </div>
      </Card>

      {/* Add meal */}
      {!showForm ? (
        <Btn onClick={() => setShowForm(true)} sx={{ width: "100%", marginBottom: 20 }}>
          + {t.addMeal}
        </Btn>
      ) : (
        <Card sx={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 600, color: T.n800 }}>{t.addMeal}</p>

          {/* Meal type selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {["breakfast","lunch","dinner","snack"].map(type => (
              <button key={type} onClick={() => setMealType(type)} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: `1px solid ${mealType === type ? T.teal : T.n200}`,
                background: mealType === type ? T.tealLight : T.n50,
                color: mealType === type ? T.teal : T.n600, cursor: "pointer",
              }}>{t[type]}</button>
            ))}
          </div>

          {foods.map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} placeholder={t.foodName} value={f.name} onChange={e => updateFood(i, "name", e.target.value)} />
              <input style={inputStyle} placeholder={t.portion} value={f.portion} onChange={e => updateFood(i, "portion", e.target.value)} />
              <input style={{ ...inputStyle, width: "100%" }} placeholder={t.kcal} type="number" value={f.calories} onChange={e => updateFood(i, "calories", e.target.value)} />
            </div>
          ))}

          <button onClick={addFoodRow} style={{ background: "none", border: "none", color: T.teal, fontSize: 12, fontWeight: 500, cursor: "pointer", padding: "4px 0", marginBottom: 12 }}>
            + Add another item
          </button>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" size="sm" onClick={() => setShowForm(false)}>{lang === "sw" ? "Ghairi" : "Cancel"}</Btn>
            <Btn size="sm" onClick={submit}>{t.save}</Btn>
          </div>
        </Card>
      )}

      {/* Meal list */}
      {mealGroups.map(group => (
        group.items.length > 0 && (
          <div key={group.type} style={{ marginBottom: 20 }}>
            <SectionLabel>{group.label}</SectionLabel>
            {group.items.map((meal, i) => (
              <Card key={i} sx={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    {meal.foods.map((f, fi) => (
                      <p key={fi} style={{ margin: "0 0 3px", fontSize: 13, color: T.n700 }}>
                        {f.name} {f.portion && <span style={{ color: T.n400 }}>— {f.portion}</span>}
                      </p>
                    ))}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.amber, flexShrink: 0, marginLeft: 10 }}>
                    {meal.totalCalories} {t.kcal}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )
      ))}

      {meals.length === 0 && (
        <p style={{ textAlign: "center", color: T.n400, fontSize: 13, marginTop: 32 }}>{t.noMeals}</p>
      )}
      <Disclaimer t={t} />
    </div>
  );
}

// ─── HABITS ────────────────────────────────────────────────────────────────
function HabitsModule({ habits, onUpdate, t }) {
  const items = [
    { key: "water", icon: "💧", label: t.water, unit: t.glasses, target: 8, color: T.blue, step: 1, max: 12 },
    { key: "sleep", icon: "🌙", label: t.sleep, unit: t.hours,   target: 8, color: T.purple, step: 0.5, max: 12 },
    { key: "steps", icon: "👣", label: t.steps, unit: "",        target: 8000, color: T.green, step: 500, max: 20000 },
  ];

  return (
    <div style={{ padding: "18px 18px 80px", overflowY: "auto" }}>
      <p style={{ fontSize: 13, color: T.n600, marginBottom: 24, lineHeight: 1.6 }}>
        {t.note}
      </p>
      {items.map(item => {
        const val = habits[item.key] || 0;
        const pct = Math.min(1, val / item.target);
        return (
          <Card key={item.key} sx={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.n800 }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 11, color: T.n400 }}>
                    {t.target}: {item.target} {item.unit}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: item.color }}>
                  {val.toLocaleString()}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: T.n400 }}>{item.unit}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: T.n100, borderRadius: 4, height: 7, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${pct * 100}%`, background: pct >= 1 ? T.green : item.color, borderRadius: 4, transition: "width 0.3s" }} />
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => onUpdate({ [item.key]: Math.max(0, val - item.step) })} style={{
                width: 36, height: 36, borderRadius: 9, border: `1px solid ${T.n200}`,
                background: T.n50, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>−</button>
              <input
                type="range" min={0} max={item.max} step={item.step} value={val}
                onChange={e => onUpdate({ [item.key]: parseFloat(e.target.value) })}
                style={{ flex: 1, accentColor: item.color }}
              />
              <button onClick={() => onUpdate({ [item.key]: Math.min(item.max, val + item.step) })} style={{
                width: 36, height: 36, borderRadius: 9, border: `1px solid ${T.n200}`,
                background: T.n50, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>+</button>
            </div>
          </Card>
        );
      })}
      <Disclaimer t={t} />
    </div>
  );
}

// ─── WORKOUT ───────────────────────────────────────────────────────────────
const WORKOUTS = [
  { id: "w1", type: "Walking",        icon: "🚶", duration: 30, kcal: 120, intensity: "low",    desc: "30-minute brisk walk. No equipment needed." },
  { id: "w2", type: "Stretching",     icon: "🧘", duration: 20, kcal: 60,  intensity: "low",    desc: "Full-body gentle stretch. Good for any fitness level." },
  { id: "w3", type: "Bodyweight",     icon: "◈",  duration: 25, kcal: 180, intensity: "medium", desc: "Squats, push-ups, lunges. No equipment." },
  { id: "w4", type: "Dance / Ngoma",  icon: "◉",  duration: 30, kcal: 220, intensity: "medium", desc: "Traditional movement-based activity. Fun and effective." },
  { id: "w5", type: "Strength",       icon: "◆",  duration: 40, kcal: 280, intensity: "high",   desc: "Resistance exercises. Gym or home with minimal equipment." },
];

function WorkoutModule({ workouts, onAddWorkout, t }) {
  const [active, setActive] = useState(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval;
    if (running) interval = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const startWorkout = (w) => { setActive(w); setTimer(0); setRunning(false); setDone(false); };
  const finishWorkout = () => {
    onAddWorkout({ id: Date.now().toString(), date: new Date().toISOString(), type: active.type, duration: Math.max(active.duration, Math.round(timer / 60)), kcal: active.kcal, completed: true });
    setActive(null); setDone(false); setRunning(false);
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;
  const intensityColor = { low: T.green, medium: T.amber, high: T.red };

  if (active) return (
    <div style={{ padding: "18px 18px 80px" }}>
      <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: T.teal, fontSize: 13, fontWeight: 500, cursor: "pointer", marginBottom: 16 }}>
        ← Back to activities
      </button>
      <Card sx={{ textAlign: "center", padding: "32px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>{active.icon}</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.n800, margin: "0 0 6px" }}>{active.type}</h2>
        <p style={{ fontSize: 13, color: T.n600, margin: "0 0 24px" }}>{active.desc}</p>

        <div style={{ fontSize: 52, fontWeight: 800, color: T.primary, fontFamily: "monospace", letterSpacing: 2, marginBottom: 24 }}>
          {fmt(timer)}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn variant="secondary" onClick={() => setRunning(r => !r)}>
            {running ? "Pause" : timer > 0 ? "Resume" : "Start"}
          </Btn>
          {timer > 10 && (
            <Btn onClick={() => { setRunning(false); setDone(true); finishWorkout(); }}>
              {t.done}
            </Btn>
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: "18px 18px 80px", overflowY: "auto" }}>
      <SectionLabel>{t.startWorkout}</SectionLabel>
      {WORKOUTS.map(w => (
        <Card key={w.id} sx={{ marginBottom: 10, cursor: "pointer" }} onClick={() => startWorkout(w)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: intensityColor[w.intensity] + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {w.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.n800 }}>{w.type}</p>
                <span style={{ padding: "2px 8px", borderRadius: 10, background: intensityColor[w.intensity] + "18", color: intensityColor[w.intensity], fontSize: 11, fontWeight: 500 }}>
                  {t[w.intensity]}
                </span>
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: T.n400 }}>{w.duration} min · ~{w.kcal} {t.kcal}</p>
            </div>
          </div>
        </Card>
      ))}

      {workouts.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: 24 }}>{t.workouts}</SectionLabel>
          {workouts.slice(-5).reverse().map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.n100}`, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: T.n700 }}>{w.type}</span>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.n400 }}>{w.duration} min</span>
                <span style={{ fontSize: 12, color: T.amber, fontWeight: 500 }}>{w.kcal} {t.kcal}</span>
              </div>
            </div>
          ))}
        </>
      )}
      <Disclaimer t={t} />
    </div>
  );
}

// ─── PROGRESS ──────────────────────────────────────────────────────────────
function ProgressModule({ profile, workouts, meals, habitLogs, t }) {
  const totalCal   = meals.reduce((s, m) => s + m.totalCalories, 0);
  const avgSleep   = habitLogs.length > 0 ? (habitLogs.reduce((s, h) => s + h.sleep, 0) / habitLogs.length).toFixed(1) : 0;
  const avgWater   = habitLogs.length > 0 ? (habitLogs.reduce((s, h) => s + h.water, 0) / habitLogs.length).toFixed(1) : 0;
  const totalWorkouts = workouts.length;

  const weekCal = ["M","T","W","T","F","S","S"].map((l, i) => ({
    label: l, value: i === 3 ? totalCal : Math.floor(Math.random() * 800 + 1200), today: i === 3,
  }));

  return (
    <div style={{ padding: "18px 18px 80px", overflowY: "auto" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: t.avgCalories, value: totalCal || "—", unit: t.kcal, color: T.amber },
          { label: t.avgSleep,    value: avgSleep,         unit: t.hours, color: T.purple },
          { label: t.avgWater,    value: avgWater,         unit: t.glasses, color: T.blue },
          { label: t.totalWorkouts, value: totalWorkouts,  unit: "", color: T.green },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 14, background: s.color + "12", border: `1px solid ${s.color}30` }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: s.color, fontWeight: 500 }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.n800 }}>
              {s.value} <span style={{ fontSize: 12, fontWeight: 400, color: T.n400 }}>{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Calorie chart */}
      <Card sx={{ marginBottom: 16 }}>
        <SectionLabel>{t.week} — {t.calories}</SectionLabel>
        <BarChart data={weekCal} color={T.amber} height={100} />
      </Card>

      {/* Rings */}
      <Card sx={{ marginBottom: 16 }}>
        <SectionLabel>{t.today} — Goals</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 0" }}>
          <RingProgress value={habitLogs[habitLogs.length-1]?.water || 0} max={8}   size={72} color={T.blue}   label={`${habitLogs[habitLogs.length-1]?.water || 0}/8`}   sub={t.water}   />
          <RingProgress value={habitLogs[habitLogs.length-1]?.sleep || 0} max={8}   size={72} color={T.purple} label={`${habitLogs[habitLogs.length-1]?.sleep || 0}/8`}   sub={t.sleep}   />
          <RingProgress value={Math.min(habitLogs[habitLogs.length-1]?.steps || 0, 8000)} max={8000} size={72} color={T.green}  label={`${Math.round((habitLogs[habitLogs.length-1]?.steps || 0)/1000)}k`} sub={t.steps} />
        </div>
      </Card>

      {/* Profile info */}
      <Card>
        <SectionLabel>{t.profile}</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: t.name,   value: profile.name },
            { label: t.age,    value: `${profile.age}y` },
            { label: t.weight, value: `${profile.weight} kg` },
            { label: t.height, value: `${profile.height} cm` },
          ].map(f => (
            <div key={f.label} style={{ padding: "10px 12px", borderRadius: 10, background: T.n50 }}>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: T.n400 }}>{f.label}</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.n800 }}>{f.value}</p>
            </div>
          ))}
        </div>
      </Card>
      <Disclaimer t={t} />
    </div>
  );
}

// ─── FAMILY ────────────────────────────────────────────────────────────────
function FamilyModule({ profiles, currentProfile, onAddProfile, onSwitch, t }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", relationship: "child" });

  const relations = [
    { key: "child",   label: t.child   },
    { key: "parent",  label: t.parent  },
    { key: "partner", label: t.partner },
    { key: "elder",   label: t.elder   },
  ];

  const submit = () => {
    if (!form.name) return;
    onAddProfile({
      id: Date.now().toString(),
      name: form.name,
      age: parseInt(form.age) || 10,
      goals: [], activity: 1,
      language: currentProfile?.language || "en",
      dailyCalorieTarget: 1800,
      profileType: form.relationship,
      weight: 50, height: 150,
    });
    setForm({ name: "", age: "", relationship: "child" });
    setShowForm(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px", borderRadius: 9,
    border: `1px solid ${T.n200}`, fontSize: 13, color: T.n800,
    background: T.n50, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "18px 18px 80px", overflowY: "auto" }}>
      <p style={{ fontSize: 13, color: T.n600, marginBottom: 20, lineHeight: 1.6 }}>
        Manage wellness for your family members. Each profile tracks their own habits and nutrition.
      </p>

      {profiles.map(p => (
        <Card key={p.id} sx={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: p.id === currentProfile?.id ? T.teal : T.n200,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 16, color: p.id === currentProfile?.id ? "#fff" : T.n600,
          }}>
            {p.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: T.n800 }}>{p.name}</p>
            <p style={{ margin: 0, fontSize: 12, color: T.n400 }}>{p.age} years · {p.profileType}</p>
          </div>
          {p.id !== currentProfile?.id && (
            <Btn size="sm" variant="ghost" onClick={() => onSwitch(p.id)}>{t.switchTo}</Btn>
          )}
          {p.id === currentProfile?.id && (
            <span style={{ fontSize: 11, color: T.teal, fontWeight: 500 }}>Active</span>
          )}
        </Card>
      ))}

      {!showForm ? (
        <Btn variant="ghost" onClick={() => setShowForm(true)} sx={{ width: "100%", marginTop: 8 }}>
          + {t.addProfile}
        </Btn>
      ) : (
        <Card sx={{ marginTop: 10 }}>
          <p style={{ margin: "0 0 14px", fontWeight: 600, color: T.n800 }}>{t.addProfile}</p>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.n600, marginBottom: 5 }}>{t.name}</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.n600, marginBottom: 5 }}>{t.age}</label>
            <input type="number" style={inputStyle} value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: T.n600, marginBottom: 8 }}>{t.relationship}</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {relations.map(r => (
                <button key={r.key} onClick={() => setForm(p => ({ ...p, relationship: r.key }))} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                  border: `1px solid ${form.relationship === r.key ? T.teal : T.n200}`,
                  background: form.relationship === r.key ? T.tealLight : T.n50,
                  color: form.relationship === r.key ? T.teal : T.n600, cursor: "pointer",
                }}>{r.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn size="sm" onClick={submit}>{t.save}</Btn>
          </div>
        </Card>
      )}
      <Disclaimer t={t} />
    </div>
  );
}

// ─── BOTTOM NAV ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNavigate, t }) {
  const items = [
    { id: "overview", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>), label: t.overview },
    { id: "food",     icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>), label: t.food },
    { id: "habits",   icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>), label: t.habits },
    { id: "workout",  icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>), label: t.workout },
    { id: "progress", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>), label: t.progress },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: 70,
      background: T.white, borderTop: `1px solid ${T.n200}`,
      display: "flex", alignItems: "center", justifyContent: "space-around",
      zIndex: 100, paddingBottom: 4,
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          background: "none", border: "none", cursor: "pointer", padding: "6px 10px",
          color: active === item.id ? T.teal : T.n400, flex: 1,
        }}>
          {item.icon}
          <span style={{ fontSize: 10, fontWeight: active === item.id ? 600 : 400 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── ROOT MODULE ─────────────────────────────────────────────────────────────
export function WellnessModule({ initialProfile = null, lang: initialLang = "en", onClose }) {
  const [lang, setLang]       = useState(initialLang);
  const [screen, setScreen]   = useState(initialProfile ? "overview" : "onboarding");
  const [profile, setProfile] = useState(initialProfile);
  const [profiles, setProfiles] = useState(initialProfile ? [initialProfile] : []);
  const [meals, setMeals]     = useState([]);
  const [habits, setHabits]   = useState({ water: 4, sleep: 6.5, steps: 3200 });
  const [workouts, setWorkouts] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);

  const t = I18N[lang];
  const toggleLang = () => setLang(l => l === "en" ? "sw" : "en");

  const handleOnboardComplete = (p) => {
    setProfile(p);
    setProfiles([p]);
    setHabitLogs([{ date: new Date().toISOString().split("T")[0], ...habits }]);
    setScreen("overview");
  };

  const handleUpdateHabit = useCallback((update) => {
    setHabits(h => ({ ...h, ...update }));
    setHabitLogs(logs => {
      const today = new Date().toISOString().split("T")[0];
      const idx = logs.findIndex(l => l.date === today);
      if (idx >= 0) {
        const updated = [...logs]; updated[idx] = { ...updated[idx], ...update };
        return updated;
      }
      return [...logs, { date: today, water: 0, sleep: 0, steps: 0, ...update }];
    });
  }, []);

  const addProfile  = (p) => setProfiles(ps => [...ps, p]);
  const switchPro   = (id) => { const p = profiles.find(x => x.id === id); if (p) setProfile(p); };

  const screenTitles = {
    overview: t.wellness, food: t.food, habits: t.habits,
    workout: t.workout, progress: t.progress, family: t.family,
  };

  return (
    <div style={{
      width: "100%", maxWidth: 480, margin: "0 auto",
      height: "100%", minHeight: 600, display: "flex", flexDirection: "column",
      background: T.n50, position: "relative", overflow: "hidden",
      fontFamily: "'DM Sans', 'Geist', system-ui, sans-serif",
      borderRadius: 16, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
    }}>

      {/* Back bar (all except onboarding & overview) */}
      {screen !== "onboarding" && (
        <BackBar
          title={screenTitles[screen] || t.wellness}
          onBack={screen === "overview" ? onClose : () => setScreen("overview")}
          lang={lang}
          onLangToggle={toggleLang}
          right={
            screen === "overview" && profile && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: T.teal }}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 12, color: T.n600, fontWeight: 500 }}>{profile.name.split(" ")[0]}</span>
              </div>
            )
          }
        />
      )}

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {screen === "onboarding" && (
          <WellnessOnboarding onComplete={handleOnboardComplete} lang={lang} t={t} />
        )}
        {screen === "overview" && profile && (
          <WellnessOverview profile={profile} habits={habits} meals={meals} workouts={workouts} t={t} onNavigate={setScreen} />
        )}
        {screen === "food" && profile && (
          <FoodModule profile={profile} meals={meals} onAddMeal={m => setMeals(ms => [...ms, m])} t={t} />
        )}
        {screen === "habits" && (
          <HabitsModule habits={habits} onUpdate={handleUpdateHabit} t={t} />
        )}
        {screen === "workout" && (
          <WorkoutModule workouts={workouts} onAddWorkout={w => setWorkouts(ws => [...ws, w])} t={t} />
        )}
        {screen === "progress" && profile && (
          <ProgressModule profile={profile} workouts={workouts} meals={meals} habitLogs={[{ date: new Date().toISOString().split("T")[0], ...habits }]} t={t} />
        )}
        {screen === "family" && (
          <FamilyModule profiles={profiles} currentProfile={profile} onAddProfile={addProfile} onSwitch={switchPro} t={t} />
        )}
      </div>

      {/* Bottom nav */}
      {screen !== "onboarding" && (
        <BottomNav active={screen} onNavigate={setScreen} t={t} />
      )}
    </div>
  );
}

// ─── HOW TO INTEGRATE INTO AfyaAI TZA ─────────────────────────────────────
/**
 * In your AfyaAI TZA App.jsx or patient screen:
 *
 * import { WellnessModule } from './AfyaAI_WellnessModule';
 *
 * // In patient nav, add a "Wellness" tab
 * // When user taps Wellness:
 * <WellnessModule
 *   initialProfile={currentAfyaPatientProfile}  // pass patient profile or null
 *   lang={appLanguage}                          // "en" or "sw"
 *   onClose={() => navigateBack()}              // back to main AfyaAI screen
 * />
 *
 * The WellnessModule is self-contained:
 * - Manages its own state internally
 * - Shares design tokens with AfyaAI hospital UI
 * - Does not expose clinical data to wellness module
 * - Wellness data stays local unless explicitly synced
 */

export default WellnessModule;