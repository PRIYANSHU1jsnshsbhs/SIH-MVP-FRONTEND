import React from 'react'
import StatGrid from '../ui/StatGrid'


export default function Airport() {
const stats = [
{ label: 'Active Devices', value: '42' },
{ label: 'Alerts (24h)', value: '3' },
{ label: 'Avg Response (min)', value: '9' },
]


return (
<div className="space-y-6">
<PageHeader title="Airport Dashboard" subtitle="Terminal & device overview" />


<StatGrid stats={stats} />


<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<Card title="Live Map">
<div className="h-56 flex items-center justify-center text-gray-400">[Map placeholder]</div>
</Card>


<Card title="Recent Alerts">
<ul className="space-y-2 text-sm">
<li>2025-09-26 14:12 — Suspicious luggage — Patrol dispatched</li>
<li>2025-09-26 10:03 — IoT band tamper — Hotel guest</li>
</ul>
</Card>


<Card title="Risk Matrix">
<div className="h-56 flex items-center justify-center text-gray-400">[Heatmap placeholder]</div>
</Card>
</div>
</div>
)
}


function PageHeader({ title, subtitle }) {
return (
<div>
<h2 className="text-xl font-semibold">{title}</h2>
<div className="text-sm text-gray-500">{subtitle}</div>
</div>
)
}


function Card({ title, children }) {
return (
<div className="p-4 bg-white rounded-xl shadow-sm">
<div className="text-sm font-medium mb-3">{title}</div>
{children}
</div>
)
}