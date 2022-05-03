class GameLife {
    xCells;
    yCells;
    ctx;
    closed = true;
    cells;
    paused;

    constructor(canvas, xCells, yCells, closed = false) {
        this.xCells = xCells;
        this.yCells = yCells;
        this.closed = closed;
        this.ctx = canvas.getContext('2d');
        this.cells = [];
        this.paused = true;
        for (let i = 0; i < xCells; i++) {
            this.cells[i] = Array(yCells).fill(0);
        }

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let cellWidth = this.ctx.canvas.clientWidth / this.xCells;
            let cellHeight = this.ctx.canvas.clientHeight / this.yCells;
            let i = Math.floor(x / cellWidth);
            let j = Math.floor(y / cellHeight);
            this.cells[i][j] = (this.cells[i][j] ? 0 : 1);
            this.draw();
        }, false);

        this.draw();
    }

    draw() {
        let cellWidth = this.ctx.canvas.clientWidth / this.xCells;
        let cellHeight = this.ctx.canvas.clientHeight / this.yCells;

        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                this.ctx.fillStyle = this.cells[i][j] ? 'black' : ((i + j) % 2 ? 'white' : 'lightgrey');
                this.ctx.fillRect(cellWidth * i, cellHeight * j, cellWidth, cellHeight);
            }
        }
    }

    move()
    {
        let newCells = [];
        for (let i = 0; i < this.xCells; i++) {
            newCells[i] = Array(this.yCells).fill(0);
        }

        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                newCells[i][j] = this.cells[i][j];
                let neighborLiveCount =
                    this.getCell(i-1,j-1) +
                    this.getCell(i-1,j) +
                    this.getCell(i-1,j+1) +
                    this.getCell(i,j-1) +
                    this.getCell(i,j+1) +
                    this.getCell(i+1,j-1) +
                    this.getCell(i+1,j) +
                    this.getCell(i+1,j+1);

                if (this.getCell(i, j) && (neighborLiveCount > 3 || neighborLiveCount < 2)) {
                    newCells[i][j] = 0;
                } else if(!this.getCell(i, j) && neighborLiveCount === 3) {
                    newCells[i][j] = 1;
                }
            }
        }
        this.cells = newCells;
    }

    start() {
        this.paused = false;
    }

    pause() {
        this.paused = true;
    }

    run()
    {
        setInterval(() => {
            if (!this.paused) {
                this.move();
                this.draw();
            }
        }, 100)
    }

    getCell(x, y) {
        if (this.closed) {
            x = (x + this.xCells) % this.xCells;
            y = (y + this.yCells) % this.yCells;
            return this.cells[x][y];
        } else {
            if (x >= 0 && x < this.xCells && y >= 0 && y < this.yCells) {
                return this.cells[x][y];
            }
            return 0;
        }
    }
}
