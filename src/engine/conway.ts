// Conway's Game of Life

const PI2 = Math.PI * 2;

export type Position2D = {
  x: number;
  y: number;
};

export type ConwayCellType = {
  index: number;
  alive: number;
};

export const CONWAY_DEFAULT_SETTINGS = {
  cellSize: 10,
  randomFillRate: 70,
  showGridLines: true,
  cellColor: '#fdba74',
  gridColor: '#1c1917',
  fillRandomRateInPercent: 70,
  decompositionFX: true,
  cellShapeCircle: true,
};
export type ConwaySettingsType = typeof CONWAY_DEFAULT_SETTINGS;

export class ConwayEngine {
  private maxCol: number;
  private maxRow: number;
  private maxCell: number;
  private maxx: number;
  private maxy: number;

  private cellSizeInPx: number = 10;
  private fillRandomRateInPercent: number = 70;
  private decompositionFX: boolean = true;
  private cellShapeCircle: boolean = true;
  private showGridLines: boolean = true;
  private colorCell: string = '#fdba74';
  private colorGrid: string = '#1c1917';
  private cellRadius: number = 4;
  private offsetCell: number = 1;
  private renderCellSize: number = 9;
  private displayWidth: number;
  private displayHeight: number;

  private reciprocalMaxCol: number;
  private nbGenerations: number;
  private nextBoard!: Uint8Array;
  private gameBoard!: Uint8Array;
  private nextLivingCells!: Uint32Array;
  private lastBoard!: Uint8Array;
  private nbNeighbors!: Uint8Array;
  private decompositionTime!: Uint8Array;
  private neighborsDeltaIndex!: Array<number>;
  private precalcCellPos!: Position2D[];
  private canvasRef: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private cellAlive: number = 0;

  private firstRender: boolean = true;

  constructor() {
    this.displayWidth = 0;
    this.displayHeight = 0;
    this.maxCol = 0;
    this.maxRow = 0;
    this.maxCell = 0;
    this.maxx = 0;
    this.maxy = 0;
    this.reciprocalMaxCol = 0;
    this.nbGenerations = 0;

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
      -(this.maxCol - 1), // TopLeft
      -(this.maxCol + 1), // TopRight
      +this.maxCol, // bottom
      +(this.maxCol - 1), // BottomLeft
      +(this.maxCol + 1), // BottomRight
    ];

    this.reciprocalMaxCol = 1 / this.maxCol;

    this.gameBoard = new Uint8Array(this.maxCell);
    this.nextBoard = new Uint8Array(this.maxCell);
    this.lastBoard = new Uint8Array(this.maxCell);
    this.nbNeighbors = new Uint8Array(this.maxCell);

    this.nextLivingCells = new Uint32Array(Math.floor(this.maxCell * ((this.fillRandomRateInPercent + 5) / 100))).fill(
      0
    );
    this.decompositionTime = new Uint8Array(this.maxCell).fill(0);
    this.precalcCellPos = [];

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

  private computeCellsToLive() {
    this.cellAlive = 0;
    for (let i = 0; i < this.maxCell; i++) {
      const isAlive = this.gameBoard[i] === 1;
      const needLive =
        (isAlive && (this.nbNeighbors[i] === 2 || this.nbNeighbors[i] === 3)) ||
        (!isAlive && this.nbNeighbors[i] === 3);
      if (needLive) {
        this.cellAlive++;
        this.nextLivingCells[this.cellAlive] = i;
        this.decompositionTime[i] = 100;
      } else if (this.decompositionTime[i] > 0) {
        this.decompositionTime[i] -= 25;
      }
      this.nextBoard[i] = needLive ? 1 : 0;
    }
  }

  private adjustColorIntensity(hexColor: string, intensity: number) {
    // Convertir la couleur hexadécimale en RGB
    let r: number = parseInt(hexColor.substring(1, 3), 16);
    let g: number = parseInt(hexColor.substring(3, 5), 16);
    let b: number = parseInt(hexColor.substring(5, 7), 16);

    // Ajuster chaque composante de couleur en fonction de l'intensité
    r = Math.floor(r * intensity);
    g = Math.floor(g * intensity);
    b = Math.floor(b * intensity);

    // Assurez-vous que chaque composante est dans l'intervalle [0,255]
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Convertir chaque composante en hexadécimal et combiner les résultats
    const rs: string = r.toString(16).padStart(2, '0');
    const gs: string = g.toString(16).padStart(2, '0');
    const bs: string = b.toString(16).padStart(2, '0');

    return `#${rs}${gs}${bs}`;
  }

  public genNextStep() {
    // Reset des voisins
    this.nbNeighbors.fill(0);

    // On mets a jour le tableau des voisins
    for (let i = 0; i < this.cellAlive; i++) {
      this.updateNeighbors(this.nextLivingCells[i]);
    }

    // On récupère uniquement les cellules qui doivent vivre
    this.computeCellsToLive();

    // on swap les buffers
    const tempBoard = this.gameBoard;
    this.gameBoard = this.nextBoard;
    this.nextBoard = tempBoard;

    this.nbGenerations++;
  }

  private drawSquare(x: number, y: number, size: number, color: string) {
    this.ctx!.fillStyle = color;
    this.ctx!.fillRect(x, y, size, size);
  }

  private drawCircle(x: number, y: number, radius: number, color: string) {
    //this.ctx!.beginPath();
    this.ctx!.arc(x + radius, y + radius, radius, 0, PI2, false);
    //this.ctx!.closePath();
    this.ctx!.fillStyle = color;
    this.ctx!.fill();
  }

  private drawCell(x: number, y: number, color: string) {
    if (this.cellShapeCircle) {
      this.drawCircle(x + this.offsetCell, y + this.offsetCell, this.cellRadius, color);
    } else {
      this.drawSquare(x + this.offsetCell, y + this.offsetCell, this.renderCellSize, color);
    }
  }

  private eraseCell(x: number, y: number) {
    this.ctx!.clearRect(x + this.offsetCell, y + this.offsetCell, this.renderCellSize, this.renderCellSize);
  }

  public drawGrid() {
    if (this.showGridLines) {
      //this.ctx!.beginPath();
      //this.ctx!.lineWidth = 0.5;
      this.ctx!.strokeStyle = this.colorGrid;

      for (let i = 0; i <= this.maxCol; i++) {
        const delta = i * this.cellSizeInPx;
        this.ctx!.moveTo(delta, 0);
        this.ctx!.lineTo(delta, this.displayHeight);
        this.ctx!.stroke();
      }

      for (let i = 0; i <= this.maxRow; i++) {
        const delta = i * this.cellSizeInPx;
        this.ctx!.moveTo(0, delta);
        this.ctx!.lineTo(this.displayWidth, delta);
        this.ctx!.stroke();
      }
      //this.ctx!.closePath();
    }
  }

  public drawWorld() {
    if (this.canvasRef === null || this.ctx === null) {
      throw new Error('canvasRef or canvas Ctx must not be null');
    }

    this.ctx.save();

    if (this.firstRender) {
      this.drawGrid();
      this.firstRender = false;
    }

    for (let i = 0; i < this.maxCell; i++) {
      const newValue = this.gameBoard[i];
      const { x, y } = this.precalcCellPos[i];
      const px = x * this.cellSizeInPx;
      const py = y * this.cellSizeInPx;

      this.ctx.beginPath();
      if (this.decompositionFX) {
        // Dessiner les cellules mortes avec une couleur basée sur leur temps de décomposition
        if (this.lastBoard[i] === 0 && newValue === 0) {
          if (this.decompositionTime[i] > 0) {
            const intensity = this.decompositionTime[i] * 0.01; // 1/100
            this.drawCell(px, py, this.adjustColorIntensity(this.colorCell, intensity));
          } else {
            this.eraseCell(px, py);
          }
        }
      }

      if (this.lastBoard[i] !== newValue) {
        if (newValue === 0) {
          this.eraseCell(px, py);
        } else {
          this.drawCell(px, py, this.colorCell);
        }
      }
    }

    this.ctx.closePath();
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

  private updateRenderingProperties() {
    this.renderCellSize = this.showGridLines ? this.cellSizeInPx - 1 : this.cellSizeInPx;
    this.cellRadius = this.showGridLines ? this.cellSizeInPx / 2 - 1 : this.cellSizeInPx / 2;
    this.offsetCell = this.showGridLines ? 1 : 0;
  }

  private setCellSize(cellSizeInPx: number) {
    if (cellSizeInPx === null || cellSizeInPx === undefined || cellSizeInPx <= 1) {
      throw new Error('cellSizeInPx must be greater than 1');
    }
    this.cellSizeInPx = cellSizeInPx;
    this.updateRenderingProperties();
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
    this.updateRenderingProperties();
    this.firstRender = true;
  }

  public setCellShapeCircle(cellShapeCircle: boolean) {
    this.cellShapeCircle = cellShapeCircle;
  }

  public setDecompositionFX(decompositionFX: boolean) {
    this.decompositionFX = decompositionFX;
  }

  public setFillRandomRateInPercent(fillRandomRateInPercent: number) {
    this.fillRandomRateInPercent = fillRandomRateInPercent;
  }

  public reset() {
    this.nbNeighbors = this.nbNeighbors.fill(0);
    this.gameBoard = this.gameBoard.fill(0);
    this.nextBoard = this.nextBoard.fill(0);
    this.lastBoard = this.lastBoard.fill(0);
    this.nbGenerations = 0;
  }

  public initWorld(width: number, height: number, canvasRef?: HTMLCanvasElement) {
    this.setDimension(width, height);
    if (canvasRef) this.setCanvasRef(canvasRef);
    this.init();
  }

  public async generateRandomWorld() {
    this.cellAlive = 0;
    for (let i = 0; i < this.maxCell; i++) {
      // eslint-disable-next-line no-await-in-loop
      this.gameBoard[i] = (await this.randomBooleanWeighted(this.fillRandomRateInPercent)) ? 1 : 0;
      this.decompositionTime[i] = 0;
      if (this.gameBoard[i] === 1) {
        this.cellAlive++;
        this.nextLivingCells[this.cellAlive] = i;
        this.decompositionTime[i] = 100;
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

  public setSettings(settings: ConwaySettingsType) {
    this.setCellSize(settings.cellSize);
    this.cellRadius = this.cellSizeInPx / 2 - 1;
    this.renderCellSize = this.cellSizeInPx - 1;
    this.setShowGridLines(settings.showGridLines);
    this.setColorCell(settings.cellColor);
    this.setColorGrid(settings.gridColor);
    this.setFillRandomRateInPercent(settings.fillRandomRateInPercent);
    this.setDecompositionFX(settings.decompositionFX);
    this.setCellShapeCircle(settings.cellShapeCircle);
  }
}
