import { Board } from './Board';
import { Player } from './Player';
import { Game } from './Game';

const game = new Game();

const board = new Board(
  document.querySelector('#board') as HTMLElement,
  20,
  100
);
const player = new Player(game);
game.setBoard(board);
game.setPlayer(player);

// document.addEventListener('DOMContentLoaded', () => {});

let toggle = false;

document.getElementById('toggle-bombs')?.addEventListener('click', e => {
  toggle = !toggle;
  if (toggle) board.revealBombs();
  else board.hideBombs();
});
