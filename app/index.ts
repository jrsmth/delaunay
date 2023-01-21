import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shapes/point';
import { Triangle } from '@jrsmiffy/delaunator/lib/shapes/triangle';

export const svg: any = {
  main: document.getElementById('main'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles')
}

init();

function init() {
  const svgWidth: number = window.innerWidth;
  const svgHeight: number = window.innerHeight;
  svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);

  let points: Point[] = Delaunay.generatePoints(svgWidth, svgHeight, 100);

  console.log(points);

  let triangulation: Triangle[] = Delaunay.triangulate(points);

  console.log(triangulation);

  // Note: temporary implementation
  for (let triangle of triangulation) {
    let tri = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    tri.setAttribute("fill", "#00000014");
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

  // Note: temporary implementation
  for (let point of points) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute('cx', `${point.x}`);
    circle.setAttribute('cy', `${point.y}`);
    circle.setAttribute('r', '5');

    svg.points.appendChild(circle);
  }

}