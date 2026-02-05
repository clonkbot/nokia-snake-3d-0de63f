import { useState, useCallback, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, ContactShadows, Text } from '@react-three/drei'
import NokiaPhone from './components/NokiaPhone'
import GameScreen from './components/GameScreen'
import { useSnakeGame } from './hooks/useSnakeGame'

function App() {
  const {
    snake,
    food,
    score,
    gameOver,
    isPlaying,
    direction,
    setDirection,
    startGame,
    resetGame,
    highScore
  } = useSnakeGame()

  const [showInstructions, setShowInstructions] = useState(true)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying && !gameOver && (e.key === ' ' || e.key === 'Enter')) {
      startGame()
      setShowInstructions(false)
    }
    if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
      resetGame()
    }
    if (isPlaying) {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
      }
    }
  }, [isPlaying, gameOver, direction, setDirection, startGame, resetGame])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="w-screen h-screen bg-[#0a0a0c] overflow-hidden relative">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1
          className="text-3xl md:text-5xl tracking-[0.3em] text-[#84a563] font-bold"
          style={{
            fontFamily: 'VT323, monospace',
            textShadow: '0 0 20px rgba(132, 165, 99, 0.6), 0 0 40px rgba(132, 165, 99, 0.3)'
          }}
        >
          SNAKE
        </h1>
        <p
          className="text-xs md:text-sm tracking-[0.5em] text-[#43523d] mt-1"
          style={{ fontFamily: 'VT323, monospace' }}
        >
          NOKIA 3310
        </p>
      </div>

      {/* Score display */}
      <div className="absolute top-6 right-6 z-20 text-right">
        <p
          className="text-xs tracking-[0.2em] text-[#43523d]"
          style={{ fontFamily: 'VT323, monospace' }}
        >
          SCORE
        </p>
        <p
          className="text-2xl md:text-4xl text-[#84a563]"
          style={{
            fontFamily: 'VT323, monospace',
            textShadow: '0 0 10px rgba(132, 165, 99, 0.5)'
          }}
        >
          {String(score).padStart(4, '0')}
        </p>
        <p
          className="text-xs tracking-[0.2em] text-[#43523d] mt-2"
          style={{ fontFamily: 'VT323, monospace' }}
        >
          HIGH
        </p>
        <p
          className="text-lg md:text-xl text-[#5a6b4a]"
          style={{ fontFamily: 'VT323, monospace' }}
        >
          {String(highScore).padStart(4, '0')}
        </p>
      </div>

      {/* Instructions / Game Over overlay */}
      {(showInstructions || gameOver) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div
            className="text-center p-6 md:p-10 border-2 border-[#43523d] bg-[#0a0a0c]/90 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 30px rgba(67, 82, 61, 0.3), inset 0 0 30px rgba(67, 82, 61, 0.1)'
            }}
          >
            {gameOver ? (
              <>
                <h2
                  className="text-3xl md:text-5xl text-[#84a563] mb-4"
                  style={{
                    fontFamily: 'VT323, monospace',
                    textShadow: '0 0 20px rgba(132, 165, 99, 0.6)'
                  }}
                >
                  GAME OVER
                </h2>
                <p
                  className="text-xl md:text-2xl text-[#5a6b4a] mb-6"
                  style={{ fontFamily: 'VT323, monospace' }}
                >
                  FINAL SCORE: {score}
                </p>
              </>
            ) : (
              <>
                <h2
                  className="text-2xl md:text-4xl text-[#84a563] mb-4"
                  style={{
                    fontFamily: 'VT323, monospace',
                    textShadow: '0 0 20px rgba(132, 165, 99, 0.6)'
                  }}
                >
                  HOW TO PLAY
                </h2>
                <div
                  className="text-base md:text-lg text-[#5a6b4a] mb-6 space-y-2"
                  style={{ fontFamily: 'VT323, monospace' }}
                >
                  <p>ARROW KEYS / WASD TO MOVE</p>
                  <p>EAT FOOD TO GROW</p>
                  <p>DON'T HIT THE WALLS</p>
                  <p>DON'T EAT YOURSELF</p>
                </div>
              </>
            )}
            <button
              onClick={() => {
                if (gameOver) {
                  resetGame()
                } else {
                  startGame()
                  setShowInstructions(false)
                }
              }}
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-[#84a563] text-[#84a563]
                         hover:bg-[#84a563] hover:text-[#0a0a0c] transition-all duration-200
                         text-lg md:text-xl tracking-wider min-w-[200px] min-h-[52px]"
              style={{
                fontFamily: 'VT323, monospace',
                boxShadow: '0 0 20px rgba(132, 165, 99, 0.3)'
              }}
            >
              {gameOver ? 'PLAY AGAIN' : 'START GAME'}
            </button>
            <p
              className="text-xs md:text-sm text-[#43523d] mt-4"
              style={{ fontFamily: 'VT323, monospace' }}
            >
              OR PRESS SPACE / ENTER
            </p>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button
            onTouchStart={() => direction !== 'DOWN' && setDirection('UP')}
            className="w-14 h-14 border-2 border-[#43523d] text-[#84a563] flex items-center justify-center active:bg-[#84a563]/20"
            style={{ fontFamily: 'VT323, monospace' }}
          >
            ▲
          </button>
          <div />
          <button
            onTouchStart={() => direction !== 'RIGHT' && setDirection('LEFT')}
            className="w-14 h-14 border-2 border-[#43523d] text-[#84a563] flex items-center justify-center active:bg-[#84a563]/20"
            style={{ fontFamily: 'VT323, monospace' }}
          >
            ◄
          </button>
          <button
            onTouchStart={() => direction !== 'UP' && setDirection('DOWN')}
            className="w-14 h-14 border-2 border-[#43523d] text-[#84a563] flex items-center justify-center active:bg-[#84a563]/20"
            style={{ fontFamily: 'VT323, monospace' }}
          >
            ▼
          </button>
          <button
            onTouchStart={() => direction !== 'LEFT' && setDirection('RIGHT')}
            className="w-14 h-14 border-2 border-[#43523d] text-[#84a563] flex items-center justify-center active:bg-[#84a563]/20"
            style={{ fontFamily: 'VT323, monospace' }}
          >
            ►
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0c']} />

        {/* Atmospheric lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-3, 2, 3]} intensity={0.5} color="#84a563" />
        <pointLight position={[3, -2, 3]} intensity={0.3} color="#3d5a52" />

        <Float
          speed={2}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <NokiaPhone position={[0, 0, 0]} rotation={[0.1, -0.2, 0]}>
            <GameScreen
              snake={snake}
              food={food}
              isPlaying={isPlaying}
              gameOver={gameOver}
            />
          </NokiaPhone>
        </Float>

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
          color="#84a563"
        />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          autoRotate={!isPlaying && !gameOver}
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />

        <Environment preset="night" />
      </Canvas>

      {/* Footer */}
      <footer
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-center"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        <p className="text-[10px] md:text-xs text-[#43523d]/60 tracking-wider">
          Requested by <span className="text-[#5a6b4a]/70">@RasmusLearns</span> · Built by <span className="text-[#5a6b4a]/70">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}

export default App
