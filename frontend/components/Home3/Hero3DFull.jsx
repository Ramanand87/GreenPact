"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text3D, Center, MeshTransmissionMaterial, Environment, Sphere, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useRef, useState } from "react";
import * as THREE from "three";

// Animated 3D Sphere with ripple effect
function AnimatedSphere({ position, color, scale = 1 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
    
    if (hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(scale * 1.3, scale * 1.3, scale * 1.3), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
    </Float>
  );
}

// Rotating 3D Text
function Rotating3DText() {
  const textRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    textRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    textRef.current.rotation.x = Math.cos(time * 0.2) * 0.05;
  });

  return (
    <Center>
      <group ref={textRef}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          GreenPact 3D
          <meshStandardMaterial color="#10b981" metalness={0.9} roughness={0.1} />
        </Text3D>
      </group>
    </Center>
  );
}

// Particle System
function Particles() {
  const count = 100;
  const pointsRef = useRef();

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#10b981" transparent opacity={0.6} />
    </points>
  );
}

// Holographic Card
function HolographicCard({ position, rotation }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time + rotation[0]) * 0.1;
    meshRef.current.rotation.z = rotation[2] + Math.sin(time * 0.5) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={256}
          transmission={0.95}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.5}
          anisotropy={1}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#10b981"
        />
      </mesh>
    </Float>
  );
}

export default function Hero3DFull() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#84cc16" />
          <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={1} color="#10b981" />
          
          <Particles />
          <AnimatedSphere position={[-3, 0, 0]} color="#10b981" scale={0.8} />
          <AnimatedSphere position={[3, 1, -2]} color="#84cc16" scale={0.6} />
          <AnimatedSphere position={[0, -2, -1]} color="#22c55e" scale={0.5} />
          
          <HolographicCard position={[-4, 2, -3]} rotation={[0, 0.3, 0.1]} />
          <HolographicCard position={[4, -1, -2]} rotation={[0, -0.3, -0.1]} />
          
          <Rotating3DText />
          
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 backdrop-blur-sm"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Experience True 3D Agriculture
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
          >
            Step into the
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 bg-clip-text text-transparent">
              Dimensional Future
            </span>
            <br />
            of Contract Farming
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl"
          >
            Navigate through holographic contracts, interact with real-time 3D data visualizations, and experience agricultural intelligence in an immersive spatial environment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-6 text-lg font-semibold text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] transition hover:shadow-[0_0_50px_rgba(16,185,129,0.7)]">
              <span className="relative z-10">Enter 3D Experience</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-green-500 to-lime-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
            <Button
              variant="outline"
              className="group flex items-center justify-center gap-2 rounded-full border-2 border-emerald-500/50 bg-transparent px-8 py-6 text-lg font-semibold text-emerald-300 backdrop-blur-sm transition hover:border-emerald-400 hover:bg-emerald-500/10"
            >
              <Play className="h-5 w-5" />
              <span>Watch 3D Demo</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating 3D Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {[
            { label: "3D Contracts", value: "15K+", color: "from-emerald-500 to-green-500" },
            { label: "Active in 3D Space", value: "52K", color: "from-green-500 to-lime-500" },
            { label: "Dimensional ROI", value: "42%", color: "from-lime-500 to-emerald-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-6 backdrop-blur-md"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 transition-opacity group-hover:opacity-20`} />
              <div className="relative">
                <div className="mb-2 text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-emerald-300">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
