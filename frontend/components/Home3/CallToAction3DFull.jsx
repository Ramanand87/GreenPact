"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox, Sparkles, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Rocket } from "lucide-react";
import { useRef } from "react";
import * as THREE from "three";

// Animated CTA Cube
function CTACube() {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.1;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <MeshDistortMaterial
          color="#10b981"
          speed={2}
          distort={0.4}
          radius={1}
          metalness={0.8}
          roughness={0.2}
          emissive="#10b981"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

// Orbiting Icons
function OrbitingIcon({ radius, speed, color, size, offset }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed + offset;
    meshRef.current.position.x = Math.cos(time) * radius;
    meshRef.current.position.z = Math.sin(time) * radius;
    meshRef.current.position.y = Math.sin(time * 2) * 0.5;
    meshRef.current.rotation.y = time;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

// Pulsing Ring
function PulsingRing({ radius, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scale = 1 + Math.sin(time * 2) * 0.2;
    meshRef.current.scale.set(scale, scale, 1);
    meshRef.current.rotation.x = Math.PI / 2;
    meshRef.current.rotation.z = time * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.05, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// Floating Text
function Floating3DText({ text, position, color, size = 0.3 }) {
  const textRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    textRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        ref={textRef}
        position={position}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
        fontWeight="bold"
      >
        {text}
      </Text>
    </Float>
  );
}

// CTA Scene
function CTAScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={3} color="#10b981" />
      <pointLight position={[-10, 10, -10]} intensity={2} color="#84cc16" />
      <spotLight position={[0, 5, 5]} angle={0.4} penumbra={1} intensity={3} color="#22c55e" />

      <CTACube />

      {/* Orbiting Icons */}
      <OrbitingIcon radius={3.5} speed={0.5} color="#10b981" size={0.2} offset={0} />
      <OrbitingIcon radius={3.5} speed={0.5} color="#84cc16" size={0.2} offset={Math.PI} />
      <OrbitingIcon radius={3} speed={0.7} color="#22c55e" size={0.15} offset={Math.PI / 2} />
      <OrbitingIcon radius={3} speed={0.7} color="#10b981" size={0.15} offset={Math.PI * 1.5} />

      {/* Pulsing Rings */}
      <PulsingRing radius={2.5} color="#10b981" />
      <PulsingRing radius={3.5} color="#84cc16" />

      {/* Floating Text */}
      <Floating3DText text="Join the 3D Revolution" position={[0, 2.5, 0]} color="#10b981" size={0.25} />

      {/* Background Sparkles */}
      <Sparkles count={150} scale={12} size={1.5} speed={0.4} color="#10b981" opacity={0.3} />

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 5 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 4;
        return (
          <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
            </mesh>
          </Float>
        );
      })}
    </>
  );
}

export default function CallToAction3DFull() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.2),_transparent_70%)]" />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-1/4 bottom-20 h-64 w-64 rounded-full bg-lime-500/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mb-16 h-[500px] w-full overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900/50 backdrop-blur-sm"
        >
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <CTAScene />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
          </Canvas>

          {/* Overlay Gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", delay: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 backdrop-blur-sm"
          >
            <Zap className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Step into Volumetric Operations
            </span>
            <Rocket className="h-5 w-5 text-emerald-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
          >
            Launch the{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 bg-clip-text text-transparent">
              Immersive 3D Workspace
            </span>{" "}
            Today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-10 text-lg text-slate-300 sm:text-xl"
          >
            Blend contracts, insights, and communications inside an interactive three-dimensional environment that revolutionizes collaboration across the entire agricultural value chain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 px-10 py-6 text-lg font-semibold text-white shadow-[0_0_40px_rgba(16,185,129,0.6)] transition hover:shadow-[0_0_60px_rgba(16,185,129,0.8)]">
              <span className="relative z-10">Schedule a Guided 3D Tour</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-lime-500 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
            <Button
              variant="outline"
              className="group flex items-center justify-center gap-2 rounded-full border-2 border-emerald-500/50 bg-transparent px-10 py-6 text-lg font-semibold text-emerald-300 backdrop-blur-sm transition hover:border-emerald-400 hover:bg-emerald-500/10"
            >
              <Rocket className="h-5 w-5 transition group-hover:scale-110" />
              <span>Download 3D Playbook</span>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                <span className="text-emerald-400">✓</span>
              </div>
              <span>3D Secure Environment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                <span className="text-emerald-400">✓</span>
              </div>
              <span>Holographic Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                <span className="text-emerald-400">✓</span>
              </div>
              <span>Real-Time 3D Analytics</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 grid gap-6 sm:grid-cols-3"
        >
          {[
            {
              icon: "🌐",
              title: "Spatial Interface",
              description: "Navigate contracts in 3D space with natural movements",
            },
            {
              icon: "🎯",
              title: "Precision Tracking",
              description: "Monitor all metrics in real-time holographic displays",
            },
            {
              icon: "⚡",
              title: "Instant Sync",
              description: "All data updates across the dimensional network",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-6 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
