export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function endsWith(num1: number, num2: number): boolean {
  return num1 % 10 === num2;
}

export function startsWith(num1: number, num2: number): boolean {
  return Math.floor(num1 / 10) === num2;
}
