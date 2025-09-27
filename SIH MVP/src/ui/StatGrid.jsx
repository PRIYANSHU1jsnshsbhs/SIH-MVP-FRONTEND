import React from 'react'


export default function StatGrid({ stats = [] }) {
return (
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
{stats.map((s, i) => (
<div key={i} className="p-4 bg-white rounded-lg shadow-sm flex flex-col">
<div className="text-xs text-gray-500">{s.label}</div>
<div className="text-2xl font-bold mt-2">{s.value}</div>
</div>
))}
</div>
)
}