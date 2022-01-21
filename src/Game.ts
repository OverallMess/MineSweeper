import { Board } from './Board';
import { Player, IGame } from './Player';

type eventCallback = (e: Event) => void;

export class Game implements IGame {
  private player?: Player;
  private board?: Board;
  private playereventHandlers?: { [key: string]: eventCallback };
  constructor() {
    // this.playereventHandlers = player.getEventHandlers();
  }

  public setPlayer(player: Player): void {
    this.player = player;
    this.playereventHandlers = player.getEventHandlers();
    this.board?.subscribeEvents(this.playereventHandlers);
  }

  public setBoard(board: Board): void {
    this.board = board;
  }

  handleGameRound(target: HTMLElement) {
    if (this.checkIfGameOver(target)) {
      this.handleGameOver('You lost!');
      return;
    }

    this.board?.checkSurroundingBlocks(target);

    if (this.checkIfWon()) {
      this.handleGameOver('you won!');
      return;
    }
  }

  private handleGameOver(msg: string): void {
    for (let key in this.playereventHandlers)
      this.board?.unsubscribeEvents(this.playereventHandlers);
    this.board?.revealBombs();
    alert(msg);
  }

  private checkIfWon(): boolean {
    let over = true;
    this.board?.buttons.forEach((button: any) => {
      if (!button.dataset.bomb) {
        over = over && button.classList.contains('marked');
      }
    });
    return over;
  }

  private checkIfGameOver(target: HTMLElement): boolean | undefined {
    return this.board?.checkIfTargetIsBomb(target);
  }
}
