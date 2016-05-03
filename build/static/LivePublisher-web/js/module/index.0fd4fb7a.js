/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/LivePublisher-web";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	// var dialog = require('../depend/dialog/quickDialog'); //
	// var dialog = require('../../html/index.html'); //
	// console.log(dialog); // console.log($);
	// require('styles/scss/index.scss');
	// var aa = require('styles/img/user/user-2918995f22.jpg');
	// import x from '../depend/test';

	// var a = {
	//     person: {
	//         name: 'xqg'
	//     }
	// }
	// var b = {name: 'xqg'};
	// var c = {};
	// Object.assign(c, a);
	// c.person.name = 'xqg2';
	// console.log(c,a);
	// // console.log(c);
	// // console.log();
	// if(true) {
	//     console.log(2);
	// }
	// console.log(b);
	//

	// function test() {
	//     // this.name = {
	//     //     age: 20
	//     // }
	//     // return `saf`;
	// }
	// test.prototype.name = {
	//     age: 20
	// }
	// test.prototype.test2 = function(va) {
	//     test.prototype.name = {
	//         age: va
	//     }
	// }
	// var m1 = new test();
	// m1.test2(1);
	// console.log(m1.name.age);
	// var m2 = new test();
	// console.log(m2.name.age);
	// (function() {
	//     console.log(33);
	// })();
	// console.log(m1.__proto__ === m2.__proto__);
	// const $ = test();

	// var id = 1;

	// console.log(`"${id}"`);
	// // $ = test(2);
	// console.log($);
	//
	// function timeout(ms) {
	//   return new Promise((resolve, reject) => {
	//     setTimeout(resolve, ms, 'done');
	//   });
	// }

	// timeout(100).then((value) => {
	//   console.log(value);
	// });

	// (function(w) {
	//     //ie传入第三个参数
	//     if (!+[1, ]) { //除IE外，!+[1,]都是返回false
	//         (function(overrideFn) {
	//             w.setTimeout = overrideFn(w.setTimeout);
	//             w.setInterval = overrideFn(w.setInterval);
	//         })(function(originalFn) {
	//             return function(code, delay) {
	//                 var args = Array.prototype.slice.call(arguments, 2);
	//                 return originalFn(function() {
	//                     if (typeof code == 'string') {
	//                         eval(code);
	//                     } else {
	//                         code.apply(this, args);
	//                     }
	//                 }, delay);
	//             }
	//         })
	//     }
	// })(window);

	// if(!+[1,])alert("这是ie浏览器");
	// 　　 else alert("这不是ie浏览器");
	// console.log(!+[1, ]);
	//
	var set = new Set();
	set.add(1);
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
	    for (var _iterator = set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var i = _step.value;

	        console.log(i);
	    }
	} catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	} finally {
	    try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	        }
	    } finally {
	        if (_didIteratorError) {
	            throw _iteratorError;
	        }
	    }
	}

/***/ }
/******/ ]);