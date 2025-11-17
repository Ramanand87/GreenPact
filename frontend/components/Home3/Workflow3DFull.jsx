"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox, Line, Sphere, OrbitControls, Trail } from "@react-three/drei";
import { motion } from "framer-motion";
import { UserCheck, MessageSquare, ScrollText, Truck, Award } from "lucide-react";
import { useRef } from "react";
import * as THREE from "three";

// 3D Phase Node
function PhaseNode({ position, number, color, delay }) {
  const meshRef = useRef();
  const [r, g, b] = color;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.5 + delay;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.8 + delay) * 0.1;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        {/* Outer Glow Ring */}
        <mesh>
          <torusGeometry args={[0.7, 0.05, 16, 100]} />
          <meshBasicMaterial color={new THREE.Color(r, g, b)} transparent opacity={0.3} />
        </mesh>

        {/* Main Sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={new THREE.Color(r * 0.3, g * 0.3, b * 0.3)}
            metalness={0.9}
            roughness={0.1}
            emissive={new THREE.Color(r, g, b)}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Number Text */}
        <Text
          position={[0, 0, 0.6]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {number}
        </Text>

        {/* Pulsing Ring */}
        <mesh scale={[1 + Math.sin(Date.now() * 0.002 + delay) * 0.2, 1 + Math.sin(Date.now() * 0.002 + delay) * 0.2, 1]}>
          <ringGeometry args={[0.8, 0.9, 32]} />
          <meshBasicMaterial color={new THREE.Color(r, g, b)} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Connection Line with Animation
function AnimatedConnection({ start, end, color, delay }) {
  const lineRef = useRef();
  const [r, g, b] = color;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const opacity = 0.3 + Math.sin(time * 2 + delay) * 0.2;
    if (lineRef.current) {
      lineRef.current.material.opacity = opacity;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color={new THREE.Color(r, g, b)}
      lineWidth={3}
      transparent
      opacity={0.5}
    />
  );
}

// Workflow Scene
function WorkflowScene() {
  const phases = [
    { number: "1", position: [-4, 2, 0], color: [0.06, 0.72, 0.51], delay: 0 },
    { number: "2", position: [-2, -1, 1], color: [0.52, 0.8, 0.09], delay: 0.5 },
    { number: "3", position: [0, 1.5, -0.5], color: [0.13, 0.77, 0.37], delay: 1 },
    { number: "4", position: [2, -0.5, 0.5], color: [0.06, 0.72, 0.51], delay: 1.5 },
    { number: "5", position: [4, 1, 0], color: [0.52, 0.8, 0.09], delay: 2 },
  ];

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />
      <pointLight position={[-10, 10, -10]} intensity={1.5} color="#84cc16" />
      <spotLight position={[0, 5, 5]} angle={0.5} penumbra={1} intensity={2} color="#22c55e" />

      {/* Phase Nodes */}
      {phases.map((phase, index) => (
        <PhaseNode
          key={index}
          position={phase.position}
          number={phase.number}
          color={phase.color}
          delay={phase.delay}
        />
      ))}

      {/* Connections between phases */}
      {phases.map((phase, index) => {
        if (index < phases.length - 1) {
          return (
            <AnimatedConnection
              key={`connection-${index}`}
              start={phase.position}
              end={phases[index + 1].position}
              color={phase.color}
              delay={phase.delay}
            />
          );
        }
        return null;
      })}

      {/* Ambient particles */}
      {[...Array(50)].map((_, i) => {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        return (
          <Sphere key={i} position={[x, y, z]} args={[0.02, 8, 8]}>
            <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
          </Sphere>
        );
      })}
    </>
  );
}

const phases = [
  {
    title: "Precision Onboarding",
    description: "Biometric identity, land records, and compliance checks mapped into a secure holographic dossier in 3D space.",
    icon: UserCheck,
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    title: "Immersive Negotiation",
    description: "Meet inside a spatial room that visualizes timelines, yield expectations, and risk scenarios in real-time 3D.",
    icon: MessageSquare,
    gradient: "from-lime-400 to-lime-600",
  },
  {
    title: "Adaptive Contracting",
    description: "Draft clauses in real time as the 3D contract scroll wraps around both parties for absolute clarity.",
    icon: ScrollText,
    gradient: "from-cyan-400 to-cyan-600",
  },
  {
    title: "Logistics Sync",
    description: "Live supply routes float across a 3D map plane with milestone-based releases and intelligent alerts.",
    icon: Truck,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "Growth Loop",
    description: "Performance snapshots evolve into 3D badges, reinforcing trusted relationships and better scores.",
    icon: Award,
    gradient: "from-lime-400 to-emerald-500",
  },
];

export default function Workflow3DFull() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15),_transparent_70%)]" />
      
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Navigate a{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
              5-Phase Volumetric
            </span>{" "}
            Workflow
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-400">
            Each stage orbits inside the experience cube, lighting up the path forward and accelerating trust between stakeholders in three-dimensional space.
          </p>
        </motion.div>

        {/* 3D Workflow Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mb-16 h-[600px] w-full overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm"
        >
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <WorkflowScene />
            <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Canvas>

          {/* Interaction Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/30 bg-slate-900/80 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm text-emerald-300">
              <span className="mr-2 inline-block animate-pulse">🌀</span>
              Explore the connected workflow in 3D space
            </p>
          </div>
        </motion.div>

        {/* Phase Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, rotateY: index % 2 === 0 ? 3 : -3 }}
                className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-6 backdrop-blur-md"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${phase.gradient} opacity-0 transition-opacity group-hover:opacity-10`} />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm">
                    <Icon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-white">{phase.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400">{phase.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
