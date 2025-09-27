import React from 'react'
import StatGrid from '../ui/StatGrid'


export default function Tourism() {
const stats = [
{ label: 'Active Tours', value: '24' },
{ label: 'Avg Visitor Rating', value: '4.3/5' },
{ label: 'Open Requests', value: '12' },
]


return (
<div className="space-y-6">
<PageHeader title="Tourism Department" subtitle="Visitor services & hotspot monitoring" />
<StatGrid stats={stats} />


<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card title="Hotspots & Footfall">
<div className="h-48 flex items-center justify-center text-gray-400">[Footfall chart]</div>
</Card>


<Card title="Pending Permits">
<ul className="text-sm space-y-2">
<li>Guided Tour Permit — 3 pending</li>
<li>Public Event — 1 pending</li>
<li>Drone Request — 0 pending</li>
</ul>
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