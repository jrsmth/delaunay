import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shapes/point';
import { Triangle } from '@jrsmiffy/delaunator/lib/shapes/triangle';
import $ from "jquery";

const svg: any = {
  main: document.getElementById('main'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles')
}

// Demo fields
let points: Point[] = [];
let numPoints = 7;
let interactive = true;

// Interactive fields
let selectedElement: HTMLElement | null;
let currentX = 0;
let currentY = 0;
let absX = 0;
let absY = 0;
let currentMatrix: any;
let paramHistory = '';
let currentId: string;
let drag = false;

// Artistic fields
let colour1: [number, number, number] = [227, 138, 88]; // orange
let colour2: [number, number, number] = [208, 118, 196]; // purple

// **********************
// *** Demo Functions ***
// **********************
init();

/** Initialise Demo */
function init() {
  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';

  let btnRefresh = document.getElementById('refresh');
  if (btnRefresh) btnRefresh.addEventListener('click', init);

  let btnInteractive = document.getElementById('interactive');
  if (btnInteractive) btnInteractive.addEventListener('click', () => {
    interactive = true;
    init();
  });

  let btnArtistic = document.getElementById('artistic');
  if (btnArtistic) btnArtistic.addEventListener('click', () => {
    interactive = false;
    init();
  });

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
  renderTriangles(triangulation);

  if (interactive) renderPoints(points);
  else fadeIn();
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

    if (interactive) makeInteractive(circle);

    svg.points.appendChild(circle);

    i++;
  }
}

/** Render Triangles On Screen */
function renderTriangles(triangles: Triangle[]) {
  for (let triangle of triangles) {
    let tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    
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

    if (!interactive) {
      let colour: number[] = generateColour(triangle);

      tri.setAttribute('fill', 'rgb('+colour[0]+', '+colour[1]+', '+colour[2]+')');
      tri.setAttribute('stroke', 'rgb('+colour[0]+', '+colour[1]+', '+colour[2]+')');

    } else {
      tri.setAttribute('stroke', '#56d066');
    }

    svg.triangles.appendChild(tri);
  }
}

// *****************************
// *** Interactive Functions ***
// *****************************
/** Make A Circle Interactive */
function makeInteractive(circle: SVGCircleElement): void {
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
function removeElement(element: HTMLElement): void {
  const uniqueX = element.getAttribute('cx');

  if (uniqueX)
    points = points.filter(pt => pt.x !== parseInt(uniqueX));

  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';

  triangulate(points);
}

/** Select An Element To Interact With */
function selectElement(element: HTMLElement): void {
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
function moveElement(event: any): void {
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
function deselectElement(): void {
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

// **************************
// *** Artistic Functions ***
// **************************
/** Generate Colour For Triangle Based on Location */
function generateColour(triangle: Triangle): number[] {
  let xCoords = [triangle.pointA.x, triangle.pointB.x, triangle.pointC.x].sort();

  let stopColour = (xCoords[0] / window.innerWidth) // 0 < x < 1
  let colour: number[] = [];

  for (let i = 0; i < 3; i++) {
    let value = ((colour2[i] - colour1[i]) * stopColour) + colour1[i];
    colour.push(value);
  }

  let shadeRatio: number;
  let randomInt = Math.ceil(Math.random() * 50);
  let stopTint =  Math.pow(Math.abs((xCoords[1] - xCoords[0]) / (xCoords[2] - xCoords[0])), 0.5); // 0 < x < 1

  if (randomInt % 5 === 0) {
    shadeRatio = 1.3 + stopTint * 0.1; // "lighten"
  } else if (randomInt % 4 == 0) {
    shadeRatio = 1.15 + stopTint * 0.05; // "darken"
  } else {
    shadeRatio = 1.2 + stopTint * 0.1;
  }

  for (let i = 0; i < 3; i++) colour[i] *= shadeRatio;

  return colour;
}

/** Fade-In Each Triangle */
function fadeIn() {
  let gapBetweenEach = 10;
  let speedOfFade = 400;

  $('.tris').each(function(i: number, path: HTMLElement){
    $(path).delay(gapBetweenEach * i ** 0.75).fadeIn(speedOfFade, () => {});
  });
}