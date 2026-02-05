import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Position } from '../hooks/useSnakeGame'

// useMemo is used in IdleAnimation

interface GameScreenProps {
  snake: Position[]
  food: Position
  isPlaying: boolean
  gameOver: boolean
}

const GRID_SIZE = 15
const SCREEN_WIDTH = 1.4
const SCREEN_HEIGHT = 1.2
const CELL_SIZE = SCREEN_WIDTH / GRID_SIZE

// Pixel colors matching Nokia LCD
const PIXEL_ON = '#84a563'
const PIXEL_DIM = '#5a7148'

function SnakeSegment({ position, isHead }: { position: Position; isHead: boolean }) {
  const x = (position.x - GRID_SIZE / 2 + 0.5) * CELL_SIZE
  const y = -(position.y - GRID_SIZE / 2 + 0.5) * CELL_SIZE * (SCREEN_HEIGHT / SCREEN_WIDTH)

  return (
    <mesh position={[x, y, 0.01]}>
      <boxGeometry args={[CELL_SIZE * 0.85, CELL_SIZE * 0.85, 0.02]} />
      <meshBasicMaterial
        color={isHead ? PIXEL_ON : PIXEL_DIM}
        transparent
        opacity={isHead ? 1 : 0.9}
      />
    </mesh>
  )
}

function Food({ position }: { position: Position }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 6) * 0.15 + 0.85
      meshRef.current.scale.setScalar(pulse)
    }
  })

  const x = (position.x - GRID_SIZE / 2 + 0.5) * CELL_SIZE
  const y = -(position.y - GRID_SIZE / 2 + 0.5) * CELL_SIZE * (SCREEN_HEIGHT / SCREEN_WIDTH)

  return (
    <mesh ref={meshRef} position={[x, y, 0.01]}>
      <boxGeometry args={[CELL_SIZE * 0.7, CELL_SIZE * 0.7, 0.02]} />
      <meshBasicMaterial color={PIXEL_ON} />
    </mesh>
  )
}

function GridBorder() {
  const hw = SCREEN_WIDTH / 2
  const hh = SCREEN_HEIGHT / 2

  // Draw border using thin box meshes instead of lines for better visibility
  const thickness = 0.015

  return (
    <group>
      {/* Top border */}
      <mesh position={[0, hh, 0]}>
        <boxGeometry args={[SCREEN_WIDTH + thickness * 2, thickness, 0.01]} />
        <meshBasicMaterial color={PIXEL_ON} />
      </mesh>
      {/* Bottom border */}
      <mesh position={[0, -hh, 0]}>
        <boxGeometry args={[SCREEN_WIDTH + thickness * 2, thickness, 0.01]} />
        <meshBasicMaterial color={PIXEL_ON} />
      </mesh>
      {/* Left border */}
      <mesh position={[-hw, 0, 0]}>
        <boxGeometry args={[thickness, SCREEN_HEIGHT + thickness * 2, 0.01]} />
        <meshBasicMaterial color={PIXEL_ON} />
      </mesh>
      {/* Right border */}
      <mesh position={[hw, 0, 0]}>
        <boxGeometry args={[thickness, SCREEN_HEIGHT + thickness * 2, 0.01]} />
        <meshBasicMaterial color={PIXEL_ON} />
      </mesh>
    </group>
  )
}

function IdleAnimation() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh
        const wave = Math.sin(t * 2 + i * 0.3) * 0.5 + 0.5
        mesh.scale.setScalar(wave)
      })
    }
  })

  const snakePattern = useMemo(() => {
    const positions: Position[] = []
    // Create a decorative snake shape
    for (let i = 0; i < 8; i++) {
      positions.push({
        x: 4 + i,
        y: 7 + Math.round(Math.sin(i * 0.8) * 2)
      })
    }
    return positions
  }, [])

  return (
    <group ref={groupRef}>
      {snakePattern.map((pos, i) => {
        const x = (pos.x - GRID_SIZE / 2 + 0.5) * CELL_SIZE
        const y = -(pos.y - GRID_SIZE / 2 + 0.5) * CELL_SIZE * (SCREEN_HEIGHT / SCREEN_WIDTH)
        return (
          <mesh key={i} position={[x, y, 0.01]}>
            <boxGeometry args={[CELL_SIZE * 0.8, CELL_SIZE * 0.8, 0.02]} />
            <meshBasicMaterial color={PIXEL_DIM} transparent opacity={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

function GameOverDisplay() {
  const textRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (textRef.current) {
      const flash = Math.sin(state.clock.elapsedTime * 4) > 0
      textRef.current.visible = flash
    }
  })

  // Create a simple "X" pattern for game over
  const xPattern: Position[] = [
    { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 9 },
    { x: 9, y: 5 }, { x: 8, y: 6 }, { x: 6, y: 8 }, { x: 5, y: 9 },
  ]

  return (
    <group ref={textRef}>
      {xPattern.map((pos, i) => {
        const x = (pos.x - GRID_SIZE / 2 + 0.5) * CELL_SIZE
        const y = -(pos.y - GRID_SIZE / 2 + 0.5) * CELL_SIZE * (SCREEN_HEIGHT / SCREEN_WIDTH)
        return (
          <mesh key={i} position={[x, y, 0.02]}>
            <boxGeometry args={[CELL_SIZE * 0.9, CELL_SIZE * 0.9, 0.02]} />
            <meshBasicMaterial color={PIXEL_ON} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function GameScreen({ snake, food, isPlaying, gameOver }: GameScreenProps) {
  return (
    <group>
      <GridBorder />

      {!isPlaying && !gameOver && <IdleAnimation />}

      {(isPlaying || gameOver) && (
        <>
          {snake.map((segment, index) => (
            <SnakeSegment
              key={index}
              position={segment}
              isHead={index === 0}
            />
          ))}
          <Food position={food} />
        </>
      )}

      {gameOver && <GameOverDisplay />}
    </group>
  )
}
