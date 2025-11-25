"use client";

import { motion } from "framer-motion";
import { UserCheck, MessageSquare, ScrollText, Truck, Award } from "lucide-react";
import { useTranslate } from "@/lib/LanguageContext";

export default function Workflow3D() {
  const { t } = useTranslate();
  
  const phases = [
    {
      title: t('createProfile', { en: 'Create Your Profile', hi: 'अपनी प्रोफ़ाइल बनाएं' }),
      description: t('createProfileDesc', { en: 'Sign up as a farmer or contractor and complete verification', hi: 'किसान या ठेकेदार के रूप में साइन अप करें और सत्यापन पूरा करें' }),
      icon: UserCheck,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: t('browseConnect', { en: 'Browse & Connect', hi: 'ब्राउज़ करें और कनेक्ट करें' }),
      description: t('browseConnectDesc', { en: 'Explore available contracts or post your needs in the marketplace', hi: 'उपलब्ध अनुबंधों का अन्वेषण करें या बाज़ार में अपनी आवश्यकताएं पोस्ट करें' }),
      icon: MessageSquare,
      gradient: "from-lime-400 to-lime-600",
    },
    {
      title: t('negotiateAgree', { en: 'Negotiate & Agree', hi: 'बातचीत करें और सहमत हों' }),
      description: t('negotiateAgreeDesc', { en: 'Discuss terms and digitally sign secure contracts', hi: 'शर्तों पर चर्चा करें और सुरक्षित अनुबंधों पर डिजिटल रूप से हस्ताक्षर करें' }),
      icon: ScrollText,
      gradient: "from-cyan-400 to-cyan-600",
    },
    {
      title: t('transactSafely', { en: 'Transact Safely', hi: 'सुरक्षित रूप से लेनदेन करें' }),
      description: t('transactSafelyDesc', { en: 'Complete transactions with escrow protection for both parties', hi: 'दोनों पक्षों के लिए एस्क्रो सुरक्षा के साथ लेनदेन पूरा करें' }),
      icon: Truck,
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      title: t('growTogether', { en: 'Grow Together', hi: 'साथ में बढ़ें' }),
      description: t('growTogetherDesc', { en: 'Build long-term relationships with verified, reliable partners', hi: 'सत्यापित, विश्वसनीय भागीदारों के साथ दीर्घकालिक संबंध बनाएं' }),
      icon: Award,
      gradient: "from-lime-400 to-emerald-500",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-white py-20 text-slate-900 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.12),_transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-emerald-200/60 to-transparent blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center text-3xl font-semibold text-slate-900 sm:text-4xl"
        >
          {t('howItWorks', { en: 'How It Works', hi: 'यह कैसे काम करता है' })}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600"
        >
          {t('workflowDesc', { en: 'A smooth, transparent process designed for trust and efficiency', hi: 'विश्वास और दक्षता के लिए डिज़ाइन की गई एक सुचारू, पारदर्शी प्रक्रिया' })}
        </motion.p>

        <div className="mt-16 flex flex-col gap-12" style={{ perspective: "1600px" }}>
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            const invert = idx % 2 === 1;
            return (
              <motion.div
                key={phase.title}
                className={`flex flex-col gap-6 md:flex-row ${invert ? "md:flex-row-reverse" : ""}`}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
              >
                <div className="relative flex-1">
                  <motion.div
                    whileHover={{ rotateY: invert ? -10 : 10, translateZ: 30 }}
                    transition={{ type: "spring", stiffness: 180, damping: 25 }}
                    className="group relative h-full rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_25px_60px_rgba(148,163,184,0.22)]"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${phase.gradient} opacity-35 blur`} />
                        <Icon className="relative z-10 h-7 w-7 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{phase.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{phase.description}</p>
                      </div>
                    </div>

                    <motion.div
                      className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"
                      initial={{ opacity: 0, y: 20, rotateX: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                      style={{ transform: "translateZ(60px)" }}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        {t('phaseOutcome', { en: 'Phase outcome', hi: 'चरण परिणाम' })}
                      </div>
                      <p className="mt-2 text-sm text-slate-700">
                        {t('phaseOutcomeDesc', { en: 'Each step is designed to ensure transparency, security, and trust for all parties involved.', hi: 'प्रत्येक चरण सभी संबंधित पक्षों के लिए पारदर्शिता, सुरक्षा और विश्वास सुनिश्चित करने के लिए डिज़ाइन किया गया है।' })}
                      </p>
                    </motion.div>
                  </motion.div>
                </div>

                <div className="md:w-36">
                  <motion.div
                    className="mx-auto h-32 w-32 rounded-full border border-emerald-200 bg-emerald-50 backdrop-blur"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  >
                    <div className="flex h-full flex-col items-center justify-center text-emerald-700">
                      <span className="text-sm uppercase tracking-widest text-emerald-600">{t('step', { en: 'Step', hi: 'चरण' })}</span>
                      <span className="text-3xl font-bold">{idx + 1}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
