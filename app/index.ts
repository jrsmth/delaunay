import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shapes/point';
import { Triangle } from '@jrsmiffy/delaunator/lib/shapes/triangle';

const svg: any = {
  main: document.getElementById('main'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles')
}

let points: Point[] = [];
let numPoints = 7;

let selectedElement: HTMLElement | null;
let currentX = 0;
let currentY = 0;
let absX = 0;
let absY = 0;
let currentMatrix: any;
let paramHistory = '';
let currentId: string;
let drag = false;

init();

// *** Demo Functions ***

/** Initialise Demo */
function init() {
  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';

  let button = document.getElementById('refresh');
  if (button) button.addEventListener('click', init);

  points = generatePoints();
  triangulate(points);
}

/** Generate Set Of Points */
function generatePoints() {
  const svgWidth: number = window.innerWidth;
  const svgHeight: number = window.innerHeight;

  svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);

  return Delaunay.generatePoints(svgWidth, svgHeight, numPoints);
}

/** Compute Triangulation & Render */
function triangulate(points: Point[]) {
  if (!points) points = generatePoints();

  let triangulation: Triangle[] = Delaunay.triangulate(points);

  renderPoints(points);
  renderTriangles(triangulation);
}

/** Render Points On Screen */
function renderPoints(points: Point[]) {
  let i = 0;
  while (i < points.length) {
    let point = points[i];
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    circle.setAttribute('cx', `${point.x}`);
    circle.setAttribute('cy', `${point.y}`);
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', '#fff');
    circle.setAttribute('class', 'point');
    circle.setAttribute('id', `pt-${i}`);

    makeInteractive(circle);
    svg.points.appendChild(circle);

    i++;
  }
}

/** Render Triangles On Screen */
function renderTriangles(triangles: Triangle[]) {
  // Note: temporary implementation
  for (let triangle of triangles) {
    let tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

    tri.setAttribute('stroke', '#56d066');

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

// *** Interactive Functions ***

/** Make A Circle Interactive */
function makeInteractive(circle: SVGCircleElement) {
  circle.setAttribute('transform', 'matrix(1 0 0 1 0 0)');

  circle.addEventListener(
    'mousedown', (event) => {
      drag = false;
      selectedElement = event.target as HTMLElement;
      currentX = event.clientX;
      currentY = event.clientY;
    });

  circle.addEventListener(
    'mousemove', () => {
      drag = true;
      if (selectedElement) selectElement(selectedElement);
    });

  circle.addEventListener(
    'mouseup', () => {
      if (!drag && selectedElement) removeElement(selectedElement);
    });
}

/** Remove An Element From The Screen */
function removeElement(element: HTMLElement) {
  const uniqueX = element.getAttribute('cx');

  if (uniqueX)
    points = points.filter(pt => pt.x !== parseInt(uniqueX));

  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';

  triangulate(points);
}

/** Select An Element To Interact With */
function selectElement(element: HTMLElement) {
  currentId = element.id;

  let transform = element.getAttribute('transform');
  if (transform) currentMatrix = transform.slice(7, -1).split(' ');

  for (let i = 0; i < currentMatrix.length; i++) {
    currentMatrix[i] = parseFloat(currentMatrix[i]);
  }

  element.setAttribute('pointer-events', 'none');

  svg.main.addEventListener('mousemove', moveElement);
  svg.main.addEventListener('mouseup', deselectElement);
}

/** Move An Element To A New Position On The Screen */
function moveElement(event: any) {
  let dx = event.clientX - currentX;
  let dy = event.clientY - currentY;
  currentMatrix[4] += dx;
  currentMatrix[5] += dy;

  if (selectedElement) {
    absX = parseFloat(selectedElement.getAttribute('x') + '|' + currentMatrix[4]);
    absY = parseFloat(selectedElement.getAttribute('y') + '|' + currentMatrix[5]);

    selectedElement.setAttribute('transform', 'matrix(' + currentMatrix.join(' ') + ')');
  }

  currentX = event.clientX;
  currentY = event.clientY;
}

/** Deselect The Current Element Being Interacted With */
function deselectElement() {
  if (selectedElement) {
    selectedElement.setAttribute('pointer-events', 'all')
    paramHistory += '||' + currentId + '|' + absX + '|' + absY;

    svg.main.removeEventListener('mousemove', moveElement);
    svg.main.removeEventListener('mouseup', deselectElement);

    points.push(new Point(currentX, currentY));

    removeElement(selectedElement);
  }

  selectedElement = null;
}

// *** Artistic Functions ***