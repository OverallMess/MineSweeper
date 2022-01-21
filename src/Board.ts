import { getRandomInt, endsWith, startsWith } from './ulits';

type eventCallback = (e: Event) => void;

export class Board {
  public buttons: HTMLElement[];
  private numBombs: number = 0;
  private boardDim: number = 0;
  private MAX_DIM = 100;

  constructor(private board: HTMLElement, numBombs: number, boardDim: number) {
    this.buttons = Array.from(this.board.querySelectorAll('.block')); // TODO
    this.setBoardDim(boardDim);
    this.setNumOfBombs(numBombs);
    this.initBoard();
  }

  public initBoard(): void {
    let output = '';
    for (let i = 0; i < this.boardDim; ++i)
      output += `<div data-id=${i} class="block"></div>`;
    this.board.innerHTML = output;
    this.buttons = Array.from(this.board.querySelectorAll('.block'));
    this.initBombs(this.numBombs);
  }

  public setNumOfBombs(n: number): void {
    if (n > 0 && n <= this.MAX_DIM) this.numBombs = n;
  }

  public setBoardDim(n: number): void {
    if (n > 0 && n <= this.MAX_DIM) this.boardDim = n;
  }

  private initBombs(n: number): void {
    for (let i = 0; i < n; ++i) {
      const rand = getRandomInt(0, this.boardDim - 1);
      this.buttons[rand].setAttribute('data-bomb', 'true');
      this.buttons[rand].classList.add('bomb');
    }
  }

  public checkIfTargetIsBomb(target: HTMLElement): boolean {
    if (target.dataset.bomb) return true;
    return false;
  }

  public revealBombs(): void {
    this.buttons.forEach((button: any) => {
      if (button.dataset.bomb) {
        button.style.backgroundColor = '#8f23238e';
      }
    });
  }

  public hideBombs(): void {
    this.buttons.forEach((button: any) => {
      if (button.dataset.bomb) {
        button.style.backgroundColor = '#2e42585e';
      }
    });
  }

  public checkSurroundingBlocks(block: HTMLElement) {
    const surroundingBlocks = this.getSurroundingBlocks(block);
    block.classList.add('marked');

    const numBombs = this.countBombs(surroundingBlocks);

    if (numBombs > 0) {
      block.classList.add('bomb-near-by');
      block.textContent = String(numBombs);
      return;
    }

    block.classList.add('no-bomb');
    Array.from(surroundingBlocks).forEach((bl: any) => {
      this.checkSurroundingBlocks(bl);
    });
  }

  private getSurroundingBlocks(block: HTMLElement): any {
    if (!block.dataset.id) return null;
    const blockCoord = parseInt(block.dataset.id);
    const coords: number[] = [];
    let offset = -10;

    if (endsWith(blockCoord, 0)) {
      this.checkValidCoord(coords, blockCoord - 10);
      this.checkValidCoord(coords, blockCoord - 10 + 1);
      this.checkValidCoord(coords, blockCoord + 1);
      this.checkValidCoord(coords, blockCoord + 10 + 1);
      this.checkValidCoord(coords, blockCoord + 10);
    } else if (endsWith(blockCoord, 9)) {
      this.checkValidCoord(coords, blockCoord - 10);
      this.checkValidCoord(coords, blockCoord - 10 - 1);
      this.checkValidCoord(coords, blockCoord - 1);
      this.checkValidCoord(coords, blockCoord + 10 - 1);
      this.checkValidCoord(coords, blockCoord + 10);
    } else if (startsWith(blockCoord, 9)) {
      this.checkValidCoord(coords, blockCoord - 1);
      this.checkValidCoord(coords, blockCoord - 10 - 1);
      this.checkValidCoord(coords, blockCoord - 10);
      this.checkValidCoord(coords, blockCoord - 10 + 1);
      this.checkValidCoord(coords, blockCoord + 1);
    } else if ((startsWith(blockCoord, 9), endsWith(blockCoord, 0))) {
      this.checkValidCoord(coords, blockCoord - 10);
      this.checkValidCoord(coords, blockCoord - 10 + 1);
      this.checkValidCoord(coords, blockCoord + 1);
    } else if ((startsWith(blockCoord, 9), endsWith(blockCoord, 9))) {
      this.checkValidCoord(coords, blockCoord - 1);
      this.checkValidCoord(coords, blockCoord - 10 - 1);
      this.checkValidCoord(coords, blockCoord - 10);
    } else if (endsWith(blockCoord, 9)) {
      this.checkValidCoord(coords, blockCoord - 10);
      this.checkValidCoord(coords, blockCoord - 10 - 1);
      this.checkValidCoord(coords, blockCoord - 1);
      this.checkValidCoord(coords, blockCoord + 10 - 1);
      this.checkValidCoord(coords, blockCoord + 10);
    } else {
      for (let i = 0; i < 3; ++i) {
        for (let j = -1; j < 2; ++j) {
          const coord: number = blockCoord + offset + j;
          if (coord >= 0 && coord <= 99) {
            if (!Array.from(this.buttons[coord].classList).includes('marked'))
              coords.push(coord);
          }
        }
        offset += 10;
      }
    }
    return this.findCorrespondingBlocks(coords);
  }

  private findCorrespondingBlocks(coords: any): any {
    const blocks: any = [];
    this.buttons.forEach((btn: any) => {
      coords.forEach((crd: any) => {
        if (parseInt(btn.dataset.id) === crd) blocks.push(btn);
      });
    });
    return blocks;
  }

  private countBombs(blocks: any): number {
    let num = 0;
    Array.from(blocks).forEach((block: any) => {
      if (this.checkIfTargetIsBomb(block)) ++num;
    });
    return num;
  }

  private checkValidCoord(coords: number[], coord: number): void {
    if (coord >= 0 && coord <= 99) {
      if (!Array.from(this.buttons[coord].classList).includes('marked'))
        coords.push(coord);
    }
  }

  public subscribeEvents(callbacks: { [key: string]: eventCallback }): void {
    for (let key in callbacks) {
      this.board.addEventListener(key, callbacks[key]);
    }
  }

  public unsubscribeEvents(callbacks: { [key: string]: eventCallback }) {
    for (let key in callbacks) {
      this.board.removeEventListener(key, callbacks[key]);
    }
  }

  private checkIfBlocksAreBombs(blocks: any) {
    const numBombs = this.countBombs(blocks);
    if (numBombs > 0) {
      return numBombs;
    }

    for (let block of blocks) {
      const anotherBlocks = this.getSurroundingBlocks(block);
      this.checkIfBlocksAreBombs(anotherBlocks);
    }
  }
}
