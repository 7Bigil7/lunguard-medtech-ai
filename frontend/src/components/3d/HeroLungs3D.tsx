import React, { useRef, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import * as THREE from 'three'

// Preload the real human lung GLB asset
useGLTF.preload('/models/lung.glb')

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

// --- Dynamic Laser Scanning Ring that sweeps the lungs ---

function ScanningLaserRing({ boundsHeight = 3.8 }: { boundsHeight?: number }) {
  const ringRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const t = clock.getElapsedTime() * 1.25
    // Scan up and down smoothly through the vertical bounds of the lungs
    const scanY = Math.sin(t) * (boundsHeight * 0.48)
    ringRef.current.position.y = scanY

    if (lightRef.current) {
      lightRef.current.intensity = 2.4 + Math.sin(t * 4) * 0.5
    }
  })

  return (
    <group ref={ringRef} position={[0, 0, 0]}>
      {/* Outer Luminous Scanner Torus Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.024, 16, 64]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#06b6d4"
          emissiveIntensity={2.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Holographic Laser Slice Plane */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.98, 1.98, 0.015, 48]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Scanning Target Reticles on Ring Edges */}
      <mesh position={[2.0, 0, 0]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-2.0, 0, 0]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Moving Point Light Casting Laser Glow onto Real Lung Surfaces */}
      <pointLight
        ref={lightRef}
        color="#22d3ee"
        distance={4.2}
        intensity={2.4}
        decay={2}
      />
    </group>
  )
}

// --- Real Anatomical Human Lungs Model Loaded from GLB ---

function RealHumanLungsModel({ mouseFollow = true }: { mouseFollow?: boolean }) {
  const rootGroup = useRef<THREE.Group>(null)
  const lungsPivotRef = useRef<THREE.Group>(null)

  // Load the genuine GLTF binary asset
  const { scene } = useGLTF('/models/lung.glb')

  // Clone and configure materials for photorealistic anatomical rendering
  const { modelScene, autoScale, autoOffset } = useMemo(() => {
    const cloned = scene.clone(true)

    // Compute bounding box to normalize scale and center position
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // Normalize height to approx 3.4 units to fit viewport perfectly
    const targetHeight = 3.4
    const scaleFactor = targetHeight / (size.y || 1)

    // Center offset
    const offset = new THREE.Vector3(
      -center.x * scaleFactor,
      -center.y * scaleFactor + 0.1,
      -center.z * scaleFactor
    )

    // Enhance real lung textures and materials with realistic medical subsurface look
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true

        if (mesh.material) {
          const enhanceMaterial = (mat: THREE.Material) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = 0.38
              mat.metalness = 0.08
              // Add subtle biological emissive rim to bring out lobar fissures
              mat.emissive = new THREE.Color('#0284c7')
              mat.emissiveIntensity = 0.12
            }
          }

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(enhanceMaterial)
          } else {
            enhanceMaterial(mesh.material)
          }
        }
      }
    })

    return {
      modelScene: cloned,
      autoScale: scaleFactor,
      autoOffset: offset,
    }
  }, [scene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // 1. Mouse Tracking Gyroscopic Tilt (Smooth damped lerp)
    if (rootGroup.current && mouseFollow) {
      const targetRotationY = state.pointer.x * 0.45
      const targetRotationX = -state.pointer.y * 0.3

      rootGroup.current.rotation.y = THREE.MathUtils.lerp(
        rootGroup.current.rotation.y,
        targetRotationY,
        0.06
      )
      rootGroup.current.rotation.x = THREE.MathUtils.lerp(
        rootGroup.current.rotation.x,
        targetRotationX,
        0.06
      )
    }

    // 2. Realistic Respiratory Breathing Expansion (16 breaths/min biological rhythm)
    const breathCycle = Math.sin(t * 1.5) * 0.032
    if (lungsPivotRef.current) {
      lungsPivotRef.current.scale.set(
        autoScale * (1 + breathCycle * 1.05),
        autoScale * (1 + breathCycle * 0.95),
        autoScale * (1 + breathCycle * 1.1)
      )
    }
  })

  return (
    <group ref={rootGroup} position={[0, -0.05, 0]}>
      {/* Real Anatomical Human Lung Mesh Group with Breathing Scale */}
      <group
        ref={lungsPivotRef}
        position={[autoOffset.x, autoOffset.y, autoOffset.z]}
        scale={autoScale}
      >
        <primitive object={modelScene} />
      </group>

      {/* Dynamic Laser Scanning Ring sweeping vertically across real lungs */}
      <ScanningLaserRing boundsHeight={3.4} />
    </group>
  )
}

// --- Loading HUD Fallback while 17MB model loads ---

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/20 backdrop-blur-md rounded-3xl p-6 text-center space-y-3">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 animate-pulse flex items-center justify-center text-cyan-400">
          <span className="text-3xl">🫁</span>
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-mono font-bold text-slate-800 tracking-wider uppercase">
          Loading Real Anatomical Lungs (3D Model)...
        </p>
        <p className="text-[11px] font-mono text-slate-500">
          Parsing Human Respiratory Lobes & Vasculature
        </p>
      </div>
    </div>
  )
}

// --- Main Exported Component ---

interface HeroLungs3DProps {
  className?: string
  interactive?: boolean
}

export const HeroLungs3D: React.FC<HeroLungs3DProps> = ({
  className = '',
  interactive = true,
}) => {
  const [hasWebGL] = useState<boolean>(() => checkWebGLSupport())

  if (!hasWebGL) {
    return (
      <div className={`relative flex items-center justify-center bg-slate-900/40 rounded-3xl p-8 border border-cyan-500/20 ${className}`}>
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <span className="text-2xl font-bold">🫁</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">Interactive 3D Pulmonary Engine</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-[460px] sm:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden select-none ${className}`}>
      {/* Soft Clinical Glass Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-teal-500/5 to-transparent rounded-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Canvas with Real Human Lungs Model */}
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0.15, 5.0], fov: 42 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Photorealistic Clinical Daylight Lighting */}
          <ambientLight intensity={1.1} color="#f0fdfa" />
          <directionalLight
            position={[5, 6, 4]}
            intensity={2.0}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, 4, -2]}
            intensity={1.4}
            color="#38bdf8"
          />
          <pointLight position={[0, -3, 2]} intensity={1.0} color="#14b8a6" />

          {/* Floating Physics & Real Anatomical Lung Model */}
          <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.25}>
            <RealHumanLungsModel mouseFollow={interactive} />
          </Float>
        </Canvas>
      </Suspense>

      {/* Clinical HUD Telemetry Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-900/75 border border-cyan-400/40 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-cyan-300 uppercase">
            REAL HUMAN LUNGS 3D SCANNER ACTIVE
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-300 pl-1 font-medium">
          HUMAN ANATOMY ATLAS • RESPIRATORY FREQ: 16 BPM
        </div>
      </div>

      {/* Corner HUD Telemetry */}
      <div className="absolute top-4 right-4 pointer-events-none font-mono text-[10px] text-cyan-300 bg-slate-900/60 px-2.5 py-1 rounded-md border border-cyan-500/30 backdrop-blur-sm">
        VOLUMETRIC SLICE: REALTIME
      </div>
      <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[10px] text-slate-300 bg-slate-900/70 px-2.5 py-1 rounded-md border border-slate-700/60 backdrop-blur-sm">
        <span className="text-cyan-300 font-bold">Interactive:</span> Move mouse to rotate & inspect lung anatomy
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none flex items-center space-x-1.5 text-[10px] font-mono text-cyan-300 bg-cyan-950/70 px-2.5 py-1 rounded-md border border-cyan-500/40 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>CONFORMAL TRIAGE ENGINE</span>
      </div>
    </div>
  )
}
