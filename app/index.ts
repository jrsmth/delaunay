import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shapes/point';
import { Triangle } from '@jrsmiffy/delaunator/lib/shapes/triangle';

export const svg: any = {
  main: document.getElementById('main'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles')
}

let points: Point[] = [];

init();

let button = document.getElementById('refresh');
button!.addEventListener('click', init);

function remove(event: any) {
  const pointElement: HTMLElement | null = document.getElementById(event.target.id);

  if (pointElement) {
    const uniqueX = pointElement.getAttribute('cx');

    if (uniqueX)
      points = points.filter(pt => pt.x !== parseInt(uniqueX));

    svg.points.innerHTML = '';
    svg.triangles.innerHTML = '';
  }

  triangulate(points);
}

function init() {
  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';

  points = generatePoints();

  triangulate(points);
}

function generatePoints() {
  const svgWidth: number = window.innerWidth;
  const svgHeight: number = window.innerHeight;
  svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);

  let points: Point[] = Delaunay.generatePoints(svgWidth, svgHeight, 25);

  return points;
}

function triangulate(points: Point[]) {
  if (!points) {
    points = generatePoints();
  }

  let triangulation: Triangle[] = Delaunay.triangulate(points);

  // Note: temporary implementation
  let i = 0;
  while (i < points.length) {
    let point = points[i];
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute('cx', `${point.x}`);
    circle.setAttribute('cy', `${point.y}`);
    circle.setAttribute('r', '5');
    circle.setAttribute("fill", "#fff");
    circle.setAttribute('class', 'point');
    circle.setAttribute('id', `pt-${i}`)
    circle.addEventListener('dblclick', remove);

    svg.points.appendChild(circle);
    i++;
  }

  // Note: temporary implementation
  for (let triangle of triangulation) {
    let tri = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    tri.setAttribute("stroke", "#56d066");

    let pointA = svg.main.createSVGPoint();
    pointA.x = triangle.pointA.x;
    pointA.y = triangle.pointA.y;
    tri.points.appendItem(pointA);

    let pointB = svg.main.createSVGPoint();
    pointB.x = triangle.pointB.x;
    pointB.y = triangle.pointB.y;
    tri.points.appendItem(pointB);

    let pointC = svg.main.createSVGPoint();
    pointC.x = triangle.pointC.x;
    pointC.y = triangle.pointC.y;
    tri.points.appendItem(pointC);

    svg.triangles.appendChild(tri);
  }

}