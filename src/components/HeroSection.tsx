"use client";
import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera, Instances, Instance, Grid, Float } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { motion, AnimatePresence } from "motion/react";
import { Radar, Zap, Activity, Terminal, ScanLine } from "lucide-react";
import { cn } from "../lib/utils";

// --- R3F Components ---

function CameraRig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    // Smoothly interpolate camera position based on mouse (parallax)
    camera.position.lerp(vec.set(mouse.x * 3, mouse.y * 1 + 2, 8), 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function CyberGrid() {
  return (
    <group position={[0, -2, 0]}>
      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        cellColor="#06B6D4" 
        sectionColor="#8B5CF6" 
        cellSize={1} 
        sectionSize={4} 
        position={[0, 0, 0]} 
      />
      {/* Glow under the grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function CyberCity() {
  const count = 150;
  const instances = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60 - 15;
      // keep center clear
      if (Math.abs(x) < 8 && Math.abs(z) < 8) continue;
      
      const height = Math.random() * 10 + 2;
      arr.push({
        position: [x, height / 2 - 2, z] as [number, number, number],
        scale: [Math.random() * 1.5 + 0.5, height, Math.random() * 1.5 + 0.5] as [number, number, number],
        color: Math.random() > 0.8 ? "#8B5CF6" : "#02040A",
        emissive: Math.random() > 0.9 ? "#06B6D4" : "#000000"
      });
    }
    return arr;
  }, []);

  return (
    <Instances limit={count} range={instances.length}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial metalness={0.8} roughness={0.2} />
      {instances.map((data, i) => (
        <Instance 
          key={i} 
          position={data.position} 
          scale={data.scale} 
          color={data.color}
          // @ts-expect-error emissive exists on Instance
          emissive={data.emissive}
        />
      ))}
    </Instances>
  );
}

function Particles() {
  const count = 300;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 10 + 2;
      const z = (Math.random() - 0.5) * 20;
      temp.push({ 
        position: new THREE.Vector3(x, y, z), 
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02) 
      });
    }
    return temp;
  }, []);

  const { mouse, camera } = useThree();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouseWorld = new THREE.Vector3();

  useFrame(() => {
    if (!mesh.current) return;
    
    // Find mouse position in 3D world (roughly at z=0)
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, mouseWorld);

    particles.forEach((particle, i) => {
      // Mouse repulsion
      const dist = particle.position.distanceTo(mouseWorld);
      if (dist < 4) {
        const dir = particle.position.clone().sub(mouseWorld).normalize();
        particle.velocity.add(dir.multiplyScalar(0.015));
      }

      // Return to base speed (friction)
      particle.velocity.multiplyScalar(0.95);
      
      // Floating motion & apply velocity
      particle.position.add(particle.velocity);
      particle.position.y += Math.sin(Date.now() * 0.001 + i) * 0.005;

      // Wrap around bounds
      if (particle.position.y > 10) particle.position.y = -2;
      if (particle.position.x > 15) particle.position.x = -15;
      if (particle.position.x < -15) particle.position.x = 15;
      if (particle.position.z > 5) particle.position.z = -15;

      dummy.position.copy(particle.position);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.04, 0.04, 0.04]} />
      <meshBasicMaterial color="#06B6D4" />
    </instancedMesh>
  );
}

function HologramCards() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[-4, 2, -2]}>
        <Html transform wrapperClass="pointer-events-none select-none" distanceFactor={8}>
          <div className="w-64 p-4 border border-[#06B6D4]/50 bg-[#06B6D4]/10 backdrop-blur-md rounded-xl text-[#06B6D4] font-mono shadow-[0_0_30px_rgba(6,182,212,0.4)]">
             <div className="flex items-center gap-2 mb-4 border-b border-[#06B6D4]/30 pb-2">
                 <Terminal className="w-4 h-4" />
                 <span className="text-xs tracking-widest font-bold">SYSTEM SCAN</span>
             </div>
             <div className="space-y-2 text-[10px]">
                <div className="flex justify-between"><span>TARGET:</span> <span className="text-white">EPIC GAMES</span></div>
                <div className="flex justify-between"><span>STATUS:</span> <span className="text-[#22C55E] animate-pulse">DETECTING...</span></div>
                <div className="w-full h-1 bg-[#06B6D4]/20 mt-2"><div className="h-full bg-[#06B6D4] w-2/3"></div></div>
             </div>
          </div>
        </Html>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5} position={[4, 1.5, -3]}>
        <Html transform wrapperClass="pointer-events-none select-none" distanceFactor={9}>
          <div className="w-56 p-4 border border-[#8B5CF6]/50 bg-[#8B5CF6]/10 backdrop-blur-md rounded-xl text-[#8B5CF6] font-mono shadow-[0_0_30px_rgba(139,92,246,0.4)]">
             <Activity className="w-8 h-8 mb-4 animate-pulse drop-shadow-[0_0_10px_#8B5CF6]" />
             <div className="text-xs font-bold tracking-widest mb-1 text-white">LIVE INTEL</div>
             <div className="text-[10px] opacity-70">Detecting price anomalies across 15+ storefronts.</div>
          </div>
        </Html>
      </Float>
    </>
  );
}

// --- Main Hero Component ---

export function HeroSection({ onExploreClick, onTrendingClick, onFreeGamesClick }: { onExploreClick?: () => void, onTrendingClick?: () => void, onFreeGamesClick?: () => void }) {
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#02040A] border border-[#06B6D4]/30 mb-12 h-[600px] sm:h-[700px] shadow-[0_0_60px_rgba(6,182,212,0.15)] group cursor-crosshair">
      
      {/* 3D WebGL Canvas */}
      {mounted && (
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas gl={{ antialias: false, powerPreference: "high-performance" }}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
          <color attach="background" args={["#02040A"]} />
          <fog attach="fog" args={["#02040A", 5, 30]} />
          
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#8B5CF6" />
          <pointLight position={[0, 2, 0]} intensity={5} color="#06B6D4" distance={20} />

          <Suspense fallback={null}>
             <CyberGrid />
             <CyberCity />
             <Particles />
             <HologramCards />
             <CameraRig />
             
             {/* Post Processing */}
             <EffectComposer>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.2} />
                <ChromaticAberration 
                   offset={new THREE.Vector2(0.002, 0.002)} 
                   blendFunction={BlendFunction.NORMAL} 
                />
                <Noise opacity={0.03} />
                <Vignette offset={0.1} darkness={1.1} />
             </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      )}

      {/* 2D HTML UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none p-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center text-center w-full"
          >
             {/* Main Title Logo */}
             <div className="relative flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4">
               {/* Neon Bloom Behind Text */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[100px] bg-[#06B6D4]/20 blur-[60px] rounded-full pointer-events-none"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80px] bg-[#8B5CF6]/20 blur-[50px] rounded-full pointer-events-none"></div>
               
               <Zap className="w-12 h-12 md:w-16 md:h-16 text-[#06B6D4] drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse" />
               <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-orbitron font-black text-white tracking-tighter glow-text drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] relative z-10">
                 GamesDealsHub
               </h1>
             </div>
             
             {/* Subtitle */}
             <motion.p 
                initial={{ opacity: 0, letterSpacing: "0px" }}
                animate={{ opacity: 1, letterSpacing: typeof window !== 'undefined' && window.innerWidth > 768 ? "10px" : "4px" }}
                transition={{ delay: 0.8, duration: 1.5 }}
                className="text-[#94A3B8] font-mono text-[10px] sm:text-xs md:text-sm uppercase mb-12 drop-shadow-md text-center max-w-2xl relative z-10"
              >
                Gaming Deal Intelligence Network
              </motion.p>
              
              {/* Feature List */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="flex flex-wrap justify-center gap-3 md:gap-8 text-[9px] md:text-[11px] font-orbitron font-bold text-[#06B6D4] uppercase tracking-widest mb-12 max-w-4xl opacity-90 relative z-10"
              >
                 <span className="drop-shadow-[0_0_5px_#06B6D4] flex items-center gap-2"><ScanLine className="w-3 h-3"/> Track Free Games</span>
                 <span className="hidden sm:inline">•</span>
                 <span className="text-[#8B5CF6] drop-shadow-[0_0_5px_#8B5CF6] flex items-center gap-2"><Activity className="w-3 h-3"/> Real-time Deal Intel</span>
                 <span className="hidden lg:inline">•</span>
                 <span className="text-[#EC4899] drop-shadow-[0_0_5px_#EC4899] flex items-center gap-2"><Terminal className="w-3 h-3"/> PC Optimization</span>
              </motion.div>

              {/* Call to Actions - Pointer events auto allows clicking them in the overlay */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto relative z-10"
              >
                 <button 
                  onClick={onFreeGamesClick}
                  className="relative group overflow-hidden rounded-sm bg-[#02040A]/60 backdrop-blur-md border border-[#06B6D4] px-8 py-4 flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06B6D4]/10 to-[#8B5CF6]/10 group-hover:from-[#06B6D4]/30 group-hover:to-[#8B5CF6]/30 transition-colors duration-300"></div>
                    <Radar className="w-5 h-5 text-[#06B6D4] group-hover:text-white relative z-10 animate-[spin_4s_linear_infinite]" />
                    <span className="font-orbitron font-bold uppercase tracking-[0.2em] text-[#06B6D4] group-hover:text-white relative z-10 text-xs sm:text-sm">
                      Scan Free Games
                    </span>
                 </button>
                 
                 <button 
                  onClick={onTrendingClick}
                  className="px-6 py-4 rounded-sm border border-transparent hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-[#94A3B8] hover:text-white font-orbitron font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all"
                 >
                   View Upcoming Drops
                 </button>
              </motion.div>

          </motion.div>
      </div>

    </div>
  );
}


