import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shapes/point';
import { Triangle } from '@jrsmiffy/delaunator/lib/shapes/triangle';

export const svg: any = {
  main: document.getElementById('main'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles')
}

init();

let button = document.getElementById('refresh');
button!.addEventListener('click', init);

function remove() {
  // remove this point from set

  // re-calculate the triangulation

  alert('Remove me');
}

function init() {
  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';

  let points = generatePoints();

  triangulate(points);
}

function generatePoints() {
  const svgWidth: number = window.innerWidth;
  const svgHeight: number = window.innerHeight;
  svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);

  let points: Point[] = Delaunay.generatePoints(svgWidth, svgHeight, 25);

  console.log(points);
  return points;
}

function triangulate(points: Point[]) {
  if (!points) {
    points = generatePoints();
  }

  let triangulation: Triangle[] = Delaunay.triangulate(points);

  console.log(triangulation);

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
    circle.addEventListener('click', remove);

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