export const GREEN: [number, number, number] = [80, 250, 123];
export const ORANGE: [number, number, number] = [227, 138, 88];
export const PURPLE: [number, number, number] = [208, 118, 196];
export const INIT_NUM_POINTS: number = 7;
export const MENU_HEIGHT_PX: number = 80;

export const body: HTMLElement = document.getElementsByTagName('body')[0];

export const controls: any = {
  help: document.getElementById('interactive-help') as HTMLDivElement,
  info: document.getElementById('info') as HTMLButtonElement,
  refresh: document.getElementById('refresh') as HTMLButtonElement,
  interactive: document.getElementById('interactive') as HTMLButtonElement,
  artistic: document.getElementById('artistic') as HTMLButtonElement,
}

export const slider: any = {
  input: document.getElementById('slider-input') as HTMLInputElement,
  thumb: document.getElementById('slider-thumb'),
  line: document.getElementById('slider-line-fill')
}

export const svg: any = {
  main: document.getElementById('main'),
  background: document.getElementById('artistic-background'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles'),
  circumCircles: document.getElementById('circum-circles'),
  stop1: document.getElementById('stop1'),
  stop2: document.getElementById('stop2')
}