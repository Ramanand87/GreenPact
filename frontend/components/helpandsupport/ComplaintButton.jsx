"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Upload, X, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslate } from "@/lib/LanguageContext"
import { useCreateComplaintMutation } from "@/redux/Service/complaintApi"
import { useGetAllUsersQuery } from "@/redux/Service/auth"
import { useSelector } from "react-redux"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ComplaintButton({ currentUser, role }) {
  const { t } = useTranslate()
  const [complaintOpen, setComplaintOpen] = useState(false)
  const [createComplaint, { isLoading }] = useCreateComplaintMutation()
  const { data: userData, isLoading: usersLoading } = useGetAllUsersQuery(undefined)
  const userInfo = useSelector((state) => state.auth.userInfo)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [complaintData, setComplaintData] = useState({
    category: "",
    description: "",
    priority: "Low",
    status: "pending",
  })
  const [proofImage, setProofImage] = useState(null)
  const [proofPreview, setProofPreview] = useState(null)

  // Get all users for accused dropdown (farmers + contractors), excluding current user
  const allUsers = useMemo(() => {
    if (!userData) return []
    const farmers = userData?.farmer || []
    const contractors = userData?.contractor || []
    const allUsersList = [...farmers, ...contractors]
    // Filter out current user so they can't accuse themselves
    return allUsersList.filter(user => user.user?.username !== currentUser)
  }, [userData, currentUser])

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return []
    const lowerCaseQuery = searchQuery.toLowerCase()
    return allUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerCaseQuery) ||
        user.user?.username?.toLowerCase().includes(lowerCaseQuery)
    )
  }, [allUsers, searchQuery])

  const handleProofChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProofPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProof = () => {
    setProofImage(null)
    setProofPreview(null)
  }

  const handleComplaintSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('complainant', currentUser)
      
      // Only add accused if a user is selected (optional field)
      if (selectedUser) {
        formData.append('accused', selectedUser)
      }
      
      formData.append('category', complaintData.category)
      formData.append('description', complaintData.description)
      formData.append('priority', complaintData.priority)
      formData.append('status', complaintData.status)
      
      if (proofImage) {
        formData.append('proof', proofImage)
      }

      await createComplaint(formData).unwrap()

      // Reset form
      setComplaintData({
        category: "",
        description: "",
        priority: "Low",
        status: "pending",
      })
      setSelectedUser("")
      setSearchQuery("")
      setShowDropdown(false)
      setProofImage(null)
      setProofPreview(null)
      setComplaintOpen(false)

      toast(t('complaintSubmittedSuccess', { en: 'Complaint Submitted Successfully', hi: 'शिकायत सफलतापूर्वक जमा की गई' }), {
        description: t('complaintReceivedDesc', { en: 'We have received your complaint and will address it soon.', hi: 'हमने आपकी शिकायत प्राप्त कर ली है और जल्द ही इसे हल करेंगे।' }),
        action: <CheckCircle2 className="text-green-500" />,
      })
    } catch (error) {
      toast(t('errorSubmittingComplaint', { en: 'Error Submitting Complaint', hi: 'शिकायत जमा करने में त्रुटि' }), {
        description: error?.data?.message || t('complaintErrorDesc', { en: 'There was an error submitting your complaint. Please try again.', hi: 'आपकी शिकायत जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' }),
        variant: "destructive",
        action: <AlertCircle className="text-red-500" />,
      })
      console.error(error)
    }
  }

  const handleComplaintChange = (e) => {
    const { name, value } = e.target
    setComplaintData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {t('fileComplaint', { en: 'File a Complaint', hi: 'शिकायत दर्ज करें' })}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            {t('submitYourComplaint', { en: 'Submit Your Complaint', hi: 'अपनी शिकायत जमा करें' })}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleComplaintSubmit} className="space-y-4">
          {/* Complainant (Current User - Read Only) */}
          <div className="space-y-2">
            <Label htmlFor="complainant">{t('complainant', { en: 'Complainant', hi: 'शिकायतकर्ता' })}</Label>
            <Input 
              id="complainant" 
              value={currentUser} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          {/* Accused User (Searchable Dropdown - Optional) */}
          <div className="space-y-2">
            <Label htmlFor="accused">
              {t('accused', { en: 'Accused User', hi: 'आरोपी उपयोगकर्ता' })} 
              <span className="text-gray-500 text-xs ml-1">({t('optional', { en: 'Optional', hi: 'वैकल्पिक' })})</span>
            </Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchUser', { en: 'Search by name or username...', hi: 'नाम या उपयोगकर्ता नाम से खोजें...' })}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(e.target.value.length > 0)
                  }}
                  onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                  className="pl-9"
                />
                {selectedUser && searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1.5 h-7 w-7 p-0"
                    onClick={() => {
                      setSelectedUser("")
                      setSearchQuery("")
                      setShowDropdown(false)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {showDropdown && searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {usersLoading ? (
                    <div className="px-4 py-8 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">{t('loadingUsers', { en: 'Loading users...', hi: 'उपयोगकर्ता लोड हो रहे हैं...' })}</p>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.user?.username}
                        onClick={() => {
                          setSelectedUser(user.user?.username)
                          setSearchQuery(`${user.name} (@${user.user?.username})`)
                          setShowDropdown(false)
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {user.image ? (
                              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">@{user.user?.username}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Search className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">
                        {t('noUsersFound', { en: 'No users found', hi: 'कोई उपयोगकर्ता नहीं मिला' })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedUser && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-green-600">
                  {t('selected', { en: 'Selected', hi: 'चयनित' })}: <span className="font-medium">{selectedUser}</span>
                </span>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">{t('category', { en: 'Category', hi: 'श्रेणी' })} *</Label>
            <Input
              id="category"
              name="category"
              placeholder={t('categoryPlaceholder', { en: 'e.g., fraud, scam, harassment', hi: 'जैसे धोखाधड़ी, घोटाला, उत्पीड़न' })}
              value={complaintData.category}
              onChange={handleComplaintChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('description', { en: 'Description', hi: 'विवरण' })} *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t('descriptionPlaceholder', { en: 'Describe the issue in detail...', hi: 'मुद्दे का विस्तार से वर्णन करें...' })}
              value={complaintData.description}
              onChange={handleComplaintChange}
              rows={5}
              required
            />
          </div>

          {/* Proof (Optional Image Upload) */}
          <div className="space-y-2">
            <Label htmlFor="proof">{t('proof', { en: 'Proof (Optional)', hi: 'सबूत (वैकल्पिक)' })}</Label>
            <Input
              id="proof"
              type="file"
              accept="image/*"
              onChange={handleProofChange}
              className="hidden"
            />
            <Label
              htmlFor="proof"
              className="block border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              {proofPreview ? (
                <div className="relative">
                  <img
                    src={proofPreview}
                    alt="Proof"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemoveProof()
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {t('uploadProof', { en: 'Click to upload proof image', hi: 'सबूत छवि अपलोड करने के लिए क्लिक करें' })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('supportedFormats', { en: 'PNG, JPG, JPEG', hi: 'PNG, JPG, JPEG' })}
                  </p>
                </div>
              )}
            </Label>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">{t('priority', { en: 'Priority', hi: 'प्राथमिकता' })} *</Label>
            <Select
              value={complaintData.priority}
              onValueChange={(value) =>
                setComplaintData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectPriority', { en: 'Select priority', hi: 'प्राथमिकता चुनें' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">{t('low', { en: 'Low', hi: 'कम' })}</SelectItem>
                <SelectItem value="Medium">{t('medium', { en: 'Medium', hi: 'मध्यम' })}</SelectItem>
                <SelectItem value="High">{t('high', { en: 'High', hi: 'उच्च' })}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status (Hidden, default pending) */}
          <input type="hidden" name="status" value={complaintData.status} />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setComplaintOpen(false)}>
              {t('cancel', { en: 'Cancel', hi: 'रद्द करें' })}
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('submitting', { en: 'Submitting...', hi: 'जमा हो रहा है...' })}
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {t('submitComplaint', { en: 'Submit Complaint', hi: 'शिकायत जमा करें' })}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
