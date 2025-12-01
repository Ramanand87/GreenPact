'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentRegistrations } from "@/components/admin/recent-registrations"
import { PendingConcerns } from "@/components/admin/pending-concerns"
import { useGetAllUsersQuery } from "@/redux/Service/auth"
import { useEffect, useState } from "react"
import { useGetTotalContractsQuery } from "@/redux/Service/contract"
import { useGetComplaintsQuery } from "@/redux/Service/complaintApi"

export default function DashboardPage() {
  const {data: users} = useGetAllUsersQuery();
  const {data: contracts} = useGetTotalContractsQuery();
  const {data: complaints = []} = useGetComplaintsQuery();
  
  // State for metrics
  const [metrics, setMetrics] = useState({
    farmerCount: 0,
    farmerPercentageChange: 0,
    contractorCount: 0,
    contractorPercentageChange: 0,
    todayConcerns: 0,
    pendingConcerns: 0
  })

  // Calculate concerns metrics when complaints data changes
  useEffect(() => {
    if (complaints && complaints.length > 0) {
      // Calculate today's concerns
      const today = new Date().toISOString().split('T')[0]
      const todaysConcerns = complaints.filter(complaint => 
        complaint.created_at?.split('T')[0] === today
      ).length
      
      // Calculate pending concerns
      const pendingConcerns = complaints.filter(complaint => 
        complaint.status?.toLowerCase() === "pending"
      ).length

      setMetrics(prev => ({
        ...prev,
        todayConcerns: todaysConcerns,
        pendingConcerns: pendingConcerns
      }))
    }
  }, [complaints])

  useEffect(() => {
    if (users) {
      const farmerCount = users?.farmer?.length || 0;
      const contractorCount = users?.contractor?.length || 0;
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Get start of current month
      const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
      
      // Get start of last month
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const startOfLastMonth = new Date(lastMonthYear, lastMonth, 1);
      const endOfLastMonth = new Date(currentYear, currentMonth, 0);
      
      // Filter farmers joined this month
      const currentMonthFarmers = users?.farmer?.filter(farmer => {
        const joinedDate = new Date(farmer.user.date_joined);
        return joinedDate >= startOfCurrentMonth && joinedDate <= now;
      }) || [];
      
      // Filter farmers joined last month
      const lastMonthFarmers = users?.farmer?.filter(farmer => {
        const joinedDate = new Date(farmer.user.date_joined);
        return joinedDate >= startOfLastMonth && joinedDate <= endOfLastMonth;
      }) || [];
      
      // Filter contractors joined this month
      const currentMonthContractors = users?.contractor?.filter(contractor => {
        const joinedDate = new Date(contractor.user.date_joined);
        return joinedDate >= startOfCurrentMonth && joinedDate <= now;
      }) || [];
      
      // Filter contractors joined last month
      const lastMonthContractors = users?.contractor?.filter(contractor => {
        const joinedDate = new Date(contractor.user.date_joined);
        return joinedDate >= startOfLastMonth && joinedDate <= endOfLastMonth;
      }) || [];
      
      // Calculate percentage changes with better handling for new systems
      const calculateGrowth = (current, previous) => {
        if (previous === 0) {
          // If no users last month, but we have users this month, show "New" indicator
          return current > 0 ? Infinity : 0;
        }
        return ((current - previous) / previous) * 100;
      };
      
      const farmerPercentageChange = calculateGrowth(currentMonthFarmers.length, lastMonthFarmers.length);
      const contractorPercentageChange = calculateGrowth(currentMonthContractors.length, lastMonthContractors.length);
  
      setMetrics(prev => ({
        ...prev,
        farmerCount,
        farmerPercentageChange: Math.round(farmerPercentageChange),
        contractorCount,
        contractorPercentageChange: Math.round(contractorPercentageChange)
      }));
    }
  }, [users]);
  

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-green-500 min-w-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.farmerCount + metrics.contractorCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 min-w-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {contracts?.data?.length || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 min-w-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Farmers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.farmerCount}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500 min-w-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contractors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.contractorCount}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full space-y-4">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="overview" className="py-2 text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="registrations" className="py-2 text-xs sm:text-sm">
            Registrations
          </TabsTrigger>
          <TabsTrigger value="concerns" className="py-2 text-xs sm:text-sm">
            Concerns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Overview users={users} />
        </TabsContent>
        
        <TabsContent value="registrations" className="space-y-4">
          <RecentRegistrations />
        </TabsContent>
        
        <TabsContent value="concerns" className="space-y-4">
          <PendingConcerns />
        </TabsContent>
      </Tabs>
    </div>
  )
}