import React from 'react'
import StatGrid from '../ui/StatGrid'
import QuickList from '../ui/QuickList'


export default function Hotel() {
const stats = [
{ label: 'Registered Hotels', value: '127' },
{ label: 'Bands Issued', value: '540' },
{ label: 'Open Alerts', value: '6' },
]


const issues = [
{ title: 'Missing KYC', desc: 'Hotel Riviera — 3 guests' },
{ title: 'Device Offline', desc: 'Hotel Metro — IoT band' },
{ title: 'Firmware Pending', desc: 'Multiple rooms' },
]


return (
<div className="space-y-6">
<PageHeader title="Hotel Dashboard" subtitle="Hotel compliance & guest safety" />
<StatGrid stats={stats} />


<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2">
<Card title="Top Issues">
<QuickList items={issues} />
</Card>
</div>


<Card title="Compliance Score">
<div className="text-3xl font-bold">87%</div>
<div className="text-xs text-gray-500 mt-2">Average across registered hotels</div>
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