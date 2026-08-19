'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TagStat } from '@/lib/types';

export default function TagBarChart({ data }: { data: TagStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(320, data.length * 32)}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid horizontal={false} stroke="#232327" />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fill: '#8b8b93', fontSize: 12 }}
          axisLine={{ stroke: '#232327' }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={160}
          tick={{ fill: '#e4e4e7', fontSize: 12 }}
          axisLine={{ stroke: '#232327' }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: '#1a1a1e' }}
          contentStyle={{
            background: '#131316',
            border: '1px solid #232327',
            borderRadius: 8,
            fontSize: 12,
            color: '#e4e4e7',
          }}
        />
        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
