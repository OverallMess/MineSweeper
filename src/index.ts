const board = document.querySelector('.board') as HTMLElement;

let buttons: any = [];

document.addEventListener('DOMContentLoaded', () => {
  initBoard();
  getButtonReferences();
  initBombs(10);
  board.addEventListener('click', handleButtonClick);
});

function handleButtonClick(e: Event) {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('block')) return;

  if (checkIfTargetIsBomb(target)) {
    handleGameOver();
    return;
  }

  const surroundingBlocks = findCorrespondingBlocks(
    getSurroundingBlocks(target)
  );

  const bombNumber = getNumberOfSurroundingBombs(surroundingBlocks);
  target.textContent = String(bombNumber);
}

function initBoard(): void {
  let output = '';
  for (let i = 0; i < 100; ++i)
    output += `
        <div data-id=${i} class="block"></div>
      `;
  board.innerHTML = output;
}

function getButtonReferences() {
  buttons = Array.from(board.querySelectorAll('.block'));
}

function initBombs(n: number): void {
  for (let i = 0; i < n; ++i) {
    const rand = getRandomInt(0, 99);
    buttons[rand].setAttribute('data-bomb', 'true');
    buttons[rand].classList.add('bomb');
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSurroundingBlocks(block: any): any {
  const blockCoord = parseInt(block.dataset.id);
  const coords = [];
  let offset = -10;

  for (let i = 0; i < 3; ++i) {
    for (let j = -1; j < 2; ++j) {
      const coord: number = blockCoord + offset + j;
      coords.push(coord);
    }
    offset += 10;
  }
  return coords;
}

function findCorrespondingBlocks(coords: any): any {
  const blocks: any = [];
  buttons.forEach((btn: any) => {
    coords.forEach((crd: any) => {
      if (parseInt(btn.dataset.id) === crd) blocks.push(btn);
    });
  });
  return blocks;
}

function getNumberOfSurroundingBombs(sBlocks: any): number {
  let num = 0;
  sBlocks.forEach((sb: any) => {
    if (sb.dataset.bomb) ++num;
  });
  return num;
}

function checkIfTargetIsBomb(target: any): boolean {
  if (target.dataset.bomb) return true;
  return false;
}

function handleGameOver() {
  console.log('GAME OVER');
  board.removeEventListener('click', handleButtonClick);
}
