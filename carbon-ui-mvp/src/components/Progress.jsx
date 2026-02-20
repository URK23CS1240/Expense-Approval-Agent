import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts'

export default function Progress({ weeklyData, weeklyGoal, todayTotal }){
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Carbon Footprint This Week</h2>
        <div className="text-sm text-gray-500">Goal: <span className="font-medium">{weeklyGoal} kg/day</span></div>
      </div>

      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={weeklyGoal} stroke="#999" strokeDasharray="3 3" />
            <Bar dataKey="kg" fill="#2E8B57" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatBox label="Weekly Total" value={`${weeklyData.reduce((s,d)=>s+d.kg,0).toFixed(1)} kg`} />
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
  )
}

function StatBox({ label, value }){
  return (
    <div className="p-4 rounded-lg bg-[#F4F6F6] text-center">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  )
}
