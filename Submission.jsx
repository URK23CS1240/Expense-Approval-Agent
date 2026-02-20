// src/components/Submission.jsx
import React from 'react'
import { useState } from 'react'

export default function Submission({ onCalculateSubmit, onBack }){
  // Streamlit form state (all fields are required/used in calculation)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [distance, setDistance] = useState(10) // Default to 10km
  const [diet, setDiet] = useState('Meat-heavy')
  const [electricity, setElectricity] = useState(100) // Default kWh
  const [water, setWater] = useState(1000) // Default litres
  const [classes, setClasses] = useState(22) // Default days
  const [activities, setActivities] = useState([])
  const [error, setError] = useState(null)

  const activityOptions = ["Planted Trees", "Recycling", "Carpool", "Cycling", "Green Club"]
  
  const factors = {
    car: 0.192,
    electricity: 0.82,
    water: 0.0003,
    'Meat-heavy': 7.0,
    'Vegetarian': 3.8,
    'Vegan': 2.9
  }
  
  const handleSubmission = () => {
    setError(null)
    // Input validation from Streamlit app
    if (!name || phone.length !== 10 || distance <= 0 || electricity <= 0 || water <= 0 || classes <= 0) {
      setError("Please fill all required fields correctly (Distance, Electricity, Water must be > 0, Phone must be 10 digits).")
      return
    }

    // Calculation logic translated from Python
    const transport = distance * 2 * classes * factors.car
    const power = electricity * factors.electricity
    const aqua = water * factors.water
    const diet_co2 = factors[diet] * 30 // Assuming 30 days in a month for calculation
    const eco_bonus = activities.length > 0 ? 0.9 : 1.0
    const total = parseFloat(((transport + power + aqua + diet_co2) * eco_bonus).toFixed(2))

    // Pass the results and data back to the App component
    onCalculateSubmit({
      name,
      location,
      total,
      breakdown: { transport, power, aqua, diet_co2 },
      activities: activities,
    })
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-[#1a775f] mb-4">Input Your Monthly Data 📊</h2>

      {error && <div className="p-3 mb-4 rounded-lg bg-red-100 text-red-700 text-sm font-medium">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div>
          <h3 className="text-md font-medium mb-3 text-gray-700">Personal & Commute</h3>
          <InputField label="Name *" value={name} onChange={setName} />
          <InputField label="Phone (10-digit)*" value={phone} onChange={setPhone} type="tel" maxLength={10} />
          <InputField label="Hostel / Region *" value={location} onChange={setLocation} />
          <InputField label="Daily Commute Distance (km) *" value={distance} onChange={setDistance} type="number" min="0.5" step="0.5" />
          
          <label className="text-xs text-gray-600 mt-4 block">Diet Type *</label>
          <select value={diet} onChange={(e) => setDiet(e.target.value)} className="w-full mt-2 p-3 rounded-lg border border-gray-200">
              <option value="Meat-heavy">Meat-heavy</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
          </select>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-md font-medium mb-3 text-gray-700">Monthly Usage & Activities</h3>
          <InputField label="Electricity Use (kWh/month) *" value={electricity} onChange={setElectricity} type="number" min="1" />
          <InputField label="Water Use (litres/month) *" value={water} onChange={setWater} type="number" min="10" step="10" />
          <InputField label="Number of Campus Days Last Month *" value={classes} onChange={setClasses} type="number" min="0" max="31" step="1" />
          
          <label className="text-xs text-gray-600 mt-4 block">Eco Activities (bonus points):</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {activityOptions.map(activity => (
              <ActivityButton 
                key={activity}
                label={activity} 
                active={activities.includes(activity)}
                onClick={() => setActivities(prev => 
                  prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleSubmission} className="py-3 px-8 rounded-lg bg-[#17a672] text-white font-medium hover:bg-[#138653] transition">
          Calculate and Submit
        </button>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, type = "text", ...props }){
  return (
    <div className="mb-3">
      <label className="text-xs text-gray-600">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full mt-1 p-3 rounded-lg border border-gray-200 focus:ring-[#17a672] focus:border-[#17a672]" 
        {...props}
      />
    </div>
  )
}

function ActivityButton({ label, active, onClick }){
  return (
    <button 
      onClick={onClick} 
      type="button"
      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
        active ? 'bg-[#17a672] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}