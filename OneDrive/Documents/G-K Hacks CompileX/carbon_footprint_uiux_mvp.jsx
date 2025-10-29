import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { PlusCircle, Truck, Coffee, Zap, Bus, Users } from "lucide-react";

// Single-file React component (Tailwind CSS required in the project)
// Usage: paste into a React + Tailwind project. Install dependencies:
// npm i recharts lucide-react

export default function CarbonFootprintApp() {
  const [screen, setScreen] = useState("dashboard");
  const [logPreview, setLogPreview] = useState(null);

  // Mock data — replace with real backend data later
  const todayTotal = 7.5; // kg
  const donutData = [
    { name: "Transport", value: 60 },
    { name: "Diet", value: 25 },
    { name: "Energy", value: 15 },
  ];
  const donutColors = ["#2E8B57", "#007AFF", "#E6E9EB"];

  const weeklyData = [
    { day: "M", kg: 6 },
    { day: "T", kg: 8 },
    { day: "W", kg: 7.5 },
    { day: "T", kg: 9 },
    { day: "F", kg: 5.5 },
    { day: "S", kg: 4 },
    { day: "S", kg: 6.2 },
  ];

  const weeklyGoal = 6.5;

  // Logging quick input state
  const [category, setCategory] = useState("Transport");
  const [mode, setMode] = useState("Car");
  const [distance, setDistance] = useState(10);

  function handleQuickLog() {
    // Simple preview calculation (mocked factors)
    const factors = { Car: 0.21, Bus: 0.08, Bike: 0.0, Walk: 0.0 };
    const kg = parseFloat((factors[mode] * distance).toFixed(2));
    setLogPreview({ mode, distance, kg });
    setScreen("instant");
  }

  return (
    <div className="min-h-screen bg-[#F4F6F6] text-[#333333] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Header onNav={setScreen} current={screen} />

        {screen === "dashboard" && (
          <Dashboard
            todayTotal={todayTotal}
            donutData={donutData}
            donutColors={donutColors}
            onAdd={() => setScreen("log")}
          />
        )}

        {screen === "log" && (
          <Logging
            category={category}
            setCategory={setCategory}
            mode={mode}
            setMode={setMode}
            distance={distance}
            setDistance={setDistance}
            onLog={handleQuickLog}
          />
        )}

        {screen === "instant" && (
          <InstantResults preview={logPreview} onSave={() => setScreen("progress")} />
        )}

        {screen === "progress" && (
          <Progress
            weeklyData={weeklyData}
            weeklyGoal={weeklyGoal}
            todayTotal={todayTotal}
          />
        )}

        {/* Floating primary CTA */}
        <footer className="fixed left-0 right-0 bottom-6 flex justify-center pointer-events-none">
          <button
            onClick={() => setScreen("log")}
            className="pointer-events-auto flex items-center gap-3 bg-[#2E8B57] text-white px-6 py-3 rounded-full shadow-2xl transform hover:scale-105 transition"
            aria-label="Log Activity"
          >
            <PlusCircle size={20} />
            <span className="font-medium">Log Activity</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

function Header({ onNav, current }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Carbon — Effortless Impact</h1>
        <p className="text-sm text-gray-600">A friendly tracker for student travel & lifestyle emissions</p>
      </div>

      <nav className="flex items-center gap-3">
        <NavItem label="Dashboard" active={current === "dashboard"} onClick={() => onNav("dashboard")} />
        <NavItem label="Progress" active={current === "progress"} onClick={() => onNav("progress")} />
        <NavItem label="Team" active={current === "team"} onClick={() => onNav("team")}
        />
      </nav>
    </div>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm ${active ? "bg-white shadow" : "text-gray-600 hover:text-gray-900"}`}
    >
      {label}
    </button>
  );
}

function Dashboard({ todayTotal, donutData, donutColors, onAdd }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
        {/* Hero statistic */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Today's CO₂ Footprint</p>
            <h2 className="text-4xl font-bold mt-2">{todayTotal} kg</h2>
            <p className="text-sm mt-2 text-gray-600">Scannable at a glance — good job!</p>
          </div>

          {/* Donut chart area */}
          <div className="w-44 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={48}
                  outerRadius={70}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={donutColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="relative -mt-36 text-center">
              <div className="mx-auto w-24 h-24 rounded-full flex flex-col items-center justify-center bg-white shadow">
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-lg font-semibold">{todayTotal} kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Positive reinforcement */}
        <div className="mt-6 p-4 rounded-lg bg-[#EAF7EE] border border-[#D6EFE0]">
          <p className="text-sm">You've saved <span className="font-semibold">1.8 kg</span> of CO₂ this week compared to last week!</p>
        </div>

        {/* Breakdown labels */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {donutData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-3 bg-[#F9FAFB] p-3 rounded-lg">
              <div className="w-3 h-3 rounded-full" style={{ background: donutColors[i] }} />
              <div>
                <div className="text-sm font-medium">{d.name}</div>
                <div className="text-xs text-gray-600">{d.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
        <button onClick={onAdd} className="w-full text-left p-3 rounded-lg bg-[#007AFF] text-white flex items-center gap-3">
          <Truck size={18} />
          <div>
            <div className="text-sm font-semibold">Log travel</div>
            <div className="text-xs">Add a trip in seconds</div>
          </div>
        </button>

        <div className="mt-4">
          <h4 className="text-xs text-gray-500">Friends</h4>
          <div className="mt-2 flex items-center gap-2">
            <div className="bg-[#2E8B57] text-white rounded-full w-8 h-8 flex items-center justify-center">A</div>
            <div className="bg-[#007AFF] text-white rounded-full w-8 h-8 flex items-center justify-center">B</div>
            <div className="bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center">C</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Logging({ category, setCategory, mode, setMode, distance, setDistance, onLog }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-3">Log Activity</h2>
      <p className="text-sm text-gray-500 mb-4">Choose category — minimize typing</p>

      <div className="flex gap-3 mb-4">
        <CategoryBtn active={category === "Transport"} onClick={() => setCategory("Transport")} icon={<Truck />} label="Travel" />
        <CategoryBtn active={category === "Diet"} onClick={() => setCategory("Diet")} icon={<Coffee />} label="Diet" />
        <CategoryBtn active={category === "Energy"} onClick={() => setCategory("Energy")} icon={<Zap />} label="Energy" />
      </div>

      {category === "Transport" && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <ModeBtn active={mode === "Car"} onClick={() => setMode("Car")} label="Car" />
            <ModeBtn active={mode === "Bus"} onClick={() => setMode("Bus")} label="Bus" />
            <ModeBtn active={mode === "Bike"} onClick={() => setMode("Bike")} label="Bike" />
            <ModeBtn active={mode === "Walk"} onClick={() => setMode("Walk")} label="Walk" />
          </div>

          <label className="text-xs text-gray-600">Distance (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full mt-2 p-3 rounded-lg border border-gray-200"
            placeholder="e.g., 10"
          />
        </div>
      )}

      <div className="mt-6">
        <button onClick={onLog} className="w-full py-3 rounded-lg bg-[#2E8B57] text-white font-medium">Log</button>
      </div>
    </div>
  );
}

function CategoryBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex-1 p-3 rounded-lg ${active ? "bg-white shadow" : "bg-[#F9FAFB]"}`}>
      <div className="flex items-center gap-3">
        <div className="text-[#2E8B57]">{icon}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
    </button>
  );
}

function ModeBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm ${active ? "bg-[#2E8B57] text-white" : "bg-[#F4F6F6] text-gray-700"}`}>
      {label}
    </button>
  );
}

function InstantResults({ preview, onSave }) {
  if (!preview) return null;
  // Compare bus alt (mocked)
  const busKg = parseFloat((0.08 * preview.distance).toFixed(2));
  const savingPercent = Math.round(((preview.kg - busKg) / preview.kg) * 100);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-2">Instant Results</h2>
      <p className="text-sm text-gray-600 mb-4">Immediate impact and a kinder alternative</p>

      <div className="p-4 rounded-lg bg-[#FFFDF6] border border-[#FFF4D6]">
        <div className="text-sm text-gray-600">Result</div>
        <div className="text-2xl font-bold mt-1">Your {preview.distance}km {preview.mode.toLowerCase()} trip generated <span className="text-[#2E8B57]">{preview.kg} kg</span> of CO₂</div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-[#EAF7EE] border border-[#D6EFE0]">
        <div className="font-medium">💡 Greener Alternative</div>
        <div className="text-sm">Taking the bus would have generated only <span className="font-semibold">{busKg} kg</span> of CO₂. That's a <span className="font-semibold">{savingPercent}%</span> saving!</div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={onSave} className="flex-1 py-3 rounded-lg bg-[#007AFF] text-white">Add Savings to My Goals</button>
        <button onClick={() => alert('Saved to history (mock)')} className="flex-1 py-3 rounded-lg bg-[#F4F6F6]">Save Trip</button>
      </div>
    </div>
  );
}

function Progress({ weeklyData, weeklyGoal, todayTotal }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Carbon Footprint This Week</h2>
        <div className="text-sm text-gray-500">Goal: <span className="font-medium">{weeklyGoal} kg/day</span></div>
      </div>

      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={weeklyGoal} stroke="#999" strokeDasharray="3 3" />
            <Bar dataKey="kg" fill="#2E8B57">
              {/* highlight today's bar (last element for demo) */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatBox label="Weekly Total" value={`${weeklyData.reduce((s, d) => s + d.kg, 0).toFixed(1)} kg`} />
        <StatBox label="Best Day" value={`Sat — ${weeklyData[5].kg} kg`} />
        <StatBox label="Today's" value={`${todayTotal} kg`} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Leaderboard</h3>
        <div className="bg-[#F9FAFB] p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm py-2">
            <div>#1 — Alex</div>
            <div>4.2 kg</div>
          </div>
          <div className="flex items-center justify-between text-sm py-2">
            <div>#2 — You</div>
            <div>6.2 kg</div>
          </div>
          <div className="flex items-center justify-between text-sm py-2">
            <div>#3 — Priya</div>
            <div>6.5 kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="p-4 rounded-lg bg-[#F4F6F6] text-center">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
