## FluidSlider

Responsive jquery plugin slider.

## Features
* Speed.
* Duration.
* Touch - (Will be added soon).
* CSS animation for modern browsers with JS fall back for the older ones (IE7, IE8 & IE9).


## Usage:

1. Custom arguments which you can pass into the call to the plugin below. Alternatively you can just specify them directly (Point 2).

```html
var args = {
	navRight: '.nav-right',
	navLeft: '.nav-left',
	speed: 1000,
	slideDuration: 4000
};

$('.carousel').FluidSlider(args);
```

2. Passing in options directly.

```html
$('.carousel').FluidSlider({
	navRight: '.nav-right',
	navLeft: '.nav-left',
	speed: 1000,
	slideDuration: 4000
});
```