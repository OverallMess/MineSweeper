let toggle = false;

document.getElementById('toggle-bombs')?.addEventListener('click', e => {
  toggle = !toggle;
  if (toggle) revealBombs();
  else hideBombs();
});

const board = document.querySelector('.board') as HTMLElement;

let buttons: any = [];

document.addEventListener('DOMContentLoaded', () => {
  initBoard();
  getButtonReferences();
  initBombs(5);
  board.addEventListener('click', handleButtonClick);
  board.addEventListener('contextmenu', handleRightClick);
});

function getButtonReferences() {
  buttons = Array.from(board.querySelectorAll('.block'));
}

function initBoard(): void {
  let output = '';
  for (let i = 0; i < 100; ++i)
    output += `
          <div data-id=${i} class="block"></div>
        `;
  board.innerHTML = output;
}

function initBombs(n: number): void {
  for (let i = 0; i < n; ++i) {
    const rand = getRandomInt(0, 99);
    buttons[rand].setAttribute('data-bomb', 'true');
    buttons[rand].classList.add('bomb');
  }
}

function handleRightClick(e: Event) {
  e.preventDefault();
  const target = e.target as HTMLElement;
  if (!target.classList.contains('block')) return;

  if (target.dataset.flag) {
    target.removeAttribute('data-flag');
    target.classList.remove('flag');
    target.textContent = '';
  } else {
    target.setAttribute('data-flag', 'true');
    target.classList.add('flag');
    target.textContent = 'F';
  }
}

function handleButtonClick(e: Event) {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('block')) return;

  if (target.dataset.flag) {
    return;
  }

  if (checkIfTargetIsBomb(target)) {
    handleGameOver();
    console.log('GAME OVER');

    return;
  }

  checkSurroundingBlocks(target);
  if (checkIfWon()) {
    revealBombs();
    alert('YOU HAVE WON!');
    return;
  }
}

function checkSurroundingBlocks(block: any) {
  const surroundingBlocks = getSurroundingBlocks(block);
  block.classList.add('marked');

  const numBombs = countBombs(surroundingBlocks);

  if (numBombs > 0) {
    block.classList.add('bomb-near-by');
    block.textContent = String(numBombs);
    return;
  }

  block.classList.add('no-bomb');
  Array.from(surroundingBlocks).forEach((bl: any) => {
    checkSurroundingBlocks(bl);
  });
}

function checkIfTargetIsBomb(target: any): boolean {
  if (target.dataset.bomb) return true;
  return false;
}

function getSurroundingBlocks(block: any): any {
  const blockCoord = parseInt(block.dataset.id);
  const coords: number[] = [];
  let offset = -10;

  if (endsWith(blockCoord, 0)) {
    checkValidCoord(coords, blockCoord - 10);
    checkValidCoord(coords, blockCoord - 10 + 1);
    checkValidCoord(coords, blockCoord + 1);
    checkValidCoord(coords, blockCoord + 10 + 1);
    checkValidCoord(coords, blockCoord + 10);
  } else if (endsWith(blockCoord, 9)) {
    checkValidCoord(coords, blockCoord - 10);
    checkValidCoord(coords, blockCoord - 10 - 1);
    checkValidCoord(coords, blockCoord - 1);
    checkValidCoord(coords, blockCoord + 10 - 1);
    checkValidCoord(coords, blockCoord + 10);
  } else if (startsWith(blockCoord, 9)) {
    checkValidCoord(coords, blockCoord - 1);
    checkValidCoord(coords, blockCoord - 10 - 1);
    checkValidCoord(coords, blockCoord - 10);
    checkValidCoord(coords, blockCoord - 10 + 1);
    checkValidCoord(coords, blockCoord + 1);
  } else if ((startsWith(blockCoord, 9), endsWith(blockCoord, 0))) {
    checkValidCoord(coords, blockCoord - 10);
    checkValidCoord(coords, blockCoord - 10 + 1);
    checkValidCoord(coords, blockCoord + 1);
  } else if ((startsWith(blockCoord, 9), endsWith(blockCoord, 9))) {
    checkValidCoord(coords, blockCoord - 1);
    checkValidCoord(coords, blockCoord - 10 - 1);
    checkValidCoord(coords, blockCoord - 10);
  } else if (endsWith(blockCoord, 9)) {
    checkValidCoord(coords, blockCoord - 10);
    checkValidCoord(coords, blockCoord - 10 - 1);
    checkValidCoord(coords, blockCoord - 1);
    checkValidCoord(coords, blockCoord + 10 - 1);
    checkValidCoord(coords, blockCoord + 10);
  } else {
    for (let i = 0; i < 3; ++i) {
      for (let j = -1; j < 2; ++j) {
        const coord: number = blockCoord + offset + j;
        if (coord >= 0 && coord <= 99) {
          if (!Array.from(buttons[coord].classList).includes('marked'))
            coords.push(coord);
        }
      }
      offset += 10;
    }
  }

  return findCorrespondingBlocks(coords);
}

function checkValidCoord(coords: number[], coord: number): void {
  if (coord >= 0 && coord <= 99) {
    if (!Array.from(buttons[coord].classList).includes('marked'))
      coords.push(coord);
  }
}

function countBombs(blocks: any): number {
  let num = 0;
  Array.from(blocks).forEach((block: any) => {
    if (checkIfTargetIsBomb(block)) ++num;
  });

  return num;
}

function checkIfBlocksAreBombs(blocks: any) {
  const numBombs = countBombs(blocks);
  if (numBombs > 0) {
    return numBombs;
  }

  for (let block of blocks) {
    const anotherBlocks = getSurroundingBlocks(block);
    checkIfBlocksAreBombs(anotherBlocks);
  }
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
function handleGameOver(): void {
  board.removeEventListener('click', handleButtonClick);
  revealBombs();
}
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function endsWith(num1: number, num2: number): boolean {
  if (num1 % 10 === num2) return true;
  return false;
}

function startsWith(num1: number, num2: number): boolean {
  if (Math.floor(num1 / 10) === num2) return true;
  return false;
}

function checkIfWon(): boolean {
  let over = true;
  buttons.forEach((button: any) => {
    if (!button.dataset.bomb) {
      over = over && button.classList.contains('marked');
    }
  });
  return over;
}

function revealBombs(): void {
  buttons.forEach((button: any) => {
    if (button.dataset.bomb) {
      button.style.backgroundColor = '#8f23238e';
    }
  });
}

function hideBombs(): void {
  buttons.forEach((button: any) => {
    if (button.dataset.bomb) {
      button.style.backgroundColor = '#2e42585e';
    }
  });
}

// test(90);
