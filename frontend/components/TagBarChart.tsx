'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TagStat } from '@/lib/types';

export default function TagBarChart({ data }: { data: TagStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(300, data.length * 30)}>
      <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={150} />
        <Tooltip />
        <Bar dataKey="count" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}
