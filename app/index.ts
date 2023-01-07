import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shape/point';

export const svg: any = {
  main: document.getElementById('main'),
  points: document.getElementById('points')
}

init();

function init() {
  const svgWidth: number = window.innerWidth;
  const svgHeight: number = window.innerHeight;
  svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);

  let points: Point[] = Delaunay.generatePoints(svgWidth, svgHeight, 10);

  console.log(points);

  // Note: temporary implementation
  for (let point of points) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute('cx', `${point.x}`);
    circle.setAttribute('cy', `${point.y}`);
    circle.setAttribute('r', '5');

    svg.points.appendChild(circle);
  }

}