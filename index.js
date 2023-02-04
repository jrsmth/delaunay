(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delaunay_1 = require("@jrsmiffy/delaunator/lib/delaunay");
const point_1 = require("@jrsmiffy/delaunator/lib/shapes/point");
const svg = {
    main: document.getElementById('main'),
    points: document.getElementById('points'),
    triangles: document.getElementById('triangles')
};
let points = [];
let selectedElement;
let currentX = 0;
let currentY = 0;
let absX = 0;
let absY = 0;
let currentMatrix;
let paramHistory = "";
let currentId;
let drag = false;
init();
// Demo Functions
function init() {
    svg.points.innerHTML = '';
    svg.triangles.innerHTML = '';
    let button = document.getElementById('refresh');
    if (button)
        button.addEventListener('click', init);
    points = generatePoints();
    triangulate(points);
}
function generatePoints() {
    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight;
    svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
    return delaunay_1.Delaunay.generatePoints(svgWidth, svgHeight, 7);
}
function triangulate(points) {
    if (!points)
        points = generatePoints();
    renderPoints(points);
    let triangulation = delaunay_1.Delaunay.triangulate(points);
    renderTriangles(triangulation);
}
function renderPoints(points) {
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
        makeInteractive(circle);
        svg.points.appendChild(circle);
        i++;
    }
}
function renderTriangles(triangles) {
    // Note: temporary implementation
    for (let triangle of triangles) {
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
// Interactive Functions - TODO: extract out?
function makeInteractive(circle) {
    circle.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    circle.addEventListener('mousedown', (event) => {
        drag = false;
        selectedElement = event.target;
        currentX = event.clientX;
        currentY = event.clientY;
    });
    circle.addEventListener('mousemove', () => {
        drag = true;
        if (selectedElement)
            selectElement(selectedElement);
    });
    circle.addEventListener('mouseup', () => {
        if (!drag && selectedElement)
            removeElement(selectedElement);
    });
}
function removeElement(element) {
    const uniqueX = element.getAttribute('cx');
    if (uniqueX)
        points = points.filter(pt => pt.x !== parseInt(uniqueX));
    svg.points.innerHTML = '';
    svg.triangles.innerHTML = '';
    triangulate(points);
}
function selectElement(element) {
    currentId = element.id;
    let transform = element.getAttribute("transform");
    if (transform)
        currentMatrix = transform.slice(7, -1).split(' ');
    for (let i = 0; i < currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
    }
    element.setAttribute("pointer-events", "none");
    svg.main.addEventListener('mousemove', moveElement);
    svg.main.addEventListener('mouseup', deselectElement);
}
function moveElement(event) {
    let dx = event.clientX - currentX;
    let dy = event.clientY - currentY;
    currentMatrix[4] += dx;
    currentMatrix[5] += dy;
    if (selectedElement) {
        absX = parseFloat(selectedElement.getAttribute("x") + "|" + currentMatrix[4]);
        absY = parseFloat(selectedElement.getAttribute("y") + "|" + currentMatrix[5]);
        selectedElement.setAttribute("transform", "matrix(" + currentMatrix.join(' ') + ")");
    }
    currentX = event.clientX;
    currentY = event.clientY;
}
function deselectElement() {
    if (selectedElement) {
        selectedElement.setAttribute("pointer-events", "all");
        paramHistory += "||" + currentId + "|" + absX + "|" + absY;
        svg.main.removeEventListener("mousemove", moveElement);
        svg.main.removeEventListener("mouseup", deselectElement);
        points.push(new point_1.Point(currentX, currentY));
        removeElement(selectedElement);
    }
    selectedElement = null;
}
// Artistic Functions

},{"@jrsmiffy/delaunator/lib/delaunay":2,"@jrsmiffy/delaunator/lib/shapes/point":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delaunay = void 0;
var point_1 = require("./shapes/point");
var triangle_1 = require("./shapes/triangle");
var edge_1 = require("./shapes/edge");
var Delaunay = /** @class */ (function () {
    function Delaunay() {
    }
    Delaunay.generatePoints = function (width, height, numPoints) {
        var pointSet = [];
        var xList = [];
        var yList = [];
        for (var i = 1; i <= numPoints; i++) {
            var newPointRequired = true;
            while (newPointRequired) {
                var candidate = this.generateRandomPoint(width, height);
                var uniqueCandidate = !(xList.includes(candidate.x) || yList.includes(candidate.y));
                if (uniqueCandidate) {
                    pointSet.push(candidate);
                    xList.push(candidate.x);
                    yList.push(candidate.y);
                    newPointRequired = false;
                } // else console.debug(`Duplicate candidate found! (x: ${candidate.x}, y: ${candidate.y})`);
            }
        }
        return pointSet;
    };
    Delaunay.triangulate = function (points) {
        var solution = [];
        if (points.length < 2)
            return solution;
        if (points.length === 2)
            return [new triangle_1.Triangle(points[0], points[0], points[1])];
        if (points.length === 3)
            return [new triangle_1.Triangle(points[0], points[1], points[2])];
        // #1 - Create a super triangle that encloses all points
        var superTriangle = triangle_1.Triangle.generateSuperTriangle(points);
        solution.push(superTriangle);
        console.log(superTriangle);
        // #2 - Build the solution by adding each vertex incrementally
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            solution = this.addVertex(solution, point);
        }
        // #3 - Discard any triangle that contains a coordinate of the super triangle
        solution = triangle_1.Triangle.discardSuperTriangle(solution, superTriangle);
        return solution;
    };
    Delaunay.render = function () {
        // TODO: Implement
    };
    Delaunay.generateRandomPoint = function (width, height) {
        // TODO: Extract to points?
        var borderRatio = 0.1;
        var xMax = width * (1 - borderRatio);
        var yMax = height * (1 - borderRatio);
        var xMin = width * borderRatio;
        var yMin = height * borderRatio;
        var xCoord = this.randomIntFromInterval(xMin, xMax);
        var yCoord = this.randomIntFromInterval(yMin, yMax);
        return new point_1.Point(xCoord, yCoord);
    };
    Delaunay.randomIntFromInterval = function (min, max) {
        // TODO: Extract to points?
        // Note: result is inclusive of min/max
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    Delaunay.addVertex = function (solution, vertex) {
        // TODO: Implement
        var edgeBuffer = [];
        // #1 - For each triangle in the solution:
        // If this point lies within said triangle's circumcircle, then discard this triangle but hold onto the edges
        // for (let i = 0; i < solution.length; i++) {
        //   const triangle = solution[i];
        //   if (vertex.isWithinCircumcircle(triangle)) {
        //     edgeBuffer.push(new Edge(triangle.pointA, triangle.pointB)); // AB edge
        //     edgeBuffer.push(new Edge(triangle.pointB, triangle.pointC)); // BC edge
        //     edgeBuffer.push(new Edge(triangle.pointA, triangle.pointC)); // AC edge
        //
        //     solution.splice(i);
        //     i -= 1;
        //   }
        // }
        var i = 0;
        while (i < solution.length) {
            var triangle = solution[i];
            if (vertex.isWithinCircumcircle(triangle)) {
                edgeBuffer.push(new edge_1.Edge(triangle.pointA, triangle.pointB)); // AB edge
                edgeBuffer.push(new edge_1.Edge(triangle.pointB, triangle.pointC)); // BC edge
                edgeBuffer.push(new edge_1.Edge(triangle.pointA, triangle.pointC)); // AC edge
                solution.splice(i, 1);
                i -= 1;
            }
            i += 1;
        }
        // #2 - Discard duplicate edges in the edge buffer; only retain edges that exist once
        edgeBuffer = edge_1.Edge.removeDuplicateEdges(edgeBuffer);
        // #3 - For all remaining edges (AB), construct a new triangle (PAB) using this point (P)
        for (var _i = 0, edgeBuffer_1 = edgeBuffer; _i < edgeBuffer_1.length; _i++) {
            var edge = edgeBuffer_1[_i];
            solution.push(new triangle_1.Triangle(vertex, edge.pointA, edge.pointB));
        }
        return solution;
    };
    return Delaunay;
}());
exports.Delaunay = Delaunay;

},{"./shapes/edge":4,"./shapes/point":5,"./shapes/triangle":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
var point_1 = require("./point");
var Circle = /** @class */ (function () {
    function Circle() {
    }
    Circle.prototype.calculateCenter = function (pointA, pointB, pointC) {
        // https://stackoverflow.com/questions/32861804/how-to-calculate-the-centre-point-of-a-circle-given-three-points
        var yDeltaOne = pointB.y - pointA.y;
        var xDeltaOne = pointB.x - pointA.x;
        var yDeltaTwo = pointC.y - pointB.y;
        var xDeltaTwo = pointC.x - pointB.x;
        var gradA = yDeltaOne / xDeltaOne;
        var gradB = yDeltaTwo / xDeltaTwo;
        var centerX = (gradA * gradB * (pointA.y - pointC.y) + gradB * (pointA.x + pointB.x) - gradA * (pointB.x + pointC.x)) /
            (2 * (gradB - gradA));
        var centerY = (-1 * (centerX - (pointA.x + pointB.x) / 2)) / gradA + (pointA.y + pointB.y) / 2;
        return new point_1.Point(centerX, centerY);
    };
    Circle.prototype.calculateRadius = function (circumferenceTriangle, center) {
        // (x-a)^2 + (y-b)^2 = r^2
        var xTakeA = center.x - circumferenceTriangle.pointA.x;
        var yTakeB = center.y - circumferenceTriangle.pointA.y;
        var radiusSquared = Math.pow(xTakeA, 2) + Math.pow(yTakeB, 2);
        return Math.sqrt(radiusSquared);
    };
    return Circle;
}());
exports.Circle = Circle;

},{"./point":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edge = void 0;
var Edge = /** @class */ (function () {
    function Edge(pointA, pointB) {
        this._pointA = pointA;
        this._pointB = pointB;
    }
    Object.defineProperty(Edge.prototype, "pointA", {
        get: function () {
            return this._pointA;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Edge.prototype, "pointB", {
        get: function () {
            return this._pointB;
        },
        enumerable: false,
        configurable: true
    });
    Edge.areEqual = function (thisEdge, comparisonEdge) {
        // TODO: consider refactor (too much static?)
        // the edges AB and CD are equal if:
        // (A == C && B == D) || (A == D && B == C)
        var pointA = thisEdge.pointA;
        var pointB = thisEdge.pointB;
        var pointC = comparisonEdge.pointA;
        var pointD = comparisonEdge.pointB;
        var ax = pointA.x;
        var ay = pointA.y;
        var bx = pointB.x;
        var by = pointB.y;
        var cx = pointC.x;
        var cy = pointC.y;
        var dx = pointD.x;
        var dy = pointD.y;
        return (ax === cx && ay === cy && bx === dx && by === dy) || (ax === dx && ay === dy && bx === cx && by === cy);
    };
    Edge.removeDuplicateEdges = function (edgeBuffer) {
        // TODO: sort naming!
        var j = 0;
        while (j < edgeBuffer.length) {
            // edges stored as eB = [(x1,y1), (x2,y2),    (X1,Y1), (X2,Y2),    ...]
            var k = j + 1; // next edge
            var thisEdge = edgeBuffer[j];
            while (k < edgeBuffer.length) {
                var tempEdge = edgeBuffer[k];
                if (Edge.areEqual(thisEdge, tempEdge)) {
                    edgeBuffer.splice(k, 1);
                    edgeBuffer.splice(j, 1);
                    j -= 1;
                    k -= 1;
                    if (j < 0 || j > edgeBuffer.length - 1)
                        break;
                    if (k < 0 || k > edgeBuffer.length - 1)
                        break;
                }
                k += 1;
            }
            j += 1;
        } // properly explain the logic behind this...
        // for each edge:
        // for each edge "ahead" of this edge:
        // compare this edge and this temp edge:
        // if they share the same coords, they must be equal and so need to be removed
        // counter gets decremented to compensate for edge removal
        return edgeBuffer;
    };
    return Edge;
}());
exports.Edge = Edge;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var circle_1 = require("./circle");
var Point = /** @class */ (function () {
    function Point(xCoord, yCoord) {
        this._xCoord = xCoord;
        this._yCoord = yCoord;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this._xCoord;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return this._yCoord;
        },
        enumerable: false,
        configurable: true
    });
    Point.prototype.isWithinCircumcircle = function (circumferenceTriangle) {
        var circumcircle = new circle_1.Circle();
        var center = circumcircle.calculateCenter(circumferenceTriangle.pointA, circumferenceTriangle.pointB, circumferenceTriangle.pointC);
        var radius = circumcircle.calculateRadius(circumferenceTriangle, center);
        var dx = center.x - this.x;
        var dy = center.y - this.y;
        return Math.pow(dy, 2) + Math.pow(dx, 2) <= Math.pow(radius, 2);
    };
    return Point;
}());
exports.Point = Point;

},{"./circle":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triangle = void 0;
var point_1 = require("./point");
var Triangle = /** @class */ (function () {
    function Triangle(pointA, pointB, pointC) {
        this._pointA = pointA;
        this._pointB = pointB;
        this._pointC = pointC;
    }
    Object.defineProperty(Triangle.prototype, "pointA", {
        get: function () {
            return this._pointA;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Triangle.prototype, "pointB", {
        get: function () {
            return this._pointB;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Triangle.prototype, "pointC", {
        get: function () {
            return this._pointC;
        },
        enumerable: false,
        configurable: true
    });
    Triangle.generateSuperTriangle = function (points) {
        var buffer = 1.1;
        var innerWidth = Math.max.apply(Math, points.map(function (pt) { return pt.x; })) * buffer;
        var innerHeight = Math.max.apply(Math, points.map(function (pt) { return pt.y; })) * buffer;
        var pointA = new point_1.Point(-innerWidth, -innerHeight);
        var pointB = new point_1.Point(0, 2 * innerHeight);
        var pointC = new point_1.Point(2 * innerWidth, 0);
        return new Triangle(pointA, pointB, pointC);
    };
    Triangle.discardSuperTriangle = function (solution, superTriangle) {
        // for each triangle in the solution, if any point equals a super triangle point then discard that triangle
        // for (let i = 0; i < solution.length; i++) {
        //   const triangle = solution[i];
        //
        //   const points = [triangle.pointA, triangle.pointB, triangle.pointC];
        //   const superPoints = [superTriangle.pointA, superTriangle.pointB, superTriangle.pointC];
        //   hit: for (const point of points) {
        //     for (const superPoint of superPoints) {
        //       if (point.x === superPoint.x || point.y === superPoint.y) {
        //         solution.splice(i);
        //         i -= 1;
        //         continue hit;
        //       }
        //     }
        //   }
        // if (
        //   triangle.pointA === superTriangle.pointA ||
        //   triangle.pointA === superTriangle.pointB ||
        //   triangle.pointA === superTriangle.pointC ||
        //   triangle.pointB === superTriangle.pointA ||
        //   triangle.pointB === superTriangle.pointB ||
        //   triangle.pointB === superTriangle.pointC ||
        //   triangle.pointC === superTriangle.pointA ||
        //   triangle.pointC === superTriangle.pointB ||
        //   triangle.pointC === superTriangle.pointC
        // ) {
        //   solution.splice(i);
        //   i -= 1;
        // }
        // }
        // Remove any tri that contains a coord of the Super T
        // for each tri, if any point equals a super T point, remove the tri
        var i = 0;
        while (i < solution.length) {
            var points = [solution[i].pointA, solution[i].pointB, solution[i].pointC];
            for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                var coord = points_1[_i];
                if ((coord.x === superTriangle.pointA.x && coord.y === superTriangle.pointA.y) ||
                    (coord.x === superTriangle.pointB.x && coord.y === superTriangle.pointB.y) ||
                    (coord.x === superTriangle.pointC.x && coord.y === superTriangle.pointC.y)) {
                    solution.splice(i, 1);
                    i -= 1;
                    break;
                }
            }
            i += 1;
        }
        return solution;
    };
    return Triangle;
}());
exports.Triangle = Triangle;

},{"./point":5}]},{},[1]);
