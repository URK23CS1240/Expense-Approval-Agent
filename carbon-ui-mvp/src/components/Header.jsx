import React from 'react'

export default function Header({ onNav, current }){
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Carbon — Effortless Impact</h1>
        <p className="text-sm text-gray-600">A friendly tracker for student travel & lifestyle emissions</p>
      </div>

      <nav className="flex items-center gap-3">
        <NavItem label="Dashboard" active={current === 'dashboard'} onClick={() => onNav('dashboard')} />
        <NavItem label="Progress" active={current === 'progress'} onClick={() => onNav('progress')} />
        <NavItem label="Team" active={current === 'team'} onClick={() => onNav('team')} />
      </nav>
    </div>
  )
}

function NavItem({ label, active, onClick }){
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-md text-sm ${active ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
      {label}
    </button>
  )
}
