(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svg = void 0;
const delaunay_1 = require("@jrsmiffy/delaunator/lib/delaunay");
exports.svg = {
    main: document.getElementById('main'),
    points: document.getElementById('points')
};
init();
function init() {
    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight;
    exports.svg.main.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
    let points = delaunay_1.Delaunay.generatePoints(svgWidth, svgHeight, 10);
    console.log(points);
    // Note: temporary implementation
    for (let point of points) {
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('cx', `${point.x}`);
        circle.setAttribute('cy', `${point.y}`);
        circle.setAttribute('r', '5');
        exports.svg.points.appendChild(circle);
    }
}

},{"@jrsmiffy/delaunator/lib/delaunay":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delaunay = void 0;
var point_1 = require("./shape/point");
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
    Delaunay.generateRandomPoint = function (width, height) {
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
        // Note: result is inclusive of min/max
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return Delaunay;
}());
exports.Delaunay = Delaunay;

},{"./shape/point":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
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
    return Point;
}());
exports.Point = Point;

},{}]},{},[1]);
