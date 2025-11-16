"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function FeedbackForm({ userType }) {
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
        <h3 className="text-xl font-medium text-primary">Thank You for Your Feedback!</h3>
        <p className="text-primary/80">Your feedback helps us improve our platform for everyone.</p>
        <Button onClick={handleReset} className="mt-4">
          Submit Another Feedback
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
        <Label className="text-lg">How would you rate your experience?</Label>
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
          {rating ? `You selected ${rating} star${rating !== 1 ? "s" : ""}` : "Click to rate"}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Label htmlFor="satisfaction" className="text-lg">
          What aspects are you satisfied with?
        </Label>
        <RadioGroup className="flex flex-col space-y-2 mt-2">
          {userType === "farmer" ? (
            <>
              <RadioOption value="payment" label="Payment Process" />
              <RadioOption value="support" label="Support & Guidance" />
              <RadioOption value="contract" label="Contract Terms" />
              <RadioOption value="website" label="Website Usability" />
            </>
          ) : (
            <>
              <RadioOption value="farmers" label="Farmer Relationships" />
              <RadioOption value="quality" label="Produce Quality" />
              <RadioOption value="process" label="Contract Process" />
              <RadioOption value="website" label="Website Usability" />
            </>
          )}
        </RadioGroup>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="feedback-details" className="text-lg">
          How can we improve?
        </Label>
        <Textarea id="feedback-details" placeholder="Share your suggestions..." className="min-h-[120px]" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={submitting || !rating}>
          {submitting ? "Submitting..." : "Submit Feedback"}
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
