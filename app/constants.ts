export const ORANGE: [number, number, number] = [227, 138, 88];
export const PURPLE: [number, number, number] = [208, 118, 196];
export const INIT_NUM_POINTS: number = 12;

export const svg: any = {
  main: document.getElementById('main'),
  background: document.getElementById('artistic-background'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles'),
  stop1: document.getElementById('stop1'),
  stop2: document.getElementById('stop2')
}

export const slider: any = {
  input: document.getElementById('slider-input') as HTMLInputElement,
  thumb: document.getElementById('slider-thumb'),
  line: document.getElementById('slider-line-fill')
}