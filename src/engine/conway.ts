// Conway's Game of Life

export type Position2D = {
  x: number;
  y: number;
};

export type ConwayCellType = {
  index: number;
  alive: number;
};

export type ConwayWorldType = ConwayCellType[];

export class ConwayEngine {
  private maxCol: number;
  private maxRow: number;
  private maxCell: number;
  private maxx: number;
  private maxy: number;
  private cellSizeInPx: number;
  private displayWidth: number;
  private displayHeight: number;
  private reciprocalMaxCol: number;
  private nbGenerations: number;
  private nextBoard!: Uint8Array;
  private gameBoard!: Uint8Array;
  private lastBoard!: Uint8Array;
  private nbNeighbors!: Uint8Array;
  private neighborsDeltaIndex!: number[];
  private precalcCellPos!: Position2D[];
  private canvasRef: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private showGridLines: boolean = false;
  private colorCell: string = '#000';
  private colorGrid: string = '#fff';
  private cellAlive: number = 0;

  constructor() {
    this.cellSizeInPx = 0;
    this.displayWidth = 0;
    this.displayHeight = 0;
    this.maxCol = 0;
    this.maxRow = 0;
    this.maxCell = 0;
    this.maxx = 0;
    this.maxy = 0;
    this.reciprocalMaxCol = 0;
    this.nbGenerations = 0;

    this.init();

    this.canvasRef = null;
    this.ctx = null;
  }

  private init() {
    this.maxCol = Math.floor(this.displayWidth / this.cellSizeInPx);
    this.maxRow = Math.floor(this.displayHeight / this.cellSizeInPx);
    this.maxCell = this.maxRow * this.maxCol;
    this.maxx = this.maxCol - 1;
    this.maxy = this.maxRow - 1;

    this.neighborsDeltaIndex = [
      -1, // left
      +1, // right
      -this.maxCol, // Top
      -(this.maxCol + 1), // TopLeft
      -(this.maxCol - 1), // TopRight
      +this.maxCol, // bottom
      +(this.maxCol - 1), // BottomLeft
      +(this.maxCol + 1), // BottomRight
    ];

    this.reciprocalMaxCol = 1 / this.maxCol;

    this.gameBoard = new Uint8Array(this.maxCell);
    this.nextBoard = new Uint8Array(this.maxCell);
    this.lastBoard = new Uint8Array(this.maxCell);
    this.nbNeighbors = new Uint8Array(this.maxCell);
    this.precalcCellPos = new Array();

    this.prepareBufferCellPosFromIndex();

    this.reset();
  }

  private async randomBooleanWeighted(weightInPercent: number): Promise<boolean> {
    if (weightInPercent < 0 || weightInPercent > 100) throw new Error('weightInPercent must be between 0 and 100');

    const weight = weightInPercent / 100;
    return Promise.resolve(Math.random() < weight);
  }

  private prepareBufferCellPosFromIndex() {
    for (let i = 0; i < this.maxCell; i++) {
      const x = Math.floor(i % this.maxCol);
      const y = Math.floor(i * this.reciprocalMaxCol);
      //this.precalcCellPos[i] = { x, y };
      this.precalcCellPos.push({ x, y });
    }
  }

  private updateNeighbors(index: number) {
    const { x, y } = this.precalcCellPos[index];
    if (x > 0) this.nbNeighbors[index + this.neighborsDeltaIndex[0]]++;
    if (x < this.maxx) this.nbNeighbors[index + this.neighborsDeltaIndex[1]]++;
    if (y > 0) this.nbNeighbors[index + this.neighborsDeltaIndex[2]]++;
    if (y > 0 && x > 0) this.nbNeighbors[index + this.neighborsDeltaIndex[3]]++;
    if (y > 0 && x < this.maxx) this.nbNeighbors[index + this.neighborsDeltaIndex[4]]++;
    if (y < this.maxy) this.nbNeighbors[index + this.neighborsDeltaIndex[5]]++;
    if (y < this.maxy && x > 0) this.nbNeighbors[index + this.neighborsDeltaIndex[6]]++;
    if (y < this.maxy && x < this.maxx) this.nbNeighbors[index + this.neighborsDeltaIndex[7]]++;
  }

  private getLivingCells() {
    let livingCells = [];
    for (let i = 0; i < this.maxCell; i++) {
      if (this.gameBoard[i] == 1) {
        livingCells.push(i);
      }
    }
    return livingCells;
  }

  private computeCellsToLive() {
    this.cellAlive = 0;
    for (let i = 0; i < this.maxCell; i++) {
      const isAlive = this.gameBoard[i] == 1;
      const needLive =
        (isAlive && (this.nbNeighbors[i] === 2 || this.nbNeighbors[i] === 3)) ||
        (!isAlive && this.nbNeighbors[i] === 3);
      if (needLive) {
        this.cellAlive++;
      }
      this.nextBoard[i] = needLive ? 1 : 0;
    }
  }

  public genNextStep() {
    // On récupère uniquement les cellules vivantes
    let livingCells = this.getLivingCells();

    // Reset des voisins
    for (let i = 0; i < this.maxCell; i++) {
      this.nbNeighbors[i] = 0;
    }

    // On mets a jour le tableau des voisins
    for (let i = 0; i < livingCells.length; i++) {
      this.updateNeighbors(livingCells[i]);
    }

    // On récupère uniquement les cellules qui doivent vivre
    this.computeCellsToLive();

    // on swap les buffers
    const tempBoard = this.gameBoard;
    this.gameBoard = this.nextBoard;
    this.nextBoard = tempBoard;

    this.nbGenerations++;
  }

  public drawWorld() {
    if (this.canvasRef === null || this.ctx === null) {
      throw new Error('canvasRef or canvas Ctx must not be null');
    }

    this.ctx.save();
    this.ctx.beginPath();

    // Efface le canvas
    this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

    this.ctx.fillStyle = this.colorCell;

    this.cellAlive = 0;
    for (let i = 0; i < this.maxCell; i++) {
      const newValue = this.gameBoard[i];
      if (newValue === 1) {
        this.cellAlive++;
      }
      if (this.lastBoard[i] !== newValue) {
        if (newValue === 1) {
          const { x, y } = this.precalcCellPos[i];
          this.ctx.fillRect(x * this.cellSizeInPx, y * this.cellSizeInPx, this.cellSizeInPx, this.cellSizeInPx);
        }
      }
    }

    // Dessine les lignes
    if (this.showGridLines) {
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = this.colorGrid;
      for (let i = 0; i <= this.maxCol; i++) {
        this.ctx.moveTo(i * this.cellSizeInPx, 0);
        this.ctx.lineTo(i * this.cellSizeInPx, this.displayHeight);
      }
      for (let i = 0; i <= this.maxRow; i++) {
        this.ctx.moveTo(0, i * this.cellSizeInPx);
        this.ctx.lineTo(this.displayWidth, i * this.cellSizeInPx);
      }
      this.ctx.stroke();
    }

    this.ctx.restore();

    this.lastBoard = this.gameBoard.slice(0);
  }

  private setDimension(width: number, height: number) {
    if (width === null || width === undefined || width <= 0) {
      throw new Error('width must be greater than 0');
    }
    if (height === null || height === undefined || height <= 0) {
      throw new Error('height must be greater than 0');
    }
    this.displayWidth = width;
    this.displayHeight = height;
  }

  private setCellSize(cellSizeInPx: number) {
    if (cellSizeInPx === null || cellSizeInPx === undefined || cellSizeInPx <= 1) {
      throw new Error('cellSizeInPx must be greater than 1');
    }
    this.cellSizeInPx = cellSizeInPx;
  }

  public setCanvasRef(ref: HTMLCanvasElement) {
    if (ref === null) {
      throw new Error('canvasRef must not be null');
    }
    this.canvasRef = ref;
    this.canvasRef.width = this.displayWidth;
    this.canvasRef.height = this.displayHeight;
    this.ctx = this.canvasRef.getContext('2d');
  }

  public setShowGridLines(showGridLines: boolean) {
    this.showGridLines = showGridLines;
  }

  public reset() {
    this.nbNeighbors = this.nbNeighbors.fill(0);
    this.gameBoard = this.gameBoard.fill(0);
    this.nextBoard = this.nextBoard.fill(0);
    this.lastBoard = this.lastBoard.fill(0);
    this.nbGenerations = 0;
  }

  public initWorld(width: number, height: number, cellSizeInPx: number, canvasRef?: HTMLCanvasElement) {
    this.setDimension(width, height);
    this.setCellSize(cellSizeInPx);
    if (canvasRef) this.setCanvasRef(canvasRef);
    this.init();
  }

  public async generateRandomWorld(fillRateInPercent: number) {
    this.cellAlive = 0;
    for (let i = 0; i < this.maxCell; i++) {
      this.gameBoard[i] = (await this.randomBooleanWeighted(fillRateInPercent)) ? 1 : 0;
      if (this.gameBoard[i] === 1) {
        this.cellAlive++;
      }
    }
    return Promise.resolve();
  }

  public runStepOnce() {
    this.genNextStep();
    this.drawWorld();
  }

  public getNbGenerations() {
    return this.nbGenerations;
  }

  public getTotalCell(): number {
    return this.maxCell;
  }

  public getCellAlive(): number {
    return this.cellAlive;
  }

  public setColorCell(color: string) {
    this.colorCell = color;
  }

  public setColorGrid(color: string) {
    this.colorGrid = color;
  }
}
