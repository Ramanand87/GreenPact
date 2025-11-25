import React from "react";
import Hero3D from "@/components/Home2/Hero3D";
import FeatureShowcase3D from "@/components/Home2/FeatureShowcase3D";
import Workflow3D from "@/components/Home2/Workflow3D";
import Testimonials3D from "@/components/Home2/Testimonials3D";
import CallToAction3D from "@/components/Home2/CallToAction3D";

const Home2Page = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Hero3D />
      <FeatureShowcase3D />
      <Workflow3D />
      <Testimonials3D />
      <CallToAction3D />
    </main>
  );
};

export default Home2Page;
