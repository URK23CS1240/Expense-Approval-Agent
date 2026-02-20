import React from 'react'

export default function InstantResults({ preview, onSave }){
  if(!preview) return null
  const busKg = parseFloat((0.08 * preview.distance).toFixed(2))
  const savingPercent = preview.kg === 0 ? 0 : Math.round(((preview.kg - busKg) / preview.kg) * 100)

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
  )
}
