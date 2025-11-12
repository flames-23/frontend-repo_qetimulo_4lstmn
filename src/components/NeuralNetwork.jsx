import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function NetworkPoints({ count = 65, color = '#2C5F4D' }) {
  const pointsRef = useRef()
  const linesRef = useRef()

  const { positions, connections } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const nodes = []
    for (let i = 0; i < count; i++) {
      const r = 2.2
      const x = (Math.random() - 0.5) * r
      const y = (Math.random() - 0.5) * r
      const z = (Math.random() - 0.5) * r
      positions.set([x, y, z], i * 3)
      nodes.push(new THREE.Vector3(x, y, z))
    }
    const conn = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.0 && Math.random() > 0.6) {
          conn.push([i, j])
        }
      }
    }
    return { positions, connections: conn }
  }, [count])

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const verts = []
    connections.forEach(([i, j]) => {
      verts.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      verts.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
    })
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return geometry
  }, [positions, connections])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const rotSpeed = (Math.PI * 2) / 30
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * rotSpeed * 0.2
      pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.05
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * rotSpeed * 0.2
      linesRef.current.rotation.x = Math.sin(t * 0.05) * 0.05
    }
  })

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial attach="material" color={color} transparent opacity={0.4} />
      </lineSegments>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
        <PointMaterial transparent color={color} size={0.02} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  )
}

function Scene() {
  const group = useRef()

  useFrame(({ mouse }) => {
    if (!group.current) return
    group.current.rotation.y = mouse.x * 0.3
    group.current.rotation.x = -mouse.y * 0.15
  })

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      <fog attach="fog" args={["#0a0f0d", 4, 12]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} />
      <NetworkPoints />
    </group>
  )
}

export default function NeuralNetwork() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true }}>
      <Scene />
    </Canvas>
  )
}
