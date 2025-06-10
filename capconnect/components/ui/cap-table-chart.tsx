'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ShareClass {
  id: string
  name: string
  class_type: string
  outstanding_shares: number
}

interface CapTableChartProps {
  data: ShareClass[]
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280']

export function CapTableChart({ data }: CapTableChartProps) {
  const chartData = data
    .filter(sc => Number(sc.outstanding_shares) > 0)
    .map((shareClass, index) => ({
      name: shareClass.name,
      value: Number(shareClass.outstanding_shares),
      color: COLORS[index % COLORS.length],
      type: shareClass.class_type
    }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data to display
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-sm text-gray-600">Type: {data.payload.type}</p>
          <p className="text-sm text-gray-600">
            Shares: {data.value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}