import { useState, useCallback, useEffect, useRef } from 'react'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type Position = { x: number; y: number }

const GRID_SIZE = 15
const INITIAL_SNAKE: Position[] = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
]
const INITIAL_SPEED = 150

function getRandomFood(snake: Position[]): Position {
  let food: Position
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
  return food
}

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(() => getRandomFood(INITIAL_SNAKE))
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [speed, setSpeed] = useState(INITIAL_SPEED)

  const directionRef = useRef(direction)
  directionRef.current = direction

  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const head = currentSnake[0]
      let newHead: Position

      switch (directionRef.current) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 }
          break
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 }
          break
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y }
          break
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y }
          break
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      const newSnake = [newHead, ...currentSnake]

      // Check food collision
      setFood(currentFood => {
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          setScore(s => {
            const newScore = s + 10
            setHighScore(h => {
              if (newScore > h) {
                localStorage.setItem('snakeHighScore', String(newScore))
                return newScore
              }
              return h
            })
            return newScore
          })
          setSpeed(s => Math.max(50, s - 2))
          return getRandomFood(newSnake)
        }
        newSnake.pop()
        return currentFood
      })

      return newSnake
    })
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(moveSnake, speed)
    return () => clearInterval(interval)
  }, [isPlaying, speed, moveSnake])

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setFood(getRandomFood(INITIAL_SNAKE))
    setDirection('RIGHT')
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setGameOver(false)
    setIsPlaying(true)
  }, [])

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setFood(getRandomFood(INITIAL_SNAKE))
    setDirection('RIGHT')
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setGameOver(false)
    setIsPlaying(true)
  }, [])

  return {
    snake,
    food,
    score,
    highScore,
    gameOver,
    isPlaying,
    direction,
    setDirection,
    startGame,
    resetGame,
    gridSize: GRID_SIZE,
  }
}
