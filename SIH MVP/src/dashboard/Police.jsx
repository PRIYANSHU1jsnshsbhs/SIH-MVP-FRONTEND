import React from 'react'
import StatGrid from '../ui/StatGrid'


export default function Police() {
const stats = [
{ label: 'Patrol Units', value: '18' },
{ label: 'Open FIRs', value: '7' },
{ label: 'Avg Response (min)', value: '12' },
]


return (
<div className="space-y-6">
<PageHeader title="Police Dashboard" subtitle="Operations & incident management" />
<StatGrid stats={stats} />


<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<Card title="Active Incidents">
<ul className="text-sm space-y-2">
<li>Incident #234 — Under investigation</li>
<li>Incident #237 — Closed</li>
</ul>
</Card>


<Card title="Patrol Status">
<div className="text-sm">On duty: 14 • Standby: 4</div>
</Card>


<Card title="Device Health">
<div className="text-sm">Connected: 98% • Offline: 2%</div>
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