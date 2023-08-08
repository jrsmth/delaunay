import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shapes/point';
import { Triangle } from '@jrsmiffy/delaunator/lib/shapes/triangle';
import {DEMO_VERSION, LIB_VERSION} from './versions';
import { GREEN, ORANGE, PURPLE, body, controls, slider, svg, INIT_NUM_POINTS, MENU_HEIGHT_PX } from './constants';
import $ from 'jquery';
import {Circle} from "@jrsmiffy/delaunator/lib/shapes/circle";

// Demo fields
let points: Point[] = [];
let numPoints: number = INIT_NUM_POINTS;
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
let colour1: [number, number, number];
let colour2: [number, number, number];

// **********************
// *** Demo Functions ***
// **********************
init();

/** Initialise Demo */
function init(): void {
  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';

  initControls();
  if (interactive) initInteractive();
  if (!interactive) initArtistic();

  points = generatePoints();
  triangulate(points);
}

/** Initialise Refresh & Set Mode Controls */
function initControls(): void {
  controls.refresh.addEventListener('click', () => {
    numPoints = INIT_NUM_POINTS;
    init();
  });

  controls.interactive.addEventListener('click', () => {
    interactive = true;
    numPoints = INIT_NUM_POINTS;

    body.setAttribute('class', 'interactive');
    svg.main.setAttribute('class', 'interactive');
    svg.background.setAttribute('class', 'hide');

    $('.control-interactive').removeClass('hide');
    $('.control-artistic').addClass('hide');

    init();
  });

  controls.artistic.addEventListener('click', () => {
    interactive = false;
    body.setAttribute('class', 'artistic');
    svg.main.setAttribute('class', 'artistic');
    svg.background.setAttribute('class', 'show');

    $('.control-interactive').addClass('hide');
    $('.control-artistic').removeClass('hide');

    init();
  });

  controls.help.querySelector('#version-numbers').innerHTML =
      `
       <li>Demo&nbsp;&nbsp; : ${DEMO_VERSION}</li>
       <li>Library : ${LIB_VERSION}</li>
      `
}

/** Generate Set Of Points */
function generatePoints(): Point[] {
  const svgWidth: number = window.innerWidth;
  const svgHeight: number = window.innerHeight - MENU_HEIGHT_PX;

  svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
  svg.circumCircles.innerHTML = '';

  return Delaunay.generatePoints(svgWidth, svgHeight, numPoints);
}

/** Compute Triangulation & Render */
function triangulate(points: Point[]): void {
  if (!points) points = generatePoints();

  let triangulation: Triangle[] = Delaunay.triangulate(points);
  renderTriangles(triangulation);

  if (interactive) renderPoints(points);
  else fadeIn();
}

/** Render Points On Screen */
function renderPoints(points: Point[]): void {
  let i = 0;
  while (i < points.length) {
    let point = points[i];
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    circle.setAttribute('cx', `${point.x}`);
    circle.setAttribute('cy', `${point.y}`);
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', `#ffb86c`);
    circle.setAttribute('class', 'point');
    circle.setAttribute('id', `pt-${i}`);

    if (interactive) makeInteractive(circle);
    svg.points.appendChild(circle);

    i++;
  }
}

/** Render Triangles On Screen */
function renderTriangles(triangles: Triangle[]): void {
  if (!interactive) {
    triangles = triangles.sort((a, b) => a.pointA.x - b.pointA.x);
    // Sort only required to fade in triangles from left to right
  }

  let i = 0;
  for (let triangle of triangles) {
    let tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    tri.setAttribute('class', 'triangle');
    tri.setAttribute('circum-circle-id', i.toString())

    tri.addEventListener('click', (event) => {
      let triangleSVG = event.target as HTMLElement;
      let circumCircId = parseInt(triangleSVG.getAttribute('circum-circle-id')!);

      let targetCirc = svg.circumCircles.children[circumCircId];
      if ('none' == targetCirc.style.display) {
        targetCirc.style.display = '';
      } else {
        targetCirc.style.display = 'none';
      }
    })

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

    createCircumCircleSVG(triangle, i);

    i++;
    if (!interactive) {
      let colour: number[] = generateColour(triangle);
      tri.setAttribute('fill', `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`);
      tri.setAttribute('stroke', `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`);

      tri.style.display = "none";

    } else {
      tri.setAttribute('fill', 'transparent');
      tri.setAttribute('stroke', `rgb(${GREEN[0]}, ${GREEN[1]}, ${GREEN[2]})`);

    }

    svg.triangles.appendChild(tri);
  }
}

function createCircumCircleSVG(triangle: Triangle, index: number): void {

  const pointA = triangle.pointA;
  const pointB = triangle.pointB;
  const pointC = triangle.pointC;

  const circumCircle = new Circle();
  const center = circumCircle.calculateCenter(pointA, pointB, pointC);
  const radius = circumCircle.calculateRadius(triangle, center);

  const circumSVG: SVGCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

  circumSVG.setAttribute('cx', center.x.toString());
  circumSVG.setAttribute('cy', center.y.toString());
  circumSVG.setAttribute('r', radius.toString());
  circumSVG.setAttribute('fill', 'transparent');
  circumSVG.setAttribute('stroke', 'white');
  circumSVG.setAttribute('id', `circum-circle-${index}`);
  circumSVG.style.display = 'none';

  svg.circumCircles.appendChild(circumSVG);
}

// *****************************
// *** Interactive Functions ***
// *****************************
/** Initialise Interactive Functionality */
function initInteractive(): void {
  slider.input.value = INIT_NUM_POINTS;

  controls.info.setAttribute('class', 'flat slim dark');
  controls.refresh.setAttribute('class', 'flat slim dark');
  controls.interactive.setAttribute('class', 'flat light hide');
  controls.artistic.setAttribute('class', 'flat dark show');

  updatePointsSlider();
  window.addEventListener("resize", updatePointsSlider);

  slider.input.addEventListener('input', updatePointsSlider);
  slider.input.addEventListener('mouseup', () => {
    numPoints = slider.input.value;
    svg.points.innerHTML = '';
    svg.triangles.innerHTML = '';

    points = generatePoints();
    triangulate(points);
  });
}

/** Update Number Of Points Slider Value */
function updatePointsSlider(): void {
  slider.thumb.innerHTML = slider.input.value;

  const position = (parseInt(slider.input.value) / parseInt(slider.input.max));
  const space = slider.input.offsetWidth - slider.thumb.offsetWidth;

  slider.thumb.style.left = (position * space) + 'px';
  slider.line.style.width = slider.input.value + '%';
}

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
      selectedElement = null;
    });

  circle.addEventListener(
    'dblclick', (event) => {
      removeElement(event.target as HTMLElement);
      slider.input.value = points.length;
      updatePointsSlider();
    });
}

/** Remove An Element From The Screen */
function removeElement(element: HTMLElement): void {
  const uniqueX = element.getAttribute('cx');

  if (uniqueX)
    points = points.filter(pt => pt.x !== parseInt(uniqueX));

  svg.points.innerHTML = '';
  svg.triangles.innerHTML = '';
  svg.circumCircles.innerHTML = '';

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

  // removing .point class improves interaction smoothness
  element.setAttribute('class', '');
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
    selectedElement.setAttribute('pointer-events', 'all');
    paramHistory += '||' + currentId + '|' + absX + '|' + absY;

    svg.main.removeEventListener('mousemove', moveElement);
    svg.main.removeEventListener('mouseup', deselectElement);

    currentY -= MENU_HEIGHT_PX;
    points.push(new Point(currentX, currentY));

    removeElement(selectedElement);
  }

  selectedElement = null;
}

// **************************
// *** Artistic Functions ***
// **************************
/** Initialise Artistic Functionality */
function initArtistic(): void {
  numPoints = 36;
  colour1 = ORANGE;
  colour2 = PURPLE;

  controls.info.setAttribute('class', 'flat slim light');
  controls.refresh.setAttribute('class', 'flat slim light');
  controls.interactive.setAttribute('class', 'flat light show');
  controls.artistic.setAttribute('class', 'flat dark hide');

  updateColouredComponents();
}

/** Generate Colour For Triangle Based on Location */
function generateColour(triangle: Triangle): number[] {
  let xCoords = [triangle.pointA.x, triangle.pointB.x, triangle.pointC.x].sort();

  let stopColour = (xCoords[0] / window.innerWidth); // 0 < x < 1
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
function fadeIn(): void {
  let gapBetweenEach = 10;
  let speedOfFade = 400;

  $('.triangle').each(function(i: number, path: HTMLElement){
    $(path).delay(gapBetweenEach * i ** 0.75).fadeIn(speedOfFade, () => {});
  });
}

/** Update Colour Scheme */
function updateColours(event: any): void {
  let hexValue = event.target.value.split('#')[1];

  let red = parseInt(hexValue.substring(0,2), 16);
  let green = parseInt(hexValue.substring(2,4), 16);
  let blue = parseInt(hexValue.substring(4,6), 16);

  if (event.target.id === 'colour1') colour1 = [red, green, blue];
  if (event.target.id === 'colour2') colour2 = [red, green, blue];

  updateColouredComponents();
  triangulate(points);
}

/** Update The Colour-Dependent Components */
function updateColouredComponents(): void {
  let colourOne = document.getElementById('colour1') as HTMLInputElement;
  if (colourOne) {
    colourOne.addEventListener('change', updateColours);
    colourOne.value = convertToHex(colour1[0], colour1[1], colour1[2]);
  }

  let colourTwo = document.getElementById('colour2') as HTMLInputElement;
  if (colourTwo) {
    colourTwo.addEventListener('change', updateColours);
    colourTwo.value = convertToHex(colour2[0], colour2[1], colour2[2]);
  }

  svg.stop1.setAttribute('stop-color', `rgb(${colour1[0]}, ${colour1[1]}, ${colour1[2]})`);
  svg.stop2.setAttribute('stop-color', `rgb(${colour2[0]}, ${colour2[1]}, ${colour2[2]})`);
}

/** Convert RGB Value To Hex */
function convertToHex(red: number, green: number, blue: number): string {
  let hex = function (rgb: number) {
    return rgb ? rgb.toString(16) : "00";
  };

  return `#${hex(red)}${hex(green)}${hex(blue)}`;
}