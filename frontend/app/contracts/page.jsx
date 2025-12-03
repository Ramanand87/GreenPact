"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelector } from "react-redux"
import { useTranslate } from "@/lib/LanguageContext"
import ApprovalDialog from "@/components/Contracts/ApprovalDialog"
import ViewContractDialog from "@/components/Contracts/ViewContractDialog"
import EditContractDialog from "@/components/Contracts/EditContractDialog"
import ContractCard from "@/components/Contracts/ContractCard"
import NotificationBell from "@/components/Contracts/NotificationBell"
import SearchAndFilters from "@/components/Contracts/SearchAndFilters"
import { useWebSocketContracts } from "@/hooks/use-websocket-contracts"
import { useFaceVerification } from "@/hooks/use-face-verification"
import { useContractOperations } from "@/hooks/use-contract-operations"

export default function ContractsListPage() {
  const { t } = useTranslate()
  const userInfo = useSelector((state) => state.auth.userInfo)
  const token = userInfo?.access
  const userRole = userInfo?.role
  const currentUser = userInfo?.data.username

  // Custom hooks
  const { contracts, isLoading, ws, sendMessage } = useWebSocketContracts(token)
  const {
    modelsLoaded,
    storedDescriptor,
    verificationImage,
    setVerificationImage,
    verificationStatus,
    setVerificationStatus,
    isVerifying,
    handleVerifyUser,
    retryVerification,
  } = useFaceVerification()
  const {
    handleUpdate,
    handleDelete,
    handleApprove,
    handleQrCodeUpload,
    isUpdating,
    deletingIds,
    approvingIds,
    qrCodeUploading,
    qrCodeUploaded,
    setQrCodeUploaded,
    existingQrCode,
    hasExistingQrCode,
  } = useContractOperations(ws, token,currentUser)

  // UI states
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortOption, setSortOption] = useState("newest")
  const [filterOption, setFilterOption] = useState("all")
  
  // Dialog states
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [currentContract, setCurrentContract] = useState(null)
  const [contractToApprove, setContractToApprove] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Form states
  const [deliveryDate, setDeliveryDate] = useState(new Date())
  const [formData, setFormData] = useState({
    delivery_address: "",
    quantity: 0,
    nego_price: 0,
    terms: [],
    newTerm: "",
  })

  // Handlers
  const handleViewClick = (contract) => {
    setCurrentContract(contract)
    setViewOpen(true)
  }

  const handleEditClick = (contract) => {
    setCurrentContract(contract)
    setFormData({
      delivery_address: contract.delivery_address,
      quantity: contract.quantity,
      nego_price: contract.price,
      terms: [...contract.terms],
      newTerm: "",
    })
    setDeliveryDate(new Date(contract.deliveryDate))
    setEditOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addTerm = () => {
    if (formData.newTerm.trim()) {
      setFormData((prev) => ({
        ...prev,
        terms: [...prev.terms, prev.newTerm.trim()],
        newTerm: "",
      }))
    }
  }

  const removeTerm = (index) => {
    setFormData((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }))
  }

  const openApprovalDialog = (contractId) => {
    setContractToApprove(contractId)
    setVerificationImage(null)
    setVerificationStatus(null)
    setQrCodeUploaded(false)
    setApprovalDialogOpen(true)
  }

  const onApproveConfirm = () => {
    handleApprove(contractToApprove, verificationStatus, qrCodeUploaded, () => {
      setApprovalDialogOpen(false)
      setViewOpen(false)
      setVerificationImage(null)
      setVerificationStatus(null)
      setQrCodeUploaded(false)
    })
  }

  const onUpdateContract = async () => {
    const success = await handleUpdate(
      currentContract.id,
      formData,
      deliveryDate,
      currentContract.status
    )
    if (success) {
      setEditOpen(false)
    }
  }

  const onRetryVerification = () => {
    retryVerification()
    setQrCodeUploaded(false)
  }

  // Filtered and sorted contracts
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      searchTerm === "" ||
      contract.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.buyer.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && contract.status === activeTab
  })

  const filteredAndSortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt)
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt)
      case "priceHigh":
        return b.price - a.price
      case "priceLow":
        return a.price - b.price
      default:
        return 0
    }
  })

  const pendingContracts = contracts.filter((contract) => contract.status === "pending")
  const pendingCount = pendingContracts.length


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 ">
      {/* Approval Confirmation Dialog */}
      <ApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        verificationStatus={verificationStatus}
        setVerificationStatus={setVerificationStatus}
        verificationImage={verificationImage}
        setVerificationImage={setVerificationImage}
        isVerifying={isVerifying}
        modelsLoaded={modelsLoaded}
        storedDescriptor={storedDescriptor}
        handleVerifyUser={handleVerifyUser}
        handleQrCodeUpload={handleQrCodeUpload}
        qrCodeUploading={qrCodeUploading}
        qrCodeUploaded={qrCodeUploaded}
        onApprove={onApproveConfirm}
        onRetry={onRetryVerification}
        existingQrCode={existingQrCode}
        hasExistingQrCode={hasExistingQrCode}
      />

      {/* View Contract Dialog */}
      <ViewContractDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        contract={currentContract}
        userRole={userRole}
        onApprove={openApprovalDialog}
        isApproving={currentContract && approvingIds.includes(currentContract.id)}
      />

      {/* Edit Contract Dialog */}
      <EditContractDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        formData={formData}
        onFormChange={handleFormChange}
        deliveryDate={deliveryDate}
        onDeliveryDateChange={setDeliveryDate}
        onAddTerm={addTerm}
        onRemoveTerm={removeTerm}
        onUpdate={onUpdateContract}
        isUpdating={isUpdating}
      />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800">{t('contracts', { en: 'Contracts', hi: 'अनुबंध' })}</h1>
          <p className="text-gray-600 mt-1">{t('manageContracts', { en: 'Manage your farming contracts', hi: 'अपने कृषि अनुबंधों का प्रबंधन करें' })}</p>
        </div>

        {/* Notifications Bell */}
        {userRole === "farmer" && (
          <NotificationBell
            pendingContracts={pendingContracts}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            onContractClick={(contract) => {
              handleViewClick(contract)
              setShowNotifications(false)
            }}
            onViewAll={() => {
              setActiveTab("pending")
              setShowNotifications(false)
            }}
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterOption}
          onSortChange={setSortOption}
        />

        <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6 overflow-x-auto w-full flex justify-start">
            <TabsTrigger value="all">{t('allContracts', { en: 'All Contracts', hi: 'सभी अनुबंध' })}</TabsTrigger>
            <TabsTrigger value="active">{t('active', { en: 'Active', hi: 'सक्रिय' })}</TabsTrigger>
            <TabsTrigger value="pending">
              {t('pending', { en: 'Pending', hi: 'लंबित' })}
              {pendingCount > 0 && (
                <span className="ml-1.5 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">{t('completed', { en: 'Completed', hi: 'पूर्ण' })}</TabsTrigger>
          </TabsList>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-green-600">{t('loadingContracts', { en: 'Loading contracts...', hi: 'अनुबंध लोड हो रहे हैं...' })}</span>
            </div>
          )}

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredAndSortedContracts.length > 0
                ? filteredAndSortedContracts.map((contract, index) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      index={index}
                      userRole={userRole}
                      onView={handleViewClick}
                      onEdit={handleEditClick}
                      onDelete={handleDelete}
                      onApprove={openApprovalDialog}
                      isDeleting={deletingIds.includes(contract.id)}
                      isApproving={approvingIds.includes(contract.id)}
                    />
                  ))
                : !isLoading && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">{t('noContractsFound', { en: 'No contracts found matching your criteria.', hi: 'आपके मानदंडों से मेल खाते कोई अनुबंध नहीं मिले।' })}</p>
                    </div>
                  )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
