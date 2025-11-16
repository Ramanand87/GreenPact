"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export function Overview({ users }) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (users) {
      // Process the data to group by month and count farmers/contractors
      const processedData = processUserData(users)
      setChartData(processedData)
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

    // Count farmers and contractors per month
    if (users.farmer) {
      users.farmer.forEach(farmer => {
        // Assuming each user has a createdAt timestamp - you'll need to add this to your API
        // For now, we'll use a placeholder since your data doesn't include dates
        const date = new Date() // Placeholder - replace with actual date from user data
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        const monthData = months.find(m => m.yearMonth === yearMonth)
        if (monthData) {
          monthData.farmers++
        }
      })
    }

    if (users.contractor) {
      users.contractor.forEach(contractor => {
        const date = new Date() // Placeholder - replace with actual date from user data
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        const monthData = months.find(m => m.yearMonth === yearMonth)
        if (monthData) {
          monthData.contractors++
        }
      })
    }

    return months.map(month => ({
      name: month.name,
      farmers: month.farmers,
      contractors: month.contractors
    }))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>Number of farmers and contractors registered over time</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip />
              <Bar 
                dataKey="farmers" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]} 
                name="Farmers"
              />
              <Bar 
                dataKey="contractors" 
                fill="#22c55e" 
                radius={[4, 4, 0, 0]} 
                name="Contractors"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}