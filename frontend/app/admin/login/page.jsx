"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User, Leaf } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdminloginMutation } from "@/redux/Service/auth"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/redux/features/authFeature"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [login] = useAdminloginMutation()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await login({ username, password }).unwrap()
      console.log("Login successful:", response)

      // Dispatch setCredentials to store user info in Redux and local storage
      dispatch(setCredentials(response))

      // Redirect to the home page or dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-4">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-16 left-8 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-8 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <Card className="relative z-10 w-full max-w-md border border-emerald-200 bg-white/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full blur-lg opacity-75"></div>
              <div className="relative rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 p-3">
                <Leaf className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Farm Contract
            </h2>
            <CardTitle className="text-2xl text-slate-900">Admin Portal</CardTitle>
            <CardDescription className="text-slate-500">
              Secure access to your farm management dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="font-medium text-slate-700">
                Username
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-emerald-400 focus:bg-white transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-slate-700">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-emerald-400 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-slate-500 transition-colors hover:bg-transparent hover:text-emerald-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>

          <div className="px-6 pb-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
