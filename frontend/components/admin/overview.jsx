"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Users, TrendingUp, UserCheck, UserPlus } from "lucide-react"

export function Overview({ users }) {
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    monthlyGrowth: 0,
    activeFarmers: 0,
    activeContractors: 0
  })

  useEffect(() => {
    if (users) {
      // Process the data to group by month and count farmers/contractors
      const processedData = processUserData(users)
      setChartData(processedData)
      
      // Calculate stats
      const totalFarmers = users?.farmer?.length || 0
      const totalContractors = users?.contractor?.length || 0
      const currentMonth = processedData[processedData.length - 1] || { farmers: 0, contractors: 0 }
      const previousMonth = processedData[processedData.length - 2] || { farmers: 0, contractors: 0 }
      
      const currentTotal = currentMonth.farmers + currentMonth.contractors
      const previousTotal = previousMonth.farmers + previousMonth.contractors
      const growth = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1) : 0
      
      setStats({
        totalUsers: totalFarmers + totalContractors,
        monthlyGrowth: growth,
        activeFarmers: totalFarmers,
        activeContractors: totalContractors
      })
    }
  }, [users])

  // Function to process the raw user data into chart format
  const processUserData = (users) => {
    // Get current year and month for reference
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    
    // Create an array for the last 6 months
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentDate.getMonth() - i, 1)
      months.push({
        name: date.toLocaleString('default', { month: 'short' }),
        yearMonth: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        farmers: 0,
        contractors: 0
      })
    }

    // Count farmers by month
    if (users.farmer) {
      users.farmer.forEach(farmer => {
        const date = new Date(farmer.user.date_joined)
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        const monthData = months.find(m => m.yearMonth === yearMonth)
        if (monthData) {
          monthData.farmers++
        }
      })
    }

    // Count contractors by month
    if (users.contractor) {
      users.contractor.forEach(contractor => {
        const date = new Date(contractor.user.date_joined)
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        const monthData = months.find(m => m.yearMonth === yearMonth)
        if (monthData) {
          monthData.contractors++
        }
      })
    }

    return months.map(month => ({
      name: month.name,
      Farmers: month.farmers,
      Contractors: month.contractors,
      Total: month.farmers + month.contractors
    }))
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Chart */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">User Registrations</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Number of farmers and contractors registered over time
              </CardDescription>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-600">Last 6 Months</p>
              <p className="text-lg font-bold text-green-600">
                {chartData.reduce((acc, curr) => acc + curr.Total, 0)} Total
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#d1d5db' }}
                label={{ value: 'Number of Users', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                allowDecimals={false}
                tickCount={6}
                domain={[0, (dataMax) => Math.ceil(dataMax / 3) * 3]}
                ticks={[0, 3, 6, 9, 12, 15]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
              />
              <Bar 
                dataKey="Farmers" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]} 
                name="Farmers"
                maxBarSize={60}
              />
              <Bar 
                dataKey="Contractors" 
                fill="#14b8a6" 
                radius={[8, 8, 0, 0]} 
                name="Contractors"
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}