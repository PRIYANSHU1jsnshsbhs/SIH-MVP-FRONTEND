import React from 'react'


export default function QuickList({ items = [] }) {
return (
<ul className="space-y-3">
{items.map((it, idx) => (
<li key={idx} className="p-3 bg-slate-50 rounded-md border">
<div className="font-medium">{it.title}</div>
<div className="text-xs text-gray-500">{it.desc}</div>
</li>
))}
</ul>
)
}