import { useRef, ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox, Text } from '@react-three/drei'

interface NokiaPhoneProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  children?: ReactNode
}

export default function NokiaPhone({ position = [0, 0, 0], rotation = [0, 0, 0], children }: NokiaPhoneProps) {
  const phoneRef = useRef<THREE.Group>(null!)

  return (
    <group ref={phoneRef} position={position} rotation={rotation}>
      {/* Phone body - main frame */}
      <RoundedBox
        args={[2.2, 3.6, 0.5]}
        radius={0.15}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#1e2952"
          roughness={0.6}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Phone body - front face plate */}
      <RoundedBox
        args={[2.0, 3.4, 0.1]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0.25]}
      >
        <meshStandardMaterial
          color="#232f5c"
          roughness={0.5}
          metalness={0.15}
        />
      </RoundedBox>

      {/* Screen bezel */}
      <RoundedBox
        args={[1.7, 1.5, 0.05]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.7, 0.32]}
      >
        <meshStandardMaterial
          color="#141d3d"
          roughness={0.4}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Screen (LCD background) */}
      <mesh position={[0, 0.7, 0.35]}>
        <planeGeometry args={[1.5, 1.3]} />
        <meshBasicMaterial color="#43523d" />
      </mesh>

      {/* Game screen content rendered here */}
      <group position={[0, 0.7, 0.36]}>
        {children}
      </group>

      {/* Nokia logo */}
      <Text
        position={[0, 1.55, 0.31]}
        fontSize={0.15}
        color="#8a9bc2"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJU.woff"
      >
        NOKIA
      </Text>

      {/* Earpiece */}
      <RoundedBox
        args={[0.6, 0.12, 0.05]}
        radius={0.03}
        smoothness={4}
        position={[0, 1.65, 0.28]}
      >
        <meshStandardMaterial
          color="#0d1225"
          roughness={0.3}
          metalness={0.4}
        />
      </RoundedBox>

      {/* D-pad area */}
      <mesh position={[0, -0.4, 0.31]}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
        <meshStandardMaterial
          color="#141d3d"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* D-pad center button */}
      <mesh position={[0, -0.4, 0.36]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial
          color="#1e2952"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Menu buttons row */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <RoundedBox
          key={i}
          args={[0.35, 0.15, 0.05]}
          radius={0.03}
          smoothness={4}
          position={[x, -0.85, 0.31]}
        >
          <meshStandardMaterial
            color="#141d3d"
            roughness={0.4}
            metalness={0.3}
          />
        </RoundedBox>
      ))}

      {/* Number pad */}
      {[0, 1, 2, 3].map((row) =>
        [-0.45, 0, 0.45].map((x, col) => (
          <RoundedBox
            key={`${row}-${col}`}
            args={[0.35, 0.22, 0.05]}
            radius={0.03}
            smoothness={4}
            position={[x, -1.15 - row * 0.28, 0.31]}
          >
            <meshStandardMaterial
              color="#141d3d"
              roughness={0.4}
              metalness={0.3}
            />
          </RoundedBox>
        ))
      )}

      {/* Subtle edge lighting */}
      <pointLight
        position={[0, 0.7, 1]}
        intensity={0.3}
        color="#84a563"
        distance={3}
      />
    </group>
  )
}
