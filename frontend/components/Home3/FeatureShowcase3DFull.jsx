"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox, Sparkles, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Shield, Box, Layers, Workflow, Sparkles as SparklesIcon, Gauge } from "lucide-react";
import { useRef, useState } from "react";
import * as THREE from "three";

// 3D Feature Card in Space
function Feature3DCard({ position, title, icon, color, delay }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [r, g, b] = color;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.3 + delay) * 0.15;
    groupRef.current.position.y = position[1] + Math.sin(time * 0.6 + delay) * 0.2;
    
    if (hovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group
        ref={groupRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main Card */}
        <RoundedBox args={[2.5, 3, 0.4]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color={new THREE.Color(r * 0.2, g * 0.2, b * 0.2)}
            metalness={0.9}
            roughness={0.1}
            emissive={new THREE.Color(r, g, b)}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            transparent
            opacity={0.95}
          />
        </RoundedBox>

        {/* Glowing Border */}
        <RoundedBox args={[2.7, 3.2, 0.2]} radius={0.18} smoothness={4} position={[0, 0, -0.25]}>
          <meshBasicMaterial
            color={new THREE.Color(r, g, b)}
            transparent
            opacity={hovered ? 0.4 : 0.15}
          />
        </RoundedBox>

        {/* Icon Sphere */}
        <mesh position={[0, 0.8, 0.3]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <MeshDistortMaterial
            color={new THREE.Color(r, g, b)}
            speed={2}
            distort={0.3}
            radius={1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Title Text */}
        <Text
          position={[0, 0, 0.25]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {title}
        </Text>

        {/* Icon Identifier */}
        <Text
          position={[0, -0.6, 0.25]}
          fontSize={0.15}
          color={new THREE.Color(r, g, b)}
          anchorX="center"
          anchorY="middle"
        >
          {icon}
        </Text>

        {/* Particle Effect */}
        <Sparkles
          count={hovered ? 50 : 20}
          scale={3}
          size={hovered ? 3 : 1.5}
          speed={0.6}
          color={new THREE.Color(r, g, b)}
          opacity={0.6}
        />
      </group>
    </Float>
  );
}

// 3D Features Scene
function FeaturesScene() {
  const features = [
    { title: "Multi-layered\nEscrow", icon: "🛡️", color: [0.06, 0.72, 0.51], position: [-4, 1, 0], delay: 0 },
    { title: "Spatial\nContract Viewer", icon: "📦", color: [0.52, 0.8, 0.09], position: [-1.5, -1, -1], delay: 0.5 },
    { title: "Stacked\nIntelligence", icon: "📊", color: [0.13, 0.77, 0.37], position: [1.5, 0.5, 0], delay: 1 },
    { title: "Adaptive\nWorkflows", icon: "⚙️", color: [0.06, 0.72, 0.51], position: [4, -0.5, -0.5], delay: 1.5 },
    { title: "Predictive\nSurfaces", icon: "✨", color: [0.52, 0.8, 0.09], position: [0, 2, -2], delay: 2 },
    { title: "Real-time\nHealth", icon: "📈", color: [0.13, 0.77, 0.37], position: [-2.5, -2, 1], delay: 2.5 },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />
      <pointLight position={[-10, 10, -10]} intensity={1.5} color="#84cc16" />
      <spotLight position={[0, 0, 10]} angle={0.6} penumbra={1} intensity={1} color="#22c55e" />

      {features.map((feature, index) => (
        <Feature3DCard
          key={index}
          position={feature.position}
          title={feature.title}
          icon={feature.icon}
          color={feature.color}
          delay={feature.delay}
        />
      ))}

      {/* Ambient Particles */}
      <Sparkles count={100} scale={20} size={1} speed={0.3} color="#10b981" opacity={0.2} />
    </>
  );
}

const features = [
  {
    icon: Shield,
    title: "Multi-layered Escrow",
    description: "Dynamic escrow tiers that adapt to contract milestones with automated releases in 3D space.",
  },
  {
    icon: Box,
    title: "Spatial Contract Viewer",
    description: "Navigate agreements inside a 3D holographic vault and surface clauses with natural gestures.",
  },
  {
    icon: Layers,
    title: "Stacked Intelligence",
    description: "Layer demand analytics, soil data, and climate indices in multiple dimensions for richer decisions.",
  },
  {
    icon: Workflow,
    title: "Adaptive Workflows",
    description: "Orchestrate negotiation, verification, and logistics with branching 3D automations.",
  },
  {
    icon: SparklesIcon,
    title: "Predictive Surfaces",
    description: "AI agents project price swings in 3D space and recommend interventions before risks surface.",
  },
  {
    icon: Gauge,
    title: "Real-time Health",
    description: "Monitor performance metrics inside luminous 3D gauges synced across all devices.",
  },
];

export default function FeatureShowcase3DFull() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/10 to-slate-950 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_70%)]" />
      
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Explore the{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
              3D Command Center
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-400">
            Each module exists in three-dimensional space, responding to movement and depth. Navigate, interact, and execute inside a persistent volumetric workspace.
          </p>
        </motion.div>

        {/* 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mb-16 h-[600px] w-full overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm"
        >
          <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
            <FeaturesScene />
            <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>

          {/* Interaction Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/30 bg-slate-900/80 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm text-emerald-300">
              <span className="mr-2 inline-block animate-pulse">🎮</span>
              Click and drag to explore • Hover cards for details
            </p>
          </div>
        </motion.div>

        {/* Feature Grid with Icons */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-6 backdrop-blur-md"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-lime-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm">
                    <Icon className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
