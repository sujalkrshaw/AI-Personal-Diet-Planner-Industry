import { demoMode } from "../services/firebase";
import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { Activity, Apple, LogOut, Plus, Scale as ScaleIcon, Sparkles, ShieldCheck } from 'lucide-react';
import { foods, type Food } from '../data/foods';
import { generateLocalPlan, type Plan, type Profile } from '../services/ai';
import { addFood, loadDemo, savePlan, saveProfile, subscribeScale, type Scale } from '../services/store';

const uid = 'demo-user';
const initial: Profile = {
  name: 'Demo User', age: 21, height: 170, weight: 68.4,
  activity: 'Moderate', preference: 'Vegetarian',
  goal: 'General balanced eating', allergies: '',
};

type Tab = 'Dashboard' | 'Profile' | 'Architecture';
type LoggedFood = Food & { createdAt?: string };

export default function App() {
  const demo = loadDemo();
  const [profile, setProfile] = useState<Profile>(() => demo.profile || initial);
  const [plan, setPlan] = useState<Plan | null>(() => demo.plans?.at(-1) || null);
  const [logs, setLogs] = useState<LoggedFood[]>(() => (demo.foods || []) as LoggedFood[]);
  const [scale, setScale] = useState<Scale[]>([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('Dashboard');

  useEffect(() => subscribeScale(uid, setScale), []);

  const calories = logs.reduce((sum, food) => sum + Number(food.calories || 0), 0);
  const target = 2100;
  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));
  const latest = scale[0];

  const generate = async () => {
    const nextPlan = generateLocalPlan(profile);
    setPlan(nextPlan);
    await savePlan(uid, nextPlan);
  };

  const logFood = async (food: Food) => {
    await addFood(uid, food);
    setLogs((current) => [...current, { ...food, createdAt: new Date().toISOString() }]);
  };

  const save = async () => {
    await saveProfile(uid, profile);
  };

  const chartPoints = buildScalePoints(scale);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-400 p-2 text-slate-950"><Sparkles size={20} /></div>
            <div><b className="text-lg">NutriCloud AI</b><p className="text-xs text-slate-400">Cloud wellness + IoT telemetry</p></div>
          </div>
          <nav className="flex gap-2 text-sm">
            {(['Dashboard', 'Profile', 'Architecture'] as Tab[]).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg px-3 py-2 ${tab === item ? 'bg-slate-800' : 'text-slate-400 hover:text-white'}`}>{item}</button>
            ))}
            <button type="button" aria-label="Logout" className="ml-2 rounded-lg border border-slate-700 px-3"><LogOut size={16} /></button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {tab === 'Dashboard' && (
          <>
            <section className="grid gap-4 lg:grid-cols-4">
              <Stat icon={<Activity />} label="Daily calories" value={calories} sub={`of ${target} kcal`} />
              <Stat icon={<ScaleIcon />} label="Live weight" value={latest ? `${latest.weightKg} kg` : '—'} sub="ESP32 smart scale" />
              <Stat icon={<Apple />} label="Food entries" value={logs.length} sub="today" />
              <Stat icon={<ShieldCheck />} label="Data mode" value={demoMode ? "Demo" : "Firebase"} sub={demoMode ? "Local demo" : "Cloud Firestore"} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.4fr_.9fr]">
              <Card title="Smart Scale — Live" icon={<ScaleIcon />}>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <div className="text-4xl font-bold">{latest?.weightKg ?? '—'} <span className="text-lg text-slate-400">kg</span></div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> LIVE • {latest?.deviceId || 'waiting'}</div>
                  </div>
                  <div className="text-right text-xs text-slate-400">Battery {latest?.batteryPct ?? '—'}%</div>
                </div>
                <div className="h-40">
                  <svg viewBox="0 0 700 180" className="h-full w-full" role="img" aria-label="Smart scale weight chart">
                    <polyline fill="none" stroke="currentColor" strokeWidth="3" points={chartPoints} />
                  </svg>
                </div>
                <p className="text-xs text-slate-500">Firebase mode reads live Firestore <code>onSnapshot()</code> data.</p>
              </Card>

              <Card title="AI Wellness Plan" icon={<Sparkles />}>
                <div className="space-y-3">
                  {plan ? (
                    <>
                      <Meal label="Breakfast" food={plan.breakfast} />
                      <Meal label="Lunch" food={plan.lunch} />
                      <Meal label="Snack" food={plan.snack} />
                      <Meal label="Dinner" food={plan.dinner} />
                      <p className="rounded-lg bg-slate-800 p-3 text-xs text-slate-300">{plan.note}</p>
                    </>
                  ) : <p className="text-sm text-slate-400">Generate a personalized educational plan from your profile.</p>}
                  <button type="button" onClick={generate} className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-300">{plan ? 'Regenerate plan' : 'Generate AI plan'}</button>
                </div>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
              <Card title="Food Logger" icon={<Apple />}>
                <input value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} placeholder="Search nutrition records…" className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400" />
                <div className="grid gap-2 sm:grid-cols-2">
                  {filteredFoods.slice(0, 6).map((food) => (
                    <div key={food.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                      <div><b className="text-sm">{food.name}</b><p className="text-xs text-slate-500">{food.serving} • {food.calories} kcal</p></div>
                      <button type="button" onClick={() => logFood(food)} aria-label={`Add ${food.name}`} className="rounded-lg bg-slate-800 p-2 text-emerald-300"><Plus size={17} /></button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Today's intake">
                <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, (calories / target) * 100)}%` }} /></div>
                <div className="flex justify-between text-sm"><span>{calories} kcal</span><span className="text-slate-500">{target} kcal target</span></div>
                <div className="mt-5 space-y-2">{logs.slice(-5).reverse().map((food, index) => <div key={`${food.id}-${index}`} className="flex justify-between rounded-lg bg-slate-900 p-2 text-sm"><span>{food.name}</span><span>{food.calories} kcal</span></div>)}</div>
              </Card>
            </section>
          </>
        )}

        {tab === 'Profile' && (
          <Card title="Wellness Profile">
            <div className="grid gap-4 sm:grid-cols-2">
              {([['name', 'Name'], ['age', 'Age'], ['height', 'Height (cm)'], ['weight', 'Weight (kg)'], ['allergies', 'Preferences / allergies']] as [string, string][]).map(([key, label]) => (
                <label key={key} className="text-sm text-slate-400">
                  {label}
                  <input value={String((profile as unknown as Record<string, unknown>)[key] ?? '')} onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, [key]: ['age', 'height', 'weight'].includes(key) ? Number(e.target.value) : e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white" />
                </label>
              ))}

              <Select label="Activity" value={profile.activity} opts={['Low', 'Moderate', 'High']} onChange={(value) => setProfile({ ...profile, activity: value })} />
              <Select label="Dietary preference" value={profile.preference} opts={['Vegetarian', 'Vegan', 'General/Non-Vegetarian']} onChange={(value) => setProfile({ ...profile, preference: value })} />
              <Select label="Goal" value={profile.goal} opts={['General balanced eating', 'Weight-management demo', 'Fitness-oriented demo']} onChange={(value) => setProfile({ ...profile, goal: value })} />
            </div>
            <button type="button" onClick={save} className="mt-5 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">Save profile</button>
          </Card>
        )}

        {tab === 'Architecture' && (
          <Card title="Recruiter View — System Architecture">
            <div className="grid gap-4 md:grid-cols-5">{['React + Tailwind', 'Firebase Auth', 'Firestore + Storage', 'Cloud Function', 'ESP32 + HX711 / Wokwi'].map((item, index) => <div key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center"><b>{item}</b><p className="mt-2 text-xs text-slate-500">Layer {index + 1}</p></div>)}</div>
            <div className="mt-6 rounded-xl bg-slate-900 p-5 font-mono text-sm text-emerald-300">Wokwi → HTTPS → ingestScaleTelemetry → Firestore → onSnapshot() → Dashboard</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><Badge t="Authentication + authorization" /><Badge t="Cloud database + object storage" /><Badge t="Serverless API" /><Badge t="AI fallback architecture" /><Badge t="Real-time IoT telemetry" /><Badge t="Automated tests + CI" /></div>
          </Card>
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10 text-xs text-slate-600">Portfolio/demo software only. Generated plans are educational wellness examples, not medical advice.</footer>
    </div>
  );
}

function buildScalePoints(rows: Scale[]): string {
  if (rows.length === 0) return '';
  const weights = rows.map((row) => row.weightKg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = Math.max(0.1, max - min);
  return rows.slice().reverse().map((row, index) => {
    const x = index * (650 / Math.max(1, rows.length - 1)) + 20;
    const y = 150 - ((row.weightKg - min) * 120) / range;
    return `${x},${y}`;
  }).join(' ');
}

function Stat({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string | number; sub: string }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="mb-5 flex justify-between text-emerald-300">{icon}<span className="text-xs text-slate-500">LIVE</span></div><div className="text-2xl font-bold">{value}</div><div className="text-sm text-slate-300">{label}</div><div className="text-xs text-slate-500">{sub}</div></div>;
}

function Card({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10"><div className="mb-5 flex items-center gap-2 text-lg font-semibold">{icon && <span className="text-emerald-300">{icon}</span>}{title}</div>{children}</section>;
}

function Meal({ label, food }: { label: string; food: Food }) {
  return <div className="flex justify-between rounded-lg bg-slate-800/70 p-3"><span className="text-sm">{label}: {food.name}</span><span className="text-xs text-slate-400">{food.calories} kcal</span></div>;
}

function Select({ label, value, opts, onChange }: { label: string; value: string; opts: string[]; onChange: (value: string) => void }) {
  return <label className="text-sm text-slate-400">{label}<select value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white">{opts.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function Badge({ t }: { t: string }) {
  return <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3 text-sm text-emerald-200">✓ {t}</div>;
}






