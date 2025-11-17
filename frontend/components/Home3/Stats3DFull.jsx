"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox, Sparkles, OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// 3D Stat Card with real-time updating
function Stat3DCard({ position, value, label, color, delay, baseValue, increment }) {
  const groupRef = useRef();
  const [r, g, b] = color;
  const [currentValue, setCurrentValue] = useState(baseValue);
  const [displayValue, setDisplayValue] = useState(value);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue((prev) => {
        const newValue = prev + Math.random() * increment;
        
        // Format the display value based on the type
        if (value.includes('K')) {
          setDisplayValue(`${(newValue / 1000).toFixed(1)}K+`);
        } else if (value.includes('%')) {
          setDisplayValue(`${newValue.toFixed(1)}%`);
        } else {
          setDisplayValue(`${Math.floor(newValue)}+`);
        }
        
        return newValue;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [value, increment]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5 + delay) * 0.2;
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8 + delay) * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} position={position}>
        {/* Card Body */}
        <RoundedBox args={[2, 2.5, 0.3]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={new THREE.Color(r * 0.3, g * 0.3, b * 0.3)}
            metalness={0.9}
            roughness={0.1}
            emissive={new THREE.Color(r, g, b)}
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
          />
        </RoundedBox>
        
        {/* Glow Effect */}
        <RoundedBox args={[2.2, 2.7, 0.1]} radius={0.12} smoothness={4} position={[0, 0, -0.2]}>
          <meshBasicMaterial
            color={new THREE.Color(r, g, b)}
            transparent
            opacity={0.2}
          />
        </RoundedBox>

        {/* Value Text - Now Dynamic */}
        <Text
          position={[0, 0.4, 0.2]}
          fontSize={0.6}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {displayValue}
        </Text>

        {/* Label Text */}
        <Text
          position={[0, -0.3, 0.2]}
          fontSize={0.25}
          color={new THREE.Color(r, g, b)}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          textAlign="center"
        >
          {label}
        </Text>

        {/* Sparkles Effect */}
        <Sparkles count={30} scale={2.5} size={2} speed={0.4} color={new THREE.Color(r, g, b)} />
        
        {/* Real-time indicator - pulsing dot */}
        <mesh position={[0.8, 1, 0.2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial
            color={new THREE.Color(r, g, b)}
            transparent
            opacity={0.5 + Math.sin(Date.now() * 0.005) * 0.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Animated Background Sphere
function BackgroundSphere({ position, color, scale }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.3}
        radius={1}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// Data Grid Background
function DataGrid() {
  const gridRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (gridRef.current) {
      gridRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    }
  });

  return (
    <group ref={gridRef} position={[0, 0, -3]}>
      <gridHelper args={[20, 20, "#10b981", "#10b981"]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

// Rotating Stats Container
function StatsScene() {
  const stats = [
    { 
      value: "15K+", 
      label: "3D Contracts\nSecured", 
      color: [0.06, 0.72, 0.51], 
      position: [-3, 0, 0], 
      delay: 0,
      baseValue: 15000,
      increment: 5
    },
    { 
      value: "52K", 
      label: "Farmers in\n3D Space", 
      color: [0.52, 0.8, 0.09], 
      position: [0, 0, 0], 
      delay: 1,
      baseValue: 52000,
      increment: 15
    },
    { 
      value: "42%", 
      label: "Dimensional\nROI", 
      color: [0.13, 0.77, 0.37], 
      position: [3, 0, 0], 
      delay: 2,
      baseValue: 42,
      increment: 0.1
    },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />
      <pointLight position={[-10, 10, -10]} intensity={1.5} color="#84cc16" />
      <pointLight position={[0, -10, 5]} intensity={1} color="#22c55e" />
      <spotLight position={[0, 5, 5]} angle={0.5} penumbra={1} intensity={2} color="#22c55e" />

      {/* Background Elements */}
      <BackgroundSphere position={[-5, 2, -4]} color="#10b981" scale={1.5} />
      <BackgroundSphere position={[5, -2, -3]} color="#84cc16" scale={1.2} />
      <BackgroundSphere position={[0, 3, -5]} color="#22c55e" scale={1} />
      
      <DataGrid />

      {stats.map((stat, index) => (
        <Stat3DCard
          key={index}
          position={stat.position}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          delay={stat.delay}
          baseValue={stat.baseValue}
          increment={stat.increment}
        />
      ))}

      {/* Floating Data Particles */}
      <Sparkles count={100} scale={15} size={1.5} speed={0.3} color="#10b981" opacity={0.4} />
      
      {/* Orbiting Data Points */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 3) * 2;
        return (
          <Sphere key={i} position={[x, y, z]} args={[0.05, 16, 16]}>
            <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
          </Sphere>
        );
      })}

      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxDistance={12}
        minDistance={5}
      />
    </>
  );
}

export default function Stats3DFull() {
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
            <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
              Real-Time 3D Metrics
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Experience live data visualization in three dimensions. Interact with holographic statistics that respond to your presence.
          </p>
        </motion.div>

        {/* 3D Canvas Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm"
        >
          <Canvas 
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
          >
            <color attach="background" args={["#0a0f1a"]} />
            <fog attach="fog" args={["#0a0f1a", 5, 20]} />
            <StatsScene />
          </Canvas>
          
          {/* Interaction Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/30 bg-slate-900/70 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm text-emerald-300">
              <span className="mr-2 inline-block animate-pulse">✨</span>
              Drag to rotate • Scroll to zoom
            </p>
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            {
              title: "Spatial Analytics",
              description: "Navigate data in 3D space with natural gestures and movements",
              icon: "📊",
              metric: "Real-time Updates",
              value: "Every 2s"
            },
            {
              title: "Holographic Display",
              description: "View contracts and metrics as floating holographic projections",
              icon: "🔮",
              metric: "Active Nodes",
              value: "1,247"
            },
            {
              title: "Real-Time Sync",
              description: "All data updates instantly across the dimensional interface",
              icon: "⚡",
              metric: "Sync Speed",
              value: "< 50ms"
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-6 backdrop-blur-md transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-4xl">{card.icon}</div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-emerald-400">LIVE</span>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mb-3 text-sm text-slate-400">{card.description}</p>
                <div className="flex items-center justify-between border-t border-emerald-500/20 pt-3">
                  <span className="text-xs text-slate-500">{card.metric}</span>
                  <span className="text-sm font-semibold text-emerald-400">{card.value}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
