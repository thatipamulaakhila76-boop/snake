import { useEffect, useRef, useState, useCallback } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);
  const hasStartedRef = useRef(hasStarted);

  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { hasStartedRef.current = hasStarted; }, [hasStarted]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
    if (onScoreChange) onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStartedRef.current && !gameOverRef.current) {
        setIsPaused(p => !p);
        return;
      }

      if (isPausedRef.current || gameOverRef.current || !hasStartedRef.current) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const currentDir = directionRef.current;

      head.x += currentDir.x;
      head.y += currentDir.y;

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      currentSnake.unshift(head);

      // Food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const newScore = score + 10;
        setScore(newScore);
        if (onScoreChange) onScoreChange(newScore);
        setFood(generateFood(currentSnake));
      } else {
        currentSnake.pop();
      }

      setSnake(currentSnake);
    };

    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, hasStarted, score, generateFood, onScoreChange]);

  return (
    <div className="flex flex-col items-center w-full h-full justify-center">
      <div className="bg-[#020202] rounded-2xl border border-[#1a1a1a] relative overflow-hidden shadow-2xl flex items-center justify-center p-8 w-full max-w-2xl min-h-[500px]">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute inset-0 border-[20px] border-transparent shadow-[inset_0_0_60px_rgba(0,243,255,0.05)] pointer-events-none z-20"></div>

        <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
          <div className="w-2 h-2 rounded-full bg-[#ff00ff] animate-pulse shadow-[0_0_8px_#ff00ff]"></div>
          <span className="text-[10px] font-mono tracking-widest text-[#ff00ff]">SESSION {isPaused ? 'PAUSED' : gameOver ? 'TERMINATED' : 'ACTIVE'} // SCORE: {score}</span>
        </div>
        
        {/* Game Grid */}
        <div 
          className="grid gap-[1px] bg-[#0a0a0a] border border-[#1a1a1a] z-10 opacity-80"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '400px',
            height: '400px'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full rounded-sm transition-all duration-75
                  ${isHead ? 'bg-[#00f3ff] shadow-[0_0_10px_#00f3ff] z-10' : ''}
                  ${isSnake && !isHead ? 'bg-[#00f3ff]/60' : ''}
                  ${isFood ? 'bg-[#ff00ff] shadow-[0_0_15px_#ff00ff] rounded-full animate-pulse' : ''}
                  ${!isSnake && !isFood ? 'bg-[#050505]/40' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-sm z-30 text-center p-6">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
              Neon Snake
            </h3>
            <p className="text-[#aaa] font-mono text-xs mb-8 uppercase tracking-widest">Awaiting Initialization / WASD to move</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-[#00f3ff]/10 text-[#00f3ff] border border-[#00f3ff]/50 hover:bg-[#00f3ff]/20 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] font-mono text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              Start Sequence
            </button>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/60 backdrop-blur-sm z-30">
            <h3 className="text-2xl font-bold text-[#ff00ff] tracking-[0.3em] uppercase animate-pulse">
              System Paused
            </h3>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/90 backdrop-blur-md z-30 text-center p-6 border border-[#ff00ff]/30 shadow-[inset_0_0_50px_rgba(255,0,255,0.1)]">
            <h3 className="text-3xl font-bold text-[#ff00ff] mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.5)] uppercase tracking-[0.2em]">
              System Failure
            </h3>
            <p className="text-[#00f3ff] font-mono text-lg mb-8 tracking-widest">FINAL SCORE // {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-[#ff00ff]/10 text-[#ff00ff] border border-[#ff00ff]/50 hover:bg-[#ff00ff]/20 hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] font-mono text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              Reboot Sequence
            </button>
          </div>
        )}
      </div>

      <div className="w-full mt-6 text-center text-[#444] font-mono text-[10px] tracking-widest uppercase">
        <span>Press [ <span className="text-[#00f3ff]">SPACE</span> ] to pause system</span>
      </div>
    </div>
  );
}
