/* 
 * support for modular Javascript libraries such as require.js
 */

;(function (factory) {
	
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}

})
