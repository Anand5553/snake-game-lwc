import { LightningElement } from 'lwc';

export default class SnakeGame extends LightningElement {
    board;
    gridSize = 17;
    interval;
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 }; // Snake moves right initially
    food = {};
    score = 0;
    gameOver = false;
    gameStarted = false;

    connectedCallback() {
        window.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    renderedCallback() {
        if (!this.gameStarted) {
            this.board = this.template.querySelector('.board');
            if (!this.board) return;

            this.initBoard();
            this.spawnFood();
            this.interval = setInterval(() => this.gameLoop(), 200);
            this.gameStarted = true;
        }
    }

    initBoard() {
        this.board.style.display = 'grid';
        this.board.style.gridTemplateColumns = `repeat(${this.gridSize}, 20px)`;
        this.board.style.gridTemplateRows = `repeat(${this.gridSize}, 20px)`;
        this.board.style.gap = '1px';
    }

    handleKeyPress(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    if (!this.gameStarted) {
        this.gameStarted = true;
        this.direction = { x: 1, y: 0 };
        this.interval = setInterval(() => this.gameLoop(), 200);
    }

    switch (e.key) {
        case 'ArrowUp':
            if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
            break;
    }
}


    gameLoop() {
        if (this.gameOver) return;

        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        if (this.isCollision(head)) {
            clearInterval(this.interval);
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.updateGameBoard();

    }

    isCollision(cell) {
        if (
            cell.x < 0 || cell.x >= this.gridSize ||
            cell.y < 0 || cell.y >= this.gridSize
        ) return true;

        return this.snake.some(segment => segment.x === cell.x && segment.y === cell.y);
    }

    spawnFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(s => s.x === newFood.x && s.y === newFood.y));

        this.food = newFood;
    }

   updateGameBoard() {
    if (!this.board) return;

    this.board.innerHTML = '';

    for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
            const cell = document.createElement('div');

            if (this.snake.some(s => s.x === x && s.y === y)) {
                cell.classList.add('snake');
            } else if (this.food.x === x && this.food.y === y) {
                cell.classList.add('food');
            }

            this.board.appendChild(cell);
        }
    }
}

restartGame() {
    clearInterval(this.interval);

    this.snake = [{ x: 10, y: 10 }];
    this.direction = { x: 1, y: 0 };
    this.food = {};
    this.score = 0;
    this.gameOver = false;

    // Recreate the board and start the game
    this.spawnFood();
    this.updateGameBoard();

    this.interval = setInterval(() => this.gameLoop(), 200);
}


}
