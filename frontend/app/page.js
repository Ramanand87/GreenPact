import CTASection from '@/components/Home/cta-section'
import FeaturesSection from '@/components/Home/FeatureSection'
import HeroSection from '@/components/Home/HeroSection'
import HowItWorks from '@/components/Home/HowItWorks'
import React from 'react'

const page = () => {
  return (
<div>
<HeroSection/>
<FeaturesSection/>
<HowItWorks/>
<CTASection/>
</div>  
  )
}

export default page