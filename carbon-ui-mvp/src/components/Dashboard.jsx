import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function Dashboard({ todayTotal, donutData, donutColors, onAdd }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Today's CO₂ Footprint</p>
            <h2 className="text-4xl font-bold mt-2">{todayTotal} kg</h2>
            <p className="text-sm mt-2 text-gray-600">Scannable at a glance — good job!</p>
          </div>

          <div className="w-44 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} innerRadius={48} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270} paddingAngle={2}>
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

        <div className="mt-6 p-4 rounded-lg bg-[#EAF7EE] border border-[#D6EFE0]">
          <p className="text-sm">You've saved <span className="font-semibold">1.8 kg</span> of CO₂ this week compared to last week!</p>
        </div>

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
  )
}
