"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useTranslate } from "@/lib/LanguageContext";

export default function Testimonials3D() {
  const { t } = useTranslate();
  
  const testimonials = [
    {
      name: t('testimonial1Name', { en: 'Aparna Devi', hi: 'अपर्णा देवी' }),
      role: t('testimonial1Role', { en: 'Organic farmer, Karnataka', hi: 'जैविक किसान, कर्नाटक' }),
      quote: t('testimonial1Quote', { 
        en: 'The 3D cockpit shows me contract health, logistics, and finance streams in one sweep. Our partners finally feel like co-pilots, not strangers.', 
        hi: '3D कॉकपिट मुझे एक नज़र में अनुबंध स्वास्थ्य, रसद और वित्त धाराएं दिखाता है। हमारे साझेदार अब अजनबी नहीं बल्कि सह-पायलट की तरह महसूस करते हैं।' 
      }),
    },
    {
      name: t('testimonial2Name', { en: 'Raghav Sharma', hi: 'राघव शर्मा' }),
      role: t('testimonial2Role', { en: 'Agri contractor, Punjab', hi: 'कृषि ठेकेदार, पंजाब' }),
      quote: t('testimonial2Quote', { 
        en: 'Negotiations are faster because the agreement literally surrounds us. We highlight clauses, simulate risks, and commit with absolute clarity.', 
        hi: 'बातचीत तेज़ होती है क्योंकि समझौता सचमुच हमें घेरे रहता है। हम खंडों को हाइलाइट करते हैं, जोखिमों का अनुकरण करते हैं, और पूर्ण स्पष्टता के साथ प्रतिबद्ध होते हैं।' 
      }),
    },
    {
      name: t('testimonial3Name', { en: 'GreenFuture Coop', hi: 'ग्रीनफ्यूचर सहकारिता' }),
      role: t('testimonial3Role', { en: 'Agri collective, Maharashtra', hi: 'कृषि सामूहिक, महाराष्ट्र' }),
      quote: t('testimonial3Quote', { 
        en: 'Real-time projections surfaced by AI agents help us optimise crop rotations and cashflow, keeping every member accountable.', 
        hi: 'AI एजेंटों द्वारा सामने लाए गए वास्तविक समय के अनुमान हमें फसल चक्र और नकदी प्रवाह को अनुकूलित करने में मदद करते हैं, हर सदस्य को जवाबदेह रखते हैं।' 
      }),
    },
  ];
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 text-slate-900 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.12),_transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-100/60 to-transparent blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Quote className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">{t('testimonialHeading', { en: 'Voices inside the immersive hub', hi: 'इमर्सिव हब के अंदर की आवाज़ें' })}</h2>
          <p className="mt-3 text-base text-slate-600">
            {t('testimonialSubheading', { en: 'Stories from teams who now operate inside the layered GreenPact environment.', hi: 'उन टीमों की कहानियां जो अब स्तरित GreenPact वातावरण के अंदर काम करती हैं।' })}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              className="group relative h-full overflow-hidden rounded-[28px] border border-emerald-100 bg-white p-7 shadow-[0_25px_60px_rgba(148,163,184,0.22)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ rotateX: -6, rotateY: 6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="absolute -right-6 top-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/40 to-lime-400/40 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative">
                <p className="text-sm text-slate-600">
                  {item.quote}
                </p>
                <div className="mt-6 flex flex-col">
                  <span className="text-base font-semibold text-slate-900">{item.name}</span>
                  <span className="text-xs uppercase tracking-wider text-emerald-600">{item.role}</span>
                </div>
                <div className="mt-6 flex items-center gap-1 text-emerald-500">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
