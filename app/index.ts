import { Delaunay } from '@jrsmiffy/delaunator/lib/delaunay';
import { Point } from '@jrsmiffy/delaunator/lib/shapes/point';
import { Triangle } from '@jrsmiffy/delaunator/lib/shapes/triangle';

export const svg: any = {
  main: document.getElementById('main'),
  points: document.getElementById('points'),
  triangles: document.getElementById('triangles')
}

let points: Point[] = [];
// let selectedElement: HTMLElement | null;
// let offset: any;

init();

let button = document.getElementById('refresh');
button!.addEventListener('click', init);

function removeEvent(event: any) {
  console.log(event);

  const pointElement: HTMLElement = document.getElementById(event.target.id)!;
  removeElement(pointElement);
}

function removeElement(pointElement: HTMLElement) {

  if (pointElement) {
    const uniqueX = pointElement.getAttribute('cx');

    if (uniqueX)
      points = points.filter(pt => pt.x !== parseInt(uniqueX));

    svg.points.innerHTML = '';
    svg.triangles.innerHTML = '';
  }

  triangulate(points);
}
//
// function startDrag(event: any) {
//   if (event.target.classList.contains('point')) {
//     selectedElement = event.target;
//
//     offset = getMousePosition(event);
//     if (selectedElement) {
//       let x = selectedElement.getAttribute("cx");
//       let y = selectedElement.getAttribute("cy");
//
//       offset.x -= parseFloat(x!);
//       offset.y -= parseFloat(y!);
//     }
//   }
// }
//
// function drag(event: any) {
//   if (selectedElement) {
//     event.preventDefault();
//
//     let coord = getMousePosition(event);
//
//     console.log(offset);
//
//     selectedElement.setAttribute("cx", `${coord.x - offset.x}`);
//     selectedElement.setAttribute("cy", `${coord.y - offset.y}`);
//   }
// }
//
// function endDrag(event: any) {
//   // if (selectedElement) {
//   //   let newX = selectedElement.getAttribute('cx');
//   //   let newY = selectedElement.getAttribute('cy');
//   //
//   //   points.push(new Point(parseInt(newX!), parseInt(newY!)));
//   //
//   //   remove(selectedElement);
//   // }
//
//   selectedElement = null;
// }
//
// function getMousePosition(event: any) {
//   let ctm = svg.main.getScreenCTM();
//
//   return {
//     x: (event.clientX - ctm.e) / ctm.a,
//     y: (event.clientY - ctm.f) / ctm.d
//   };
// }

let selectedElement: HTMLElement | null;
let currentX = 0;
let currentY = 0;
let absX = 0;
let absY = 0;
let currentMatrix: any;
let paramHistory = "";
let currentID: string;
let drag = false;

function selectElement(selectedElement: HTMLElement) {
  currentID = selectedElement!.id;

  console.log(currentID);

  console.log(selectedElement!.getAttributeNames());

  if (selectedElement) {
    currentMatrix = selectedElement.getAttribute("transform")!.slice(7, -1).split(' ');
    for (let i = 0; i < currentMatrix.length; i++) {
      currentMatrix[i] = parseFloat(currentMatrix[i]);
    }
    selectedElement.setAttribute("pointer-events", "none")
  }
  // svg.main.setAttribute("onmousemove", "moveElement");
  // svg.main.setAttribute("onmouseup", "deselectElement");
  svg.main.addEventListener('mousemove', moveElement);
  svg.main.addEventListener('mouseup', deselectElement);
}

function moveElement(evt: any) {
  let dx = evt.clientX - currentX;
  let dy = evt.clientY - currentY;
  currentMatrix[4] += dx;
  currentMatrix[5] += dy;

  absX = parseFloat(selectedElement!.getAttribute("x") + "|" + currentMatrix[4]);
  absY = parseFloat(selectedElement!.getAttribute("y") + "|" + currentMatrix[5]);

  selectedElement!.setAttribute("transform", "matrix(" + currentMatrix.join(' ') + ")");
  currentX = evt.clientX;
  currentY = evt.clientY;
}

function deselectElement(evt: any) {
  if (selectedElement) {
    selectedElement.setAttribute("pointer-events", "all")
    paramHistory += "||" + currentID + "|" + absX + "|" + absY;
    svg.main.removeEventListener("mousemove", moveElement);
    svg.main.removeEventListener("mouseup", deselectElement);

    // let newX = selectedElement!.getAttribute('cx');
    // let newY = selectedElement!.getAttribute('cy');
    //
    // console.log(points);
    // console.log(new Point(parseInt(newX!), parseInt(newY!)));
    // points.push(new Point(parseInt(newX!), parseInt(newY!)));
    // console.log(points);
    points.push(new Point(currentX, currentY));

    removeElement(selectedElement);
  }

  selectedElement = null;
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
    circle.setAttribute('r', '10');
    circle.setAttribute("fill", "#fff");
    circle.setAttribute('class', 'point');
    circle.setAttribute('id', `pt-${i}`);

    // circle.addEventListener('mousedown', startDrag);
    // circle.addEventListener('mousemove', drag);
    // circle.addEventListener('mouseleave', endDrag);
    // circle.addEventListener('mouseup', endDrag);

    circle.setAttribute('transform', `matrix(1 0 0 1 0 0)`);
    // circle.addEventListener('mousedown', selectElement);

    // circle.addEventListener('dblclick', removeEvent);

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
        selectElement(selectedElement!);
      });

    circle.addEventListener(
      // 'mouseup', () => console.log(
      //   drag ? 'drag' : 'click'));
      'mouseup', () => {
        if (!drag) removeElement(selectedElement!);
      });

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