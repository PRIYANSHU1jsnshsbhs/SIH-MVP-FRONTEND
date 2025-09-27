import React from 'react'
import StatGrid from '../ui/StatGrid'


export default function Embassy() {
const stats = [
{ label: 'Consular Incidents', value: '2' },
{ label: 'Assistance Requests', value: '5' },
{ label: 'Open Cases', value: '1' },
]


return (
<div className="space-y-6">
<PageHeader title="Embassy / Consular" subtitle="Citizen assistance & case tracking" />
<StatGrid stats={stats} />


<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card title="Active Cases">
<ul className="text-sm space-y-2">
<li>Case #A123 — Passport issue — In progress</li>
<li>Case #B786 — Medical assistance — Resolved</li>
</ul>
</Card>


<Card title="Requests By Country">
<div className="h-48 flex items-center justify-center text-gray-400">[Bar chart placeholder]</div>
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