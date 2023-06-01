import React, { useState, useEffect } from 'react';

const ROWS = 20;
const COLS = 20;
const INITIAL_SPEED = 200;

const generateFood = () => {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    return { x, y };
};

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState(generateFood());
    const [direction, setDirection] = useState('RIGHT');
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const interval = setInterval(moveSnake, speed);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [snake, direction, speed]);

    const handleKeyDown = (e) => {
        e.preventDefault();
        const newDirection = e.key.replace('Arrow', '').toUpperCase();
        const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
        if (newDirection !== opposites[direction]) {
            setDirection(newDirection);
        }
    };

    const moveSnake = () => {
        const { x, y } = snake[0];
        let newHead;
        switch (direction) {
            case 'UP':
                newHead = { x, y: y - 1 };
                break;
            case 'DOWN':
                newHead = { x, y: y + 1 };
                break;
            case 'LEFT':
                newHead = { x: x - 1, y };
                break;
            case 'RIGHT':
                newHead = { x: x + 1, y };
                break;
            default:
                break;
        }

        if (isCollision(newHead) || isOutOfBounds(newHead)) {
            setGameOver(true);
            return;
        }

        const newSnake = [newHead, ...snake];
        if (newHead.x === food.x && newHead.y === food.y) {
            setFood(generateFood());
            setScore(score + 1);
            if (speed > 50) {
                setSpeed(speed - 10);
            }
        } else {
            newSnake.pop();
        }
        setSnake(newSnake);
    };

    const isCollision = (head) => {
        return snake.some((segment) => segment.x === head.x && segment.y === head.y);
    };

    const isOutOfBounds = (head) => {
        return head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    };

    const handleRestart = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection('RIGHT');
        setSpeed(INITIAL_SPEED);
        setScore(0);
        setGameOver(false);
    };

    const renderGrid = () => {
        const grid = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const isSnakeSegment = snake.some((segment) => segment.x === col && segment.y === row);
                const isFood = food.x === col && food.y === row;
                const cellClass = isSnakeSegment ? 'snake' : isFood ? 'food' : '';
                grid.push(
                    <div key={`${col}-${row}`} className={`cell ${cellClass}`} />
                );
            }
        }
        return grid;
    };

    return (
        <div className="snake-game">
            <div className="grid">{renderGrid()}</div>
            {gameOver && (
                <div className="game-over">
                    <p>Game Over</p>
                    <button onClick={handleRestart}>Restart</button>
                </div>
            )}
            <div className="score">Score: {score}</div>
        </div>
    );
};

export default SnakeGame;