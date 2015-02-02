/* 
 * Author: Kevin Rodrigues.
 * Support: Jquery version 1.10.2+
 */

;(function(factory){
  //check if define/exports is a function
  if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
      module.exports = factory(require('jquery'));
  } else {
      factory(jQuery);
  }

})(function($) {

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
				navRight: '.nav-right',
				navLeft: '.nav-left'
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

			this.$el = $(el);

			//Esures the value of 'this' always references FluidSlider.
			this.changeSlide = $.proxy(this.changeSlide, this);

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

	 	  //Test to see if cssanimations are available via modernizer.
	 	  this.csstransitionsTest();
	 	  this.$el.addClass('fluid-carousel');
	 	  this.build();
	 	  this.events();
	 	  this.activate();
	 	  this.initTimer();

	 };

	 /**
	 * Appropriated out of Modernizr v2.8.3
	 * Creates a new DOM element and tests existence of properties on it's
	 * Style object to see if CSSTransitions are available
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

	/*
	 * add a css tranistion duration to the object.
	 */
	FluidSlider.prototype.addCssDuration = function() {
		var _ = this;
		this.$el.find('.slide').each(function() {
			this.style[_.csstransitions + 'Duration'] = _.settings.speed + 'ms';
		});
	}

	/*
	 * remove a css transition duration from the object.
	 */
	FluidSlider.prototype.removeCssDuration = function() {
		var _ = this;
		this.$el.find('.slide').each(function() {
			this.style[_.csstransitions + 'Duration'] = '';
		});
	}

	/*
	 * create the indicators for the slider.
	 */
	FluidSlider.prototype.build = function() {
		var $indicators = this.$el.append('<ul class="indicators">').find('.indicators');
		
		//find the total slides and update the totalSlides variable.
		this.totalSlides = this.$el.find('.slide').length;

		//increment i for every slide we have present.
		for(var i = 0; i < this.totalSlides; i++) {
			$indicators.append('<li data-index=' + i + '>');
		}

	};

	/*
	 * activate the first slide and indicator.
	 */
	FluidSlider.prototype.activate = function() {
		this.$currentSlide = this.$el.find('.slide').eq(0);
		this.$el.find('.indicators li').eq(0).addClass('active');
	};

	/*
	 * bind event handlers to events.
	 */
	FluidSlider.prototype.events = function() {
		$('body').on('click', this.settings.navRight, {direction: 'right'}, this.changeSlide);
		$('body').on('click', this.settings.navLeft, {direction: 'left'}, this.changeSlide);
		$('body').on('click', '.indicators li', this.changeSlide);
	};

	/*
	 * reset the timer. Part of the timer functionality.
	 */
	FluidSlider.prototype.clearTimer = function() {
		//if there is a timer clear it.
		if (this.timer) {
			clearInterval(this.timer);
		}
	};

	/*
	 * initialise the timer here. Part of the timer functionality.
	 */
	FluidSlider.prototype.initTimer = function() {
		//function and timer defined here. Extra parameters can be passed here but won't be supported in IE9 and below.
		this.timer = setInterval(this.changeSlide, this.settings.slideDuration);
	};

	/*
	 * start the timer here. Part of the timer functionality.
	 */
	FluidSlider.prototype.startTimer = function() {
		this.initTimer();
		this.throttle = false;
	};

	/*
	 * start main slider logic here..
	 */
	 FluidSlider.prototype.changeSlide = function(e) {

	 	//make sure the slider changes once per rotation.
	 	if (this.throttle) {
	 		return;
	 	}

	 	this.throttle = true;

	 	//stop the timer when the slider i animating.
	 	this.clearTimer();

	 	//get the sliders direction.
	 	var direction = this._direction(e);

	 	var animate = this._next(e, direction);

	 	if (!animate) {
	 		return;
	 	}

	 	//change the slide..
	 	var $nextSlide = this.$el.find('.slide').eq(this.currentSlide).addClass(direction + ' active');

	 	//check to see which animation to apply based on browser capabilities.
	 	if (!this.csstransitions) {
	 		this._jsAnimation($nextSlide, direction);
	 	} else {
	 		this._cssAnimation($nextSlide, direction);
	 	}
	 };

	 FluidSlider.prototype._direction = function(e) {
	 	var direction;

	 	if (typeof e !== 'undefined') {
	 		direction = (typeof e.data === 'undefined' ? 'right' : e.data.direction);
	 	} else {
	 		direction = 'right';
	 	}
	 	return direction;
	 };


	 /*
	  * update the plugin with the next slide number.
	  */

	  FluidSlider.prototype._next = function(e, direction) {

	  	//if the event was triggered by a slide indicator store the data-index value of that indicator.
	  	var index = (typeof e !== 'undefined' ? $(e.currentTarget).data('index') : undefined);

	  	//logic for changing the slide.
	  	switch(true) {
	  		case(typeof index !== 'undefined'):
	  		if (this.currentSlide == index) {
	  			this.startTimer();
	  			return false;
	  		}
		  		this.currentSlide = index;
		  	break;
	  		case(direction == 'right' && this.currentSlide < (this.totalSlides - 1)):
		  		this.currentSlide++;
		  	break;
	  		case(direction == 'right'):
		  		this.currentSlide = 0;
		  	break;
	  		case(direction == 'left' && this.currentSlide === 0):
	  			this.currentSlide = (this.totalSlides - 1);
  			break;
  			case(direction == 'left'):
  				this.currentSlide--;
  			break;
	  	}
	  	return true;
	  };


  	 /*
	  * Animation using css transitions..
	  */

	  FluidSlider.prototype._cssAnimation = function($nextSlide, direction) {
	  	setTimeout(function() {
	  		this.$el.addClass('transition');
	  		this.addCssDuration();
	  		this.$currentSlide.addClass('shift-' + direction);
	  	}.bind(this), 100);

	  	//remove the css transitions after its played out..
	  	setTimeout(function() {
	  		this.$el.removeClass('transition');
	  		this.removeCssDuration();
	  		this.$currentSlide.removeClass('active shift-left shift-right');
	  		this.$currentSlide = $nextSlide.removeClass(direction);
	  		this._updateIndicators();
	  		this.startTimer();
	  	}.bind(this), 100 + this.settings.speed);
	  };


	 /*
	  * Animation using javascript..
	  */

	  FluidSlider.prototype._jsAnimation = function($nextSlide, direction) {
	  	var _ = this;

	  	if (direction == 'right') {
	  		_.$currentSlide.addClass('js-reset-left');
	  	}

	  	var animation = {};
	  	animation[direction] = '0%';

	  	var animationPrev = {};
	  	animationPrev[direction] = '100%';

	  	//current slide animation..
	  	this.$currentSlide.animate(animationPrev, this.settings.speed);

	  	//Next slide animation..
	  	$nextSlide.animate(animation, this.settings.speed, 'swing', function(){

	  		_.$currentSlide.removeClass('active js-reset-left').attr('style', '');
	  		_.$currentSlide = $nextSlide.removeClass(direction).attr('style', '');
	  		_._updateIndicators();
	  		_.startTimer();
	  	});

	  };

	  FluidSlider.prototype._updateIndicators = function() {
	  	this.$el.find('.indicators li').removeClass('active').eq(this.currentSlide).addClass('active');
	  };


	  //init plugin for each instance available within the DOM.
	  //@params object options object

	  $.fn.FluidSlider = function(options) {
	  	return this.each(function (index, el) {
	  		el.FluidSlider = new FluidSlider(el, options);
	  	});
	  };

});

//some custom options for the carousel.

var args = {
	navRight: '.nav-right',
	navLeft: '.nav-left',
	speed: 1000,
	slideDuration: 4000
};

$('.carousel').FluidSlider(args);
