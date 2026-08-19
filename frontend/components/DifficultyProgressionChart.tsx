'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DifficultyProgressionPoint } from '@/lib/types';

// Recharts' default legend order doesn't reliably follow JSX child order,
// so it's rendered explicitly in Easy/Medium/Hard order instead.
const LEGEND_ITEMS = [
  { label: 'Easy', color: '#22c55e' },
  { label: 'Medium', color: '#eab308' },
  { label: 'Hard', color: '#ef4444' },
];

function DifficultyLegend() {
  return (
    <ul className="flex justify-center gap-4 pt-2 text-xs" style={{ color: '#8b8b93' }}>
      {LEGEND_ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export default function DifficultyProgressionChart({
  data,
}: {
  data: DifficultyProgressionPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#8b8b93', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#8b8b93', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(19,19,22,0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            fontSize: 12,
            color: '#e4e4e7',
          }}
        />
        <Legend content={<DifficultyLegend />} />
        <Line type="monotone" dataKey="Easy" stroke="#22c55e" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Medium" stroke="#eab308" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Hard" stroke="#ef4444" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
