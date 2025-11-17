"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox, Sparkles, OrbitControls, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useRef, useState } from "react";
import * as THREE from "three";

// 3D Testimonial Card
function Testimonial3DCard({ position, name, role, rating, delay }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.3 + delay) * 0.15;
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5 + delay) * 0.15;
    
    if (hovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group
        ref={groupRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main Card */}
        <RoundedBox args={[2.5, 3.5, 0.3]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color={new THREE.Color(0.05, 0.1, 0.15)}
            metalness={0.8}
            roughness={0.2}
            emissive={new THREE.Color(0.06, 0.72, 0.51)}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            transparent
            opacity={0.95}
          />
        </RoundedBox>

        {/* Holographic Border */}
        <RoundedBox args={[2.65, 3.65, 0.15]} radius={0.17} smoothness={4} position={[0, 0, -0.2]}>
          <meshBasicMaterial
            color={new THREE.Color(0.06, 0.72, 0.51)}
            transparent
            opacity={hovered ? 0.5 : 0.2}
          />
        </RoundedBox>

        {/* Quote Icon */}
        <mesh position={[0, 1.3, 0.2]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={new THREE.Color(0.52, 0.8, 0.09)}
            metalness={0.9}
            roughness={0.1}
            emissive={new THREE.Color(0.52, 0.8, 0.09)}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Name Text */}
        <Text
          position={[0, 0.3, 0.2]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
          fontWeight="bold"
        >
          {name}
        </Text>

        {/* Role Text */}
        <Text
          position={[0, -0.1, 0.2]}
          fontSize={0.15}
          color={new THREE.Color(0.06, 0.72, 0.51)}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
        >
          {role}
        </Text>

        {/* Stars */}
        <group position={[0, -0.8, 0.2]}>
          {[...Array(rating)].map((_, i) => (
            <mesh key={i} position={[(i - 2) * 0.35, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={new THREE.Color(0.52, 0.8, 0.09)} />
            </mesh>
          ))}
        </group>

        {/* Particle Effects */}
        <Sparkles
          count={hovered ? 40 : 15}
          scale={3}
          size={hovered ? 2.5 : 1}
          speed={0.5}
          color={new THREE.Color(0.06, 0.72, 0.51)}
          opacity={0.5}
        />

        {/* Floating Quote Marks */}
        <mesh position={[-0.8, 0.9, 0.3]} rotation={[0, 0, Math.PI]}>
          <ringGeometry args={[0.1, 0.15, 16]} />
          <meshBasicMaterial color={new THREE.Color(0.52, 0.8, 0.09)} transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

// Testimonials Scene
function TestimonialsScene() {
  const testimonials = [
    { name: "Aparna Devi", role: "Organic Farmer\nKarnataka", rating: 5, position: [-3.5, 0, 0], delay: 0 },
    { name: "Raghav Sharma", role: "Agri Contractor\nPunjab", rating: 5, position: [0, 0.5, -1], delay: 0.5 },
    { name: "GreenFuture Coop", role: "Agri Collective\nMaharashtra", rating: 5, position: [3.5, -0.3, 0], delay: 1 },
  ];

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#10b981" />
      <pointLight position={[-10, 10, -10]} intensity={1.5} color="#84cc16" />
      <pointLight position={[0, -5, 5]} intensity={1} color="#22c55e" />
      <spotLight position={[0, 5, 3]} angle={0.5} penumbra={1} intensity={2} color="#10b981" />

      {testimonials.map((testimonial, index) => (
        <Testimonial3DCard
          key={index}
          position={testimonial.position}
          name={testimonial.name}
          role={testimonial.role}
          rating={testimonial.rating}
          delay={testimonial.delay}
        />
      ))}

      {/* Ambient Glow Spheres */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Sphere key={i} position={[x, Math.random() * 4 - 2, z]} args={[0.05, 16, 16]}>
            <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
          </Sphere>
        );
      })}

      {/* Floating Particles */}
      <Sparkles count={80} scale={15} size={1} speed={0.2} color="#10b981" opacity={0.2} />
    </>
  );
}

const testimonials = [
  {
    name: "Aparna Devi",
    role: "Organic Farmer, Karnataka",
    quote:
      "The 3D cockpit shows me contract health, logistics, and finance streams in one immersive sweep. Our partners finally feel like co-pilots in a shared holographic space.",
  },
  {
    name: "Raghav Sharma",
    role: "Agri Contractor, Punjab",
    quote:
      "Negotiations are faster because the agreement literally surrounds us in 3D. We highlight clauses, simulate risks, and commit with absolute clarity in spatial environment.",
  },
  {
    name: "GreenFuture Coop",
    role: "Agri Collective, Maharashtra",
    quote:
      "Real-time projections surfaced by AI agents in 3D help us optimize crop rotations and cashflow, keeping every member accountable in the volumetric workspace.",
  },
];

export default function Testimonials3DFull() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/10 to-slate-950 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15),_transparent_70%)]" />
      
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-6 inline-flex"
          >
            <Quote className="h-16 w-16 text-emerald-400" />
          </motion.div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Voices from the{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
              Immersive Hub
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-400">
            Stories from teams who now operate inside the layered GreenPact environment, experiencing agriculture in three dimensions.
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
          <Canvas camera={{ position: [0, 0, 9], fov: 60 }}>
            <TestimonialsScene />
            <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.4} />
          </Canvas>

          {/* Interaction Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/30 bg-slate-900/80 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm text-emerald-300">
              <span className="mr-2 inline-block animate-pulse">💬</span>
              Interact with 3D testimonials • Hover for effects
            </p>
          </div>
        </motion.div>

        {/* Testimonial Details Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
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
                <Quote className="mb-4 h-8 w-8 text-emerald-400" />
                <p className="mb-4 text-sm text-slate-300">{testimonial.quote}</p>
                <div className="mb-3 border-t border-emerald-500/20 pt-3">
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-emerald-400">{testimonial.role}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-emerald-400 text-emerald-400" />
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
