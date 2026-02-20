import React, { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Logging from './components/Logging'
import InstantResults from './components/InstantResults'
import Progress from './components/Progress'

export default function App(){
  const [screen, setScreen] = useState('dashboard')
  const [logPreview, setLogPreview] = useState(null)

  const todayTotal = 7.5
  const donutData = [
    { name: 'Transport', value: 60 },
    { name: 'Diet', value: 25 },
    { name: 'Energy', value: 15 },
  ]
  const donutColors = ['#2E8B57', '#007AFF', '#E6E9EB']

  const weeklyData = [
    { day: 'M', kg: 6 },
    { day: 'T', kg: 8 },
    { day: 'W', kg: 7.5 },
    { day: 'T', kg: 9 },
    { day: 'F', kg: 5.5 },
    { day: 'S', kg: 4 },
    { day: 'S', kg: 6.2 },
  ]

  const weeklyGoal = 6.5

  // logging state passed to Logging component
  const [category, setCategory] = useState('Transport')
  const [mode, setMode] = useState('Car')
  const [distance, setDistance] = useState(10)

  function handleQuickLog(){
    const factors = { Car: 0.21, Bus: 0.08, Bike: 0.0, Walk: 0.0 }
    const kg = parseFloat((factors[mode] * distance).toFixed(2))
    setLogPreview({ mode, distance, kg })
    setScreen('instant')
  }

  return (
    <div className="min-h-screen bg-[#F4F6F6] text-[#333333] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Header onNav={setScreen} current={screen} />

        {screen === 'dashboard' && (
          <Dashboard todayTotal={todayTotal} donutData={donutData} donutColors={donutColors} onAdd={() => setScreen('log')} />
        )}

        {screen === 'log' && (
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

        {screen === 'instant' && (
          <InstantResults preview={logPreview} onSave={() => setScreen('progress')} />
        )}

        {screen === 'progress' && (
          <Progress weeklyData={weeklyData} weeklyGoal={weeklyGoal} todayTotal={todayTotal} />
        )}

        <footer className="fixed left-0 right-0 bottom-6 flex justify-center pointer-events-none">
          <button onClick={() => setScreen('log')} className="pointer-events-auto flex items-center gap-3 bg-[#2E8B57] text-white px-6 py-3 rounded-full shadow-2xl transform hover:scale-105 transition" aria-label="Log Activity">
            <span className="text-xl">+</span>
            <span className="font-medium">Log Activity</span>
          </button>
        </footer>
      </div>
    </div>
  )
}
