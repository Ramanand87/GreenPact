"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslate } from "@/lib/LanguageContext"

export function FeedbackForm({ userType }) {
  const { t } = useTranslate();
  const [rating, setRating] = useState(null)
  const [hoveredRating, setHoveredRating] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  const handleReset = () => {
    setSubmitted(false)
    setRating(null)
    setHoveredRating(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  }

  if (submitted) {
    return (
      <motion.div
        className="p-6 text-center bg-primary/10 rounded-lg border-2 border-primary/20 space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20">
          <ThumbsUp className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium text-primary">{t('thankYouFeedback', { en: 'Thank You for Your Feedback!', hi: 'आपके फीडबैक के लिए धन्यवाद!' })}</h3>
        <p className="text-primary/80">{t('feedbackHelps', { en: 'Your feedback helps us improve our platform for everyone.', hi: 'आपका फीडबैक हमें सभी के लिए अपने प्लेटफॉर्म को बेहतर बनाने में मदद करता है।' })}</p>
        <Button onClick={handleReset} className="mt-4">
          {t('submitAnotherFeedback', { en: 'Submit Another Feedback', hi: 'एक और फीडबैक जमा करें' })}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <Label className="text-lg">{t('rateExperience', { en: 'How would you rate your experience?', hi: 'आप अपने अनुभव को कैसे रेट करेंगे?' })}</Label>
        <div className="flex justify-center space-x-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              type="button"
              variant="ghost"
              size="icon"
              className="h-12 w-12"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
            >
              <Star
                className={`h-8 w-8 ${
                  (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                    ? "fill-secondary text-secondary"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          {rating ? t('youSelectedStars', { en: `You selected ${rating} star${rating !== 1 ? 's' : ''}`, hi: `आपने ${rating} स्टार चुना` }) : t('clickToRate', { en: 'Click to rate', hi: 'रेट करने के लिए क्लिक करें' })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Label htmlFor="satisfaction" className="text-lg">
          {t('whatSatisfied', { en: 'What aspects are you satisfied with?', hi: 'आप किन पहलुओं से संतुष्ट हैं?' })}
        </Label>
        <RadioGroup className="flex flex-col space-y-2 mt-2">
          {userType === "farmer" ? (
            <>
              <RadioOption value="payment" label={t('paymentProcess', { en: 'Payment Process', hi: 'भुगतान प्रक्रिया' })} />
              <RadioOption value="support" label={t('supportGuidance', { en: 'Support & Guidance', hi: 'समर्थन और मार्गदर्शन' })} />
              <RadioOption value="contract" label={t('contractTerms', { en: 'Contract Terms', hi: 'अनुबंध शर्तें' })} />
              <RadioOption value="website" label={t('websiteUsability', { en: 'Website Usability', hi: 'वेबसाइट उपयोगिता' })} />
            </>
          ) : (
            <>
              <RadioOption value="farmers" label={t('farmerRelationships', { en: 'Farmer Relationships', hi: 'किसान संबंध' })} />
              <RadioOption value="quality" label={t('produceQuality', { en: 'Produce Quality', hi: 'उपज गुणवत्ता' })} />
              <RadioOption value="process" label={t('contractProcess', { en: 'Contract Process', hi: 'अनुबंध प्रक्रिया' })} />
              <RadioOption value="website" label={t('websiteUsability', { en: 'Website Usability', hi: 'वेबसाइट उपयोगिता' })} />
            </>
          )}
        </RadioGroup>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="feedback-details" className="text-lg">
          {t('howCanWeImprove', { en: 'How can we improve?', hi: 'हम कैसे सुधार सकते हैं?' })}
        </Label>
        <Textarea id="feedback-details" placeholder={t('shareSuggestions', { en: 'Share your suggestions...', hi: 'अपने सुझाव साझा करें...' })} className="min-h-[120px]" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={submitting || !rating}>
          {submitting ? t('submitting', { en: 'Submitting...', hi: 'जमा हो रहा है...' }) : t('submitFeedback', { en: 'Submit Feedback', hi: 'फीडबैक जमा करें' })}
        </Button>
      </motion.div>
    </motion.form>
  )
}

function RadioOption({ value, label }) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={value} />
      <Label htmlFor={value} className="font-normal">{label}</Label>
    </div>
  )
}
