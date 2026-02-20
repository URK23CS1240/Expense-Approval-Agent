import React from 'react'

export default function Logging({ category, setCategory, mode, setMode, distance, setDistance, onLog }){
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-3">Log Activity</h2>
      <p className="text-sm text-gray-500 mb-4">Choose category — minimize typing</p>

      <div className="flex gap-3 mb-4">
        <CategoryBtn active={category === 'Transport'} onClick={() => setCategory('Transport')} label="Travel" />
        <CategoryBtn active={category === 'Diet'} onClick={() => setCategory('Diet')} label="Diet" />
        <CategoryBtn active={category === 'Energy'} onClick={() => setCategory('Energy')} label="Energy" />
      </div>

      {category === 'Transport' && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <ModeBtn active={mode === 'Car'} onClick={() => setMode('Car')} label="Car" />
            <ModeBtn active={mode === 'Bus'} onClick={() => setMode('Bus')} label="Bus" />
            <ModeBtn active={mode === 'Bike'} onClick={() => setMode('Bike')} label="Bike" />
            <ModeBtn active={mode === 'Walk'} onClick={() => setMode('Walk')} label="Walk" />
          </div>

          <label className="text-xs text-gray-600">Distance (km)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full mt-2 p-3 rounded-lg border border-gray-200" placeholder="e.g., 10" />
        </div>
      )}

      <div className="mt-6">
        <button onClick={onLog} className="w-full py-3 rounded-lg bg-[#2E8B57] text-white font-medium">Log</button>
      </div>
    </div>
  )
}

function CategoryBtn({ active, onClick, label }){
  return (
    <button onClick={onClick} className={`flex-1 p-3 rounded-lg ${active ? 'bg-white shadow' : 'bg-[#F9FAFB]'}`}>
      <div className="flex items-center gap-3">
        <div className="text-[#2E8B57]">{label}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
    </button>
  )
}

function ModeBtn({ active, onClick, label }){
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm ${active ? 'bg-[#2E8B57] text-white' : 'bg-[#F4F6F6] text-gray-700'}`}>
      {label}
    </button>
  )
}
