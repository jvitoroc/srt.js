(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["srtJs"] = factory();
	else
		root["srtJs"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ({

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toJSON = toJSON;
exports.toSRT = toSRT;
exports.secondsToTimecode = secondsToTimecode;
exports.spreadToSeconds = spreadToSeconds;
exports.timecodeToSeconds = timecodeToSeconds;

var srtJs = function srtJs() {
  /* initialize API */
};

var SEQUENCE = /^\d+$/m;
var TIMECODE_LINE = /^((\d{2}):(\d{2}):(\d{2}),(\d{3})) --> ((\d{2}):(\d{2}):(\d{2}),(\d{3}))/;
var TIMECODE = /(\d{2}):(\d{2}):(\d{2}),(\d{3})/;
var CAPTION = /^[^]+/;
var EMPTY_LINE = /^\s*$/;
/**
 * Converts timecode to seconds
 * @param {number|string} h - Hours
 * @param {number|string} m - Minutes
 * @param {number|string} s - Seconds
 * @param {number|string} ms - Miliseconds
 * @returns {number} The result of the conversion
 */

function spreadToSeconds(h, m, s, ms) {
  return h * 3600 + m * 60 + s * 1 + ms / 1000;
}
/**
 * Converts timecode to seconds
 * @param {string} timecode - Timecode
 * @returns {number} The result of the conversion 
 */


function timecodeToSeconds(timecode) {
  var spread = TIMECODE.exec(timecode);
  if (spread === null) throw new Error("[srt.js:timecodeToSeconds] Argument is invalid");
  return spreadToSeconds(spread[1], spread[2], spread[3], spread[4]);
}
/**
 * Converts s to timecode
 * @param {number} s - Seconds
 * @returns {string} The result of the conversion
 */


function secondsToTimecode(s) {
  // Check if 's' is already a timecode
  if (typeof s !== "number") return s;
  var h = Math.floor(s / 3600);
  var m = s / 60;
  var mf = Math.floor(m);
  var sf = Math.floor((m - mf) * 60);
  var ms = (s - Math.floor(s)) * 1000;
  h = h < 10 ? "0".concat(h) : h;
  mf = mf < 10 ? "0".concat(mf) : mf;
  sf = sf < 10 ? "0".concat(sf) : sf;
  ms = Math.round(ms);
  return "".concat(h, ":").concat(mf, ":").concat(sf, ",").concat(ms);
}
/**
 * Converts both timecode start and end to seconds;
 * @param {Array} timecodes
 * @returns {Object} A object that contains the results
 */


function convertTimecodes(timecodes) {
  var start = spreadToSeconds(timecodes[2], timecodes[3], timecodes[4], timecodes[5]);
  var end = spreadToSeconds(timecodes[7], timecodes[8], timecodes[9], timecodes[10]);
  return {
    start: start,
    end: end
  };
}
/**
 * Returns the JSON version of srt
 * @param {string} srt
 * @param {boolean} [convertTimecode=true] - Allow timecode to seconds conversion
 * @returns {Object} JSON version of srt
 */


function toJSON(srt) {
  var convertTimecode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var lines = srt.split("\n");
  var length = lines.length;
  var output = [];
  var buffer = {};
  var sequence;
  var timecodes;
  var currentCaption;
  var caption = "";
  var captionOffset;
  var index;

  for (var i = 0; i < length; i++) {
    // Check if line has the sequence
    if (sequence = SEQUENCE.exec(lines[i])) {
      captionOffset = 2; // Lines between sequence and caption

      index = sequence[0];
      buffer.sequence = index;
      sequence = null;

      var _timecodes = TIMECODE_LINE.exec(lines[i + 1]);

      if (_timecodes === null) {
        throw new Error("[srt.js] Timecodes are missing or in the wrong format at line ".concat(i + 1, ": ").concat(lines[i + 1]));
      }

      if (convertTimecode) Object.assign(buffer, convertTimecodes(_timecodes));else {
        buffer.start = _timecodes[1];
        buffer.end = _timecodes[6];
      }
      currentCaption = lines[captionOffset + i];

      while (EMPTY_LINE.test(currentCaption) === false && captionOffset + i < length) {
        caption += currentCaption + "\n";
        captionOffset += 1;
        currentCaption = lines[captionOffset + i];
      }

      buffer.caption = caption.slice(0, -1);
      caption = ""; // skip impossible lines

      i = i + captionOffset;
      output.push(buffer);
      buffer = {};
    }
  }

  return output;
}
/**
 * Returns the SubRip Text version of map
 * @param {Object} map
 * @returns {string} SubRip Text version of map
 */


function toSRT(map) {
  var output = "";
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _sub = _step.value;
      output += "".concat(_sub.sequence, "\n") + "".concat(secondsToTimecode(_sub.start), " --> ").concat(secondsToTimecode(_sub.end), "\n") + "".concat(_sub.caption, "\n\n");
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  output = output.slice(0, -2);
  return output;
} // Top-Level API

/***/ })

/******/ });
});