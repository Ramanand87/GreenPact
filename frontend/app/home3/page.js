import React from "react";
import Hero3DFull from "@/components/Home3/Hero3DFull";
import FeatureShowcase3DFull from "@/components/Home3/FeatureShowcase3DFull";
import Workflow3DFull from "@/components/Home3/Workflow3DFull";
import Testimonials3DFull from "@/components/Home3/Testimonials3DFull";
import CallToAction3DFull from "@/components/Home3/CallToAction3DFull";
import Stats3DFull from "@/components/Home3/Stats3DFull";

const Home3Page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Hero3DFull />
      <Stats3DFull />
      <FeatureShowcase3DFull />
      <Workflow3DFull />
      <Testimonials3DFull />
      <CallToAction3DFull />
    </main>
  );
};

export default Home3Page;
