type eventCallback = (e: Event) => void;

export interface IGame {
  handleGameRound(target: HTMLElement): void;
}

export class Player {
  constructor(private game: IGame) {}

  public getEventHandlers(): { [key: string]: eventCallback } {
    return {
      click: this.handleLeftClick,
      contextmenu: this.handleRightClick,
    };
  }

  private handleLeftClick = (e: Event): void => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('block')) return;
    if (target.dataset.flag) return;
    this.game.handleGameRound(target);
  };

  private handleRightClick = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (!target.classList.contains('block')) return;

    if (target.dataset.flag) {
      this.addFlag(target);
    } else {
      this.removeFlag(target);
    }
  };

  private addFlag(target: HTMLElement): void {
    target.removeAttribute('data-flag');
    target.classList.remove('flag');
    target.textContent = '';
  }

  private removeFlag(target: HTMLElement): void {
    target.setAttribute('data-flag', 'true');
    target.classList.add('flag');
    target.textContent = 'F';
  }
}
