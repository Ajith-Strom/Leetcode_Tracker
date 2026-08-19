'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ConfidenceStat } from '@/lib/types';

const COLORS: Record<number, string> = {
  1: '#ef4444', // Struggled -> hard/red
  2: '#eab308', // Satisfactory -> medium/yellow
  3: '#22c55e', // Mastered -> easy/green
};

export default function ConfidenceDonutChart({ data }: { data: ConfidenceStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={data.length > 1 ? 2 : 0}
        >
          {data.map((d) => (
            // stroke matches fill (rather than "none") to mask the hairline seam
            // Recharts leaves where a full-circle arc path starts/ends
            <Cell
              key={d.confidence}
              fill={COLORS[d.confidence]}
              stroke={COLORS[d.confidence]}
              strokeWidth={3}
              strokeLinejoin="round"
            />
          ))}
        </Pie>
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
        <Legend
          verticalAlign="bottom"
          height={24}
          wrapperStyle={{ fontSize: 12, color: '#8b8b93' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
