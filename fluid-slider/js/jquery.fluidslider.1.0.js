/* 
 * support for modular Javascript libraries such as require.js
 */

;(function($) {

	/*
	 * Define FluidSlider as a variable of type function.
	 * Make sure its executed immediately.
	 */

	var FluidSlider = (function (el, settings) {

		var slideInstance = 0;

		function _FluidSlider(el, settings) {
			this.defaults = {
				slideDuration: '3000',
				speed: 500,
				arrowRight: '.arrow-right',
				arrowLeft: 'arrow-left'
			};

			//Create a new property to merge the users settings with the defaults above.
			this.settings = $.extend({}, this, this.defaults, settings);

			//This object will hold values that will change as the plugin operates.

			this.initials = {
				currentSlide: 0,
				$currentSlide: null,
				totalSlides: false,
				csstransitions: false
			};

			//Adds the properies of this.initials to the variable FluidSlider.
			$.extend(this, this.initials);

			this.$el = $(element);

			//Esures the value of 'this' always references FluidSlider.
			this.changeSlide = $.call(this.changeSLide, this);

			//call the init function so we can kick things off!
			this.init();

			//provide every instance of our carousel with a unique ID.
			this.slideInstance = slideInstance++;
		}

		return _FluidSlider;


	})();

	/*
	 * Called once per instance..
	 */

	 FluidSlider.prototype.init = function() {

	 	  //Test to see if cssanimations are available
	 	  this.csstransitionsTest();
	 	  // Add a class so we can style our carousel
	 	  this.$el.addClass('zippy-carousel');
	 	  // Build out any DOM elements needed for the plugin to run
	 	  // Eg, we'll create an indicator dot for every slide in the carousel
	 	  this.build();
	 	  // Eg. Let the user click next/prev arrows or indicator dots
	 	  this.events();
	 	  // Bind any events we'll need for the carousel to function
	 	  this.activate();
	 	  // Start the timer loop to control progression to the next slide
	 	  this.initTimer();
	 	
	 };

	 /**
	 * Appropriated out of Modernizr v2.8.3
	 * Creates a new DOM element and tests existence of properties on it's
	 * Style object to see if CSSTransitions are available
	 * @params void
	 * @returns void
	 *
	 */
	FluidSlider.prototype.csstransitionsTest = function(){
		var elem = document.createElement('modernizr');
		//A list of properties to test for
		var props = ["transition","WebkitTransition","MozTransition","OTransition","msTransition"];
		//Iterate through our new element's Style property to see if these properties exist
		for ( var i in props ) {
			var prop = props[i];
			var result = elem.style[prop] !== undefined ? prop : false;
			if (result){
				this.csstransitions = result;
				break;
			} 
		} 
	};


});
