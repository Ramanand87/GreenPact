"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslate } from "@/lib/LanguageContext"

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  onFilterChange,
  onSortChange,
}) {
  const { t } = useTranslate()

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t('searchContracts', { en: 'Search contracts...', hi: 'अनुबंध खोजें...' })}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> {t('filter', { en: 'Filter', hi: 'फ़िल्टर' })}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFilterChange("all")}>{t('allContracts', { en: 'All Contracts', hi: 'सभी अनुबंध' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("farmer")}>{t('byFarmer', { en: 'By Farmer', hi: 'किसान द्वारा' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("buyer")}>{t('byBuyer', { en: 'By Buyer', hi: 'खरीददार द्वारा' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("crop")}>{t('byCrop', { en: 'By Crop', hi: 'फसल द्वारा' })}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" /> {t('sort', { en: 'Sort', hi: 'क्रमबद्ध करें' })}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSortChange("newest")}>{t('dateNewest', { en: 'Date: Newest', hi: 'तिथि: नवीनतम' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("oldest")}>{t('dateOldest', { en: 'Date: Oldest', hi: 'तिथि: पुरानी' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("priceHigh")}>{t('priceHighToLow', { en: 'Price: High to Low', hi: 'मूल्य: उच्च से निम्न' })}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("priceLow")}>{t('priceLowToHigh', { en: 'Price: Low to High', hi: 'मूल्य: निम्न से उच्च' })}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
