/* **********************************************
                    mjs_plot

  CC MATTHEW SARSBY, 2014,Some Rights Reserved.
  
You are free to use, copy, and modify this
software in non-profit applications.
Modifications must retain this header, and a file
name in the format mjs_plot_*.js
 
mjs_plot is distributed with hope it will be useful
but WITHOUT ANY WARRANTY.

TODO:
add more functions:
 + annotations system (big!)
	- arrows
	- lines
	- text
	- annotation storage inside graphics_style
	- annotation selector, move, edit.
 - kernals graph
 - improve the interpolation algorythem
 - add fitting errors
 - improve the smooth function
 + extend graph.data type to include x and y error options
	+ include x,y,x_error_low,x_error_high,y_error_low,y_error_high
		- then expand all the function to correctally manage the propogation of errors. :/
	- start using a Series object to hold each series. this might make things cleaner?
 - add support for a series to use left or right axies top/bottom too
	- put arrows in the lines menu to show what axis that line is on
	- expand units_to_pixels and pixles_to_units to include which one (left/right, top/bottom)
 - add axies menu
	- which axis is active (left, right, both; top, bottom, both)
	- put log-lin mode changes here
	- put changable time modes here
- expand line menu to have per-line pickable line modes /colour. 
- have functions work an any series, individually. not shore how this will work.
- add remove_backgound function that seaks the longest straightline removeing the bad points.
- fix the large year spacing issure to quantise correctally.
	
 Hold ups:
None
 
 Known Bugs:
 - time in 10s of years doesn't align correctlly to decade boundaries.
 - on mobile devices if the viewport has a zoom != 1 the position infomaition is wrong.
 
 
 Done:
 2_2_6 - added y-c and x-c functions
       - history began
 2_2_7 - fixed transforms making nans (dam logs) by implementing transforms.clean() that cleans data.
       - added a curved line to log/lin and log/log graph that shows what a line in linear space looks like. 
	   - hooked onto mouseout event so that when the mouse leaves the graph the buttons on the top/bottom don't still show.
	   - sum function now works in a basic way. 
	   - added graph.errors = [] list of strings that prints before getting the scale. 
	   - added error messages throughout.
	   - imporved handling of manuly picked negative scales when chanig to log mode
	   - fixed errors trigering other errors. so now only the more useful errors are shown
	   - added not_drawn_something and no_data flags
	   - added font checks. 
	   - added version number and me to the extended info page.
2_2_8  - changed minwidth and maxwidth to guideWidth.
	   - implemented polynomial fits and a fits menu. 
	   - added data reader that sticks to the points
	   - implemented smooth function. uses weighting so that it works on unevenly spaced data. Still not great.
	   - implemented 'mid' line mode. Like zig and zag but does the vertical at the mid x-point
	   - improved the find_scale function. much simpler!
	   - fixed the major/minor ticks regression.
	   - refactored this.graphics_style inside graph.plot() to gs. 
	   - refactored context to ctx
	   - imporved line mode changing code (smaller, faster, eayser to read)
	   - imporved 'hist' line mode
	   - added 'mid' and 'hist' to the caption sketch box
	   - moved title and subtitle to draw ontop of the data. 
	   - added transforms text list so you can see the transforms stack. 
	   - fixed an extra label being drawn at the top of the scale when using narrow log mode.
	   - added fittings menu and fittings!
2_2_9  - split guideWidth into guideWidthx and guideWidthy
	   - changed over to load_gs and save_gs function. - much smaller cookies!
	   - added options pane. user can now edit everything in graphics style, even though they ofern shouldn't
	   - implemented graph.default_graphics_style as a way to change the defaults but still allow the user to make there own changes. uses graphics style peroperty called .modified that is false on fresh graphics styles. 
	   - zoom out by right click in zoom mode.
	   - overridden the right click context menu on the canvas (required for the zooming out)
	   - unified label drawing code. (about 100lines less!)
	   - added basic ability to draw grids under the data
	   - fixed the end of the mouse zoom rectangle ending on a button and activating the button.
	   - added graph.ui object. and ui.size as the size of the ui in pixels.
	   - graph.ui is set by what will fit on screen, no more buttons going away!
	   - unified find_limits. also reducing number of lines.
	   - can use local storage if it is avaliable. defaults back to cookie storage.
	   - export menu: low res png, high 3x png, data tabbed, data code style, data cvs, png for figure is a 1000px*750px image scaled up by 2.5x.
	   - fixed inconvienence with the y axis scale labels covering up the y axis label
2_2_10 - exported graph now use transparent backgrounds -  better for posters
	   - text uses the text_center method. 
2_2_10b-removed cookie based storage, reverted back to saving full JSON'd graphics_style object.
	   - added basic touch support detections and forwarding touch events to act like mouse.
	   - basic touch screen support
	   - imporved options menu layout to fit the screen better and simpler code.
	   - imporved the visibility of the caption text by using strokeText() this only works if the background isn't transparent.
	   - fixed graph.graphics_style.hidden_lines not being populated after a graphics_style reset.
	   - imporved visability of fit text by using strokeText
	   - fixed issue with the scale stepping changing if 0 was on the edge. (change between -0.0 and 0.0) causing the stepping flag to jump randomly depending on floating point rounding.
	   - added mouse mode 'mouse' for moving objects.
	   - added captions_position object to graphics_style
	   - added fit_text_position object to graphics_style
	   - can use mouse mode to move the position of the fit text and the captions
	   - captions have correct alignment depending on which quadrant they are in.
2_2_10c- changed ctx.lineJoin to rounded from miter. looks better.
	   - imporved touch support. including zoom out button. (no right click on a touch screen!)
	   - view under finger on touch screens.
	   - added mobile support as well as touch support.
	   - added flag DEBUGG_FORCE_TOUCH to help testing.
	   - fixed regression in placement of transforms list.
2_2_11 - fixed bug where the user pics an manual man/min that is off the range of the data and then picks an autoscale direction that is away from the data causing max to be lower than min (or viser versa).
	   - moved fitting function into fits object, unified fitting code.
	   - fixed bug with fittings on log scale drawing odd lines between -ve line points
	   - added y=c fitting (trivial)
	   - added option for fits to extrapolate rather than interpolate
	   - added graphics_style.fit_color boolean, no ui avaliable yet.
	   - overhaul of the infomation button. now shows other graph infomation
2_2_11b- added ax^b, a*blnx and abx^c fits.
	   - added remove-fit
	   - added remove-outliers
	   - added keep only outliers
	   - added fit option 'old' to show the old fit and not make a  new one (usefull for understanding the new functions)
	   - added graph.old_fit to hold the old fit.
	   - added gauss dirstobution
2_2_11b2 - added subtitle2 for a second line of subtitles
	   - added jitter funciton
	   - the transforms list drawn position now depends on if the subtitles are drawn or not. (looks better)
	   - improved the drawing of histograms. the bars now only go to zero. 
	   - fixed bug with intergrate transform. 
	   - added spacing function. 1/spacing is usefull for finding the data dencity
	   - added touch only on screen zoom out button, and auto zoom button.
	   - Fixed problum with the menu text now being drawn on mobile devices.
	   - Changed default fit-text posision.
	   - fixed bug with number_quote causing crashes when given NaNs
2_2_11b3 - quickfix to change MJSprecision  
2_2_12 - added JSON export [[][]] 
	   - added matlab style data export. [] with spaces between the numbers. 
2_2_13 - changed -mx+c button to be a user selectable line by drawing. was an automatic line, but that is now acheviable by picking a linear fit and then subtract fit.
2_2_14 - added time axis
       - added functions to print a time at different precisions
	   - added methods to find correct time axis
	   - added transofrms to convert time to numbers
	   - added time menu in functions menu.
	   - modified code to use get_axis_string so that time can be provided in the measure, x-c,y-c tools.
	   - added website to info button
2_2_15 - changed default apperence, font to "sans-serif", white->#111111, dark->#eeeeee.
	   - added markers on mouse-zoom while dragging to make it easyer to see where the zoom is going.
	   - pinch to zoom on mobile works in drag mode.
	   - ping zoom scale has min 0.1x and max of 10x
	   - reading off graphs is now easyer as the labels have stroked text
	   - data reader mode has stroked text for easyer reading.
2_2_16 - vastly improved the axis labels stepping charastic using font-metrics on the left
	     and right sides. meaning slim fonts jump to stepping less. 
	   - improved performace after dragging
	   - improved performace in mjs_plot() if not dragging, no need to save a drag image.
	   - added code to check for visable sequences of data, and then to only draw the data that appears
	     on screen. Huge improvements in performance when zoomed in.
	   - then only do that if the view is zoomed in, as finding sequences takes time.
	   - fixed regression in the options menu where the background wasn't transparent
	   - added show_grid option to graphic_style, grid button in lower left, grid drawing
	   - added option for middle ground colour. but this is not used anywhere yet.
	   - measure mode on mobile devices saves the gradient and measurments after the user lifted one finger.
	   - modified date printing behavour.
	   - added the 5day interval for timemode axies. the jump from 2d to 7d was too much.
	   - added fullscreen button in lower right corner. This kills the rest of the page to put the graph full size and requensts
	     that the browser goes full screen too.
2_2_17 - added shim function between mouse_move_event and the event hander
         so that if the function hasn't ended it won't try to call it again
       - added fps counter and DEBUGG_FPS global flag
       - reverted graph position overlay to be near the pointer, with 
         position caped to be on screen. This fixes a performance regression.
       - added custom function to functions.
       - function parser can now use the "now" variable. useful if working with time data.
       - line menu has add function line button and keeps track of fuction lines
       - cleaned up code when drawing simple line on the graph.
	   - modified the code for datetime printing. still trying to get this right.
0_2_18 - added mode menu in top right
	   - removed dot_size and circle_size
	   - added symbol_size as replacement
	   - removed feature: draw label over the graph.
	   - added symbols cross and x
	   - added captions menu
	   - added captions_display and show_captions to graphics style.
BREAKING CHANGES MADE rename 0_2_13 to 0_3_1
0_3_1  - fixed fonts changing size in on_mouse_over
	   - added normalisation for fits when using a time axis. Huge improvement (now usable)
	   - preliminary support for poltting error bars.
			new allowed formats:
			[x,y] // existing
			[x,y,yerror] //using yerrors
			[x,y,yerror,xerror] //using x and y errors.
			//note errors are not accounted for in transformations. yet.
			support for errors should be considered unstable.
	   - changed namespace. now using a javascirpt module pattern.
			use mjs_plot.new_graph(name,canvas)
			mjs_plot.convert_time_strings(strings)
			mjs_plot.get_graph_style()
			
			all the helper funtioncs are hidden away from the global name space.
			added "use strict"; to many functions to avoid pollution.
0_3_2  - added area consideration to gauss fitting. much more usefull now.
	   - fixed gauss fit area being upside down for right-to-left data
	   - fixed the mid variable not beging declaired.
	   - added mean_normalise function y' = (y-mean(y))/sigma(y)
	   - changed the size of the buttons to scale with the size of the tick text rather than the size of the ticks.
	   - the mouse move event text on mobile devices is at the edge rather than near the finger.
	   - removed limitation of 1e-13 being the smallest plottable number. now it is 1e-203 ish. 
	   - modified/fixed time scale behavour when working in different time zones
	   - time does scaling to the nearest start of the unit. i.e. going up in every 2h is 0,2,4,6,8 etc, not 1,3,5,7.
	   - improved tick labels for time. check if the highprecision is needed. Results in shorter strings with no losses.
0_3_3svg  - added svg output!
	   - large and small figure sizes
	   - drawing improvements (things spotted when drawing svgs
0_3_4  - changed website to github.io
       - improved right-click zoom out method. Now uses the guidewidth method.
	   - removed the "there is no x/y data to plot" error from popping up, as users draw funciton lines without any data on screen.
	   - fixed svg opacity.
	   - added svg font handling in fillText
	   - fixed bug in find_limits where there are is no data and the user picks a negative low point for a log scale. 
	   - removed the + and - buttons from the top row, this was confusing new users.
	   - replaced it with a 'graph' menu. from which users can set the title and other strings.
	   - added new options to hide the transform text.
	       this means users can clean up the axis titles to what they want before printing.
	   - improved HTML embedding export.
	   - improved text to screen. Rather than dumping all over the <body> it now places a textarea with the contents
	      and a button to go back.
	- added robustness to users zooming way out trying to break things. caps at +-1e250 and 1e-250 on log mode.
	- time now can have a scale in 1000s of years. 
	   
			
*********************************************** */

mjs_plot = (function () {

var MJS_PLOT_VERSION = '0_3_4';
var MJS_PLOT_AUTOR = 'MJS';
var MJS_PLOT_DATE = '2015';
var MJS_PLOT_WEBSITE = 'http://generalsarsby.github.io/mjs_plot/';

var DEBUGG_FORCE_TOUCH = false;
var DEBUGG_FPS = false;

var svgNS = "http://www.w3.org/2000/svg";  

var vals = [1,2,5]; // only go up in steps of 1s 2s or 5s. 
var few_minor_ticks = [2,2,5];
var many_minor_ticks = [5,4,5];

//initial color table. hand picked for up to 7 colours.
//after 7 they are generated automatically.
var color_table = [['#aa3939'],
['#aa3939','#383276'],
['#aa3939','#236467','#7b9f35'],
['#aa3939','#aa6d39','#236467','#2d882d'],
['#aa3939','#aa6d39','#236467','#2d882d','#304473'],
['#aa3939','#aa6d39','#236467','#2d882d','#304473','#ac873c']];

function hslToRgb(h, s, l){
	var r, g, b;
	if(s == 0){
		r = g = b = l; // achromatic
	} else {
		function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	return 'rgb(' +  Math.round(r * 255) +','+ Math.round(g * 255)  +','+ Math.round(b * 255) + ')';
}

function get_color(i,j){
	//j is number of colors
	//i is current color(0 starting). i.e get color 1 of 7
	//i 0-->(j-1)
	if (j<color_table.length){
		return color_table[j][i];
	}
	var sat = 1 - Math.exp(-1.1*j);
	var lightness = 0.5 + (1-Math.exp(-1.1*j))*Math.cos(i*Math.PI)*0.15;
	return hslToRgb( i/(j+1) , sat, lightness);
}

function parseExpression(text,ax,ay){
	//move some functions around from the math namespace to local so
	//they can be used inside eval.
	//ax and ay are arrays
	var sin = Math.sin;
	var cos = Math.cos;
	var tan = Math.tan;
	var ln = Math.log;
	var pi = Math.PI;
	var e = Math.E;
	var pow = Math.pow;
	var sqrt = Math.sqrt;
	var log = function(x){
		return Math.log(x)/Math.log(10);
	}
	var now = (new Date()).getTime();
	var returny = [];
	for (var i = 0;i<ax.length;i++){
		var x = ax[i];
		var y = ay[i];
		returny.push(eval(text));
	}
	return returny;
	
}

function color_from_string(s){
	var hash =321;
    for (var i = 0; i < s.length*50; i++) {
       hash = s.charCodeAt(i%s.length) + ((hash << 5) - hash);
    }
	hash = hash & hash; //convert to 32bit int (signed)
	hue = Math.abs((hash%256)/256);
	sat = 0.9;
	lightness = 0.3 + 0.2*(Math.abs(hash)%3);
	return hslToRgb(hue,sat,lightness);
}

function clone(existingArray) {
   var newObj = (existingArray instanceof Array) ? [] : {};
   for (i in existingArray) {
      if (i == 'clone') continue;
      if (existingArray[i] && typeof existingArray[i] == "object") {
         newObj[i] = clone(existingArray[i]);
      } else {
         newObj[i] = existingArray[i]
      }
   }
   return newObj;
}

function hasLocalStorage(){
    try {
        localStorage.setItem("MJSplot","Stored");
        localStorage.removeItem("MJSplot");
        return true;
    } catch(e) {
        return false;
    }
}
function isMobile(){
	var platforms = {
    Android: function() {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Windows: function() {
        return /IEMobile/i.test(navigator.userAgent);
    },
    any: function() {
        return (platforms.Android() || platforms.BlackBerry() || platforms.iOS() || platforms.Windows());
    }
	};
	return platforms.any();
};
function is_touch_device() {

	var can_touch = (('ontouchstart' in window)
		  || (navigator.MaxTouchPoints > 0)
		  || (navigator.msMaxTouchPoints > 0));
	return ((can_touch && isMobile()) || DEBUGG_FORCE_TOUCH );
}
var mouse_down = false;
var start_x = 0;
var end_x = 0;

//fix f****ng google chrome and ie. 
try {
	//might not even have log10. 
	Math.log10(100);
}
catch(e) {
	//have to add it!
	Math.log10 = function(x){
	  return Math.log(x) / Math.LN10;
	};
}

var log_vals = [[1],
		[1,3],
		[1,2,4],
		[1,2,3,6],
		[1,2,3,4,6],
		[1,2,3,4,6,8],
		[1,1.5,2,3,4,6,8],
		[1,1.5,2,2.5,3,4,6,8],
		[1,1.5,2,2.5,3,4,6,7,8],
		[1,1.2,1.5,2,2.5,3,4,5,6,7,9],
		[1,1.2,1.5,2,2.5,3,4,5,6,7,8,9],
		[1,1.2,1.4,1.6,1.8,2,2.5,3,4,5,6,7,8,9],
		[1,1.1,1.2,1.3,1.4,1.6,1.8,2,2.2,2.4,2.6,2.8,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
		[1,1.1,1.2,1.3,1.4,1.6,1.8,2,2.2,2.4,2.6,2.8,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
		[1,1.05,1.1,1.15,1.2,1.25,1.3,1.4,1.6,1.8,2,2.2,2.4,2.6,2.8,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
		[1,1.05,1.1,1.15,1.2,1.25,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.2,2.4,2.6,2.8,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
		[1,1.05,1.1,1.15,1.2,1.25,1.3,1.35,1.4,1.45,1.5,1.55,1.6,1.65,1.7,1.75,1.8,1.85,1.9,1.95,2,2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.8,2.9,3,3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
		];

var log_vals_ticks = [[1,3],
		[1,2,3,4,5,6,7,8,9],
		[1,2,3,4,5,6,7,8,9],
		[1,2,3,4,5,6,7,8,9],
		[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,3,4,5,6,7,8,9],
		[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.5,3,4,5,6,7,8,9],
		[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,8,9],
		[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.25,2.75,3,3.5,4,4.5,5,5.5,6,6.5,7,8,9],
		[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.25,2.75,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,9],
		[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.2,2.4,2.6,2.8,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,9],
		[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.2,2.4,2.6,2.8,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,9]
		]; //minor tick mode changes after this many. 

		
		//There is no ruleset to generate the allowed time intervals. so I've just written them out. all in milliseconds.
 //                      all the miliseeconds up to   the seconds - a base 60 system   minuilts - a base 60 system               hours -  a base 12/24system                      days
//                       500 ms                     1s   2s   5s   10s   20s   30s   1m    2m     5m     10m    15m    20m     30m     1h      2h      3h       6h       12h      1d       2d        5d        7d        14d        30d        60d        180d        1y          2y          5y           10y          20y          50y           100y          200y          500y           1000y
var allowed_intervals = [1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,30000,60000,120000,300000,600000,900000,1200000,1800000,3600000,7200000,10800000,21600000,43200000,86400000,172800000,432000000,604800000,1209600000,2592000000,5184000000,15552000000,31536000000,63072000000,157680000000,315360000000,630720000000,1576800000000,3153600000000,6307200000000,15768000000000,31536000000000 ];
         var time_ticks=[0.2,0.5,1,2 ,5 ,10,20 ,50 ,100,200 ,500 ,1000,2000 ,5000 ,10000,20000,30000 ,60000 ,120000,300000,300000 ,600000 ,1200000,1800000,3600000 ,7200000 ,10800000,21600000,43200000 ,86400000 , 86400000 ,172800000 ,864000000 ,1728000000,2592000000 ,7884000000 ,31536000000,31536000000 ,63072000000 ,157680000000,315360000000 ,630720000000 ,1576800000000,3153600000000,6307200000000 ];
//                                                                                                                                                                                                                        2d         10d        20d        30d         1/4y        1/y
	var string_precisions = [8,8,8,7, 7 ,7 ,6  ,6  ,6  ,5   ,5   ,5   ,5    ,5    ,5    ,4    ,4     ,4     ,4     ,4      ,4      ,4      ,3      ,3      ,3      ,3       ,3       ,2       ,2        ,2        ,2         ,2         ,1         ,1          , 0         ,0        ,0          ,0           ,0            ,0          ,0            ,0            ,0            ,0              , 0];
	

function download_text(text,filename,type){
	var ftype = type || 'data:text/plain;charset=utf-8';
	var pom = document.createElement('a');
	//data:image/svg+xml;charset=utf-8
	pom.setAttribute('href', ftype+',' + encodeURIComponent(text));
	//pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	//pom.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);
	pom.style.display = 'none';
	document.body.appendChild(pom);
	console.log('downloading '+filename);
	pom.click();
	document.body.removeChild(pom);
}

function show_text_to_screen(text,graph){

	var pom = document.createElement('button');
	var textDiv = document.createElement('div');
	
	pom.setAttribute('onclick', 'location.reload()');
	pom.innerHTML  = "back";
	pom.style.display = 'block';
	
	var export_textarea = document.createElement('textarea');
	export_textarea.style.width = 0.8*graph.canvas.width+'px';
	export_textarea.style.height = 0.8*graph.canvas.height+'px';
	
	textDiv.appendChild(pom);
	textDiv.appendChild(export_textarea);
	
	export_textarea.value = text;
	graph.canvas.parentNode.appendChild(textDiv);
	graph.canvas.parentNode.removeChild(graph.canvas);
	
}


	
function save_gs(name, gs){
	//bake_cookie(name, gs);
	if (hasLocalStorage()){
		var string = JSON.stringify(gs);
		localStorage.setItem(name, string);
	} else {
		console.log("No local storage!");
	}
}

function load_gs(graphname){
	var gs  = mjs_plot.get_graph_style();
	if (hasLocalStorage()){
		var result = localStorage.getItem(graphname);
		result && (result = JSON.parse(result));
		result && (gs = result);
	} else {
		console.log("No local storage!");
	}
	 return gs;
	
	
}

function linear_regression(x,y){
	var sum_x = 0;
	var sum_y = 0;
	var sum_xx = 0;
	var sum_xy = 0;
	for (var i = 0;i<x.length;i++){
		sum_x += x[i];
		sum_xx += x[i]*x[i];
		sum_y += y[i];
		sum_xy +=x[i]*y[i];
	}
	var n = x.length;
	sum_xy -= sum_x*sum_y/n;
	sum_xx -= sum_x*sum_x/n;
	var b = sum_xy / sum_xx;
	var a = sum_y/n - b * sum_x/n;
	return slope = {a : a,b : b}
}

function series_stats(x,y){
	var sum_x = 0;
	var sum_y = 0;
	var sum_xx = 0;
	var sum_xy = 0;
	var sum_yy = 0;
	for (var i = 0;i<x.length;i++){
		sum_x += x[i];
		sum_xx += x[i]*x[i];
		sum_y += y[i];
		sum_xy +=x[i]*y[i];
		sum_yy +=y[i]*y[i];
	}
	var n = x.length;
	sum_xy -= sum_x*sum_y/n;
	sum_xx -= sum_x*sum_x/n;
	sum_yy -= sum_y*sum_y/n;
	
	//the r^2 value
	var r_2 = sum_xy * sum_xy / sum_xx / sum_yy;
	
	var x_mean = sum_x/n;
	var y_mean = sum_y/n;
	var sigma_x = Math.sqrt(sum_xx / n);
	var sigma_y = Math.sqrt(sum_yy / n);
	//covarience(x,y)
	var cov = sum_xy / n;
	//slope of linear regression
	var b = sum_xy / sum_xx;
	//intercept of linear regression
	var a = sum_y/n - b * sum_x/n;
	// s is varience in regression error
	var s = Math.sqrt( (sum_yy - sum_xy*sum_xy/sum_xx)/(n-2) );
	// standard error on b
	var s_b = s / Math.sqrt(sum_xx);
	//standard error in a
	var s_a = s * Math.sqrt( 1/n + x_mean * x_mean/sum_xx );
	var ymin = Math.min.apply(null, y );
	var ymax = Math.max.apply(null, y );
	var xmin = Math.min.apply(null, x );
	var xmax = Math.max.apply(null, x );
	
	return stats = {x_mean : x_mean,
					y_mean : y_mean,
					sigma_x: sigma_x,
					sigma_y:sigma_y,
					cov    : cov,
					b      : b,
					a      : a,
					s_b    : s_b,
					s_a    : s_a,
					n      : n,
					r_2    : r_2,
					ymin   : ymin,
					ymax   : ymax,
					xmin   : xmin,
					xmax   : xmax};
}

 
 function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}

function trim(n,l,h){
	//trimps a number to the range l<-->h
	n = Math.max(n,l);
	n = Math.min(n,h);
	return n;
}

function mjs_time_difference_print(milliseconds){
	//for printing the elapsed time. not absolute time.
	var d = milliseconds/1000
	milliseconds = milliseconds%1000;
	 var seconds = Math.floor(d%(60));
      var min = Math.floor(d/60%(60));
      var hours = Math.floor(d/60/60%(24));
      var days = Math.floor(d/60/60/24);
	var s = '';
	if (seconds>0){s= seconds+'seconds ' +milliseconds.toFixed(0) +'ms' }
	if (min>0){s=  min+'min ' + seconds+'seconds'}
	if (hours>0){s= hours+'hours '+ min+'min ' + seconds+'seconds' ;}
	if (days>0){s = days+'days ' + hours+'hours ' + min+'min'; }
	return s;
}

 function mjs_date_print(milliseconds,hp,lp){
	//milliseconds is the date
	//hp and lp in the range 0-8 inclusive
	// yyyy-mm-dd HH:MM:ss.###
	//   0   1 2  3  4  5  678
	//eg     hp   -> lp
    //     mm-dd HH:mm
	//
	hp = isFinite(hp) ? hp : 0;
	lp = isFinite(lp) ? lp : 8;
	
	//there is usully enough space for two even if it's not asked for.
	//if (hp == lp){hp--;}
	hp = trim(hp,0,8);
	//if (hp == lp){lp--;}
	lp = trim(lp,0,8);
	hp = Math.min(hp,lp);
	
	var d = new Date(milliseconds);
	var s = '';
	
	//if the day is first hp==2 put the day mon tue wed...
	var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	
	
	//if (hp == 2){s+=days[d.getDay()];}
	//if (hp == 2){s+=months[d.getMonth()];}
	
	
	if ( hp == 2 && lp == 2 ){
		s+=(d.getMonth()+1)+'-'//months[d.getMonth()]
	}
	
	
	
	if (hp == 1 && lp>1){s+=months[d.getMonth()]+'-';hp++;}
	
	if (hp == 3 && (lp == 4 || lp == 3)){
		s+=padLeft(d.getHours(),2,'0');
		s+=':'+padLeft(d.getMinutes(),2,'0');
		return s;
	}
	
	if (hp == 4 && lp == 4){
		s+=padLeft(d.getHours(),2,'0');
		s+=':'+padLeft(d.getMinutes(),2,'0');
		return s;
	}
	
	if (hp == 4 && lp == 5){
		s+=padLeft(d.getMinutes(),2,'0');
		s+='m'+padLeft(d.getSeconds(),2,'0') +'s';
		return s;
	}
	if (hp == 1 && lp == 1){
		s=months[d.getMonth()];
		return s;
	}
	
	
	if (hp <= 0){s+=d.getFullYear();}
	if (hp <= 0 && lp >= 1){s+='-';}
	if (hp <= 1 && lp >= 1){s+=(d.getMonth()+1);}
	if (hp <= 1 && lp >= 2){s+='-';}
	if (hp <= 2 && lp >= 2){s+=(d.getDate());}
	if (hp <= 2 && lp >= 3){s+=' ';}
	if (hp <= 3 && lp >= 3){s+=padLeft(d.getHours(),2,'0');}
	if (hp <= 3 && lp >= 4){s+=':';}
	if (hp <= 4 && lp >= 4){s+=padLeft(d.getMinutes(),2,'0');}
	if (hp <= 4 && lp >= 5){s+=':';}
	if (hp <= 5 && lp >= 5){s+=padLeft(d.getSeconds(),2,'0');}
	if (hp <= 5 && lp >= 6){s+='.';}
	if (hp <= 6 && lp >= 6){s+=padLeft(d.getMilliseconds(),3,'0')[0];}
	if (hp <= 7 && lp >= 7){s+=padLeft(d.getMilliseconds(),3,'0')[1];}
	if (hp <= 8 && lp >= 8){s+=padLeft(d.getMilliseconds(),3,'0')[2];}
	
	//touches to make things easyer to read
	//hours are last without seconds
	if (lp == 3 && hp <=3){s+='h';}
	if (lp == 4 && hp == 4){s+='m';}
	if (lp == 5 && (hp ==5 || hp == 4)){s+='s';}
	
	return s;	
 }

function round_to_month(milliseconds){
	//takes a milliseconds date and returns milliseconds rounded to the nearest month
	var d = new Date(milliseconds);
	var down = d.getDate();
	var u = new Date(d.getFullYear(),d.getMonth()+1,0);
	var up = u.getDate() - down;
	if (down < up){
		return milliseconds - (down-1)* 24*60*60*1000;
	} else {
		return milliseconds + (up+1)* 24*60*60*1000;
	}
}
 
 function round_to_year(milliseconds){
	var d = new Date(milliseconds);
	var down = new Date(d.getFullYear(),0,1);
	var up = new Date(d.getFullYear()+1,0,1);
	if (d.getTime()-down.getTime() < up.getTime() - d.getTime()  ){
		return down.getTime();
	} else {
		return up.getTime();
	}
 }
 
 //var pm = String.fromCharCode( 177 ); //the plus minus sign

var fits = {
	//each fit has some_fit and some_fun
	//some_fun takes an array of x and the params for the fit returning an array of y
	//some_fit takes an array of x and and array of y
	//returning parameters - arbitary length array of numbers from the result of the fit
	//returning strings - an array length 3 of string to describe to the user the results (ofern printed)
	//returning fun - a function that will realise this fit.
	exponential_fun : function(x,params){
		var y = [];
		for (var i=0;i<x.length;i++){
			y.push(params[0] * Math.pow(Math.E, params[1] * x[i]));
		}
		return y;
	},
	exponential : function(ox,oy){
		//y = Ae^Bx
		var x = [];
		var y = [];
		for (var i=0; i<ox.length;i++){
			if ( oy[i] >0){
				x.push(ox[i]);
				y.push(oy[i]);
			}
		}
		var sum = [0, 0, 0, 0, 0, 0];
		var results = [];
		for (var n=0; n < x.length; n++) {
			sum[0] += x[n];
			sum[1] += y[n];
			sum[2] += x[n] * x[n] * y[n];
			sum[3] += y[n] * Math.log(y[n]);
			sum[4] += x[n] * y[n] * Math.log(y[n]);
			sum[5] += x[n] * y[n];
		}
		var denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
		var A = Math.pow(Math.E, (sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
		var B = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
		var string = 'y = ' +mjs_precision(A,5)  + 'e^(' + mjs_precision(B,5) + 'x)';
		
		return { parameters:[A,B], strings : [string,'',''], fun : fits.exponential_fun}
	},
	exponential_plus_c_fun : function(x,params){
		var y = [];
		for (var i=0;i<x.length;i++){
			y.push(  params[0] + params[1]*Math.exp(params[2]*x[i]) );
		}
		return y;
	},
	exponential_plus_c : function(x,y){
		//a + b exp(c*x);
		var len = x.length;
		var S_xx=0,S_xs=0,S_ss=0,S_yx=0,S_ys=0,s=[];
		s[0] = 0
		for (var i=1; i < len; i++) {
			s[i] = s[i-1]+0.5*(y[i]+y[i-1])*(x[i]-x[i-1]);
		}
		for (var i=0; i < len; i++) {
			S_xx += (x[i]-x[0])*(x[i]-x[0]);
			S_xs += (x[i]-x[0])*s[i];
			S_ss += s[i]*s[i];
			S_yx += (y[i]-y[0])*(x[i]-x[0]);
			S_ys += (y[i]-y[0])*s[i];
		}
		var f = 1.0/(S_xx*S_ss-S_xs*S_xs);
		var A_1 = f * (S_ss*S_yx - S_xs*S_ys);
		var B_1 = f * (S_xx*S_ys - S_xs*S_yx);//B_1 = C_1 =C_2
		a = -1*A_1/B_1;
		var S_t=0,S_tt=0,S_y=0,S_yt=0,t=0;
		for (var i=0; i < len; i++) {
			t = Math.exp(B_1*x[i]);
			S_t += t;
			S_tt += t*t;
			S_y += y[i];
			S_yt += y[i]*t;
		}
		f = 1/(S_tt*len - S_t*S_t);
		var a_2 = f*(S_tt*S_y-S_t*S_yt);
		var b_2 = f*(len*S_yt-S_t*S_y);
		a=a_2;
		var string = 'y = ' + mjs_precision(a,5) + '+'+mjs_precision(b_2,5)+'e^(' + mjs_precision(B_1,5)+ 'x)';
		return {parameters: [a, b_2,B_1], strings: [string,'',''],fun:fits.exponential_plus_c_fun};
	},
	gauss_fun : function(x,params){
		//asdf
		var y = [];
		var mu = params[0];
		var sig = params[1];
		var root_two_pi = Math.sqrt(Math.PI * 2);
		for (var i=0;i<x.length;i++){
			y.push( params[2]/root_two_pi/sig * Math.exp(-0.5* Math.pow((x[i]-mu)/sig,2)) );//*sig * 1.0/(sig * root_two_pi)
		}
		return y;
	},
	gauss : function(x,y){
		//taken from Cad de la fonction densite de probabilite de Gauss
		// Regression et Equation Intergrale
		// application a la distrobution Gaussienne
		var len = x.length;
		var s=[];
		s[0] = 0;
		var area = 0;
		
		for (var i=1; i < len; i++) {
			s[i] = s[i-1]+0.5*(y[i]+y[i-1])*(x[i]-x[i-1]);
			
		}
		area =Math.abs(s[i-1]);
		var t = [];
		t[0] = 0;
		for (var i=1; i < len; i++) {
			t[i] = t[i-1]+0.5*(x[i]*y[i]+x[i-1]*y[i-1])*(x[i]-x[i-1]);
		}
		var S_ss=0,S_st=0,S_tt=0,S_ys=0,S_yt=0;
		for (var i=0; i < len; i++) {
			S_ss +=s[i]*s[i];
			S_st +=s[i]*t[i];
			S_tt +=t[i]*t[i];
			S_ys +=(y[i]-y[0])*s[i];
			S_yt +=(y[i]-y[0])*t[i];
		}
		var f = 1/(S_ss*S_tt - S_st*S_st);
		var A = f * ( S_tt*S_ys - S_st*S_yt );
		var B = f * ( S_ss*S_yt - S_st*S_ys );
		//book says:
		var sig = -1.0/B* Math.sqrt(2.0/Math.PI);
		// I found:
		var sig = Math.sqrt(-1.0/B);
		var mu = -A/B;
		var string1 = 'A/(sig * sqrt(2pi)) exp(-0.5*((x-mu)/sig)^2)';
		var string2 = 'sig = ' + mjs_precision(sig,5) + ",  A = " + + mjs_precision(area,5);
		var string3 = 'mu = ' + mjs_precision(mu,5);
		
		return {parameters: [mu,sig,area], strings: [string1,string2,string3],fun:fits.gauss_fun};
	},
	
	linear_fun : function(x,params){
		var y = [];
		for (var i=0;i<x.length;i++){
			y.push( x[i]*params[0]+params[1] );
		}
		return y;
	},
	linear : function(x,y){
		var sum_x = 0;
		var sum_y = 0;
		var sum_xx = 0;
		var sum_xy = 0;
		var sum_yy = 0;
		for (var i = 0;i<x.length;i++){
			sum_x += x[i];
			sum_xx += x[i]*x[i];
			sum_y += y[i];
			sum_xy +=x[i]*y[i];
			sum_yy +=y[i]*y[i];
		}
		var n = x.length;
		sum_xy -= sum_x*sum_y/n;
		sum_xx -= sum_x*sum_x/n;
		sum_yy -= sum_y*sum_y/n;
		var x_mean = sum_x/n;
		var y_mean = sum_y/n;
		//the r^2 value
		var r_2 = sum_xy * sum_xy / sum_xx / sum_yy;
		//slope of linear regression
		var b = sum_xy / sum_xx;
		//intercept of linear regression
		var a = sum_y/n - b * sum_x/n;
		// s is varience in regression error
		var s = Math.sqrt( (sum_yy - sum_xy*sum_xy/sum_xx)/(n-2) );
		// standard error on b
		var s_b = s / Math.sqrt(sum_xx);
		var s_a = s * Math.sqrt( 1/n + x_mean * x_mean/sum_xx );
		var squared = String.fromCharCode( 178 ); //σ²
		string1 = 'r'+squared+' = ' + number_quote(r_2,1-r_2);
		string2 = 'intecept a = ' + number_quote(a,s_a) +
					',   S(a) = ' +mjs_precision(s_a,2);
		string3 = 'slope b = ' + number_quote(b,s_b) + 
					',   S(b) = ' +mjs_precision(s_b,2);
		return {parameters: [b,a], strings: [string1,string2,string3],fun:fits.linear_fun};
	},
	constant_fun : function(x,params){
		var y = [];
		for (var i=0;i<x.length;i++){
			y.push( params[0] );
		}
		return y;
	},
	constant : function(x,y){
		var sum_y = 0;
		var sum_yy = 0;
		for (var i = 0;i<x.length;i++){
			sum_y += y[i];
			sum_yy +=y[i]*y[i];
		}
		var n = x.length;
		sum_yy -= sum_y*sum_y/n;
		var y_mean = sum_y/n;
		var sigma_y = Math.sqrt(sum_yy / n);
		string1 = 'y='+number_quote(y_mean,sigma_y) + String.fromCharCode( 177 ) + mjs_precision(sigma_y,2);
		return {parameters: [y_mean], strings: [string1,'',''],fun:fits.constant_fun};
	},
	poly2 : function(x,y){
		return fits.polyn_fit(x,y,2);
	},
	poly3 : function(x,y){
		return fits.polyn_fit(x,y,3);
	},
	poly4 : function(x,y){
		return fits.polyn_fit(x,y,4);
	},
	poly5 : function(x,y){
		return fits.polyn_fit(x,y,5);
	},
	poly6 : function(x,y){
		return fits.polyn_fit(x,y,6);
	},
	poly7 : function(x,y){
		return fits.polyn_fit(x,y,7);
	},
	poly8 : function(x,y){
		return fits.polyn_fit(x,y,8);
	},
	//polynomial function break the normal api internally
	//as they forward to the generic poly n method with different order
	polyn_fun : function(x,params){
		var y = [];
		for (var i = 0; i < x.length; i++) {
			y[i] = 0;
			for (var w = 0; w < params.length; w++) {
				y[i] += params[w] * Math.pow(x[i], w);
			}
		 }
		 return y;
	},
	polyn_fit : function(x,y,o){
		var lhs = [], rhs = [], a = 0, b = 0, i = 0, k = o + 1;
		for (var i = 0; i < k; i++) {
			for (var l = 0, len = x.length; l < len; l++) {
				a += Math.pow(x[l], i) * y[l];
			}
			lhs.push(a);
			a = 0;
			var c = [];
			for (var j = 0; j < k; j++) {
				for (var l = 0, len = x.length; l < len; l++) {
					b += Math.pow(x[l], i + j);
				}
				c.push(b), b = 0;
			}
			rhs.push(c);
		}
		rhs.push(lhs);
		//begin gaussian elemination  . . . 
	   var j = 0, k = 0, maxrow = 0, tmp = 0, n = rhs.length - 1;
	   for (i = 0; i < n; i++) {
		  maxrow = i;
		  for (j = i + 1; j < n; j++) {
			 if (Math.abs(rhs[i][j]) > Math.abs(rhs[i][maxrow]))
				maxrow = j;
		  }
		  for (k = i; k < n + 1; k++) {
			 tmp = rhs[k][i];
			 rhs[k][i] = rhs[k][maxrow];
			 rhs[k][maxrow] = tmp;
		  }
		  for (j = i + 1; j < n; j++) {
			 for (k = n; k >= i; k--) {
				rhs[k][j] -= rhs[k][i] * rhs[i][j] / rhs[i][i];
			 }
		  }
	   }
	   var  coeffs = [];
	   for (j = n - 1; j >= 0; j--) {
		  tmp = 0;
		  for (k = j + 1; k < n; k++)
			 tmp += rhs[k][j] * coeffs[k];
		  coeffs[j] = (rhs[n][j] - tmp) / rhs[j][j];
	   }
	   fit = [];
		for (var i = 0; i < x.length; i++) {
			fit[i] = 0;
			for (var w = 0; w < coeffs.length; w++) {
				fit[i] += coeffs[w] * Math.pow(x[i], w);
			}
		 }
		var sum_x = 0;
		var sum_y = 0;
		var sum_xx = 0;
		//var sum_xy = 0;
		var sum_yy = 0;
		var sum_ff = 0;
		for (var i = 0;i<x.length;i++){
			sum_x += x[i];
			sum_xx += x[i]*x[i];
			sum_y += y[i];
			//sum_xy +=x[i]*y[i];
			sum_yy +=y[i]*y[i];
		}
		var y_mean = sum_y/x.length;
		var ss_reg = 0;
		var ss_res = 0;
		for (var i = 0;i<x.length;i++){
			ss_reg += (fit[i] - y_mean)*(fit[i] - y_mean);
			ss_res += (fit[i] - y[i])*(fit[i] - y[i]);
		}
		
		var n = x.length;
		var ss_tot = sum_yy - sum_y*sum_y/n;
		var ss_reg = sum_ff;
		var r_squared = 1-ss_res/ss_tot;
		var squared = String.fromCharCode( 178 ); //σ²
		var string2 = 'y = ';
		var string3 = '';
		if (coeffs.length>4){
		for(var i = coeffs.length-1; i >= 4; i--){
		  if(i > 1) string2 += mjs_precision(coeffs[i],5)+ 'x^' + i + ' + ';
		  else if (i == 1) string2 += mjs_precision(coeffs[i],5) + 'x' + ' + ';
		  else string2 += mjs_precision(coeffs[i],5);
		}
		for(; i >= 0; i--){
		  if(i > 1) string3 += mjs_precision(coeffs[i],5)+ 'x^' + i + ' + ';
		  else if (i == 1) string3 += mjs_precision(coeffs[i],5) + 'x' + ' + ';
		  else string3 += mjs_precision(coeffs[i],5);
		}
		} else {
		for(var i = coeffs.length-1; i >= 0; i--){
		  if(i > 1) string2 += mjs_precision(coeffs[i],5)+ 'x^' + i + ' + ';
		  else if (i == 1) string2 += mjs_precision(coeffs[i],5) + 'x' + ' + ';
		  else string2 += mjs_precision(coeffs[i],5);
		}
		}
		
		string1 = 'r'+squared+' = ' + number_quote(r_squared,1-r_squared);
		//return coeffs;
		return {parameters: coeffs, strings: [string1,string2,string3],fun:fits.polyn_fun};
	},
	log_fun : function(x,params){
		var y = [];
		for (var i = 0; i < x.length; i++) {
			y.push( params[0] + params[1]*Math.log(x[i] ));
		}
		return y;
	},
	log : function(ox,oy){
		//protect against negative x
		var x = [];
		var y = [];
		for (var i=0; i<ox.length;i++){
			if ( ox[i] > 0 ){
				x.push(ox[i]);
				y.push(oy[i]);
			}
		}
		var S_lx = 0;
		var S_ylx = 0;
		var S_y = 0;
		var S_lxlx=0;
		var l = x.length;
		for (n=0; n < l; n++) {
			S_lx += Math.log(x[n]);
			S_ylx += y[n] * Math.log(x[n]);
			S_y += y[n];
			S_lxlx += Math.pow(Math.log(x[n]), 2);
		}

		var B = (n * S_ylx - S_y * S_lx) / (n * S_lxlx - S_lx * S_lx);
		var A = (S_y - B * S_lx) / n;

		var string = 'y=' + mjs_precision(A,4) + ' + ' + mjs_precision(B,4) + ' ln(x)';

		return {parameters: [A, B], strings: [string,'',''], fun:fits.log_fun};
	},
	power_plus_c_fun : function(x,params){
		var y = [];
		for (var i=0;i<x.length;i++){
			y.push(  params[0] + params[1]*Math.pow(x[i],params[2]) );
		}
		return y;
	},
	power_plus_c : function(x,y){
		var nx = [];
		var ny = [];
		for (var i=0; i<x.length;i++){
			xi = Math.log(x[i]);
			if (isFinite(xi)){
				nx.push(xi);
				ny.push(y[i]);
			}
		}
		var r = fits.exponential_plus_c(nx,ny);
		var string = 'y = ' + mjs_precision(r.parameters[0],5) + '+'+mjs_precision(r.parameters[1],5)+'x^' + mjs_precision(r.parameters[2],5);
		r.strings = [string,'',''];
		r.fun = fits.power_plus_c_fun;
		return r
		
	},
	power_fun : function(x,params){
		var y = [];
		for (var i = 0; i < x.length; i++) {
			y.push( params[0] *Math.pow(x[i] , params[1] )   );
		}
		return y;
	},
	power : function(ox,oy){
		var x = [];
		var y = [];
		for (var i=0; i<ox.length;i++){
			if ( ox[i] > 0 && oy[i] >0){
				x.push(ox[i]);
				y.push(oy[i]);
			}
		}
		var l = x.length
		var S_lx = 0;
		var  S_lylx = 0;
		var S_ly = 0;
		var S_lxlx = 0;
		for (var i=0; i < l; i++) {
			S_lx += Math.log(x[i]);
			S_lylx += Math.log(y[i]) * Math.log(x[i]);
			S_ly += Math.log(y[i]);
			S_lxlx += Math.pow(Math.log(x[i]), 2);
		}
		var B = (l * S_lylx - S_ly * S_lx) / (l * S_lxlx - S_lx * S_lx);
		var A = Math.pow(Math.E, (S_ly - B * S_lx) / l);
		var string = 'y=' + mjs_precision(A,4)+ 'x^' + mjs_precision(B,4);
		return {parameters: [A, B], strings: [string,'',''], fun:fits.power_fun};
	},
	pre_fit_normalizing : function(x){
		var s = series_stats(x,x);
		var x_primed = clone(x);
		for (var i = 0;i<x.length;i++){
			x_primed[i] = (x[i] - s.x_mean)/s.sigma_x;
		}
		var string1 = "normalized (x-" + s.x_mean+")/"+s.sigma_x;
		return {x:x_primed,s:string1,x_mean:s.x_mean,sigma_x:s.sigma_x}
	},
	post_fit_normalizing : function(x,normalised){
		var x_primed = clone(x);
		for (var i = 0;i<x.length;i++){
			x_primed[i] = (x[i] - normalised.x_mean)/normalised.sigma_x;
		}
		return x_primed
	}
}
fits.fit_strings = ['exp','exp_c','linear','quad', 'cubic','poly4','poly5','poly6','poly7','const','log','power','power_c','gauss'];
fits.fit_funs = [fits.exponential,fits.exponential_plus_c,fits.linear,fits.poly2,fits.poly3,fits.poly4,fits.poly5,fits.poly6,fits.poly7,fits.constant,fits.log,fits.power,fits.power_plus_c,fits.gauss];
			
function mjs_precision(number,precision){
	var precision = Math.max(1,precision);
	
	if (precision<1){precision =1;}
	if (precision>21){precision =21;}
	/*
	if (Math.abs(number) < 1e-13){
		number = 0;
		return number.toFixed(precision);
	}
	*/
	if (Math.abs(number) < 1e-3){
		return label = number.toExponential(precision); 
	}
	var label = number.toPrecision(precision);
	//this bit of mess fixes the strings that say 3.1e+2 rather than 310.
	//as '3.1e+2' is longer (6) than '310' (3).
	if (label.length > number.toPrecision(precision+2).length){
		label =  number.toPrecision(precision+2);
	}
	if (label.length > number.toPrecision(precision+1).length){
		label =  number.toPrecision(precision+1);
	}
	if (label.length > number.toPrecision(precision+3).length){
		label =  number.toPrecision(precision+3);
	}
	
	return label
}



function number_quote(number,error){
	//returns a string which would be correct to quote to the given error.
	// assuming that error is given to 2 sig fig.
	if (! isFinite(error)){error = 1e-20;}
	if (! isFinite(number)){number = 0;}
	return mjs_precision(number, Math.max(2,Math.floor(Math.log10(Math.abs(number))) -   Math.floor(Math.log10(Math.abs(error))) + 2) );
}


function drawEllipse(ctx, centerX, centerY, radiusX, radiusY) {
	ctx.beginPath();
	
	var rotationAngle = 0.5;
	
	for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
		var xPos = centerX - (radiusX * Math.sin(i)) * Math.sin(rotationAngle * Math.PI) + (radiusY * Math.cos(i)) * Math.cos(rotationAngle * Math.PI);
		var yPos = centerY + (radiusY * Math.cos(i)) * Math.sin(rotationAngle * Math.PI) + (radiusX * Math.sin(i)) * Math.cos(rotationAngle * Math.PI);
		if (i == 0) {
			ctx.moveTo(graph.units_to_pixels(xPos,'x'),graph.units_to_pixels(yPos,'y') );
		} else {
			ctx.lineTo(graph.units_to_pixels(xPos,'x'),graph.units_to_pixels(yPos,'y'));
		}
	}
	ctx.stroke();
}


function mouse_move_event(event,graph){
	graph.ui.latestEvent = event;
	if(!graph.ui.ticking) {
		graph.ui.ticking = true;
		requestAnimationFrame( function(){mouse_move_event_shim(graph.ui.latestEvent,graph);} );
		//setTimeout(function(){mouse_move_event_shim(graph.ui.latestEvent,graph);}, 10);
	}
	
}

function mouse_move_event_shim(event,graph){
	var start_time = new Date();
	mouse_move_event_actual(event,graph);
	var end_time = new Date();
	graph.ui.copy_time=end_time.getTime() - start_time.getTime();
	graph.ui.ticking=false;
}

function mouse_move_event_actual(event,graph){
	
	var canvas = graph.canvas;
	var ctx = canvas.getContext('2d');
	var gs = graph.graphics_style;
	
	
	//ctx.stroke();
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	var px = graph.pixels_to_units(x,'x');
	var py = graph.pixels_to_units(y,'y');
	
	
	ctx.putImageData(graph.graph_image,0,0);
	
	
	if (graph.ui.touch){
		var edge = 	Math.min(Math.min(canvas.width / 22, canvas.height/15));
	} else {
		var edge = 	Math.min(gs.tick_labels_font_size/0.55 * gs.scaling_factor,Math.min(canvas.width / 22, canvas.height/15));
	}
	graph.ui.size = edge;
	var cs = edge/4;
	ctx.font = (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
	if (DEBUGG_FPS){
		ctx.fillText('fps: '+ (1/graph.ui.copy_time*1000),30,30);
	}
	
	
	if (mouse_down == false){
		
		if (gs.o >= 1){
			ctx.fillStyle = gs.color_bg;
			ctx.globalAlpha = 0.5;
			ctx.beginPath();
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			//draw the options plane.
			
			ctx.fill();
			ctx.stroke();
			ctx.globalAlpha = 1;
			ctx.fillStyle = gs.color_fg;
			ctx.strokeStyle = gs.color_fg;
			var values = [gs.guideWidthx, gs.guideWidthy, gs.symbol_size, gs.line_thickness, gs.tick_len,gs.minor_tick_len, gs.title_font_size,gs.tick_labels_font_size,gs.axis_labels_font_size,gs.title_spacing,gs.tick_lables_font_padding,gs.lable_spacing,gs.graph_line_thickness];
			var names = ['scale width x','scale width y','symbol size','line thickness','tick length','minor tick length','title font size','ticks font size','axis font size','title spacing','tick padding','label spacing','graph line thickness'];
			
			var s = edge*0.7;//gs.tick_labels_font_size; //size to use for the menu
			var s = Math.min(canvas.height/32,canvas.width/25);
			graph.ui.s = s;
			ctx.font=s*0.8 + 'px ' + gs.font_name//"14px Courier New";
			for (var i = 0;i<values.length;i++){
				ctx.rect(s,s + i * s*1.2 -s*0.75 ,s,s);
				ctx.rect(2*s,s + i * s*1.2 -s*0.75 ,s,s);
				ctx.textAlign="center"; 
				ctx.fillText( '+' ,1.5*s, s + i * s*1.2);
				ctx.fillText( '-' ,2.5*s, s + i * s*1.2);
				ctx.textAlign="left"; 
				ctx.fillText( names[i] + ' = ' + mjs_precision(values[i],3) ,3.5*s, s + i * s*1.2);
			}
			ctx.stroke();
			//the strings
			var strings  = [gs.font_name,gs.title,gs.subtitle,gs.subtitle2,gs.x_axis_title,gs.y_axis_title,gs.color_fg,gs.color_bg,gs.color_mg];
			var string_names = ['font','title','subtitle','subtitle2','x-axis','y-axis','fg color','bg color','mg color'];
			j=0;
			for (var i = values.length;i<values.length+strings.length;i++){
				ctx.rect(s,s + i * s*1.2-s*0.75,s*3,s);
				ctx.textAlign="center";
				ctx.fillText( 'edit' ,2.5*s, s + i * s*1.2);
				ctx.textAlign="left";
				ctx.fillText( string_names[j] + ' = ' + strings[j] ,s+s*3.5, s + i * s*1.2);
				j++;
			}
			ctx.stroke();
			i++;
			ctx.rect(s,s + i * s*1.2 -s*0.75 ,s*4,s);
			ctx.stroke();
			ctx.textAlign="center";
			ctx.fillText( 'Reset' ,s*2.5, s + i * s*1.2);
			i++;
			ctx.rect(s,s + i * s*1.2 -s*0.75 ,s*4,s);
			ctx.stroke();
			ctx.fillText( 'Exit' ,s*2.5, s + i * s*1.2);
			
			gs.mouse_mode = 'options';
			return;
		}
		
		//not at the very edges draw interactive stuff
		ctx.fillStyle = gs.color_fg;
 		ctx.strokeStyle = gs.color_fg; 
		//do the mouse modes
		if (x>edge && y>edge && canvas.height-y > edge && canvas.width-x > edge ){
			
			if (gs.mouse_mode === 'zoom'){
				ctx.beginPath();
				ctx.arc(x, y, cs , 0 ,Math.PI*2, true);
				ctx.stroke();
			}
			
			if (gs.mouse_mode === 'zoom' || gs.mouse_mode === 'drag' || gs.mouse_mode === 'measure' ){
				
				var labelx = graph.get_axis_string(px,'x');
				var labely = graph.get_axis_string(py,'y');
				
				lw = labely.length * gs.scaling_factor*gs.axis_labels_font_size;
				
				if (graph.ui.touch && graph.ui.is_touching ){
					ctx.fillText(labelx,x+cs, canvas.height-2*edge );
					ctx.fillText(labely,2*edge,y-cs);
				} else {
					ctx.fillText(labelx,x+cs, Math.min(y+2*cs+2*edge,canvas.height-2*edge) );
					ctx.fillText(labely,Math.max(x-2*cs-lw-2*edge,2*edge),y-cs);
				}
				
				ctx.beginPath();
				ctx.moveTo(x,y+edge);
				ctx.lineTo(x,canvas.height );
				ctx.moveTo(x,y-edge);
				ctx.lineTo(x,0);
				ctx.moveTo(x-edge,y);
				ctx.lineTo(0,y);
				ctx.moveTo(x+edge,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
				ctx.beginPath();
				ctx.stroke();
			}
			
			if (gs.mouse_mode === 'trim'){
				ctx.fillText('trim',x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x,canvas.height);
				ctx.moveTo(0,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
			}
			if (gs.mouse_mode === 'cut'){
				ctx.fillText('cut',x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x,canvas.height);
				ctx.moveTo(0,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
			}
			if (gs.mouse_mode === 'sublin'){
				ctx.fillText('draw a line to subtract',x+cs*2,y-cs*2);
			}
			if (gs.mouse_mode === 'x-c'){
				label = graph.get_axis_string(px,'x');
				ctx.fillText('x-'+label,x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x,canvas.height);
				ctx.stroke();
			}
			if (gs.mouse_mode === 'y-c'){
				label = graph.get_axis_string(py,'y');
				ctx.fillText('y-'+label,x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(0,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
			}
			if (gs.mouse_mode === 'mouse'){
			
				//fit text handle
				
				if (gs.fits === 'none'){
					//don't draw the handle if there is no fit text.
				} else {
					ctx.beginPath();
					ctx.arc(gs.fit_text_position.x*canvas.width, gs.fit_text_position.y*canvas.height, 2*cs , 0 ,Math.PI*2, true);
					ctx.stroke();
				}
				//title spacing handle
				ctx.beginPath();
				var title_y = (gs.tick_len+gs.title_spacing+gs.title_font_size)*gs.scaling_factor;
				ctx.arc(canvas.width/2, title_y, 2*cs , 0 ,Math.PI*2, true);
				ctx.stroke();
				if (gs.show_captions>0){
					//there are captions visable
				//caption position handle
				var cap_x = gs.scaling_factor*gs.caption_position.x;
				if (gs.caption_position.x>0){
					cap_x += gs.scaling_factor*gs.tick_len;
				} else {
					cap_x = canvas.width + cap_x;
					cap_x -= gs.scaling_factor*gs.tick_len;
				}
				cap_y = gs.scaling_factor*gs.caption_position.y;
				if (gs.caption_position.y>0){
					//going down from top
					cap_y += gs.scaling_factor*gs.tick_len;
				} else {
					//up from botton
					cap_y = canvas.height + cap_y;
					cap_y -= gs.scaling_factor*gs.tick_len;
				}
				ctx.beginPath();
				ctx.arc(cap_x, cap_y, 2*cs , 0 ,Math.PI*2, true);
				ctx.stroke();
				}
				
			}
			ctx.beginPath();
			ctx.stroke();
			
			if (gs.mouse_mode === 'measure'){
				//measure mode
				ctx.beginPath();
				ctx.moveTo(x-cs,y-cs);
				ctx.lineTo(x+cs,y+cs);
				ctx.moveTo(x-cs,y+cs);
				ctx.lineTo(x+cs,y-cs);
				ctx.stroke();
				ctx.beginPath();
				ctx.stroke();
			}
			if (gs.mouse_mode === 'drag'){
				//center lines
				drag_x = x-0.5*edge;
				drag_y = y-0.5*edge;
				ctx.beginPath();
				ctx.moveTo(drag_x+edge*0.2,drag_y+edge*0.5);
				ctx.lineTo(drag_x+edge*0.8,drag_y+edge*0.5);
				ctx.moveTo(drag_x+edge*0.5,drag_y+edge*0.2);
				ctx.lineTo(drag_x+edge*0.5,drag_y+edge*0.8);
				//diagonals
				ctx.moveTo(drag_x+edge*0.2,drag_y+edge*0.5);
				ctx.lineTo(drag_x+edge*0.3,drag_y+edge*0.6);
				ctx.moveTo(drag_x+edge*0.2,drag_y+edge*0.5);
				ctx.lineTo(drag_x+edge*0.3,drag_y+edge*0.4);
				
				ctx.moveTo(drag_x+edge*0.8,drag_y+edge*0.5);
				ctx.lineTo(drag_x+edge*0.7,drag_y+edge*0.6);
				ctx.moveTo(drag_x+edge*0.8,drag_y+edge*0.5);
				ctx.lineTo(drag_x+edge*0.7,drag_y+edge*0.4);
				
				ctx.moveTo(drag_x+edge*0.5,drag_y+edge*0.2);
				ctx.lineTo(drag_x+edge*0.4,drag_y+edge*0.3);
				ctx.moveTo(drag_x+edge*0.5,drag_y+edge*0.2);
				ctx.lineTo(drag_x+edge*0.6,drag_y+edge*0.3);
				
				ctx.moveTo(drag_x+edge*0.5,drag_y+edge*0.8);
				ctx.lineTo(drag_x+edge*0.4,drag_y+edge*0.7);
				ctx.moveTo(drag_x+edge*0.5,drag_y+edge*0.8);
				ctx.lineTo(drag_x+edge*0.6,drag_y+edge*0.7);
				
				ctx.stroke();
				
				ctx.beginPath();
				ctx.stroke();
			}
			if (gs.mouse_mode === 'reader'){
				var pi = graph.reader_index[0];
				var pj = graph.reader_index[1];
				var xi = graph.units_to_pixels(graph.data[pi][0][pj],'x');
				var yi = graph.units_to_pixels(graph.data[pi][1][pj],'y');
				
				
				var old_line_width = ctx.lineWidth;
				ctx.strokeStyle = gs.color_bg;
				ctx.lineWidth =  gs.scaling_factor*gs.axis_labels_font_size/3;
				
				if (gs.x_scale_mode ==='lin' || gs.x_scale_mode ==='log'){
					label= mjs_precision(graph.data[pi][0][pj],gs.x_precision+5);
				}
				if (gs.x_scale_mode ==='time'){
					label= mjs_date_print(graph.data[pi][0][pj],0,8);
				}
				
				
				//label = 'x='+graph.data[pi][0][pj];
				ctx.strokeText(label,x+2*cs,y+gs.axis_labels_font_size*1.6);
				ctx.fillText(label,x+2*cs,y+gs.axis_labels_font_size*1.6);
				
				
				if (gs.y_scale_mode ==='lin' || gs.y_scale_mode ==='log'){
					label= mjs_precision(graph.data[pi][1][pj],gs.y_precision+5);
				}
				if (gs.y_scale_mode ==='time'){
					label= mjs_date_print(graph.data[pi][1][pj],0,8);
				}
				
				
				
				//label = 'y='+graph.data[pi][1][pj];
				ctx.strokeText(label,x+2*cs,y);
				ctx.fillText(label,x+2*cs,y);
				
				label = graph.captions[pi];
				//label = 'y='+graph.data[pi][1][pj];
				
				ctx.strokeText(label,x+2*cs,y-gs.axis_labels_font_size*1.6);
				ctx.fillText(label,x+2*cs,y-gs.axis_labels_font_size*1.6);
				label = 'i='+pj;//the index of the data point in the series.
								//called j internally, as i if for which series. 
				//label = 'y='+graph.data[pi][1][pj];
				ctx.strokeText(label,x+2*cs,y+gs.axis_labels_font_size*1.6*2);
				
				ctx.fillText(label,x+2*cs,y+gs.axis_labels_font_size*1.6*2);
				
				
				ctx.lineWidth = old_line_width;
				ctx.strokeStyle = gs.color_fg;
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(xi,yi);
				ctx.stroke()
				ctx.beginPath();
				ctx.arc(x,y, edge*0.3*0.8 , 0 ,Math.PI*2, true);
				ctx.moveTo(x,y-edge*.3);
				ctx.lineTo(x,y+edge*.3);
				ctx.moveTo(x+edge*0.3,y);
				ctx.lineTo(x-edge*0.3,y);
				ctx.stroke();
			}
		}
		// draw some buttons.... top edge
		if (y<edge){
			
			ctx.fillStyle = gs.color_bg;
			
			ctx.beginPath();
			ctx.rect(0,0,edge*4,edge);
			
			ctx.rect(4*edge,0,edge*4,edge);
			ctx.fill();
			ctx.stroke();
			
			ctx.fillStyle = gs.color_fg;
			ctx.beginPath();
			ctx.fillText("symbol/line",0.2*edge,0.8*edge);
			ctx.fillText("Graph",4.2*edge,0.8*edge);
			
			ctx.fillStyle = gs.color_bg;
			
			
			//mouse mode to drag button
			ctx.rect(edge*9,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			//center lines
			ctx.moveTo(edge*9.2,edge*0.5);
			ctx.lineTo(edge*9.8,edge*0.5);
			ctx.moveTo(edge*9.5,edge*0.2);
			ctx.lineTo(edge*9.5,edge*0.8);
			//diagonals
			ctx.moveTo(edge*9.2,edge*0.5);
			ctx.lineTo(edge*9.3,edge*0.6);
			ctx.moveTo(edge*9.2,edge*0.5);
			ctx.lineTo(edge*9.3,edge*0.4);
			
			ctx.moveTo(edge*9.8,edge*0.5);
			ctx.lineTo(edge*9.7,edge*0.6);
			ctx.moveTo(edge*9.8,edge*0.5);
			ctx.lineTo(edge*9.7,edge*0.4);
			
			ctx.moveTo(edge*9.5,edge*0.2);
			ctx.lineTo(edge*9.4,edge*0.3);
			ctx.moveTo(edge*9.5,edge*0.2);
			ctx.lineTo(edge*9.6,edge*0.3);
			
			ctx.moveTo(edge*9.5,edge*0.8);
			ctx.lineTo(edge*9.4,edge*0.7);
			ctx.moveTo(edge*9.5,edge*0.8);
			ctx.lineTo(edge*9.6,edge*0.7);
			
			ctx.stroke();
			
			//mouse mode to zoom button
			ctx.rect(edge*10,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(edge*10.5, edge*0.5, edge*0.3*0.8 , 0 ,Math.PI*2, true);
			ctx.moveTo(edge*10.4,edge*0.5);
			ctx.lineTo(edge*10.6,edge*0.5);
			ctx.moveTo(edge*10.5,edge*0.4);
			ctx.lineTo(edge*10.5,edge*0.6);
			ctx.moveTo(edge*10.5+edge*0.3*0.8*0.707,edge*0.5+edge*0.3*0.8*0.707);
			ctx.lineTo(edge*10.9,edge*0.9);
			ctx.stroke();
			
			//measure mode
			ctx.rect(edge*11,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*11.2,edge*0.8);
			ctx.lineTo(edge*11.8,edge*0.8);
			ctx.lineTo(edge*11.8,edge*0.2);
			ctx.lineTo(edge*11.2,edge*0.8);
			ctx.stroke();
			
			//datareader button
			ctx.rect(edge*12,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(edge*12.5, edge*0.5, edge*0.3*0.8 , 0 ,Math.PI*2, true);
			ctx.moveTo(edge*12.5,edge*0.2);
			ctx.lineTo(edge*12.5,edge*0.8);
			ctx.moveTo(edge*12.2,edge*0.5);
			ctx.lineTo(edge*12.8,edge*0.5);
			ctx.stroke();
			
			//hand/mouse button
			ctx.rect(edge*13,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*13.3,edge*0.2);
			ctx.lineTo(edge*13.3,edge*0.8);
			ctx.lineTo(edge*13.7,edge*0.6);
			ctx.lineTo(edge*13.3,edge*0.2);

			//show/hide captions button
			ctx.fillStyle = gs.color_bg;
			ctx.rect(canvas.width-edge,0,edge,edge);
			ctx.rect(canvas.width-edge*2,0,edge,edge);
			ctx.rect(canvas.width-edge*3,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = gs.color_fg;
			//ctx.font = (0.7*edge) + 'px ' + gs.font_name;//"24px Courier New";
			ctx.fillText('c',canvas.width-0.7*edge, edge*0.7);
			
			// infomation button
			ctx.fillStyle = gs.color_fg;
			ctx.fillText('i',canvas.width-1.7*edge, edge*0.7);
			
			//the ... button. opens the options pane. like the info pane. 
			ctx.beginPath();
			ctx.arc(canvas.width-2.2*edge, edge*0.7, edge*0.07 , 0 ,Math.PI*2, true);
			ctx.arc(canvas.width-2.5*edge, edge*0.7, edge*0.07 , 0 ,Math.PI*2, true);
			ctx.arc(canvas.width-2.8*edge, edge*0.7, edge*0.07 , 0 ,Math.PI*2, true);
			ctx.fill();
			
			ctx.fillStyle = gs.color_fg;
			//flush the drawing code
			ctx.beginPath();
			ctx.stroke();
		}
		//draw bottom buttons
		if (y>canvas.height-edge){
			ctx.fillStyle = gs.color_bg;
			ctx.beginPath();
			ctx.rect(0,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.rect(edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.rect(2*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.rect(3*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			
			ctx.fillStyle = gs.color_fg;
			
			ctx.beginPath();
			//down
			ctx.moveTo(0.5*edge,canvas.height-0.8*edge);
			ctx.lineTo(0.5*edge,canvas.height-0.2*edge);
			
			ctx.moveTo(0.2*edge,canvas.height-0.5*edge);
			ctx.lineTo(0.5*edge,canvas.height-0.2*edge);
			
			ctx.moveTo(0.8*edge,canvas.height-0.5*edge);
			ctx.lineTo(0.5*edge,canvas.height-0.2*edge);
			//up
			ctx.moveTo(1.5*edge,canvas.height-0.8*edge);
			ctx.lineTo(1.5*edge,canvas.height-0.2*edge);
			
			ctx.moveTo(1.2*edge,canvas.height-0.5*edge);
			ctx.lineTo(1.5*edge,canvas.height-0.8*edge);
			ctx.moveTo(1.8*edge,canvas.height-0.5*edge);
			ctx.lineTo(1.5*edge,canvas.height-0.8*edge);
			//left
			ctx.moveTo(2.2*edge,canvas.height-0.5*edge);
			ctx.lineTo(2.8*edge,canvas.height-0.5*edge);
			
			ctx.moveTo(2.5*edge,canvas.height-0.2*edge);
			ctx.lineTo(2.2*edge,canvas.height-0.5*edge);
			ctx.moveTo(2.5*edge,canvas.height-0.8*edge);
			ctx.lineTo(2.2*edge,canvas.height-0.5*edge);
			//right
			ctx.moveTo(3.2*edge,canvas.height-0.5*edge);
			ctx.lineTo(3.8*edge,canvas.height-0.5*edge);
			
			ctx.moveTo(3.5*edge,canvas.height-0.2*edge);
			ctx.lineTo(3.8*edge,canvas.height-0.5*edge);
			ctx.moveTo(3.5*edge,canvas.height-0.8*edge);
			ctx.lineTo(3.8*edge,canvas.height-0.5*edge);
			
			
			
			if (gs.x_scale_auto_max == false){
			//draw line at end of arrows
				ctx.moveTo(3.8*edge,canvas.height-0.8*edge);
				ctx.lineTo(3.8*edge,canvas.height-0.2*edge);
			}
			if (gs.x_scale_auto_min == false){
			//draw line at end of arrows
				ctx.moveTo(2.2*edge,canvas.height-0.8*edge);
				ctx.lineTo(2.2*edge,canvas.height-0.2*edge);
			}
			if (gs.y_scale_auto_max == false){
			//draw line at end of arrows
				ctx.moveTo(1.2*edge,canvas.height-0.8*edge);
				ctx.lineTo(1.8*edge,canvas.height-0.8*edge);
			}
			if (gs.y_scale_auto_min == false){
			//draw line at end of arrows
				ctx.moveTo(0.2*edge,canvas.height-0.2*edge);
				ctx.lineTo(0.8*edge,canvas.height-0.2*edge);
			}
			ctx.stroke();
			
			//grid button
			ctx.fillStyle = gs.color_bg;
			ctx.rect(4*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			var lx = 4*edge;
			var ly = canvas.height-edge;
			ctx.moveTo(lx+0.2*edge,ly+0.4*edge);
			ctx.lineTo(lx+0.8*edge,ly+0.4*edge);
			ctx.moveTo(lx+0.2*edge,ly+0.6*edge);
			ctx.lineTo(lx+0.8*edge,ly+0.6*edge);
			ctx.moveTo(lx+0.4*edge,ly+0.2*edge);
			ctx.lineTo(lx+0.4*edge,ly+0.8*edge);
			ctx.moveTo(lx+0.6*edge,ly+0.2*edge);
			ctx.lineTo(lx+0.6*edge,ly+0.8*edge);
			ctx.stroke();
			
			//lin log buttons
			
			ctx.rect(5*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.rect(6*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.rect(7*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			
			if (gs.y_scale_mode == 'log'){
				//draw lines showing linear
				ctx.moveTo(5*edge,canvas.height-0.2*edge);
				ctx.lineTo(6*edge,canvas.height-0.2*edge);
				ctx.moveTo(5*edge,canvas.height-0.4*edge);
				ctx.lineTo(6*edge,canvas.height-0.4*edge);
				ctx.moveTo(5*edge,canvas.height-0.6*edge);
				ctx.lineTo(6*edge,canvas.height-0.6*edge);
				ctx.moveTo(5*edge,canvas.height-0.8*edge);
				ctx.lineTo(6*edge,canvas.height-0.8*edge);
			} else {
				//draw log like lines
				ctx.moveTo(5*edge,canvas.height-0.4*edge);
				ctx.lineTo(6*edge,canvas.height-0.4*edge);
				ctx.moveTo(5*edge,canvas.height-0.65*edge);
				ctx.lineTo(6*edge,canvas.height-0.65*edge);
				ctx.moveTo(5*edge,canvas.height-0.8*edge);
				ctx.lineTo(6*edge,canvas.height-0.8*edge);
				ctx.moveTo(5*edge,canvas.height-0.9*edge);
				ctx.lineTo(6*edge,canvas.height-0.9*edge);
			}
			if (gs.x_scale_mode === 'log'){
				ctx.moveTo(6.2*edge,canvas.height);
				ctx.lineTo(6.2*edge,canvas.height-edge);
				ctx.moveTo(6.4*edge,canvas.height);
				ctx.lineTo(6.4*edge,canvas.height-edge);
				ctx.moveTo(6.6*edge,canvas.height);
				ctx.lineTo(6.6*edge,canvas.height-edge);
				ctx.moveTo(6.8*edge,canvas.height);
				ctx.lineTo(6.8*edge,canvas.height-edge);
			} else {
				ctx.moveTo(6.4*edge,canvas.height);
				ctx.lineTo(6.4*edge,canvas.height-edge);
				ctx.moveTo(6.65*edge,canvas.height);
				ctx.lineTo(6.65*edge,canvas.height-edge);
				ctx.moveTo(6.8*edge,canvas.height);
				ctx.lineTo(6.8*edge,canvas.height-edge);
				ctx.moveTo(6.9*edge,canvas.height);
				ctx.lineTo(6.9*edge,canvas.height-edge);
			}
			ctx.stroke();
			//time axis button
			var lx = 7*edge;
			var ly = canvas.height-edge;
			ctx.beginPath();
			ctx.moveTo(lx+0.1*edge,ly+0.6*edge);
			ctx.lineTo(lx+0.1*edge,ly+0.9*edge);
			ctx.lineTo(lx+0.9*edge,ly+0.9*edge);
			ctx.lineTo(lx+0.9*edge,ly+0.6*edge);
			ctx.moveTo(lx+0.5*edge,ly+0.9*edge);
			ctx.lineTo(lx+0.5*edge,ly+0.8*edge);
			
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(lx+0.5*edge,ly+0.4*edge, edge*0.3 , 0 ,Math.PI*2, true);
			ctx.moveTo(lx+0.5*edge,ly+0.2*edge);
			ctx.lineTo(lx+0.5*edge,ly+0.4*edge);
			ctx.lineTo(lx+0.6*edge,ly+0.4*edge);
			ctx.stroke();
			
			//f() button
			ctx.fillStyle = gs.color_bg;
			ctx.rect(8*edge,canvas.height-edge,edge*3,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = gs.color_fg;
			//ctx.font= (0.7*edge) + 'px ' + gs.font_name;//"24px Courier New";
			ctx.fillText('f()',8.2*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			//line menu button
			ctx.fillStyle = gs.color_bg;
			ctx.rect(11*edge,canvas.height-edge,edge*4,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = gs.color_fg;
			ctx.fillText('lines',11.2*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			//fits menu button
			ctx.fillStyle = gs.color_bg;
			ctx.rect(15*edge,canvas.height-edge,edge*4,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = gs.color_fg;
			ctx.fillText('fits',15.2*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			//draw data out button
			ctx.fillStyle = gs.color_bg;
			ctx.rect(canvas.width-edge,canvas.height-edge,edge,edge);
			//the fullscreen button
			ctx.rect(canvas.width-edge*3,canvas.height-edge,edge,edge);
			ctx.rect(canvas.width-edge*2.8,canvas.height-edge*.8,edge*0.6,edge*0.6);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = gs.color_fg;
			ctx.fillText('e',canvas.width-0.7*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			
			//draw day/nightmode button
			ctx.fillStyle = gs.color_fg;
			ctx.beginPath();
			ctx.rect(canvas.width-2*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.fillStyle = gs.color_bg;
			ctx.moveTo(canvas.width-2*edge,canvas.height);
			ctx.lineTo(canvas.width-edge-1,canvas.height-edge+1);
			ctx.lineTo(canvas.width-edge-1,canvas.height);
			ctx.closePath();
			ctx.fill();
			
			ctx.beginPath();
			ctx.fill();
			ctx.stroke();
		}
		
		
		if (graph.drawmodemenu){
			if (x < 10*edge && y < edge*3){
				//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
				//box
				ctx.fillStyle = gs.color_bg;
				ctx.beginPath();
				ctx.rect(0,0,edge*10,edge*3);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = gs.color_fg;
				ctx.beginPath();
				ctx.fillText('symbol/line',0.2*edge, 0.8*edge);
				
				//+ and - buttons 
				ctx.beginPath();
				ctx.moveTo(0.2*edge,1.5*edge);
				ctx.lineTo(0.8*edge,1.5*edge);
				ctx.moveTo(0.5*edge,1.2*edge);
				ctx.lineTo(0.5*edge,1.8*edge);
				ctx.moveTo(1.2*edge,1.5*edge);
				ctx.lineTo(1.8*edge,1.5*edge);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(0.2*edge,2.5*edge);
				ctx.lineTo(0.8*edge,2.5*edge);
				ctx.moveTo(0.5*edge,2.2*edge);
				ctx.lineTo(0.5*edge,2.8*edge);
				ctx.moveTo(1.2*edge,2.5*edge);
				ctx.lineTo(1.8*edge,2.5*edge);
				ctx.stroke();
				
				//structure lines
				ctx.beginPath();
				ctx.moveTo(0,edge);
				ctx.lineTo(10*edge,edge);
				ctx.moveTo(0,2*edge);
				ctx.lineTo(10*edge,2*edge);
				ctx.moveTo(2*edge,1*edge)
				ctx.lineTo(2*edge,3*edge);
				
				ctx.stroke();
				
				ctx.beginPath();
				ctx.arc(2.5*edge,1.5*edge,edge*0.35,0 ,Math.PI*2, true);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(2.2*edge,1.2*edge)
				ctx.lineTo(2.8*edge,1.8*edge);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(2.5*edge,2.5*edge,edge*0.35,0 ,Math.PI*2, true);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(2.2*edge,2.2*edge)
				ctx.lineTo(2.8*edge,2.8*edge);
				ctx.stroke();
				
				//symbol buttons
				var lx = 3*edge;
				var ly = 1*edge;//top left corner of a 1x1edge square
				
				
				
				//dot
				ctx.fillStyle = gs.color_fg;
				ctx.rect(lx + 0.3*edge,ly + 0.3*edge,edge*0.4,edge*0.4);
				ctx.fill();
				
				//filled circle
				lx += edge;
				ctx.arc(edge*0.5+lx, ly+ edge*0.5, edge*0.3 , 0 ,Math.PI*2, true);
				ctx.fill();
				
				//box
				lx += edge;
				ctx.fillStyle = gs.color_bg;
				ctx.beginPath();
				ctx.rect(lx + 0.3*edge,ly + 0.3*edge,edge*0.4,edge*0.4);
				ctx.stroke();
				
				//stroked circle
				lx += edge;
				ctx.beginPath();
				ctx.arc(edge*0.5+lx, ly+ edge*0.5, edge*0.3 , 0 ,Math.PI*2, true);
				ctx.stroke();
				
				//x
				lx += edge;
				ctx.beginPath();
				ctx.moveTo(lx+0.3*edge,ly+0.3*edge);
				ctx.lineTo(lx+0.7*edge,ly+0.7*edge);
				ctx.moveTo(lx+0.7*edge,ly+0.3*edge);
				ctx.lineTo(lx+0.3*edge,ly+0.7*edge);
				ctx.stroke();
				
				//cross
				lx += edge;
				ctx.beginPath();
				ctx.moveTo(lx+0.5*edge,ly+0.3*edge);
				ctx.lineTo(lx+0.5*edge,ly+0.7*edge);
				ctx.moveTo(lx+0.7*edge,ly+0.5*edge);
				ctx.lineTo(lx+0.3*edge,ly+0.5*edge);
				ctx.stroke();
				
				//line modes
				ly += 1.5*edge;
				lx = 3.5*edge;
				var ll = 0.3;
				//line
				ctx.beginPath();
				ctx.moveTo(lx-ll*edge,ly-ll*edge);
				ctx.lineTo(lx+ll*edge,ly+ll*edge);
				
				//approx
				lx += edge;
				ctx.moveTo(lx-ll*edge,ly+ll*edge);
				ctx.quadraticCurveTo(lx-ll*edge,ly-ll*edge,lx+ll*edge,ly-ll*edge);
				
				
				//interp
				lx += edge;
				ctx.moveTo(lx-ll*edge,ly+ll*edge);
				ctx.bezierCurveTo(lx+ll*edge,ly+ll*edge,lx-ll*edge,ly-ll*edge,lx+ll*edge,ly-ll*edge);
			
				//zig
				lx += edge;
				ctx.moveTo(lx-ll*edge,ly-ll*edge);
				ctx.lineTo(lx-ll*edge,ly+ll*edge);
				ctx.lineTo(lx+ll*edge,ly+ll*edge);
			
				//zag
				lx += edge;
				ctx.moveTo(lx-ll*edge,ly-ll*edge);
				ctx.lineTo(lx+ll*edge,ly-ll*edge);
				ctx.lineTo(lx+ll*edge,ly+ll*edge);
				
				//mid
				lx += edge;
				ctx.moveTo(lx-ll*edge,ly-ll*edge);
				ctx.lineTo(lx,ly-ll*edge);
				ctx.lineTo(lx,ly+ll*edge);
				ctx.lineTo(lx+ll*edge,ly+ll*edge);
				
				//hist
				lx += edge;
				ctx.moveTo(lx-ll*edge,ly-ll*edge);
				ctx.lineTo(lx-ll*edge,ly+ll*edge);
				ctx.moveTo(lx-ll*edge,ly);
				
				ctx.lineTo(lx+ll*edge,ly);
				
				ctx.lineTo(lx+ll*edge,ly+ll*edge);
				
				ctx.stroke();
				
				
			} else {
			console.log('leaving menu');
				graph.drawmodemenu = false;
			}
		}
		
		if (graph.drawgraphmenu){
			if (x < 12*edge && x > 4*edge && y < edge*10){
				ctx.fillStyle = gs.color_bg;
				ctx.rect(4*edge,0,edge*8,edge*10);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = gs.color_fg;
				ctx.beginPath();
				var ly = edge*0.8;
				var dy = -edge;
				var lx = 4.2*edge;
				ctx.fillText('Graph',lx, ly);ly-=dy;
				ctx.fillText('Set title',lx,  ly);ly-=dy;
				ctx.fillText('Set subtitle',lx,  ly);ly-=dy;
				ctx.fillText('Set subtitle2',lx,  ly);ly-=dy;
				ctx.fillText('Toggle show transforms',lx,  ly);ly-=dy;
				ctx.fillText('set x-axis title',lx,  ly);ly-=dy;
				ctx.fillText('set y-axis title',lx, ly);ly-=dy;
				ctx.fillText('Scaling Factor down',lx,  ly);ly-=dy;
				ctx.fillText('Scaling Factor up',lx,  ly);ly-=dy;
				ctx.fillText('Reset Graph',lx,  ly);ly-=dy;
				
			} else {
				graph.drawgraphmenu = false;
			}
		}
		
		
		if (graph.drawexportmenu){
			if (x > canvas.width - 8*edge && y > canvas.height-edge*14){
				//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
				//box
				ctx.fillStyle = gs.color_bg;
				ctx.rect(canvas.width - 8*edge,canvas.height-edge*14,edge*8,edge*14);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = gs.color_fg;
				ctx.beginPath();
				var ly = canvas.height - edge*0.1;
				var dy = edge;
				var lx = canvas.width - 7.8*edge;
				ctx.fillText('export',lx, ly);ly-=dy;
				ctx.fillText('data (csv)',lx,  ly);ly-=dy;
				ctx.fillText('data (code)',lx,  ly);ly-=dy;
				ctx.fillText('data (code [matlab])',lx,  ly);ly-=dy;
				ctx.fillText('data (code [JSON])',lx,  ly);ly-=dy;
				ctx.fillText('data (tabbed)',lx,  ly);ly-=dy;
				ctx.fillText('png (hi res)',lx, ly);ly-=dy;
				ctx.fillText('png (low res)',lx,  ly);ly-=dy;
				ctx.fillText('png (small figure)',lx,  ly);ly-=dy;
				ctx.fillText('png (large figure)',lx,  ly);ly-=dy;
				ctx.fillText('svg',lx,  ly);ly-=dy;
				ctx.fillText('svg (small figure)',lx,  ly);ly-=dy;
				ctx.fillText('svg (large figure)',lx,  ly);ly-=dy;
				
				ctx.fillText('HTML [Beta!]',lx,  ly);ly-=dy;
			} else {
				graph.drawexportmenu = false;
			}
		
		}
		
		if (graph.drawcaptionmenu){
			if (x>canvas.width-4*edge && y < edge*8){
				ctx.fillStyle = gs.color_bg;
				ctx.beginPath();
				ctx.rect(canvas.width-4*edge,0,edge*4,edge*8);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = gs.color_fg;
				//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
				ctx.fillText('captions',canvas.width-3.8*edge, 0.8*edge);
				ctx.fillText('Show/Hide',canvas.width-3.8*edge, 1.8*edge);
				
				ctx.fillText('x',canvas.width-3.8*edge, 2.8*edge);
				ctx.fillText('y',canvas.width-1.8*edge, 2.8*edge);
				
				ctx.fillText('First',canvas.width-3.8*edge, 3.8*edge);
				ctx.fillText('Last',canvas.width-3.8*edge, 4.8*edge);
				ctx.fillText('Min',canvas.width-3.8*edge, 5.8*edge);
				ctx.fillText('Max',canvas.width-3.8*edge, 6.8*edge);
				ctx.fillText('First',canvas.width-1.8*edge, 3.8*edge);
				ctx.fillText('Last',canvas.width-1.8*edge, 4.8*edge);
				ctx.fillText('Min',canvas.width-1.8*edge, 5.8*edge);
				ctx.fillText('Max',canvas.width-1.8*edge, 6.8*edge);
				ctx.fillText('None',canvas.width-2.8*edge, 7.8*edge);
				
				ctx.beginPath()
				ctx.moveTo(canvas.width-4*edge,edge);
				ctx.lineTo(canvas.width,edge);
				ctx.moveTo(canvas.width-4*edge,2*edge);
				ctx.lineTo(canvas.width,2*edge);
				ctx.moveTo(canvas.width-4*edge,3*edge);
				ctx.lineTo(canvas.width,3*edge);
				ctx.moveTo(canvas.width-2*edge,2*edge);
				ctx.lineTo(canvas.width-2*edge,7*edge);
				ctx.stroke();
				
			} else {
				graph.drawcaptionmenu = false;
			}
		}
		
		//draw fx menue
		if (graph.drawfxmenu){
			
			if (x>8*edge && x<22*edge && y > canvas.height-edge*14){
				//f() button
				ctx.fillStyle = gs.color_bg;
				ctx.rect(8*edge,canvas.height-edge*14,edge*14,edge*14);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = gs.color_fg;
				//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
				ctx.fillText('functions',8.2*edge, canvas.height - edge*0.3);
				ctx.stroke();
				
				//the lines seperating buttons
				ctx.beginPath();
				for (var i  = 1;i<14;i++){
					ctx.moveTo(edge*8,canvas.height - edge*i);
					ctx.lineTo(edge*22,canvas.height - edge*i);
				}
				ctx.moveTo(edge*12,canvas.height);
				ctx.lineTo(edge*12,canvas.height - edge*14);
				ctx.moveTo(edge*16,canvas.height);
				ctx.lineTo(edge*16,canvas.height - edge*14);
				ctx.moveTo(edge*10,canvas.height - edge*9);
				ctx.lineTo(edge*10,canvas.height - edge*13);
				ctx.moveTo(edge*10,canvas.height - edge*4);
				ctx.lineTo(edge*10,canvas.height - edge*5);
				ctx.moveTo(edge*14,canvas.height - edge*9);
				ctx.lineTo(edge*14,canvas.height - edge*13);
				ctx.moveTo(edge*14,canvas.height - edge*3);
				ctx.lineTo(edge*14,canvas.height - edge*5);
				ctx.stroke();
				
				ctx.fillText('reset',8.2*edge, canvas.height - edge*1.3);
				ctx.fillText('cut',8.2*edge, canvas.height - edge*2.3);
				ctx.fillText('norm(y)',8.2*edge, canvas.height - edge*3.3);
				ctx.fillText('y-c',8.2*edge, canvas.height - edge*4.3);
				ctx.fillText('x-c',10.2*edge, canvas.height - edge*4.3);
				
				ctx.fillText('smooth',8.2*edge, canvas.height - edge*5.3);
				ctx.fillText('interpolate',8.2*edge, canvas.height - edge*6.3);
				ctx.fillText('-(mx+c)',8.2*edge, canvas.height - edge*7.3);
				ctx.fillText('dy/dx',8.2*edge, canvas.height - edge*8.3);
				ctx.fillText('ln x',8.2*edge, canvas.height - edge*9.3);
				ctx.fillText('e^x',10.2*edge, canvas.height - edge*9.3);
				ctx.fillText('log x',8.2*edge, canvas.height - edge*10.3);
				ctx.fillText('10^x',10.2*edge, canvas.height - edge*10.3);
				ctx.fillText('10x',8.2*edge, canvas.height - edge*11.3);
				ctx.fillText('x/10',10.2*edge, canvas.height - edge*11.3);
				ctx.fillText('-x',8.2*edge, canvas.height - edge*12.3);
				ctx.fillText('1/x',10.2*edge, canvas.height - edge*12.3);
				ctx.fillText('x<->y',12.2*edge, canvas.height - edge*1.3);
				ctx.fillText('trim',12.2*edge, canvas.height - edge*2.3);
				ctx.fillText('x^n',12.2*edge, canvas.height - edge*3.3);
				ctx.fillText('y^n',14.2*edge, canvas.height - edge*3.3);
				ctx.fillText('rt x',12.2*edge, canvas.height - edge*4.3);
				ctx.fillText('rt y',14.2*edge, canvas.height - edge*4.3);
				ctx.fillText('sum',12.2*edge, canvas.height - edge*5.3);
				//ctx.fillText('B-A',14.2*edge, canvas.height - edge*5.3);
				ctx.fillText('jitter(y)',12.2*edge, canvas.height - edge*6.3);
				ctx.fillText('Hist',12.2*edge, canvas.height - edge*7.3);
				ctx.fillText('Intergrate',12.2*edge, canvas.height - edge*8.3);
				ctx.fillText('ln y',12.2*edge, canvas.height - edge*9.3);
				ctx.fillText('e^y',14.2*edge, canvas.height - edge*9.3);
				ctx.fillText('log y',12.2*edge, canvas.height - edge*10.3);
				ctx.fillText('10^y',14.2*edge, canvas.height - edge*10.3);
				ctx.fillText('10y',12.2*edge, canvas.height - edge*11.3);
				ctx.fillText('y/10',14.2*edge, canvas.height - edge*11.3);
				ctx.fillText('-y',12.2*edge, canvas.height - edge*12.3);
				ctx.fillText('1/y',14.2*edge, canvas.height - edge*12.3);
				ctx.fillText('pop',12.2*edge, canvas.height - edge*0.3);
				ctx.fillText('y vs y',8.2*edge, canvas.height - edge*13.3);
				
				ctx.fillText('sub fit',16.2*edge, canvas.height - edge*13.3);
				ctx.fillText('rmv outliers',16.2*edge, canvas.height - edge*12.3);
				ctx.fillText('keep outliers',16.2*edge, canvas.height - edge*11.3);
				ctx.fillText('custom y=f(x,y)',16.2*edge, canvas.height - edge*10.3);
				
				ctx.fillText('(y - mean)/sigma',16.2*edge, canvas.height - edge*2.3);
				ctx.fillText('x spacing',16.2*edge, canvas.height - edge*1.3);
				ctx.fillText('time->number',16.2*edge, canvas.height - edge*0.3);
			} else {
				graph.drawfxmenu = false;
			}
		}
		
		if (graph.drawtimemenu){
			graph.drawfxmenu = false;
			if (x>10*edge && x<20*edge && y > canvas.height-edge*6){
				ctx.fillStyle = gs.color_bg;
				ctx.beginPath();
				ctx.rect(10*edge,canvas.height-edge*6,edge*10,edge*6);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = gs.color_fg;
				//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
				ctx.fillText('time->number',10.2*edge, canvas.height - edge*0.3);
				
				var timeoptionsstrings = [['days','hours','mins','sec'],['now','ago','start','end']];
				var lx = 10.2*edge;
				var ldx = 2*edge;
				var ly =  canvas.height - edge*3.3;
				var ldy = edge;
				
				for (var i = 0;i<2;i++){
					for (var j = 0;j<4;j++){
						var label = timeoptionsstrings[i][j];
						if (graph.timemenuoptions[i] == j ){
						 label = '['+label+']';
						} else 
						{
						 label = ' '+label+' ';
						}
						ctx.fillText(label,lx+j*ldx, ly -i*ldy);
					}
				}
				ctx.fillText('Pick reference and unit',lx, ly -2*ldy);
				ctx.fillText('apply on x',lx, ly +2*ldy);
				ctx.fillText('apply on y',lx+3*ldx, ly +2*ldy);
				
			} else {
				graph.drawtimemenu = false;
			}
		}
		
		//draw line menu buttons
		if (graph.drawlinemenu){
			//get number of lines
			var no_of_lines = graph.data_backup.length;
			for (var i = 0;i<no_of_lines;i++){
				gs.hidden_lines[i] = gs.hidden_lines[i] || false;
				
			}
			//add in the number of function lines
			var no_of_function_lines = gs.function_lines.length;
			
			//draw the menu
			if (x>11*edge && x<21*edge && y > canvas.height-edge*(no_of_lines+no_of_function_lines+2)){
				//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
				//box
				ctx.fillStyle = gs.color_bg;
				ctx.rect(11*edge,canvas.height-edge*(no_of_lines+no_of_function_lines+2),edge*10,edge*(no_of_lines+no_of_function_lines+2));
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(edge*11,canvas.height - edge);
				ctx.lineTo(edge*21,canvas.height - edge);
				ctx.moveTo(edge*11,canvas.height - edge*(no_of_lines+1));
				ctx.lineTo(edge*21,canvas.height - edge*(no_of_lines+1));
				ctx.stroke();
				
				ctx.fillStyle = gs.color_fg;
				ctx.fillText('line menu',11.2*edge+0.2, canvas.height -edge*0.2);
				var ly = canvas.height - no_of_lines*edge - 0.2*edge;
				var lx = 13.2*edge+0.2;
				for (var i = 0;i<no_of_function_lines;i++){
					ly -= edge;
					ctx.fillText(gs.function_lines[i],lx, ly);
					ctx.fillText( '(-) ' ,11.2*edge+0.2, ly);
					
				}
				ly -= edge;
				ctx.fillText( 'new function line',lx, ly);
					
				
				for (var i = no_of_lines-1;i+1>0;i--){
					var label = graph.captions_backup[i] ||  'label' ;
					ctx.fillStyle = graph.colors_backup[i];
					ctx.fillText(label,13.2*edge+0.2, canvas.height -no_of_lines*edge + edge*(i-0.2));
					//show or hide button
					if (gs.hidden_lines[i]){
						ctx.fillText('( )',11.2*edge+0.2, canvas.height - no_of_lines*edge + edge*(i-0.2));
					} else {
						ctx.fillText('(+)',11.2*edge+0.2, canvas.height - no_of_lines*edge + edge*(i-0.2));
					}
				}
				ctx.fillStyle = gs.color_fg;
				//all button
				//none button
				ctx.fillText('all',15.2*edge+0.2, canvas.height -edge*0.2);
				ctx.fillText('none',17.2*edge+0.2, canvas.height -edge*0.2);
				
				
				
			}else {
				graph.drawlinemenu = false;
			}
		
		}
		
		//draw fit's menu buttons
		if (graph.drawfitsmenu){
			if (x>15*edge && x<21*edge && y > canvas.height-edge*10){
				//f() button
				ctx.fillStyle = gs.color_bg;
				ctx.rect(15*edge,canvas.height-edge*10,edge*6,edge*10);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.stroke();
				ctx.fillStyle = gs.color_fg;
				//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";

				var label = '';
				if (gs.extrapolate){
					label = '(+) extrapolate';
				} else {
					label = '( ) extrapolate';
				}
				var lx = 18.2*edge;
				var ly= canvas.height - edge*0.3;
				var dly = edge;
				ctx.fillText('none',lx, ly);ly-=dly;
				ly-=dly;//extrapolate takes up two.
				ctx.fillText('stats',lx,  ly);ly-=dly;
				ctx.fillText('ae^bx',lx, ly);ly-=dly;
				ctx.fillText('a+be^cx',lx,  ly);ly-=dly;
				ctx.fillText('a+blnx',lx,  ly);ly-=dly;
				ctx.fillText('ax^b',lx, ly);ly-=dly;
				ctx.fillText('a+bx^c',lx, ly);ly-=dly;
				ctx.fillText('gauss',lx, ly);ly-=dly;
				lx = 15.2*edge;
				ly = canvas.height - edge*0.3;
				ctx.fillText('fits',lx, ly);ly-=dly;
				ctx.fillText(label,lx, ly);ly-=dly;
				ctx.fillText('y=c',lx, ly);ly-=dly;
				ctx.fillText('linear',lx, ly);ly-=dly;
				ctx.fillText('quad',lx,ly);ly-=dly;
				ctx.fillText('cubic',lx, ly);ly-=dly;
				ctx.fillText('poly 4',lx, ly);ly-=dly;
				ctx.fillText('poly 5',lx,ly);ly-=dly;
				ctx.fillText('poly 6',lx, ly);ly-=dly;
				ctx.fillText('poly 7',lx,ly);ly-=dly;
			
			} else {
				graph.drawfitsmenu = false;
			}
		}
		
		if (graph.ui.touch && graph.ui.is_touching && (gs.mouse_mode === 'zoom' || gs.mouse_mode === 'drag')){
			//big zoom out button 
			ctx.fillStyle = gs.color_bg;
			ctx.rect(0,canvas.height-2*edge,edge*4,edge);
			ctx.fill();
			ctx.stroke();
			if (gs.mouse_mode === 'zoom'){
				ctx.rect(0,canvas.height-3*edge,edge*4,edge);
				ctx.fill();
				ctx.stroke();
			}
			ctx.fillStyle = gs.color_fg;
			//ctx.font= (0.55*edge) + 'px ' + gs.font_name;//"24px Courier New";
			
			
			ctx.fillText('Auto Zoom',0.2*edge, canvas.height - edge*1.3);
			if (gs.mouse_mode === 'zoom'){
				ctx.fillText('Zoom out',0.2*edge, canvas.height - edge*2.3);
			}
		}
		
		if (graph.ui.touch && graph.ui.is_touching ){
			//draw the bit under the finger. in the middle
			var image = ctx.getImageData(x-2*edge,y-2*edge,edge*4,4*edge);
			ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.lineTo(canvas.width/2,canvas.height/2);
			ctx.stroke();
			//the bit is 4edge by 4edge. the boarder has 2px on each side as well.
			ctx.rect(canvas.width/2-2*edge-2,canvas.height/2-2*edge-2,4*edge+4,4*edge+4);
			ctx.stroke();
			ctx.putImageData(image,canvas.width/2-2*edge,canvas.height/2-2*edge);
			ctx.beginPath();
			ctx.arc(canvas.width/2, canvas.height/2, edge/2 , 0 ,Math.PI*2, true);
			ctx.stroke();
		}
	}
	ctx.beginPath();
	ctx.stroke();
	
	if (mouse_down && gs.mouse_mode === 'zoom'){
		//is dragging for zoom
		end_x = x;
		end_y = y;
		//draw bounding box
		ctx.beginPath();
		ctx.rect(start_x+1,start_y+1,end_x-start_x-1,end_y-start_y-1);
		ctx.moveTo(start_x,0);
		ctx.lineTo(start_x,2*edge);
		ctx.moveTo(start_x,canvas.height);
		ctx.lineTo(start_x,canvas.height-2*edge);
		ctx.moveTo(end_x,canvas.height);
		ctx.lineTo(end_x,canvas.height-2*edge);
		ctx.moveTo(end_x,0);
		ctx.lineTo(end_x,2*edge);
		
		ctx.moveTo(0,start_y);
		ctx.lineTo(2*edge,start_y);
		ctx.moveTo(canvas.width-2*edge,start_y);
		ctx.lineTo(canvas.width,start_y);
		
		ctx.moveTo(0,end_y);
		ctx.lineTo(2*edge,end_y);
		ctx.moveTo(canvas.width-2*edge,end_y);
		ctx.lineTo(canvas.width,end_y);
		ctx.stroke();
		
		//this is a hack to get the screen to redraw correctly. 
		ctx.beginPath();
		ctx.stroke();
	}
	if (mouse_down && gs.mouse_mode === 'drag'){
		//is dragging
		
		if (graph.ui.is_touching){
		
			is_touch_dragging = true;
			start_x = 0.5*(touch_start_x[0]+touch_start_x[1]);
			start_y = 0.5*(touch_start_y[0]+touch_start_y[1]);
			
			end_x = 0.5*(touch_x[0]+touch_x[1]);
			end_y = 0.5*(touch_y[0]+touch_y[1]);
			
			scale_x = (touch_x[0]-touch_x[1]) / (touch_start_x[0]-touch_start_x[1]);
			scale_y = (touch_y[0]-touch_y[1]) / (touch_start_y[0]-touch_start_y[1]);
			scale_x = trim(Math.abs(scale_x),0.1,10);
			scale_y = trim(Math.abs(scale_y),0.1,10);
			
			ctx.putImageData(graph.graph_image_for_drag,0,0);
			ctx.save();
			ctx.translate((start_x) ,(start_y) );
			ctx.scale(scale_x,scale_y);
			ctx.translate((end_x-start_x)/scale_x ,(end_y-start_y)/scale_y );
			//draw the canvas on its self. Crazy. 
			ctx.drawImage(canvas, -start_x, -start_y);// this dam line too me ages to figure out.
			
			ctx.restore();
		} else {
		
			end_x = x;
			end_y = y;
			ctx.fillStyle = gs.color_bg; 
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			ctx.putImageData(graph.graph_image_for_drag,end_x-start_x,end_y-start_y);
		}
	}
	if (mouse_down && gs.mouse_mode === 'measure'){
		ctx.beginPath();
		ctx.moveTo(start_x,start_y);
		ctx.lineTo(x,y);
		ctx.stroke();
		dx = x - start_x;
		dy = y - start_y;
		px = graph.pixels_to_units(x,'x');
		py = graph.pixels_to_units(y,'y');
		px_start = graph.pixels_to_units(start_x,'x');
		py_start = graph.pixels_to_units(start_y,'y');
	
		label = graph.get_axis_string(px,'x');
		ctx.fillText(label,x+cs,canvas.height-1.5*edge);
		
		label = graph.get_axis_string(py,'y');
		ctx.fillText(label,2*edge,y-cs*2);
		
		ctx.beginPath();
		ctx.moveTo(x,canvas.height);
		ctx.lineTo(x,canvas.height - 1.5*edge );
		ctx.moveTo(x,0);
		ctx.lineTo(x,2*edge);
		ctx.moveTo(0,y);
		ctx.lineTo(2*edge,y);
		ctx.moveTo(canvas.width,y);
		ctx.lineTo(canvas.width-2*edge,y);
		ctx.stroke();
		ctx.beginPath();
		ctx.stroke();
		label = graph.get_axis_string(px_start,'x');
		ctx.fillText(label,start_x+cs,canvas.height-2*edge);
		label = graph.get_axis_string(py_start,'y');
		ctx.fillText(label,2*edge,start_y-cs*2);
		ctx.beginPath();
		ctx.moveTo(start_x,canvas.height);
		ctx.lineTo(start_x,canvas.height - 2*edge );
		ctx.moveTo(start_x,0);
		ctx.lineTo(start_x,2*edge);
		ctx.moveTo(0,start_y);
		ctx.lineTo(2*edge,start_y);
		ctx.moveTo(canvas.width,start_y);
		ctx.lineTo(canvas.width-2*edge,start_y);
		ctx.stroke();
		ctx.beginPath();
		ctx.stroke();
			
		//show dx infomation
		if (dx > edge/2 || dx < -edge/2){
			x_meas = Math.min(y,start_y)-edge;
			ctx.beginPath();
			ctx.moveTo(x,x_meas-0.3*edge);
			ctx.lineTo(x,x_meas+0.3*edge);
			ctx.moveTo(start_x,x_meas-0.3*edge);
			ctx.lineTo(start_x,x_meas+0.3*edge);
			ctx.moveTo(x,x_meas);
			ctx.lineTo(start_x,x_meas);
			ctx.stroke();
			
			
			if (gs.x_scale_mode === 'time'){
				label = mjs_time_difference_print(px-px_start);
			} else {
				label = graph.get_axis_string(px-px_start,'x');
			}
			
			ctx.fillText(label,(x+start_x)/2-.3*gs.scaling_factor*gs.axis_labels_font_size*label.length,x_meas-.4*gs.axis_labels_font_size);
			
		}
		
		//show dy infomation
		if (dy > edge/2 || dy < -edge/2){
			y_meas = Math.min(x,start_x)-edge;
			//label = mjs_precision(py-py_start, gs.y_precision );
			
			if (gs.y_scale_mode === 'time'){
				label = mjs_time_difference_print(py-py_start);
			} else {
				label = graph.get_axis_string(py-py_start,'y');
			}
			
			label_pos = y_meas - .7*gs.axis_labels_font_size*gs.scaling_factor*label.length;
			ctx.beginPath();
			ctx.moveTo(y_meas-0.3*edge,y);
			ctx.lineTo(y_meas+0.3*edge,y);
			ctx.moveTo(y_meas-0.3*edge,start_y);
			ctx.lineTo(y_meas+0.3*edge,start_y);
			ctx.moveTo(y_meas,y);
			ctx.lineTo(y_meas,start_y);
			ctx.stroke();
			ctx.fillText(label,label_pos,(y+start_y)/2);
		}
		//show grad
		if ((dx > edge/2 || dx < -edge/2) && (dy > edge/2 || dy < -edge/2)){
			grad =  (py-py_start) / (px-px_start);
			
			var unit = '';
			if ( (gs.y_scale_mode === 'lin' || gs.y_scale_mode === 'log' ) && gs.x_scale_mode === 'time'){
				unit = '/ms';
				
				if (Math.abs(grad)<1){grad*=1000; unit='/s';}
				if (Math.abs(grad)<1){grad*=60; unit='/m';}
				if (Math.abs(grad)<1){grad*=60; unit='/h';}
				if (Math.abs(grad)<1){grad*=24; unit='/d';}
				grad = mjs_precision(grad,5);
			}
			else {	
				grad = mjs_precision(grad, Math.min(gs.y_precision,gs.x_precision));
			}
			ctx.fillText('g = ' + grad+unit,x+cs,y-cs);
			//show tau if semi log y graph.
			if ( gs.y_scale_mode === 'log' && (gs.x_scale_mode === 'lin' || gs.x_scale_mode === 'time' )){
				var tau =  (Math.log10(py)-Math.log10(py_start)) / (px-px_start);
				
				if ( gs.x_scale_mode === 'time'){
				
					unit = '/ms';
					if (Math.abs(tau)<1){tau*=1000; unit='/s';}
					if (Math.abs(tau)<1){tau*=60; unit='/m';}
					if (Math.abs(tau)<1){tau*=60; unit='/h';}
					if (Math.abs(tau)<1){tau*=24; unit='/d';}
					tau = mjs_precision(tau,5);
					
				} else {
					unit = '';
					tau = mjs_precision(tau, Math.min(gs.y_precision,gs.x_precision));
				
				}
				ctx.fillText('tau =' + tau+unit,x+cs,y+cs);
				
				var n = Math.ceil(Math.max(dx,dy)/4);
				
				ctx.beginPath();
				for (var k = 0;k<n;k++){
					var yi = graph.units_to_pixels(py_start+k*(py-py_start)/n,'y');
					var xi =  graph.units_to_pixels(px_start+k*(px-px_start)/n,'x');
					ctx.moveTo(xi,yi);
					var yi =  graph.units_to_pixels(py_start+(k+1)*(py-py_start)/n,'y');
					var xi =  graph.units_to_pixels(px_start+(k+1)*(px-px_start)/n,'x');
					ctx.lineTo(xi,yi);
				}
				ctx.stroke();
			}
			
			//show powerlaw if log log graph.
			if ( gs.y_scale_mode === 'log' && gs.x_scale_mode === 'log'){
				var powerlaw =  (Math.log10(py)-Math.log10(py_start)) / (Math.log10(px)-Math.log10(px_start));
				powerlaw = mjs_precision(powerlaw, Math.min(gs.y_precision,gs.x_precision));
				ctx.fillText('p =' + powerlaw,x+cs,y+cs);
				
				var n = Math.ceil(Math.max(dx,dy)/2);
				
				ctx.beginPath();
				var yi = 0;
				var xi = 0;
				for (var k = 0;k<n;k++){
					xi = Math.exp(Math.log(px_start)+k*(Math.log(px)-Math.log(px_start))/n);
					yi = (xi-px_start) * grad+py_start;
					xi = graph.units_to_pixels(xi,'x');
					yi = graph.units_to_pixels(yi,'y');
					ctx.moveTo(xi,yi);
					xi = Math.exp(Math.log(px_start)+(k+1)*(Math.log(px)-Math.log(px_start))/n);
					yi = (xi-px_start) * grad+py_start;
					xi = graph.units_to_pixels(xi,'x');
					yi = graph.units_to_pixels(yi,'y');
					ctx.lineTo(xi,yi);
				}
				ctx.stroke();
			}
		}
		
		ctx.beginPath();
		ctx.stroke();
	}
	
	if (mouse_down && gs.mouse_mode === 'trim'){
		//is dragging for trim
		end_x = x;
		end_y = y;
		//draw bounding box
		ctx.beginPath();
		ctx.rect(start_x,start_y,end_x-start_x,end_y-start_y);
		ctx.stroke();
		//this is a hack to get the screen to redraw correctly. 
		ctx.beginPath();
		ctx.stroke();
	}
	if (mouse_down && gs.mouse_mode === 'cut'){
		//is dragging for cut
		end_x = x;
		end_y = y;
		//draw bounding box
		ctx.beginPath();
		ctx.rect(start_x,start_y,end_x-start_x,end_y-start_y);
		ctx.stroke();
		//this is a hack to get the screen to redraw correctly. 
		ctx.beginPath();
		ctx.stroke();
	}
	if (mouse_down && gs.mouse_mode === 'x-c'){
		label = mjs_precision(px,gs.y_precision+1);
		ctx.fillText('x-'+label,x+cs*2,y-cs*2);
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x,canvas.height);
		ctx.stroke();
		ctx.beginPath();
		ctx.stroke();
	}
	if (mouse_down && gs.mouse_mode === 'y-c'){
		label = mjs_precision(py,gs.y_precision+1);
		ctx.fillText('y-'+label,x+cs*2,y-cs*2);
		ctx.beginPath();
		ctx.moveTo(0,y);
		ctx.lineTo(canvas.width,y);
		ctx.stroke();
		ctx.beginPath();
		ctx.stroke();
	}
	if (mouse_down && gs.mouse_mode === 'sublin'){
		ctx.fillText('draw line to subtract',x+cs*2,y-cs*2);
		ctx.beginPath();
		ctx.moveTo(start_x,start_y);
		ctx.lineTo(x,y);
		ctx.stroke();
		ctx.beginPath();
		ctx.stroke();
	}
	
	if (mouse_down && gs.mouse_mode === 'mouse'){
		
		
		graph.ui.mouse_is_dragging = false;
		
		//distance from fit text handle
		var d = Math.sqrt(Math.pow(start_x-gs.fit_text_position.x*canvas.width,2)+Math.pow(start_y-gs.fit_text_position.y*canvas.height,2));
		if (d<2*cs){
			ctx.beginPath();
			ctx.moveTo(start_x,start_y);
			ctx.lineTo(x,y);
			ctx.stroke();
			graph.ui.mouse_is_dragging = true;
			graph.ui.drag_object = 'fit_text';
			return;
		}
		
		//distance from title spacing handle
		d = Math.sqrt(Math.pow(start_x-canvas.width/2,2)+Math.pow((start_y-(gs.tick_len+gs.title_spacing+gs.title_font_size)*gs.scaling_factor),2));
		if (d<2*cs){
			ctx.beginPath();
			ctx.moveTo(canvas.width/2,start_y);
			ctx.lineTo(canvas.width/2,y); //force a vertical line
			ctx.stroke();
			graph.ui.mouse_is_dragging = true;
			graph.ui.drag_object = 'title_spacing';
			return;
		}
		//distance from caption handle
		var cap_x = gs.scaling_factor*gs.caption_position.x;
		if (gs.caption_position.x>0){
			cap_x += gs.scaling_factor*gs.tick_len;
		} else {
			cap_x = canvas.width + cap_x;
			cap_x -= gs.scaling_factor*gs.tick_len;
		}
		cap_y = gs.scaling_factor*gs.caption_position.y;
		if (gs.caption_position.y>0){
			//going down from top
			cap_y += gs.scaling_factor*gs.tick_len;
		} else {
			//up from botton
			cap_y = canvas.height + cap_y;
			cap_y -= gs.scaling_factor*gs.tick_len;
		}
		d = Math.sqrt(Math.pow(start_x-cap_x,2) + Math.pow(start_y-cap_y,2));
		if (d<2*cs){
			ctx.beginPath();
			ctx.moveTo(start_x,start_y);
			ctx.lineTo(x,y);
			ctx.stroke();
			
			var l = 2*cs;
			ctx.beginPath();
			
			if (x>canvas.width/2 && y>canvas.height/2){
				ctx.moveTo(x-l,y);ctx.lineTo(x,y);ctx.lineTo(x,y-l);
			}
			if (x>canvas.width/2 && y<canvas.height/2){
				ctx.moveTo(x-l,y);ctx.lineTo(x,y);ctx.lineTo(x,y+l);
			}
			if (x<canvas.width/2 && y>canvas.height/2){
				ctx.moveTo(x+l,y);ctx.lineTo(x,y);ctx.lineTo(x,y-l);
			}
			if (x<canvas.width/2 && y<canvas.height/2){
				ctx.moveTo(x+l,y);ctx.lineTo(x,y);ctx.lineTo(x,y+l);
			}
			ctx.stroke();
			
			graph.ui.mouse_is_dragging = true;
			graph.ui.drag_object = 'caption_position';
			
			return;
		}
		
		
		
	}
}

function mouse_down_event(event,graph){
		mouse_down = true;
		var canvas = graph.canvas;
		var ctx = canvas.getContext('2d');
		var rect = canvas.getBoundingClientRect();
		start_x = event.clientX - rect.left;
		start_y = event.clientY - rect.top;
		//freeze the scaling stuff in place for the duration of the drag
		drag_x_max = graph.pixels_to_units(canvas.width,'x');
		drag_x_min = graph.pixels_to_units(0,'x');
		drag_y_max = graph.pixels_to_units(0,'y');
		drag_y_min = graph.pixels_to_units(canvas.height,'y');
		
		
}
var dotcount = 0;

function mouse_out_event(event,graph){
	var canvas = graph.canvas;
	var ctx = canvas.getContext('2d');
	ctx.putImageData(graph.graph_image,0,0);
}

function keypress_event(event,graph){
	console.log('in keypress');
	var c = String.fromCharCode(event.keyCode || event.charCode);
	console.log(c);
	console.log('in keypress');
}

function mouse_up_event(event,graph){
	"use strict";
	var canvas = graph.canvas;
	var gs = graph.graphics_style;
	var ctx = canvas.getContext('2d');
	mouse_down = false;
	var rect = canvas.getBoundingClientRect();
	var end_x = event.clientX - rect.left;
	var end_y = event.clientY - rect.top;
	
	var no_drag_size = gs.tick_len;
	var edge = graph.ui.size;
	
	if (gs.o >=1){
		var s = graph.ui.s;
		var names = ['scale width x','scale width y','symbol size','line thickness','tick length','minor tick length','title font size','ticks font size','axis font size','title spacing','tick padding','label spacing','graph line thickness'];
		var values = ['guideWidthx', 'guideWidthy','symbol_size','line_thickness','tick_len','minor_tick_len', 'title_font_size','tick_labels_font_size','axis_labels_font_size','title_spacing','tick_lables_font_padding','lable_spacing','graph_line_thickness'];

		var item = Math.ceil((end_y - s)/(1.2*s));
		var button = Math.ceil((end_x - s) / (s))-1;
		var speed = 1.1
		if (button >= 1){
			var scale = 1.0/speed;
			//right hand button smaller
		} else {
			var scale = speed;
		   //left had button, larger.
		}
		console.log(names[item]);
		//2.5*edge+tick_labels_font_size*1.2
		if (item >=0 && item < values.length){
			eval("graph.graphics_style." + values[item] + '*=' + scale);
		}
		item -= values.length;
		var strings  = ['font_name','title','subtitle','subtitle2','x_axis_title','y_axis_title','color_fg','color_bg','color_mg'];
		var string_names = ['font','title','subtitle','subtitle2','x-axis','y-axis','fg color','bg color','mg color'];
		if (item >=0 && item < strings.length){
			var name = string_names[item];
			var old_item = eval("graph.graphics_style." + strings[item]);
			eval("graph.graphics_style." + strings[item] + '= prompt("new '+name+'", "'+old_item+'") || "'+old_item+'"; ');
			//check if it was chainging an axis name. as the transforms will need to be rerun
			if (name === 'y-axis' || name === 'x-axis'){
				graph.transform_index--;
			}
		}
		

		item -= strings.length;
		if (item == 1){
			//reset everything except the current state of the options pane
			var temp =gs.o;
		    //graph.graphics_style = get_graph_style();
			//graph.graphics_style = graph.default_graphics_style;
			graph.graphics_style = JSON.parse(JSON.stringify(graph.default_graphics_style));
			graph.graphics_style.modified = false;
			graph.graphics_style.o = temp;
			console.log('doing reset');
			//need to force the data transforms to run to update the axies titles
			graph.transform_index=-1;
		}
		item--;;
		if (item == 1){
			//exit button
			graph.graphics_style.o = 0;
			console.log('menu exit');
		}
		
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
	}
	
	//zooming with rectangle. 
	if (gs.mouse_mode === 'zoom'){
		
		if (Math.abs(start_x - end_x) > no_drag_size && Math.abs(start_y - end_y) > no_drag_size){
			console.log('mouse zoom');
			 start_x = graph.pixels_to_units(start_x,'x');
			 start_y = graph.pixels_to_units(start_y,'y');
			 end_x = graph.pixels_to_units(end_x,'x');
			 end_y = graph.pixels_to_units(end_y,'y');
			
			gs.x_manual_min = Math.min(start_x,end_x);
			gs.x_manual_max = Math.max(start_x,end_x);
			gs.y_manual_min = Math.min(start_y,end_y);
			gs.y_manual_max = Math.max(start_y,end_y);
			gs.x_scale_auto_min = false;
			gs.y_scale_auto_min = false;
			gs.x_scale_auto_max = false;
			gs.y_scale_auto_max = false;
			gs.y_scale_tight = true;
			gs.x_scale_tight = true;
			graph.mjs_plot();
			return;
		}  
	}
	//touch zoom out button
	if (graph.ui.touch && (gs.mouse_mode === 'zoom' || gs.mouse_mode === 'drag')  && end_x < 4*edge && end_y >canvas.height-2*edge && end_y <canvas.height-1*edge ){
	//document.getElementById('errors').innerHTML="zoom out button";
		gs.y_scale_auto_min = true;
		gs.y_scale_tight = false;
		gs.y_scale_auto_max = true;
		gs.y_scale_tight = false;
		gs.x_scale_auto_min = true;
		gs.x_scale_tight = false;
		gs.x_scale_auto_max = true;
		gs.x_scale_tight = false;
	}
	
	//touch zoom out button event.button === 2
	if (graph.ui.touch && gs.mouse_mode === 'zoom' && end_x < 4*edge && end_y >canvas.height-3*edge && end_y <canvas.height-2*edge ){
		event.button = 2;
	}
	
	
	if(graph.drawcaptionmenu){
		var lx = Math.floor((canvas.width-end_x)/2/edge); //1 for left, 0 for right
		var ly = Math.floor(end_y/edge);
		graph.drawcaptionmenu=false;
		if (ly==1){
			gs.show_captions= !gs.show_captions ;
		}
		if (ly==7){
			gs.captions_display= "none";
		}
		if (lx ==1){
			switch (ly){
				case 3:
					gs.captions_display = "xfirst";
					break;
				case 4:
					gs.captions_display = "xlast";
					break;
				case 5:
					gs.captions_display = "xmin";
					break;
				case 6:
					gs.captions_display = "xmax";
					break;
			}
		}
		if (lx == 0){
			switch (ly){
				case 3:
					gs.captions_display = "yfirst";
					break;
				case 4:
					gs.captions_display = "ylast";
					break;
				case 5:
					gs.captions_display = "ymin";
					break;
				case 6:
					gs.captions_display = "ymax";
					break;
			}
		}
		if (ly >2 && ly<7){
			gs.show_captions=true;
		}
		graph.mjs_plot();
		setTimeout(function(){ mouse_move_event(event,graph); }, 0);
		return;
	}
	
	if(graph.drawmodemenu){
		var lx = Math.floor(end_x/edge);
		var ly = Math.floor(end_y/edge);
		if (ly==0){
			graph.drawmodemenu=false;
		}
		if (ly==1){
			//symbols
			switch(lx){
			case 0:
				gs.symbol_size*=1.2;
				break;
			case 1:
				gs.symbol_size/=1.2;
				break;
			case 2:
				gs.symbol_mode = "none";
				break;
			case 3:
				gs.symbol_mode = "dot";
				break;
			case 4:
				gs.symbol_mode = "cdot";
				break;
			case 5:
				gs.symbol_mode = "box";
				break;
			case 6:
				gs.symbol_mode = "circ";
				break;
			case 7:
				gs.symbol_mode = "x";
				break;
			case 8:
				gs.symbol_mode = "cross";
				break;
			}
		}
		if (ly==2){
			//lines
			switch(lx){
			case 0:
				gs.line_thickness*=1.2;
				break;
			case 1:
				gs.line_thickness/=1.2;
				break;
			case 2:
				gs.line_mode = "none";
				break;
			case 3:
				gs.line_mode = "line";
				break;
			case 4:
				gs.line_mode = "approx";
				break;
			case 5:
				gs.line_mode = "interp";
				break;
			case 6:
				gs.line_mode = "zig";
				break;
			case 7:
				gs.line_mode = "zag";
				break;
			case 8:
				gs.line_mode = "mid";
				break;
			case 9:
				gs.line_mode = "hist";
				break;
			}
		}
		
		graph.mjs_plot();
		setTimeout(function(){ mouse_move_event(event,graph); }, 0);
		return;
	}
	
	if(graph.drawgraphmenu){
	var ly = Math.floor(end_y/edge);
	switch(ly){
		case 0:
			graph.drawgraphmenu=false;
			break;
		case 1:
			gs.title = prompt("new title",gs.title ) || gs.title;
			break;
		case 2:
			gs.subtitle = prompt("new subtitle",gs.subtitle ) || gs.subtitle;
			break;
		case 3:
			gs.subtitle2 = prompt("new subtitle",gs.subtitle2 ) || gs.subtitle2;
			break;
		case 4:
			gs.showTransformTexts = !gs.showTransformTexts;
			break;
		case 5:
			gs.x_axis_title = prompt("new x axis title",gs.x_axis_title ) || gs.x_axis_title;
			graph.transform_index--;
			break;
		case 6:
			gs.y_axis_title = prompt("new y axis title",gs.y_axis_title ) || gs.y_axis_title;
			graph.transform_index--;
			break;
		case 7:
			gs.scaling_factor/=1.1;
			break;
		case 8:
			gs.scaling_factor*=1.1;
			break;
		case 9:
			graph.graphics_style = JSON.parse(JSON.stringify(graph.default_graphics_style));
			graph.graphics_style.modified = false;
			graph.transform_index= -1;
			break;
		}
		graph.mjs_plot();
		setTimeout(function(){ mouse_move_event(event,graph); }, 0);
		return;
	}
	
	//top buttons
	if (end_y < edge){
		if ( end_x < 4*edge){
		//dot button
		graph.drawmodemenu = true;
		}
		if ( end_x  >4*edge && end_x  <8 *edge){
		//dot button
		graph.drawgraphmenu = true;
		}
	
		
		if ( end_x < 10*edge && end_x > 9*edge){
		//drag button
		gs.mouse_mode = 'drag';
		graph.needs_drag_image = true;
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < 11*edge && end_x > 10*edge){
		//zoom button
		gs.mouse_mode = 'zoom';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < 12*edge && end_x > 11*edge){
		//measure button
		gs.mouse_mode = 'measure';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < 13*edge && end_x > 12*edge){
		//data reader button
		gs.mouse_mode = 'reader';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < 14*edge && end_x > 13*edge){
		//mouse button
		gs.mouse_mode = 'mouse';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < canvas.width && end_x > canvas.width - edge){
		//show/hide captions
			graph.drawcaptionmenu = true;
		}
		if ( end_x < canvas.width - edge && end_x > canvas.width - 2*edge){
		//infomation button 
			gs.i =  (gs.i + 1)%2;//a two state button.
			gs.o = 0;
		}
		if ( end_x < canvas.width - edge*2 && end_x > canvas.width - 3*edge){
		//options button 
			gs.o =  (gs.o + 1)%2;//a three state button.
			gs.mouse_mode = 'options';
			gs.i = 0;
		}
		
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
	}
	
	

	
	if(graph.drawtimemenu){
		var lx = 10*edge;
		var ldx = 2*edge;
		var ly =  canvas.height - edge*3;
		var ldy = edge;
		
		for (var i = 0;i<2;i++){
			if (end_y > ly-(i+1)*ldy && end_y < ly-i*ldy && end_x>lx && end_x < lx+4*ldx){
				for (var j = 0;j<4;j++){
					//var label = timeoptionsstrings[i][j];
					
					var selected = end_x>lx+j*ldx && end_x < lx+(j+1)*ldx;
					
					if (selected){graph.timemenuoptions[i] = j;}
					
				}
			}
		}
		if (end_y < ly +2*ldy && end_y > ly +1*ldy && end_x > lx && end_x < lx+3*ldx){
			//apply to x button
			console.log('apply button');
			var n = gs.data_transforms.length;
			gs.data_transforms[n] = "time_to_num";
			gs.x_scale_mode ='lin';
			var now = new Date();
			gs.data_transforms_args[n] = [graph.timemenuoptions[1],graph.timemenuoptions[0],'x',now.getTime()];
			graph.drawtimemenu = false;
			graph.mjs_plot();
			
		}
		if (end_y < ly +2*ldy && end_y > ly +1*ldy && end_x > lx+3*ldx && end_x < lx+6*ldx){
			//apply to ybutton
			console.log('apply button');
			var n = gs.data_transforms.length;
			gs.data_transforms[n] = "time_to_num";
			gs.y_scale_mode ='lin';
			var now = new Date();
			gs.data_transforms_args[n] = [graph.timemenuoptions[1],graph.timemenuoptions[0],'y',now.getTime()];
			graph.drawtimemenu = false;
			graph.mjs_plot();
		}
		
		
		mouse_move_event(event,graph);
		return;
	}
	//function buttons
	if (graph.drawfxmenu){
		var n = gs.data_transforms.length;
		
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height-edge){
			//pressed the fit menu button again
			graph.drawfxmenu = false;
			mouse_move_event(event,graph);
			return;
		}
		
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*2 && end_y < canvas.height - edge*1){
			// reset button
			console.log('resetbutton');
			graph.graphics_style.data_transforms = [];
			graph.graphics_style.data_transforms_args = [];
			
			if (gs.mode === 'hist dot'){
				gs.mode = 'line dot';
			}
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*1){
			// pop button
			console.log('pop');
			gs.data_transforms.pop();
			gs.data_transforms_args.pop();
		}
		if ( end_x < 12*edge && end_x >8*edge && end_y > canvas.height - edge*14 && end_y < canvas.height - edge*13){
			// y vs y button
			console.log('y vs y');
			if (gs.data_transforms[n-1] == "y_vs_y"){
				gs.data_transforms_args[n-1][0] += 1;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "y_vs_y";
				gs.data_transforms_args[n] = [1];
			}
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*3 && end_y < canvas.height - edge*2){
			// cut button button
			console.log('cut button');
			graph.pre_mouse_mode = gs.mouse_mode;
			gs.mouse_mode = 'cut';
			graph.drawfxmenu = false;
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*4 && end_y < canvas.height - edge*3){
			// normalise button
			console.log('normalise');
			if (gs.data_transforms[n-1] == "normalise"){
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "normalise";
				gs.data_transforms_args[n] = [0];
			}
			gs.y_scale_auto_min = true;
			gs.y_scale_auto_max = true;
			
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// y-c button
			console.log('y-c');
			graph.pre_mouse_mode = gs.mouse_mode;
			gs.mouse_mode = 'y-c';
			graph.drawfxmenu = false;
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// x-c button
			console.log('x-c');
			graph.pre_mouse_mode = gs.mouse_mode;
			gs.mouse_mode = 'x-c';
			graph.drawfxmenu = false;
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*6 && end_y < canvas.height - edge*5){
			// smooth button
			console.log('smooth');
			if (gs.data_transforms[n-1] == "smooth"){
				gs.data_transforms_args[n-1][0] = gs.data_transforms_args[n-1][0]*1.467799;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "smooth";
				gs.data_transforms_args[n] = [2.1544339];
			}
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*7 && end_y < canvas.height - edge*6){
			// interpolate button
			console.log('interpolate');
			if (gs.data_transforms[n-1] == "interpolate"){
				gs.data_transforms_args[n-1][0] *= 2;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "interpolate";
				gs.data_transforms_args[n] = [20];
			}
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*8 && end_y < canvas.height - edge*7){
			// subtract user defined line
			console.log('-baseline');
			graph.pre_mouse_mode = gs.mouse_mode;
			gs.mouse_mode = 'sublin';
			graph.drawfxmenu = false;
			//gs.data_transforms[n] = "remove_linear";
			//gs.data_transforms_args[n] = [];
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*9 && end_y < canvas.height - edge*8){
			// differentiate button
			console.log('dy/dx');
			gs.data_transforms[n] = "differentiate";
			gs.data_transforms_args[n] = [0];
			gs.y_scale_auto_min = true;
			gs.y_scale_auto_max = true;
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// e to the power x button
			console.log('ex');
			if (gs.data_transforms[n-1] == "ln_x"){
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "e_to_x";
				gs.data_transforms_args[n] = [0];
			}
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// ln x button
			console.log('lnx');
			if (gs.data_transforms[n-1] == "e_to_x"){
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "ln_x";
				gs.data_transforms_args[n] = [0];
			}
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// ten to the x button
			console.log('10^x');
			if (gs.data_transforms[n-1] == "log_x"){
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "ten_to_x";
				gs.data_transforms_args[n] = [0];
			}
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// log x button
			console.log('logx');
			if (gs.data_transforms[n-1] == "ten_to_x"){
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "log_x";
				gs.data_transforms_args[n] = [0];
			}
			
		
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// x over 10 button
			console.log('x/10');
			if (gs.data_transforms[n-1] == "scale_x"){
				console.log('incresing scaling');
				gs.data_transforms_args[n-1][0] *= 0.1;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "scale_x";
				gs.data_transforms_args[n] = [0.1];
			}
			gs.x_manual_min *=0.10;
			gs.x_manual_max *=0.10;
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// ten x button
			console.log('10x');
			if (gs.data_transforms[n-1] == "scale_x"){
				console.log('incresing scaling');
				gs.data_transforms_args[n-1][0] *= 10;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "scale_x";
				gs.data_transforms_args[n] = [10];
			}
			gs.x_manual_min *=10;
			gs.x_manual_max *=10;
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// one over x button
			console.log('1/x');
			if (gs.data_transforms[n-1] == "one_over_x"){
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "one_over_x";
				gs.data_transforms_args[n] = [];
			}
			
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// neg x button
			console.log('-x');			
			if (gs.data_transforms[n-1] == "scale_x"){
				console.log('incresing scaling');
				gs.data_transforms_args[n-1][0] *= -1;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "scale_x";
				gs.data_transforms_args[n] = [-1];
			}
			var oldmin = gs.x_manual_min*-1;
			var oldmax = gs.x_manual_max*-1;
			gs.x_manual_min = Math.min(oldmin,oldmax);
			gs.x_manual_max = Math.max(oldmin,oldmax);
		}
		
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*2 && end_y < canvas.height - edge*1){
			// swap button
			console.log('x<->y');	
			if (gs.data_transforms[n-1] == "swap_x_y"){
				console.log('undoing swap');
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "swap_x_y";
				gs.data_transforms_args[n] = [];
			}
			
			
			var temp = gs.x_manual_min;
			gs.x_manual_min =gs.y_manual_min;
			gs.y_manual_min =temp;
			temp =gs.x_manual_max;
			gs.x_manual_max =gs.y_manual_max;
			gs.y_manual_max =temp;
			temp = gs.x_scale_mode;
			gs.x_scale_mode = gs.y_scale_mode;
			gs.y_scale_mode = temp;
			
			
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*3 && end_y < canvas.height - edge*2){
			// trim button
			console.log('trim');
			graph.pre_mouse_mode = gs.mouse_mode;
			gs.mouse_mode = 'trim';
			graph.drawfxmenu = false;
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*4 && end_y < canvas.height - edge*3){
			// y^(n) button
			console.log('y^(n)');
			if (gs.data_transforms[n-1] == "y_pow_n"){
				console.log('incresing power');
				gs.data_transforms_args[n-1][0] += 1;
				var pwr = gs.data_transforms_args[n-1][0];
				gs.y_manual_min = Math.pow(gs.y_manual_min,pwr/(pwr-1));
				gs.y_manual_max = Math.pow(gs.y_manual_max,pwr/(pwr-1));
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "y_pow_n";
				gs.data_transforms_args[n] = [2];
				gs.y_manual_min = Math.pow(gs.y_manual_min,2);
				gs.y_manual_max = Math.pow(gs.y_manual_max,2);
			}
			
			
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*4 && end_y < canvas.height - edge*3){
			// some button
			console.log('x^(n)');
			if (gs.data_transforms[n-1] == "x_pow_n"){
				console.log('incresing power');
				gs.data_transforms_args[n-1][0] += 1;
				var pwr = gs.data_transforms_args[n-1][0];
				gs.x_manual_min = Math.pow(gs.x_manual_min,pwr/(pwr-1));
				gs.x_manual_max = Math.pow(gs.x_manual_max,pwr/(pwr-1));
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "x_pow_n";
				gs.data_transforms_args[n] = [2];
				gs.x_manual_min = Math.pow(gs.x_manual_min,2);
				gs.x_manual_max = Math.pow(gs.x_manual_max,2);
			}
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// some button
			console.log('sqrty');
			if (gs.data_transforms[n-1] == "y_nth_root"){
				console.log('incresing power');
				gs.data_transforms_args[n-1][0] += 1;
				var pwr = gs.data_transforms_args[n-1][0];
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "y_nth_root";
				gs.data_transforms_args[n] = [2];
				var pwr = 2;
			}
			var rtmin = Math.pow(Math.abs(gs.y_manual_min),1/2);
			var rtmax = Math.pow(Math.abs(gs.y_manual_max),1/2)
			if (gs.y_manual_min < 0 && gs.y_manual_max > 0){
			//if graph is accross zero then make the minimum zero. max could be ether still.
				var make_zero = 0;
			} else {make_zero = 1;}
			gs.y_manual_min = Math.min( rtmin,rtmax)*make_zero;
			gs.y_manual_max = Math.max( rtmin,rtmax);
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// some button
			console.log('sqrtx');
			if (gs.data_transforms[n-1] == "x_nth_root"){
				console.log('incresing power');
				gs.data_transforms_args[n-1][0] += 1;
				var pwr = gs.data_transforms_args[n-1][0];
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "x_nth_root";
				gs.data_transforms_args[n] = [2];
				var pwr = 2;
			}
			var rtmin = Math.pow(Math.abs(gs.x_manual_min),1/2);
			var rtmax = Math.pow(Math.abs(gs.x_manual_max),1/2)
			if (gs.x_manual_min < 0 && gs.x_manual_max > 0){
			//if graph is accross zero then make the minimum zero. max could be ether still.
				var make_zero = 0;
			} else {make_zero = 1;}
			gs.x_manual_min = Math.min( rtmin,rtmax)*make_zero;
			gs.x_manual_max = Math.max( rtmin,rtmax);
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*6 && end_y < canvas.height - edge*5){
			// some button
			console.log('B-A');
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*6 && end_y < canvas.height - edge*5){
			// some button
			console.log('sum');
			gs.data_transforms[n] = "sum";
			gs.data_transforms_args[n] = [];
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*7 && end_y < canvas.height - edge*6){
			// some button
			console.log('Jitter');
			if (gs.data_transforms[n-1] == "jitter"){
				gs.data_transforms_args[n-1][0] += 1;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "jitter";
				gs.data_transforms_args[n] = [1];
			}
			
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*8 && end_y < canvas.height - edge*7){
			// some button
			console.log('Hist');
			gs.data_transforms[n] = "hist";
			gs.data_transforms_args[n] = [0];
			gs.x_scale_auto_max = true;
			gs.x_scale_auto_min = true;
			gs.y_scale_auto_max = true;
			gs.y_scale_auto_min = true;
			gs.x_scale_mode = 'lin';
			gs.y_scale_mode = 'lin';
			gs.mode = 'hist dot';
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*9 && end_y < canvas.height - edge*8){
			// some button
			console.log('Intergrate');
			gs.data_transforms[n] = "intergrate";
			gs.data_transforms_args[n] = [0];
			gs.y_scale_auto_min = true;
			gs.y_scale_auto_max = true;
			
		}
	
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// some button
			console.log('ey');
			gs.data_transforms[n] = "e_to_y";
			gs.data_transforms_args[n] = [0];
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// some button
			console.log('lny');
			gs.data_transforms[n] = "ln_y";
			gs.data_transforms_args[n] = [0];
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// some button
			console.log('10^y');
			gs.data_transforms[n] = "ten_to_y";
			gs.data_transforms_args[n] = [0];
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// some button
			console.log('logy');
			gs.data_transforms[n] = "log_y";
			gs.data_transforms_args[n] = [0];
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// some button
			console.log('y/10');
			if (gs.data_transforms[n-1] == "scale_y"){
				console.log('incresing scaling');
				gs.data_transforms_args[n-1][0] *= 0.1;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "scale_y";
				gs.data_transforms_args[n] = [0.1];
			}
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// some button
			console.log('10y');
			if (gs.data_transforms[n-1] == "scale_y"){
				console.log('incresing scaling');
				gs.data_transforms_args[n-1][0] *= 10;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "scale_y";
				gs.data_transforms_args[n] = [10];
			}
			
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// some button
			console.log('1/y');
			
			if (gs.data_transforms[n-1] == "one_over_y"){
				gs.data_transforms.pop();
				gs.data_transforms_args.pop();
			} else {
				gs.data_transforms[n] = "one_over_y";
			gs.data_transforms_args[n] = [];
			}
			
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// some button
			console.log('-y');
			if (gs.data_transforms[n-1] == "scale_y"){
				console.log('incresing scaling');
				gs.data_transforms_args[n-1][0] *= -1;
				graph.transform_index--;
			} else {
				gs.data_transforms[n] = "scale_y";
				gs.data_transforms_args[n] = [-1];
			}
			var oldmin = gs.y_manual_min*-1;
			var oldmax = gs.y_manual_max*-1;
			gs.y_manual_min = Math.min(oldmin,oldmax);
			gs.y_manual_max = Math.max(oldmin,oldmax);
		}
		if ( end_x < 22*edge && end_x >16*edge && end_y > canvas.height - edge*14 && end_y < canvas.height - edge*13){
			// subtract trend button
			console.log('subtract trend');
			if (fits.fit_strings.indexOf(gs.fits)>-1){
				gs.data_transforms[n] = "subtract_fit";
				gs.data_transforms_args[n] = [gs.fits];
				gs.fits = 'none';
			} else {
					graph.errors.push('No fit chosen');
			}	
		}
		if ( end_x < 22*edge && end_x >16*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// remove outliers button
			console.log('subtract trend');
			if (gs.data_transforms[n-1] == "remove_outliers"){
				gs.data_transforms_args[n-1][1] -= 1;
				graph.transform_index--;
			} else {
				if (fits.fit_strings.indexOf(gs.fits)>-1){
					//only add if there is a valid fit 
					gs.data_transforms[n] = "remove_outliers";
					gs.data_transforms_args[n] = [gs.fits,5];
					gs.fits = 'old';
				} else {
					graph.errors.push('No fit chosen');
				}
			}
		}
		if ( end_x < 22*edge && end_x >16*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// remove outliers button
			console.log('subtract trend');
			if (gs.data_transforms[n-1] == "keep_outliers"){
				gs.data_transforms_args[n-1][1] += 1;
				graph.transform_index--;
			} else {
				if (fits.fit_strings.indexOf(gs.fits)>-1){
				gs.data_transforms[n] = "keep_outliers";
				gs.data_transforms_args[n] = [gs.fits,0];
				gs.fits = 'old';
				} else {
					graph.errors.push('No fit chosen');
				}
			}
		}
		
		if ( end_x < 22*edge && end_x >16*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// remove outliers button
			console.log('custom button');
			var f = prompt('y = f(x,y) =','y');
			if (f){
				gs.data_transforms[n] = "custom_y";
				gs.data_transforms_args[n] = [f];
				
			}
		}
		
		if ( end_x < 22*edge && end_x >16*edge && end_y > canvas.height - edge*2 && end_y < canvas.height - edge*1){
			// spacing button
			console.log('x spacing');
			gs.data_transforms[n] = "spacing";
			gs.data_transforms_args[n] = [];
		}
		if ( end_x < 22*edge && end_x >16*edge && end_y > canvas.height - edge*3 && end_y < canvas.height - edge*2){
			// mean_normalise button
			console.log('mean_normalise');
			gs.data_transforms[n] = "mean_normalise";
			gs.data_transforms_args[n] = [];
		}
		if ( end_x < 22*edge && end_x >16*edge && end_y > canvas.height - edge*1 && end_y < canvas.height){
			// time menu button
			console.log('time menu');
			graph.drawtimemenu=true;
			graph.drawfxmenu = false;
		}
		
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
	
	}
	
	//line menu buttons
	if (graph.drawlinemenu){
		if ( end_x < 15*edge && end_x > 11*edge && end_y > canvas.height-edge){
			//pressed the fit menu button again
			graph.drawlinemenu = false;
			mouse_move_event(event,graph);
			return;
		}
		//pressed hide/show
		if ( end_x < 20*edge && end_x > 11*edge && end_y < canvas.height-edge){
			
			var no_of_lines = graph.data_backup.length;
			var no_of_function_lines = gs.function_lines.length;
			
			var item = Math.floor((no_of_lines+no_of_function_lines+1)-((canvas.height-end_y) / edge -1));
			
			if (item == 0){
				console.log('new function');
				var f;
				if (gs.x_scale_mode === 'time'){
				f = prompt('y = f(x)','cos(2*pi*x/1000/60/60/24)');
				} else {
				f = prompt('y = f(x)','x*x/2');
				}
				if (f){
					gs.function_lines.push(f);
				}
			}
			item -=1;
			if (item < no_of_function_lines && item >= 0 && end_x < 13*edge){
				console.log('remove item '+ item);
				gs.function_lines.splice(no_of_function_lines-item-1,1);
			}
			if (item < no_of_function_lines && item >= 0 && end_x > 13*edge){
				console.log('edit item '+ item);
				var f = prompt('y = f(x)',gs.function_lines[no_of_function_lines-item-1]);
				if (f){
					gs.function_lines[no_of_function_lines-item-1] = f;
				}
				//gs.function_lines.splice(no_of_function_lines-item-1,1);
			}
			
			item -= no_of_function_lines;
			if (item >= 0){
				console.log('hideshow'+ item);
				gs.hidden_lines[item] = !gs.hidden_lines[item];
			}
		}
		//all button
		if ( end_x < 17*edge && end_x > 15*edge && end_y > canvas.height-edge){
			console.log('all');
			for (var k = 0;k<gs.hidden_lines.length;k++){
				gs.hidden_lines[k] = false;
			} 
		}
		//none button
		if ( end_x < 19*edge && end_x > 17*edge && end_y > canvas.height-edge){
			console.log('non');
			for (var k = 0;k<gs.hidden_lines.length;k++){
				gs.hidden_lines[k] = true;
			} 
		}
		
		
		graph.transform_index--;
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
	}
	
	//export menu buttons
	if (graph.drawexportmenu){
		graph.drawexportmenu = false;
		mouse_move_event(event,graph);
		var my = canvas.height;
		var dy = edge;
		
		
		if ( end_y > my - dy && end_y < my){
			
			return;
		}
		
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('csv');
			//find longest data set
			len = 0;
			for (i = 0;i<graph.data.length;i++){
				len = Math.max(len,graph.data[i][0].length);
			}
			//traverse the data variable in an odd way.
			//just to get copy and paste to origin/matlab working
			var text = "";
				for(var ii = 0; ii <len; ii++) {
					for (i = 0;i<graph.data.length;i++){
						try{
						text += graph.data[i][0][ii].toString() + ","+ graph.data[i][1][ii].toString() + ",";
						} catch(e){
						text += ",,";
						}
					}
					text = text.substring(0, text.length - 1); //removes the trailing comma
					text += "\n";
				}
			
			download_text(text,'mjsplot_graph.csv');
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('code');
			var theBody = document.getElementsByTagName('body')[0];
			var text = '';
			for (i = 0;i<graph.data.length;i++){
				text += graph.captions[i].replace( /\W/g, "")+'_x = [';
				for (ii = 0;ii<graph.data[i][0].length-1;ii++){
					text += graph.data[i][0][ii] + ','
				}
				text += graph.data[i][0][ii] + '];\n';
				
				text += graph.captions[i].replace( /\W/g, "")+'_y = [';
				for (ii = 0;ii<graph.data[i][1].length-1;ii++){
					text += graph.data[i][1][ii] + ','
				}
				text += graph.data[i][1][ii] + '];\n';
				
				
			}
			show_text_to_screen(text,graph);
			//theBody.innerHTML = text;
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('code matlab');
			var theBody = document.getElementsByTagName('body')[0];
			var text = '';
			for (i = 0;i<graph.data.length;i++){
				text += graph.captions[i].replace( /\W/g, "")+'_x = [';
				for (ii = 0;ii<graph.data[i][0].length-1;ii++){
					text += graph.data[i][0][ii] + ' '
				}
				text += graph.data[i][0][ii] + '];\n';
				
				text += graph.captions[i].replace( /\W/g, "")+'_y = [';
				for (ii = 0;ii<graph.data[i][1].length-1;ii++){
					text += graph.data[i][1][ii] + ' '
				}
				text += graph.data[i][1][ii] + '];\n';
				
				
			}
			show_text_to_screen(text,graph);
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('code JSON');
			var text = '';
			text = JSON.stringify(graph.data);
			download_text(text,'mjsplot_graph.json');
		}
		
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('tabbed');
			//find longest data set
			var len = 0;
			for (i = 0;i<graph.data.length;i++){
				len = Math.max(len,graph.data[i][0].length);
			}
			//traverse the data variable in an odd way.
			//just to get copy and paste to origin/matlab working
			var text = "";
				for(var ii = 0; ii <len; ii++) {
					for (i = 0;i<graph.data.length;i++){
						try{
						text += graph.data[i][0][ii].toString() + "\t"+ graph.data[i][1][ii].toString() + "\t";
						} catch(e){
						text += "\t\t";
						}
					}
					text += "\n";
				}
			download_text(text,'mjsplot_graph.dat');
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('png hi');
			graph.canvas.width *= 3;
			graph.canvas.height *= 3;
			gs.scaling_factor *= 3;
			graph.transparent = true;
			graph.mjs_plot();
			var dataUrl = graph.canvas.toDataURL();
			window.open(dataUrl, "toDataURL() image", "width=600, height=400");
			graph.transparent = false;
			gs.scaling_factor /= 3;
			graph.canvas.width /= 3;
			graph.canvas.height /= 3;
			graph.mjs_plot();
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('png low');
			graph.transparent = true;
			graph.mjs_plot();
			var dataUrl = graph.canvas.toDataURL();
			window.open(dataUrl, "toDataURL() image", "width=600, height=400");
			graph.transparent = false;
			graph.mjs_plot();
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('png (small figure)');
			//TODO should figure out a way to allways get the fonts to be the correct size. 
			var temp_width = graph.canvas.width;
			var temp_height = graph.canvas.height;
			graph.canvas.width = 1000;
			graph.canvas.height = 750;
			gs.scaling_factor *= 2.5;
			graph.transparent = true;
			graph.mjs_plot();
			var dataUrl = graph.canvas.toDataURL();
			window.open(dataUrl, "toDataURL() image", "width=1000, height=750");
			graph.transparent = false;
			gs.scaling_factor /= 2.5;
			graph.canvas.width  = temp_width;
			graph.canvas.height = temp_height;
			graph.mjs_plot();
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('png (large figure)');
			//TODO should figure out a way to allways get the fonts to be the correct size. 
			var temp_width = graph.canvas.width;
			var temp_height = graph.canvas.height;
			graph.canvas.width = 1000*2;
			graph.canvas.height = 750*2;
			gs.scaling_factor *= 2.5;
			graph.transparent = true;
			graph.mjs_plot();
			var dataUrl = graph.canvas.toDataURL();
			window.open(dataUrl, "toDataURL() image", "width=1000, height=750");
			graph.transparent = false;
			gs.scaling_factor /= 2.5;
			graph.canvas.width  = temp_width;
			graph.canvas.height = temp_height;
			graph.mjs_plot();
		}
		my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('svg');
			//make a div to put a tempoary inline svg in.
			var svgDiv = document.createElement('div');
			svgDiv.innerHTML = '<svg id="_mjsplotSVG" version="1.1" width="'+graph.canvas.width+'" height="'+graph.canvas.height+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"/>';
			document.body.appendChild(svgDiv);
			//set the graph to SVG mode and plot to the svg
			graph.isSVG=true;
			graph.mjs_plot();
			//get the svg that was just plotted
			var svg = document.getElementById("_mjsplotSVG").outerHTML;
			// get a headder on it for utf-8
			var xmlheadder = '<?xml version="1.0" encoding="utf-8" standalone="yes"?> ';
			//make a download link
			/*
			var pom = document.createElement('a');
			//on click do the download
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xmlheadder+svg));
			pom.setAttribute('download', 'mjsplot_graph.svg');
			pom.style.display = 'none';
			document.body.appendChild(pom);
			pom.click();
			//clean up
			document.body.removeChild(pom);
			*/
			download_text(xmlheadder+svg,'mjsplot_graph.svg','data:image/svg+xml;charset=utf-8');
			document.body.removeChild(svgDiv);
			graph.isSVG=false;
			graph.mjs_plot();
		}my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('svg (small fig)');
			var temp_width = graph.canvas.width;
			var temp_height = graph.canvas.height;
			graph.canvas.width = 1000/2.5;
			graph.canvas.height = 750/2.5;
			
			var svgDiv = document.createElement('div');
			svgDiv.innerHTML = '<svg id="_mjsplotSVG" version="1.1" width="'+graph.canvas.width+'" height="'+graph.canvas.height+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"/>';
			document.body.appendChild(svgDiv);
			graph.isSVG=true;
			graph.mjs_plot();
			var svg = document.getElementById("_mjsplotSVG").outerHTML;
			
			var xmlheadder = '<?xml version="1.0" encoding="utf-8" standalone="yes"?> ';
			
			download_text(xmlheadder+svg,'mjsplot_graph.svg','data:image/svg+xml;charset=utf-8');
			document.body.removeChild(svgDiv);
			graph.isSVG=false;
			graph.canvas.width  = temp_width;
			graph.canvas.height = temp_height;
			graph.mjs_plot();
		}my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('svg (large fig)');
			var temp_width = graph.canvas.width;
			var temp_height = graph.canvas.height;
			graph.canvas.width = 2*1000/2.5;
			graph.canvas.height = 2*750/2.5;
			
			var svgDiv = document.createElement('div');
			svgDiv.innerHTML = '<svg id="_mjsplotSVG" version="1.1" width="'+graph.canvas.width+'" height="'+graph.canvas.height+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"/>';
			document.body.appendChild(svgDiv);
			graph.isSVG=true;
			graph.mjs_plot();
			var svg = document.getElementById("_mjsplotSVG").outerHTML;
			
			
			var xmlheadder = '<?xml version="1.0" encoding="utf-8" standalone="yes"?> ';
			
			download_text(xmlheadder+svg,'mjsplot_graph.svg','data:image/svg+xml;charset=utf-8');
			document.body.removeChild(svgDiv);
			graph.isSVG=false;
			graph.canvas.width  = temp_width;
			graph.canvas.height = temp_height;
			graph.mjs_plot();
		}my-=dy;
		if ( end_y > my - dy && end_y < my){
			console.log('html embedding');
			var text = '';
			var nl= ' \n';
			var graph_name = graph.graph_name;
			var canvas_name = graph.canvas_name ;
			var mjsplot_embed = '<script src="mjs_plot_0_3_3svg.js"></script>'
			var canvas_embed = '<canvas id="'+ canvas_name+'" width="'+graph.canvas.width+'px" height="'+graph.canvas.height+'px"></canvas>';
			var data_code = JSON.stringify(graph.data_backup);
			var gs_code = JSON.stringify(graph.graphics_style);
			var captions_code = JSON.stringify(graph.captions_backup);
			
			text += "put this in <head>"+nl;
			text+= mjsplot_embed+nl;
			text+="This links to a copy of mjs_plot. You will need to put mjs_plot_3_n.js in the same folder."+nl;
			text+="The plan is to get a CDN so you can skip this step." +nl;
			
			
			text += nl +"put a canvas in the <body> where you want the graph:" + nl;
			text += canvas_embed+nl;
			
			text += nl+"Put this after the <body>:" + nl;
			text += '<script>' + nl;
			text+= graph_name+' = new mjs_plot.new_graph("'+graph_name+'","'+canvas_name+'") ;'+nl;
			text+= graph_name+'.setData( '+data_code+' );'+nl;
			text+= graph_name+'.setCaptions( '+captions_code+' ); '+nl;
			text+= graph_name+'.default_graphics_style = '+gs_code+'; '+nl;
			text+= graph_name+'.plot();\n'+nl;
			text += '</script>' + nl;
			
			show_text_to_screen(text,graph);
			
		}my-=dy;
		
		
		
		return;
	}
	
	//fit menu buttons
	if (graph.drawfitsmenu){
		
		if ( end_x < 21*edge && end_x > 18*edge && end_y > canvas.height-edge){
			//pressed none fits button
			gs.fits = 'none';
		}
		if ( end_y > canvas.height-2*edge && end_y < canvas.height-1*edge){
			gs.extrapolate = !gs.extrapolate;
		}
		if ( end_y > canvas.height-3*edge && end_y < canvas.height-2*edge && end_x > 18*edge){
			gs.fits = 'stats';
		}
		if ( end_y > canvas.height-4*edge && end_y < canvas.height-3*edge && end_x > 18*edge){
			gs.fits = 'exp';
		}
		if ( end_y > canvas.height-5*edge && end_y < canvas.height-4*edge && end_x > 18*edge){
			gs.fits = 'exp_c';
		}
		if ( end_y > canvas.height-6*edge && end_y < canvas.height-5*edge && end_x > 18*edge){
			gs.fits = 'log';
		}
		if ( end_y > canvas.height-7*edge && end_y < canvas.height-6*edge && end_x > 18*edge){
			gs.fits = 'power';
		}
		if ( end_y > canvas.height-8*edge && end_y < canvas.height-7*edge && end_x > 18*edge){
			gs.fits = 'power_c';
		}
		if ( end_y > canvas.height-9*edge && end_y < canvas.height-8*edge && end_x > 18*edge){
			gs.fits = 'gauss';
		}
		
		//exp_c
		if ( end_y > canvas.height-3*edge && end_y < canvas.height-2*edge && end_x < 18*edge){
			gs.fits = 'const';
		}
		if ( end_y > canvas.height-4*edge && end_y < canvas.height-3*edge && end_x < 18*edge){
			gs.fits = 'linear';
		}
		if ( end_y > canvas.height-5*edge && end_y < canvas.height-4*edge && end_x < 18*edge){
			gs.fits = 'quad';
		}
		if ( end_y > canvas.height-6*edge && end_y < canvas.height-5*edge && end_x < 18*edge){
			gs.fits = 'cubic';
		}
		if ( end_y > canvas.height-7*edge && end_y < canvas.height-6*edge && end_x < 18*edge){
			gs.fits = 'poly4';
		}
		if ( end_y > canvas.height-8*edge && end_y < canvas.height-7*edge && end_x < 18*edge){
			gs.fits = 'poly5';
		}
		if ( end_y > canvas.height-9*edge && end_y < canvas.height-8*edge && end_x < 18*edge){
			gs.fits = 'poly6';
		}
		if ( end_y > canvas.height-10*edge && end_y < canvas.height-9*edge && end_x < 18*edge){
			gs.fits = 'poly5';
		}
		
		
		graph.mjs_plot();
		
		if ( end_x < 18*edge && end_x > 15*edge && end_y > canvas.height-edge){
			//pressed the fit menu button again
			graph.drawfitsmenu = false;
		}
		if ( end_x < 21*edge && end_x > 18*edge && end_y > canvas.height-edge){
			//pressed none fits button
			gs.fits = 'none';
			graph.drawfitsmenu = false;
			
		}
		console.log(gs.fits);
		mouse_move_event(event,graph);
		return;
	}
	
	//bottom buttons
	if (end_y>canvas.height-edge){
		if ( end_x < 1*edge && end_x > 0*edge){
			gs.y_scale_auto_min = true;
			gs.y_scale_tight = false;
		}
		if ( end_x < 2*edge && end_x > 1*edge){
			gs.y_scale_auto_max = true;
			gs.y_scale_tight = false;
		}
		if ( end_x < 3*edge && end_x > 2*edge){
			gs.x_scale_auto_min = true;
			gs.x_scale_tight = false;
		}
		if ( end_x < 4*edge && end_x > 3*edge){
			gs.x_scale_auto_max = true;
			gs.x_scale_tight = false;
		}
		if ( end_x < 5*edge && end_x > 4*edge){
			gs.show_grid = !gs.show_grid;
		}
		if ( end_x < 6*edge && end_x > 5*edge){
			//y scalemode button
			if (gs.y_scale_mode === 'log' ){
				gs.y_scale_mode = 'lin';
			} else {
				gs.y_scale_mode = 'log';
			}
		}
		if ( end_x < 7*edge && end_x > 6*edge){
			//x scalemode button
			if (gs.x_scale_mode === 'log' ){
				gs.x_scale_mode = 'lin';
			} else {
				gs.x_scale_mode = 'log';
			}
		}
		if ( end_x < 8*edge && end_x > 7*edge){
			//x scalemode button
			gs.x_scale_mode = 'time';
		}
		
		if ( end_x < 11*edge && end_x > 8*edge){
			//f() menu button
			graph.drawfxmenu = true;
			mouse_move_event(event,graph);
			return;
		}
		
		if ( end_x < 15*edge && end_x > 11*edge){
			//line menu button
			console.log('line menu button');
			graph.drawlinemenu = true;
			mouse_move_event(event,graph);
			return;
		}
		if ( end_x < 19*edge && end_x > 15*edge){
			//fits menu button
			console.log('fits menu button');
			graph.drawfitsmenu = true;
			mouse_move_event(event,graph);
			return;
		}
		
		
		if ( end_x < canvas.width && end_x > canvas.width - edge){
		//export data button
			//data_out(graph);
			//return;
			//open the export menu
			graph.drawexportmenu = true;
		}
		if ( end_x < canvas.width-edge && end_x > canvas.width - 2*edge){
		//day/night data button
			//gs.day_night_mode = !gs.day_night_mode;
			var temp = gs.color_fg 
			gs.color_fg = gs.color_bg;
			gs.color_bg = temp;
		}
		if ( end_x < canvas.width-edge*2 && end_x > canvas.width - edge*3){
			//fullscreen button
			if (graph.isFullscreen){
				graph.exit_full_screen();
			} else {
				graph.make_full_screen(graph);
			}
		}
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
	
	}
	
	//zoom without drag
	if (gs.mouse_mode === 'zoom'){
		ctx.rect(start_x-no_drag_size*0.5,start_y-no_drag_size*0.5,no_drag_size,no_drag_size);
		ctx.stroke();
		 if( event.button=== 0){
			gs.x_scale_auto_min = true;
			gs.y_scale_auto_min = true;
			gs.x_scale_auto_max = true;
			gs.y_scale_auto_max = true;
			gs.y_scale_tight = false;
			gs.x_scale_tight = false;
		}
		else if(event.button === 2){
			//console.log('was right click');
			gs.x_scale_auto_min = false;
			gs.y_scale_auto_min = false;
			gs.x_scale_auto_max = false;
			gs.y_scale_auto_max = false;
			gs.y_scale_tight = false;
			gs.x_scale_tight = false;
			var f = 0.8;
			gs.x_manual_min = graph.pixels_to_units(-f*gs.guideWidthx,'x');
			gs.x_manual_max = graph.pixels_to_units(canvas.width+f*gs.guideWidthx,'x');
			gs.y_manual_min = graph.pixels_to_units(canvas.height+f*gs.guideWidthy,'y');
			gs.y_manual_max = graph.pixels_to_units(-f*gs.guideWidthy,'y');
			
			
		}
		
	}
	
	//on mobile, don't replot the graph if using the measure mode. 
	if (graph.ui.touch && gs.mouse_mode === 'measure' && graph.ui.is_touching){
		graph.graph_image = ctx.getImageData(0,0,canvas.width,canvas.height);
		return;
		
	}
	
	//on mobile, don't replot the graph if using the measure mode. 
	if (graph.ui.touch && gs.mouse_mode === 'measure'){
		graph.mjs_plot();return;
		
	}
	
	//dragging
	if (gs.mouse_mode === 'drag'){
		if (graph.ui.touch && graph.ui.is_touching){
		
			start_x = 0.5*(touch_start_x[0]+touch_start_x[1]);
			start_y = 0.5*(touch_start_y[0]+touch_start_y[1]);
			
			end_x = 0.5*(touch_x[0]+touch_x[1]);
			end_y = 0.5*(touch_y[0]+touch_y[1]);
			
			var scale_x = (touch_x[0]-touch_x[1]) / (touch_start_x[0]-touch_start_x[1]);
			var scale_y = (touch_y[0]-touch_y[1]) / (touch_start_y[0]-touch_start_y[1]);
			scale_x = trim(Math.abs(scale_x),0.1,10);
			scale_y = trim(Math.abs(scale_y),0.1,10);
			
			//p + (1-1/scale)*( start-p )+ end - start
			//this set of equations took two days of trial and fuck error. Lots of error. 
			var new_max_y = 0 + (1-1/scale_y)*( start_y-0 ) +(- end_y + start_y)/scale_y;
			var new_min_y = canvas.height + (1-1/scale_y)*( start_y-canvas.height )+(- end_y + start_y)/scale_y
			
			var new_max_x = canvas.width + (1-1/scale_x)*( start_x-canvas.width ) +(- end_x + start_x)/scale_x;
			var new_min_x = 0 + (1-1/scale_x)*( start_x-0 ) +(- end_x + start_x)/scale_x
			
			gs.y_manual_max = Math.min(1e250,graph.pixels_to_units(new_max_y,'y'));
			gs.y_manual_min = Math.max(-1e250,graph.pixels_to_units(new_min_y,'y'));
			gs.x_manual_min = Math.max(-1e250,graph.pixels_to_units(new_min_x,'x'));
			gs.x_manual_max = Math.min(1e250,graph.pixels_to_units(new_max_x,'x'));
			//the 1e250 is to protect the 
			
			gs.x_scale_auto_min = false;
			gs.y_scale_auto_min = false;
			gs.x_scale_auto_max = false;
			gs.y_scale_auto_max = false;
			gs.y_scale_tight = true;
			gs.x_scale_tight = true;

			graph.mjs_plot();return;
		}
		if (!graph.ui.touch){
		
			gs.y_manual_max = graph.pixels_to_units(start_y-end_y+gs.guideWidthy+1,'y');
			gs.y_manual_min = graph.pixels_to_units(canvas.height+start_y-end_y-gs.guideWidthy-1,'y');
			gs.x_manual_min = graph.pixels_to_units(start_x-end_x+gs.guideWidthx-1,'x');
			gs.x_manual_max = graph.pixels_to_units(canvas.width+start_x-end_x-gs.guideWidthx+1,'x');
			gs.x_scale_auto_min = false;
			gs.y_scale_auto_min = false;
			gs.x_scale_auto_max = false;
			gs.y_scale_auto_max = false;
			gs.y_scale_tight = true;
			gs.x_scale_tight = true;

			graph.mjs_plot();return;
		}
		
	}
	
	if (gs.mouse_mode === 'reader'){
		//the the point that is closed to whene the mouse ended the click
		 //end_x = graph.pixels_to_units(end_x,'x');
		 //end_y = graph.pixels_to_units(end_y,'y');
		 var pi = 0;//index of the series it is in
		 var pj = 0;// index in the series. 
		 var best_dist = 1e200; 
		 var dist = 1e200;
		 for (i = 0;i<graph.data.length;i++){
			for (j = 0;j<graph.data[i][0].length;j++){
				var xi =  graph.units_to_pixels(graph.data[i][0][j],'x');
				var yi = graph.units_to_pixels(graph.data[i][1][j],'y');
				dist = Math.sqrt( Math.pow(xi-end_x,2) + Math.pow(yi-end_y,2)  );
				if (dist < best_dist){
					best_dist = dist;
					pi = i;
					pj = j;
				}
			}
		}
		graph.reader_index = [pi,pj];
		mouse_move_event(event,graph);
		return;
	}
	
	if (gs.mouse_mode === 'trim'){
		//running trim
		console.log('mouse trim');
		var start_px = graph.pixels_to_units(start_x,'x');
		var start_py = graph.pixels_to_units(start_y,'y');
		var end_px = graph.pixels_to_units(end_x,'x');
		var end_py = graph.pixels_to_units(end_y,'y');
		var xlow = Math.min(start_px,end_px);
		var ylow = Math.min(start_py,end_py);
		var xhigh = Math.max(start_px,end_px);
		var yhigh = Math.max(start_py,end_py);
		var n = gs.data_transforms.length;
		gs.data_transforms[n] = "trim";
		gs.data_transforms_args[n] = [xlow,xhigh,ylow,yhigh];
		gs.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	
	if (gs.mouse_mode === 'sublin'){
		//running cut
		console.log('sublin');
		var start_px = graph.pixels_to_units(start_x,'x');
		var start_py = graph.pixels_to_units(start_y,'y');
		var end_px = graph.pixels_to_units(end_x,'x');
		var end_py = graph.pixels_to_units(end_y,'y');
		
		var grad = (end_py-start_py) /(end_px-start_px);
		var intercept = start_py-(grad*start_px);
		
		if (isFinite(grad) && isFinite(intercept)){
		
		var n = gs.data_transforms.length;
		gs.data_transforms[n] = "sublin";
		gs.data_transforms_args[n] = [grad,intercept];
		
		gs.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		}
		gs.mouse_mode = graph.pre_mouse_mode;
		return;
	}
	
	if (gs.mouse_mode === 'cut'){
		//running cut
		console.log('mouse cut');
		var start_px = graph.pixels_to_units(start_x,'x');
		var start_py = graph.pixels_to_units(start_y,'y');
		var end_px = graph.pixels_to_units(end_x,'x');
		var end_py = graph.pixels_to_units(end_y,'y');
		var xlow = Math.min(start_px,end_px);
		var ylow = Math.min(start_py,end_py);
		var xhigh = Math.max(start_px,end_px);
		var yhigh = Math.max(start_py,end_py);
		var n = gs.data_transforms.length;
		gs.data_transforms[n] = "cut";
		gs.data_transforms_args[n] = [xlow,xhigh,ylow,yhigh];
		gs.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	
	
	if (graph.graphics_style.mouse_mode === 'y-c'){
		//running cut
		console.log('y-c');
		var c = graph.pixels_to_units(end_y,'y');
		var n = gs.data_transforms.length;
		gs.data_transforms[n] = "y_c";
		gs.data_transforms_args[n] = [c];
		gs.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	if (gs.mouse_mode === 'x-c'){
		//running cut
		console.log('y-c');
		var c = graph.pixels_to_units(end_x,'x');
		var n = gs.data_transforms.length;
		gs.data_transforms[n] = "x_c";
		gs.data_transforms_args[n] = [c];
		gs.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	
	
	if (gs.mouse_mode === 'mouse'){
	
		if (graph.ui.mouse_is_dragging && graph.ui.drag_object === 'fit_text'){
			gs.fit_text_position.x = end_x/canvas.width;
			gs.fit_text_position.y = end_y/canvas.height;
		}
		if (graph.ui.mouse_is_dragging && graph.ui.drag_object === 'title_spacing'){
			gs.title_spacing = (end_y - (gs.tick_len+gs.title_font_size)*gs.scaling_factor)/gs.scaling_factor;
			
			//gs.+gs.title_font_size
		}
		if (graph.ui.mouse_is_dragging && graph.ui.drag_object === 'caption_position'){
			if (end_x > canvas.width/2){
				//on right side
				gs.caption_position.x = (canvas.width-end_x-gs.tick_len*gs.scaling_factor)*-1/gs.scaling_factor;
			} else {
				gs.caption_position.x = (end_x-gs.tick_len*gs.scaling_factor)/gs.scaling_factor;
			}
			if (end_y > canvas.height/2){
				//on bottom half
				gs.caption_position.y = (canvas.height-end_y-gs.tick_len*gs.scaling_factor)*-1/gs.scaling_factor;
			} else {
				gs.caption_position.y = (end_y-gs.tick_len*gs.scaling_factor)/gs.scaling_factor;
			}
		}
		graph.mjs_plot();
		mouse_move_event(event,graph);
		graph.ui.mouse_is_dragging = false;
		return;
	}
	// if the mouse mode is 'i' then the covering rectangle hides everything
	// clicking in this mode changes the mouse to zoom and remove the info panel.
	//this should stop users feeling stuck.
	if (gs.mouse_mode === 'i'){
		gs.mouse_mode = graph.pre_mouse_mode;
		gs.i = 0;
		//if the last mouse mode was laso 'i' then just switch to zoom. a psudo default.
		if (gs.mouse_mode === 'i'){
			gs.mouse_mode = 'zoom';
		}
	}
	
	
	
	graph.mjs_plot();
}

var touch_start_x = [];
var touch_start_y = [];
var touch_x = [];
var touch_y = [];

function touch_start_event(event,graph){
//console.log('touch start');
	event.preventDefault();
	graph.ui.is_touching = true;
	
	touch_start_x[0] =  event.targetTouches[0].clientX-rect.left;
	touch_start_y[0] =  event.targetTouches[0].clientY-rect.top;
	if (event.targetTouches.length >= 2){
		touch_start_x[1] =  event.targetTouches[1].clientX-rect.left;
		touch_start_y[1] =  event.targetTouches[1].clientY-rect.top;
	}
	
	touch_move_event(event,graph);
	
}

function touch_move_event(event,graph){
//console.log('touch move');
//document.getElementById('errors').innerHTML="touch move event";
	my_touches = event.targetTouches;
	event.preventDefault();
	graph.ui.is_touching = true;
	mouse_down = my_touches.length >=2;
	rect = graph.canvas.getBoundingClientRect();
	
	start_x =  event.targetTouches[0].clientX-rect.left;
	start_y =  event.targetTouches[0].clientY-rect.top;
	
	touch_x[0] =  event.targetTouches[0].clientX-rect.left;
	touch_y[0] =  event.targetTouches[0].clientY-rect.top;
	if (event.targetTouches.length > 1){
		touch_x[1] =  event.targetTouches[1].clientX-rect.left;
		touch_y[1] =  event.targetTouches[1].clientY-rect.top;
	}
	
	
	event.clientX =  my_touches[my_touches.length-1].clientX;//+rect.left;
	event.clientY =  my_touches[my_touches.length-1].clientY;//+rect.top;
	mouse_move_event(event,graph);
	
	}

function touch_cancel_event(event,graph){
graph.ui.is_touching = event.targetTouches.length != 0;
//document.getElementById('errors').innerHTML="touch cancle";
	event.preventDefault();
	touch_end_event(event,graph);
}
function touch_leave_event(event,graph){
//document.getElementById('errors').innerHTML="touch leave";
	touch_end_event(event,graph);
}

function touch_click_event(event,graph){
	//document.getElementById('errors').innerHTML="touch click";
	rect = graph.canvas.getBoundingClientRect();
	start_x = event.clientX - rect.left;
	start_y = event.clientY - rect.top;
	mouse_up_event(event,graph);
	
}
function touch_end_event(event,graph){
	//document.getElementById('errors').innerHTML="touchendevent";
	//console.log('touch end');
	//graph.errors.push('touch end');
	//event.preventDefault();
	graph.ui.is_touching = event.targetTouches.length != 0;
	rect = graph.canvas.getBoundingClientRect();
	//document.getElementById('errors').innerHTML="a";
	//start_x =  event.targetTouches[0].clientX-rect.left;
	//start_y =  event.targetTouches[0].clientY-rect.top;
	start_x =  my_touches[0].clientX-rect.left;;//+rect.left;
	start_y =  my_touches[0].clientY-rect.top;;//+rect.top;
	//document.getElementById('errors').innerHTML="touchendevent";
	//end_x =  event.targetTouches[my_touches.length-1].clientX-rect.left;
	//end_y =  event.targetTouches[my_touches.length-1].clientY-rect.top;

	event.clientX =  my_touches[my_touches.length-1].clientX;//+rect.left;
	event.clientY =  my_touches[my_touches.length-1].clientY;//+rect.top;
	mouse_up_event(event,graph);
}

function keep_parent_sized (e,graph){
	// Make it visually fill the positioned parent
	  graph.canvas.style.width ='100%';
	  graph.canvas.style.height='100%';
	  // ...then set the internal size to match
	  graph.canvas.width  = canvas.offsetWidth;
	  graph.canvas.height = canvas.offsetHeight;
	//graph.canvas.width = some_graph.canvas.parentNode.clientWidth;
	//graph.canvas.height = some_graph.canvas.parentNode.clientHeight;
	graph.mjs_plot();
}

function make_interactive(graph){
	if (graph.ui.touch){
		graph.canvas.addEventListener("touchstart", function(event){touch_start_event(event,graph);}, false);
		graph.canvas.addEventListener("touchend", function(event){touch_end_event(event,graph);}, false);
		graph.canvas.addEventListener("touchmove", function(event){touch_move_event(event,graph);}, false);
		graph.canvas.addEventListener("touchcancel", function(event){touch_cancel_event(event,graph);}, false);
		graph.canvas.addEventListener("touchleave", function(event){touch_leave_event(event,graph);}, false);
		graph.canvas.addEventListener("click", function(event){touch_click_event(event,graph);}, false);
	} else {
		graph.canvas.addEventListener('mousemove', function(event){mouse_move_event(event,graph);}, false);
		graph.canvas.addEventListener('mousedown', function(event){mouse_down_event(event,graph);}, false);
		graph.canvas.addEventListener('mouseup', function(event){mouse_up_event(event,graph);} , false);
		graph.canvas.addEventListener('mouseout', function(event){mouse_out_event(event,graph);} , false);
	}

	graph.canvas.oncontextmenu = function (e) {e.preventDefault();};
	// TODO get keyboard to work. z for zoom, m for measure, c for cut etc....
	//graph.canvas.addEventListener('keydown', function(event){keypress_event(event,graph);} , false);
}

function SVGContext(ctx){
	this.target = document.getElementById("_mjsplotSVG");
	this._ctx = ctx;//borrow from the 2dcanvas context
	this.x=0;
	this.y=0;
	this.strokeStyle = '#000';
	this.lineWidth = 2;
	this.lineCap;
	this.lineJoin;
	this.miterLimit=10;
	//.getLineDash()
	//.setLineDash()
	//.lineDashOffset
	this.font;
	this.textAlign = 'left';// or center or right
	this.textBaseline = 'alphabetic';//or top hanging middle ideographic bottom.
	this.direction = 'inherit';//or ltr rtl
	//.createLinearGradient()
	//.createRadialGradient()
	this._pixel_precision = 2;
	//.createPattern()
	//.shadowBlur = 0;
	//.shadowColor = ctx.shadowColor;
	//.shadowOffsetX
	//.shadowOffsetY
	
	/*.bezierCurveTo()
	.arc()
	.arcTo()
	.rect()
	.drawFocusIfNeeded()
	.scrollPathIntoView()
	.clip()
	.isPointInPath()
	.isPointInStroke()
	*/
	this._shape_type = 'path';
	this.fillStyle = '#000';
	this._path = '';
	this._isdrawn = false;
	this.clearAll = function(){
		while (this.target.lastChild) {
				this.target.removeChild(this.target.lastChild);
			}
	}
	this.arc = function(x,y,r,a1,a2,direction){
		this._shape_type = 'arc';
		this._shape = document.createElementNS(svgNS, "circle");
		this._shape.setAttributeNS(null, "stroke-width", this.lineWidth);
		this._shape.setAttributeNS(null, "stroke", this.strokeStyle);
		this._shape.setAttributeNS(null, "r", r);
		this._shape.setAttributeNS(null, "cx", x);
		this._shape.setAttributeNS(null, "cy", y);
	}
	this.moveTo = function (x,y){
		this._path+= ' M' + x.toFixed(this._pixel_precision) + ' ' + y.toFixed(this._pixel_precision);
	}
	this.lineTo = function (x,y){
		this._path += ' L' + x.toFixed(this._pixel_precision) + ' ' + y.toFixed(this._pixel_precision);
	}
	this.beginPath = function(){
		this._shape_type = 'path';
		this._shape = document.createElementNS(svgNS, "path");
		this._path = '';
		this._isdrawn = false;
	}
	this.closePath = function(){
		this._path += 'Z';
	}
	this.quadraticCurveTo = function(x1,y1,x2,y2){
		this._path += ' Q' + x1.toFixed(this._pixel_precision) +' '+ y1.toFixed(this._pixel_precision) +' '+ x2.toFixed(this._pixel_precision) +' '+ y2.toFixed(this._pixel_precision);
	}
	this.bezierCurveTo = function(x1,y1,x2,y2,x3,y3){
		console.log('bezierCurveTo is not implemented yet');
		this._path += ' Q' + (x1+x2)/02 +' '+ (y1+y2)/2 +' '+ x3.toFixed(this._pixel_precision) +' '+ y3.toFixed(this._pixel_precision);
	}
	this.stroke = function (){
		
		this._shape.setAttributeNS(null, "fill", 'none');
		this._shape.setAttributeNS(null, "stroke-width", this.lineWidth.toFixed(this._pixel_precision));
		this._shape.setAttributeNS(null, "stroke", this.strokeStyle);
		if (!this._isdrawn){
			if (this._shape_type === 'path'){	this._shape.setAttributeNS(null, "d", this._path); }
			if (this.globalAlpha <1 ){
			this._shape.setAttributeNS(null, "opacity", this.globalAlpha.toFixed(2));
			} 
			this.target.appendChild(this._shape);
			this._isdrawn = true;
		}
	}
	this.fill = function(){
		this._shape.setAttributeNS(null, "fill", this.fillStyle);
		if (!this._isdrawn){
			if (this._shape_type === 'path'){	this._shape.setAttributeNS(null, "d", this._path); }
			this.target.appendChild(this._shape);
			this._isdrawn = true;
		}
	}
	this.fillText = function (l,x,y){
		var t = document.createElementNS(svgNS, "text");
		var anchor = 'start';
		switch (this.textAlign){
		case 'left':anchor = 'start';break
		case 'right':anchor = 'end';break
		case 'center':anchor = 'middle';break
		case 'middle':anchor = 'middle';break
		}
		t.setAttributeNS(null, "text-anchor", anchor);
		t.setAttributeNS(null, "fill", this.fillStyle);
		t.setAttributeNS(null, "x", x.toFixed(this._pixel_precision));
		t.setAttributeNS(null, "x", x.toFixed(this._pixel_precision));
		t.setAttributeNS(null, "font-family", this.font_name );
		t.setAttributeNS(null, "y", y.toFixed(this._pixel_precision));
		t.setAttributeNS(null, "font-size", parseFloat(this.font.split(' ')[0].slice(0,-2)).toFixed(this._pixel_precision) );
		
		t.textContent=l;
		this.target.appendChild(t);
	}
	this.rect = function(x,y,w,h){
		this.moveTo(x,y);
		this.lineTo(x+w,y);
		this.lineTo(x+w,y+h);
		this.lineTo(x,y+h);
		this.lineTo(x,y);
	}
	this.fillRect = function(x,y,w,h){
		this.beginPath();
		this.rect(x,y,w,h);
		this.fill();
	}
	this.strokeText = function (l,x,y){	}
	
	this.getImageData = this._ctx.getImageData;
	this.measureText = function(s){return {width:this._ctx.measureText(s).width}} ;
	
}


var transforms = {
	scale_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = data[i][0][j] * args[0];
			}
		}
		graph.transform_text_x= graph.transform_text_x +'*'+mjs_precision(args[0],1);
	},
	log_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = Math.log10(data[i][0][j]);
			}
		}
		transforms.clean(data,graph);
		graph.transform_text_x= 'log('+graph.transform_text_x +')';
	},
	x_c: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = data[i][0][j]-args[0];
			}
		}
		graph.transform_text_x= graph.transform_text_x +'-'+ mjs_precision(args[0],graph.graphics_style.x_precision+1);
	},
	y_c: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = data[i][1][j]-args[0];
			}
		}
		graph.transform_text_y = graph.transform_text_y +'-'+ mjs_precision(args[0],graph.graphics_style.y_precision+1);
	},
	remove_lines: function(data,args,graph){
		for (var ii = data.length - 1; ii >= 0; ii--){
			if (args[ii]){
				data.splice(ii,1);
				graph.captions.splice(ii,1);
				graph.colors.splice(ii,1);
			}
		}
	},
	y_vs_y: function(data,args,graph){
		
		//args[0] is the series ment to be the x-axis. 
		var x_axis = args[0] % data.length; //might be bigger than the data, so roll around
		
		console.log(x_axis);
		var points = data[x_axis][0].length //Math.min(data[0][1].length,data[1][1].length);
		
		for (var i = 0;i<data.length;i++){
			var points = Math.min(data[i][0].length,data[x_axis][0].length);
				if (i!=x_axis){
					var newx = [];
					var newy = [];
					for (var j = 0;j<points;j++){
						newx[j] = data[x_axis][1][j];
						newy[j] = data[i][1][j];
					}
					data[i] = [ clone(newx),clone(newy) ];
					graph.captions[i] = graph.captions[x_axis] + ' vs ' + graph.captions[i];
				}
		}
		graph.transform_text_x= graph.captions[x_axis] + '('+graph.transform_text_y +')';
		//graph.transform_text_y= graph.captions[1] + '('+graph.transform_text_y +')';
		//data.splice(1,data.length-1);
		graph.captions.splice(x_axis,1);
		data.splice(x_axis,1);
		graph.colors.splice(x_axis,1);
	},
	sum: function(data,args,graph){
		var points = Math.min(data[0][0].length);
		var newx = [];
		var newy = [];
		for (j = 0;j<data[0][0].length;j++){
			newx[j] = data[0][0][j];
			newy[j] = 0.0;
			for (i = 0;i<data.length;i++){
				newy[j] += data[i][1][j];
			}
		}
		var t = "sum("
		for (i = 0;i<data.length;i++){
			t+= ", " + graph.captions[i];
		}
		t += ")"
		
		data[0] = [ newx,newy ];
		data.splice(1,data.length-1);
		graph.captions[0] = t ;
		graph.captions.splice(1,data.length-1);
		graph.transform_text_y = "sum(" + graph.transform_text_y +")";
		transforms.clean(data,graph);
		
	},
	ln_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = Math.log(data[i][0][j]);
			}
		}
		transforms.clean(data,graph);
		console.log(data);
		graph.transform_text_x= 'ln('+graph.transform_text_x +')';
	},
	e_to_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = Math.pow(Math.E,data[i][0][j]);
			}
		}
		graph.transform_text_x= 'e^('+graph.transform_text_x +')';
	},
	ten_to_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = Math.pow(10,data[i][0][j]);
			}
		}
		graph.transform_text_x= '10^('+graph.transform_text_x +')';
	},
	scale_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][1][j] = data[i][1][j] *  args[0];
			}
		}
		graph.transform_text_y= graph.transform_text_y +'*'+mjs_precision(args[0],1);
	},
	log_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = Math.log10(data[i][1][j]);
			}
		}
		transforms.clean(data,graph);
		graph.transform_text_y= 'log('+graph.transform_text_y +')';
	},
	ln_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = Math.log(data[i][1][j]);
			}
		}
		transforms.clean(data,graph);
		
		graph.transform_text_y= 'ln('+graph.transform_text_y +')';
	},
	e_to_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = Math.pow(Math.E,data[i][1][j]);
			}
		}
		graph.transform_text_y= 'e^('+graph.transform_text_y +')';
	},
	ten_to_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = Math.pow(10,data[i][1][j]);
			}
		}
		graph.transform_text_y= '10^('+graph.transform_text_y +')';
	},
	one_over_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][1][j] = 1.0 / data[i][1][j];
			}
		}
		transforms.clean(data,graph);
		graph.transform_text_y= '1/('+graph.transform_text_y +')';
	},
	custom_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			data[i][1] = parseExpression(args[0],data[i][0],data[i][1])
		}
		transforms.clean(data,graph);
		graph.transform_text_y= 'f('+graph.transform_text_y +')';
	},
	one_over_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = 1.0 / data[i][0][j];
			}
		}
		transforms.clean(data,graph);
		graph.transform_text_x= '1/('+graph.transform_text_x +')';
	},
	x_pow_n: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = Math.pow(data[i][0][j],args[0]);
			}
		}
		graph.transform_text_x= '('+graph.transform_text_x +')^'+args[0];
	},
	y_pow_n: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = Math.pow(data[i][1][j],args[0]);
			}
		}
		graph.transform_text_y= '('+graph.transform_text_y +')^'+args[0];
	},
	add_me: function(data,args,graph){
		graph.data = [[[2,2,3,4,4],[2,5,4,5,2]],[[5,7,6,6,5],[5,5,5,2,2]],[[8,10,10,8,8,10],[2,2,4,4,5,5]],[[1,1,11,11,1],[1,6,6,1,1]]];
		graph.captions = ['m','j','s',' '];
	},
	y_nth_root: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = Math.pow(Math.abs(data[i][1][j]),1/args[0]);
			}
		}
		graph.transform_text_y= '('+graph.transform_text_y +')^1/'+args[0];
	},
	x_nth_root: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = Math.pow(Math.abs(data[i][0][j]),1/args[0]);
			}
		}
		graph.transform_text_x= '('+graph.transform_text_x +')^1/'+args[0];
	},
	trim:function(data,args,graph){
		//removes any data outside of the box
		var xlow = args[0];
		var xhigh = args[1];
		var ylow = args[2];
		var yhigh = args[3];
		for (i = 0;i<data.length;i++){
			for(var ii = data[i][0].length - 1; ii >= 0; ii--) {
				if(  data[i][0][ii] < xlow ||
					 data[i][0][ii] > xhigh ||
					 data[i][1][ii] < ylow ||
					 data[i][1][ii] > yhigh ) {
					data[i][0][ii] = NaN;
				}
			}
		}
		transforms.clean(data,graph);
		graph.transform_text_x= 'trim('+graph.transform_text_x +')';
		graph.transform_text_y= 'trim('+graph.transform_text_y +')';
	},
	cut:function(data,args,graph){
		//like trim, but removes any data in the box
		var xlow = args[0];
		var xhigh = args[1];
		var ylow = args[2];
		var yhigh = args[3];
		for (i = 0;i<data.length;i++){
			for(var ii = data[i][0].length - 1; ii >= 0; ii--) {
				if(  !(data[i][0][ii] < xlow ||
					 data[i][0][ii] > xhigh ||
					 data[i][1][ii] < ylow ||
					 data[i][1][ii] > yhigh)) {
					data[i][0][ii] = NaN;
				} 
			}
		}
		transforms.clean(data,graph);
		graph.transform_text_x= 'cut('+graph.transform_text_x +')';
		graph.transform_text_y= 'cut('+graph.transform_text_y +')';
	},
	remove_linear: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			slope = linear_regression(data[i][0],data[i][1]);
			for (j = 0;j<data[i][0].length;j++){
				data[i][1][j] = data[i][1][j] - slope.a - slope.b*data[i][0][j];
			}
		}
		
		graph.transform_text_y= 'sub_linear('+graph.transform_text_y +')';
	},
	sublin : function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][1][j] = data[i][1][j] - args[1] - args[0]*data[i][0][j];
			}
		}
		var p = Math.max(graph.graphics_style.x_precision,graph.graphics_style.y_precision)+1;
		graph.transform_text_y= graph.transform_text_y +'-'+mjs_precision(args[1],p) +'-'+ mjs_precision(args[0],p)+'x';
	},
	swap_x_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			temp = data[i][0];
			data[i][0] = data[i][1];
			data[i][1] = temp;
		}
		var temp = graph.transform_text_x;
		graph.transform_text_x= graph.transform_text_y;
		graph.transform_text_y= temp;
	},
	normalise: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			ymin = Math.min.apply(null, data[i][1] );
			ymax = Math.max.apply(null, data[i][1] );
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] =  (data[i][1][j] - ymin)/(ymax-ymin);
			}
		}
		graph.transform_text_y= 'norm('+graph.transform_text_y +')';
	},
	mean_normalise: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			var s = series_stats(data[i][0],data[i][1]);
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] =  (data[i][1][j] - s.y_mean)/(s.sigma_y);
			}
		}
		graph.transform_text_y= 'norm('+graph.transform_text_y +')';
	},
	clean: function(data,graph){
		//cut off any infinites NaNs
		for (i = 0;i<data.length;i++){
			
			if (data[i].length == 2){
				for(var ii = data[i][0].length - 1; ii >= 0; ii--) {
					if(  ! ( isFinite(data[i][1][ii]) && isFinite(data[i][0][ii])  ) ) {
						data[i][0].splice(ii,1);
						data[i][1].splice(ii,1);
					}
				}
			}
			if (data[i].length == 3){
				for(var ii = data[i][0].length - 1; ii >= 0; ii--) {
					if(  ! ( isFinite(data[i][1][ii]) && isFinite(data[i][0][ii])  ) ) {
						data[i][0].splice(ii,1);
						data[i][1].splice(ii,1);
						//the errors
						data[i][2].splice(ii,1);
					}
				}
			}
			if (data[i].length == 4){
				for(var ii = data[i][0].length - 1; ii >= 0; ii--) {
					if(  ! ( isFinite(data[i][1][ii]) && isFinite(data[i][0][ii])  ) ) {
						data[i][0].splice(ii,1);
						data[i][1].splice(ii,1);
						//the errors
						data[i][2].splice(ii,1);
						data[i][3].splice(ii,1);
					}
				}
			}
			
		}
		//remove any empty series.
		for (var ii = data.length - 1; ii >= 0; ii--){
			if (data[ii][0].length == 0){
				data.splice(ii,1);
				graph.captions.splice(ii,1);
				graph.colors.splice(ii,1);
			}
		}
	},
	intergrate: function(data,args,graph){
		var tally = 0;
		for (i = 0;i<data.length;i++){
			tally = 0;
			tallys = [];
			tallys[0] = 0.0;
			for (j = 0;j<data[i][0].length-1;j++){
				tally += (data[i][0][j+1] - data[i][0][j]) * (data[i][1][j+1] + data[i][1][j])/2;
				console.log(tally);
				tallys[j+1] = tally;
			}
			for (j = 0;j<data[i][0].length;j++){
				data[i][1][j] = tallys[j];
			}
		}
		graph.transform_text_y= 'int('+graph.transform_text_y +')';
	},
	smooth: function(data,args,graph){
		//simple linear smooth for now...
		var l = 0;
		var h = 0;
		var sumy= 0;
		var sumx = 0
		for (i = 0;i<data.length;i++){
			var width = Math.round(Math.min(data[i][0].length/3,args[0]/2)); //is half the apiture size
			var newx = [];
			var newy = [];
			var weights =[];
			//find weights
			var len = data[i][0].length;
			weights[0] = Math.sqrt(Math.pow(2*(data[i][0][1]-data[i][0][0]),2)+Math.pow(2*(data[i][1][1]-data[i][1][0]),2));
			weights[len-1] = Math.sqrt(Math.pow(2*(data[i][0][len-1]-data[i][0][len-2]),2)+Math.pow(2*(data[i][0][len-1]-data[i][1][len-2]),2));
			for (j = 1;j<data[i][0].length-1;j++){
				weights[j] = Math.sqrt(Math.pow(data[i][0][j+1]-data[i][0][j-1],2)+Math.pow(data[i][1][j+1]-data[i][1][j-1],2));
			}
			//weights[0] = weights[1];
			//weights[len-1] = weights[len-2];
			for (j = 0;j<data[i][0].length;j++){
				l = Math.max(j-width,0);
				h = Math.min(j+width,data[i][0].length-1);
				d = h-l;
				sumy = 0;
				sumx = 0;
				sumw = 0;
				for (var k = l;k<h;k++){
					sumx += data[i][0][k]*weights[k];
					sumy += data[i][1][k]*weights[k];
					sumw += weights[k];
				}
				newy[j] = sumy  / sumw;
				newx[j] = sumx  / sumw;
			}
			data[i] = [newx,newy];
		}
		graph.transform_text_y= 'smooth('+graph.transform_text_y +',' + Math.round(args[0]) + ')';
	},
	hist: function(data,args,graph){
		//make awesome histogram
		for (i = 0;i<data.length;i++){
			var ymin = Math.min.apply(null, data[i][1] );
			var ymax = Math.max.apply(null, data[i][1] );
			var val_i = 0;
			var power = -13 ;
			var notgood = 1;
			var scale = 0;
			var extra_sections = 2;
			var best_sections = Math.floor(Math.pow(data[i][1].length,0.5))*2;
			var scale = vals[val_i]* Math.pow(10,power);
			var sections = Math.ceil(ymax/scale)-Math.floor(ymin/scale)+extra_sections;
			
			while (sections > best_sections ){
				val_i+=1;	
				if (val_i == 3){
					val_i = 0;
					power +=1;
				}
				scale = vals[val_i]* Math.pow(10,power);
				sections = Math.ceil(ymax/scale)-Math.floor(ymin/scale)+extra_sections;
				
			}
			var lowpoint = Math.floor(ymin/scale-1)*scale; // bring low one section lower.
			var highpoint = Math.ceil(ymax/scale+1)*scale; //one section higher
			//starting from lowpoint to highpoint with bin widths of scale
			var bin_centers = [];
			var bin_counts = [];
			var bin_i = 0;
			for (bin_start = lowpoint;bin_start<highpoint;bin_start+=scale){
				var bin_end = bin_start+scale;
				bin_counts[bin_i] = 0;
				for (j = 0;j<data[i][1].length-1;j++){
					if (bin_start < data[i][1][j] && data[i][1][j] < bin_end){
						bin_counts[bin_i] +=1;
					}
				}
				bin_centers[bin_i] = (bin_start+bin_end)/2;
				bin_i++;
			}
			data[i][0] = bin_centers;
			data[i][1] = bin_counts;
			
		}
		graph.transform_text_y= 'hist('+graph.transform_text_y +')';
		graph.transform_text_x= 'bin_centers('+graph.transform_text_x +')';
	},
	interpolate: function(data,args,graph){
		var xmin = Math.min.apply(null, data[0][0] );
		var xmax = Math.max.apply(null, data[0][0] );;
		
		for (i = 0;i<data.length;i++){
			var xmini = Math.min.apply(null, data[i][0] );
			var xmaxi = Math.max.apply(null, data[i][0] );
			xmin = Math.min(xmin,xmini);
			xmax = Math.max(xmax,xmaxi);
		}
		
		var stepsize = (xmax-xmin)/args[0];
		for (i = 0;i<data.length;i++){
			
			//args[0] is the number of steps
			var newxs = [];
			var newys = [];
			for (j = 0;j<args[0];j++){
				newxs[j] = xmin+j*stepsize;
				
				//find closesest points on x below and above
				var closest_left = 1e200;
				var cli = 1;
				var closest_right = 1e200;
				var cri = data[i][0].length-2;
				
				for (k = 0;k<data[i][0].length;k++){
					var diff = newxs[j]-data[i][0][k];
					if (diff >= 0 && diff < closest_left){
						closest_left = diff;
						cli = k;
					}
					if (diff < 0 && -1*diff < closest_right){
						closest_right = -1*diff;
						cri =k;
					}
				}
				
				newys[j] = data[i][1][cli] + (data[i][1][cri]-data[i][1][cli])/(data[i][0][cri]-data[i][0][cli])*(newxs[j]-data[i][0][cli]);
			}
			data[i][0] = newxs;
			data[i][1]= newys;
			
		}
		transforms.clean(data,graph);
		
		graph.transform_text_y= 'interpolate('+graph.transform_text_y +','+args[0]+')';
		graph.transform_text_x= 'interpolate('+graph.transform_text_x +','+args[0]+')';
	},
	differentiate: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length-1;j++){
				data[i][1][j] = (data[i][1][j+1]-data[i][1][j])/(data[i][0][j+1]-data[i][0][j]);
				data[i][0][j] = (data[i][0][j] + data[i][0][j+1])/2;
			}
			data[i][1].pop();
			data[i][0].pop();
		}
		transforms.clean(data,graph);
		graph.transform_text_y= 'd/dx('+graph.transform_text_y +')';
	},
	subtract_fit: function(data,args,graph){
		var fit_method = args[0];
		for (i = 0;i<data.length;i++){
			var fit = fits.fit_funs[fits.fit_strings.indexOf(fit_method)](data[i][0],data[i][1]);
			var fit_points = fit.fun(data[i][0],fit.parameters);
			for (j = 0;j<data[i][0].length;j++){
				data[i][1][j] -= fit_points[j];
			}
		}
		transforms.clean(data,graph);
		graph.transform_text_y= graph.transform_text_y +'-'+fit.strings[0];
	},
	keep_outliers: function(data,args,graph){
		transforms.outliers_generic(data,args,graph,false);
	},
	remove_outliers: function(data,args,graph){
		transforms.outliers_generic(data,args,graph,true);
	},
	outliers_generic: function(data,args,graph,remove){
		//remove true = remove the outliers
		//remove false = remove the trend (keep outliers)
		var fit_method = args[0];
		var levels = [0.5,1,1.5,2,2.5,3];
		var i = args[1]%(levels.length)
		if (i<0){
			i += levels.length;
		}
		var threshold = levels[i]; //the number of sigma that is threshold
		for (i = 0;i<data.length;i++){
			var fit = fits.fit_funs[fits.fit_strings.indexOf(fit_method)](data[i][0],data[i][1]);
			var fit_points = fit.fun(data[i][0],fit.parameters);
			var r = [];
			var ri = 0;
			for (j = 0;j<data[i][0].length;j++){
				ri = data[i][1][j] - fit_points[j];
				if (isFinite(ri)){
					r.push( ri );
				}
			}
			//find sigma of r
			var sum_r = 0;
			var sum_rr = 0;
			for (var j = 0;j<r.length;j++){
				sum_r += r[j];
				sum_rr +=r[j]*r[j];
			}
			var n = r.length;
			sum_rr -= sum_r*sum_r/n;
			var sigma_r = Math.sqrt(sum_rr / n);
			//loop data again to find points further away than threshold
			if (remove){
				for (j = 0;j<data[i][0].length;j++){
					if ((data[i][1][j] - fit_points[j]) > threshold * sigma_r){
						data[i][1][j] = NaN;
					}
				}
			} else {
				for (j = 0;j<data[i][0].length;j++){
					if ((data[i][1][j] - fit_points[j]) < threshold * sigma_r){
						data[i][1][j] = NaN;
					}
				}
			}
			
		}
		transforms.clean(data,graph);
		if (remove){
			graph.transform_text_y= 'remove_outliers('+graph.transform_text_y+','+fit_method+','+threshold+')';
		} else {
			graph.transform_text_y= 'keep_outliers('+graph.transform_text_y+','+fit_method+','+threshold+')';
		}
	},
	jitter: function(data,args,graph){
		//jitter(y)
		var amount = args[0]; // a percentage. 
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] =  data[i][1][j] + (Math.random()*2-1)*amount*data[i][1][j]/100;
			}
		}
		graph.transform_text_y= 'jitter('+graph.transform_text_y +','+amount+'%)';
	},
	spacing: function(data,args,graph){
		//the spacing between ajecent x points. 1/spacing is the dencity. 
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length-1;j++){
				data[i][1][j] =  data[i][0][j+1] - data[i][0][j];
			}
			for (j = 0;j<data[i][1].length-1;j++){
				data[i][0][j] =  (data[i][0][j+1] + data[i][0][j])/2;
			}
			data[i][0][j] = 1/0;
		}
		transforms.clean(data,graph);
		graph.transform_text_y= 'spacing('+graph.transform_text_y +')';
		
	},
	time_to_num: function(data,args,graph){
		//convert a time to a number
		var axis = args[2];
		var reference = args[0];
		var time_axis = axis === 'x' ? 0 : 1;
		var other_axis = axis === 'x' ? 1 : 0;
		
		
		var units = [ 24*60*60*1000,60*60*1000,60*1000,1000 ];
		var unit = units[args[1]];
		//find reference number
		var offset = 0;
		if (reference ==0){
			offset = args[3];
		}
		if (reference ==1){
			var now = new Date();
			offset = now.getTime();
		}
		if (reference ==2){
			//from start
			var amin  = 1e+307; 
			var low = 1e+307; //very high. easy to shrink
			for (i = 0;i<data.length;i++){
				var amin = Math.min.apply(null, data[i][time_axis] );
				low = Math.min(amin,low);
			}
			offset = low;
		}
		if (reference ==3){
			//from end
			var ahigh  = 1e-307; 
			var high = 1e-307; //very high. easy to shrink
			for (i = 0;i<data.length;i++){
				var ahigh = Math.max.apply(null, data[i][time_axis] );
				high = Math.max(ahigh,high);
			}
			offset = high;
		}
		console.log(offset);
		console.log(unit);
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][time_axis][j] = (data[i][time_axis][j] - offset)/unit;
			}
		}
		transforms.clean(data,graph);
	}
}

mjs_plot = {

new_graph : function (graphname,canvasname){
	var canvas = document.getElementById(canvasname);
	"use strict";
	var gs = load_gs(graphname);
	if (gs.v === MJS_PLOT_VERSION){
		console.log('version is same');
	} else {
		gs  = mjs_plot.get_graph_style();
		console.log('version changed, get new style');
	}
	var graph = {
	graphics_style : gs,
	default_graphics_style : mjs_plot.get_graph_style(),
	graph_name : graphname,
	canvas_name : canvasname,
	drawfxmenu : false,
	drawlinemenu : false,
	drawmodemenu:false,
	drawfitsmenu : false,
	drawtimemenu : false,
	drawgraphmenu : false,
	drawcaptionmenu:false,
	timemenuoptions : [0,0], //which button is selected, [top row,bottom row] left to right.
	plot_failed : false,
	transparent : false,
	needs_drag_image : true,
	points_drawn : 0,
	orignal_canvas_width : 600,
	orignal_canvas_height : 400,
	isFullscreen : false,
	isSVG : false, // when using the SVG render is set to true.
	svg : '',
	errors : [],
	data : [],
	data_backup : [],
	colors : [],
	colors_backup : [],
	captions_backup : [],
	captions : [],
	onPlotFunctions :[],//each function in here is called after a plot
	fit_data : [], //save the fit data
	reader_index:[0,0],//the i,j indices in the data of the picked reader point. 
	transform_index : -1,
	transform_text_x : 'x',
	ui : {size:20,touch:is_touch_device(),mouse_is_dragging:false, is_touching : false,draw_time :1e200,copy_time:1e200,ticking:false,latestEvent:false }, //contains ui infomation.
	transform_text_y : 'y',
	drawing_methods : {
		draw_y_errors : function(graph,ctx,series,start,end,dot_size){
			ctx.beginPath();
			dot_size /=2;
			graph.points_drawn+=end-start;
			ctx.beginPath();
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				top_ei = graph.units_to_pixels(graph.data[series][1][j]+graph.data[series][2][j],'y');
				bot_ei = graph.units_to_pixels(graph.data[series][1][j]-graph.data[series][2][j],'y');
				ctx.moveTo(xi,bot_ei);
				ctx.lineTo(xi,top_ei);
				ctx.moveTo(xi-dot_size,bot_ei);
				ctx.lineTo(xi+dot_size,bot_ei);
				ctx.moveTo(xi-dot_size,top_ei);
				ctx.lineTo(xi+dot_size,top_ei);
			}
			ctx.stroke();
		},
		draw_x_errors : function(graph,ctx,series,start,end,dot_size){
			ctx.beginPath();
			dot_size /=2;
			graph.points_drawn+=end-start;
			ctx.beginPath();
			for (j =start;j<end;j++){
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				right_ei = graph.units_to_pixels(graph.data[series][0][j]+graph.data[series][3][j],'x');
				left_ei = graph.units_to_pixels(graph.data[series][0][j]-graph.data[series][3][j],'x');
				ctx.moveTo(right_ei,yi);
				ctx.lineTo(left_ei,yi);
				ctx.moveTo(right_ei,yi+dot_size);
				ctx.lineTo(right_ei,yi-dot_size);
				ctx.moveTo(left_ei,yi+dot_size);
				ctx.lineTo(left_ei,yi-dot_size);
			}
			ctx.stroke();
		},
		draw_line : function(graph,ctx,series,start,end){
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			ctx.beginPath();
			ctx.moveTo(xi,yi);
			graph.points_drawn+=end-start;
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.lineTo(xi,yi);
				old_xi3 = xi;
				old_yi3 = yi;
			}
			ctx.stroke();
		},
		draw_dot : function(graph,ctx,series,start,end,dot_size){
			ctx.beginPath();
			graph.points_drawn+=end-start;
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.fillRect(xi-dot_size/2,yi-dot_size/2,dot_size,dot_size);
			}
		},
		draw_cdot : function(graph,ctx,series,start,end,dot_size){
			dot_size/=2;
			graph.points_drawn+=end-start;
			for (j =start;j<end;j++){
				ctx.beginPath();
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.arc(xi, yi, dot_size, 0 ,Math.PI*2, true);
				ctx.fill();
			}
		},
		draw_circ : function(graph,ctx,series,start,end,circle_size){
		circle_size/=2;
			ctx.beginPath();
			graph.points_drawn+=end-start;
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.beginPath();
				ctx.arc(xi, yi, circle_size, 0 ,Math.PI*2, true);
				ctx.stroke();
			}
		},
		draw_cross : function(graph,ctx,series,start,end,dot_size){
			dot_size/=2;
			ctx.beginPath();
			graph.points_drawn+=end-start;
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.moveTo(xi,yi-dot_size);
				ctx.lineTo(xi,yi+dot_size);
				ctx.moveTo(xi-dot_size,yi);
				ctx.lineTo(xi+dot_size,yi);
			}
			ctx.stroke();
		},
		draw_x : function(graph,ctx,series,start,end,dot_size){
			dot_size/=2;
			ctx.beginPath();
			graph.points_drawn+=end-start;
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.moveTo(xi-dot_size,yi-dot_size);
				ctx.lineTo(xi+dot_size,yi+dot_size);
				ctx.moveTo(xi-dot_size,yi+dot_size);
				ctx.lineTo(xi+dot_size,yi-dot_size);
			}
			ctx.stroke();
		},
		draw_box : function(graph,ctx,series,start,end,circle_size){
			ctx.beginPath();
			graph.points_drawn+=end-start;
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.beginPath();
				ctx.rect(xi-circle_size/2,yi-circle_size/2,circle_size,circle_size);
				ctx.stroke();
			}
		},
		draw_zig : function(graph,ctx,series,start,end){
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			old_xi3 = xi;
			old_yi3 = yi;
			graph.points_drawn+=end-start;
			ctx.beginPath();
			ctx.moveTo(xi,yi);
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.lineTo(old_xi3,yi);
				ctx.lineTo(xi,yi);
				old_xi3 = xi;
				old_yi3 = yi;
			}
			ctx.stroke();
		},
		draw_zag : function(graph,ctx,series,start,end){
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			old_xi3 = xi;
			old_yi3 = yi;
			graph.points_drawn+=end-start;
			ctx.beginPath();
			ctx.moveTo(xi,yi);
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.lineTo(xi,old_yi3);
				ctx.lineTo(xi,yi);
				old_xi3 = xi;
				old_yi3 = yi;
			}
			ctx.stroke();
		},
		draw_mid : function(graph,ctx,series,start,end){
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			var old_xi2 = xi;
			var old_yi2 = yi;
			var old_xi3 = xi;
			var old_yi3 = yi;
			graph.points_drawn+=end-start;
			ctx.beginPath();
			ctx.moveTo(xi,yi);
			for (j =start;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.lineTo((old_xi3+xi)/2,old_yi3);
				ctx.lineTo((old_xi3+xi)/2,yi);
				old_xi2 = old_xi3;
				old_yi2 = old_yi3;
				old_xi3 = xi;
				old_yi3 = yi;
			}
			xi = graph.units_to_pixels(graph.data[series][0][end-1],'x');
			yi = graph.units_to_pixels(graph.data[series][1][end-1],'y');
			ctx.lineTo(xi,yi);
			ctx.stroke();
		},
		draw_hist : function(graph,ctx,series,start,end){
			var hist_zero = Math.min(graph.units_to_pixels(0,'y'),canvas.height);
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			var old_xi2 = xi;
			var old_yi2 = yi;
			var old_xi3 = xi;
			var old_yi3 = yi;
			graph.points_drawn+=end-start;
			xi = graph.units_to_pixels(graph.data[series][0][start+1],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start+1],'y');
			ctx.beginPath();
			ctx.moveTo(old_xi3-(xi-old_xi3)/2,hist_zero);
			ctx.lineTo(old_xi3-(xi-old_xi3)/2,old_yi3);
			ctx.lineTo((xi+old_xi3)/2,old_yi3);
			for (j =start+1;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.lineTo((old_xi3+old_xi2)/2,old_yi3);
				ctx.lineTo((old_xi3+xi)/2,old_yi3);
				ctx.lineTo((old_xi3+xi)/2,hist_zero);
				old_xi2 = old_xi3;
				old_yi2 = old_yi3;
				old_xi3 = xi;
				old_yi3 = yi;
			}
			xi = graph.units_to_pixels(graph.data[series][0][end-1],'x');
			yi = graph.units_to_pixels(graph.data[series][1][end-1],'y');
			ctx.moveTo((old_xi2+xi)/2,hist_zero);
			ctx.lineTo((old_xi2+xi)/2,yi);
			ctx.lineTo(xi+(xi-old_xi2)/2,yi);
			ctx.lineTo(xi+(xi-old_xi2)/2,hist_zero);
			ctx.stroke();
		},
		draw_approx : function(graph,ctx,series,start,end){
			graph.points_drawn+=end-start;
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			old_xi1 = xi;
			old_yi1 = yi;
			old_xi2 = xi;
			old_yi2 = yi;
			old_xi3 = xi;
			old_yi3 = yi;
			ctx.beginPath();
			ctx.moveTo(old_xi1,old_yi1);
			ctx.lineTo((old_xi1+xi)/2,(old_yi1+yi)/2);
			for (j =start+1;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				ctx.quadraticCurveTo(old_xi3,old_yi3,(old_xi3+xi)/2,(old_yi3+yi)/2);
				old_xi1 = old_xi2;
				old_yi1 = old_yi2;
				old_xi2 = old_xi3;
				old_yi2 = old_yi3;
				old_xi3 = xi;
				old_yi3 = yi;
			}
			xi = graph.units_to_pixels(graph.data[series][0][end-1],'x');
			yi = graph.units_to_pixels(graph.data[series][1][end-1],'y');
			ctx.lineTo(xi,yi);
			ctx.stroke();
		},
		draw_interp : function(graph,ctx,series,start,end){
			if (end - start < 3){
				this.draw_line(graph,ctx,series,start,end)
			}
			graph.points_drawn+=end-start;
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			old_xi1 = xi;
			old_yi1 = yi;
			old_xi2 = xi;
			old_yi2 = yi;
			old_xi3 = graph.units_to_pixels(graph.data[series][0][start+1],'x');
			old_yi3 = graph.units_to_pixels(graph.data[series][1][start+1],'y');
			xi = graph.units_to_pixels(graph.data[series][0][start+2],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start+2],'y');
			ctx.beginPath();
			var smoothing = 5;
			ctx.moveTo(old_xi1,old_yi1);
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi1,
						(old_yi3-old_yi1)/smoothing+old_yi1,
						old_xi3-(xi-old_xi1)/smoothing,
						old_yi3-(yi-old_yi1)/smoothing,
						old_xi3,
						old_yi3
						);
			ctx.moveTo(old_xi2,old_yi2);
			for (j =start+2;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi2,
						(old_yi3-old_yi1)/smoothing+old_yi2,
						old_xi3-(xi-old_xi2)/smoothing,
						old_yi3-(yi-old_yi2)/smoothing,
						old_xi3,
						old_yi3
						);
				old_xi1 = old_xi2;
				old_yi1 = old_yi2;
				old_xi2 = old_xi3;
				old_yi2 = old_yi3;
				old_xi3 = xi;
				old_yi3 = yi;
			}
			xi = graph.units_to_pixels(graph.data[series][0][end-1],'x');
			yi = graph.units_to_pixels(graph.data[series][1][end-1],'y');
			//ctx.moveTo(old_xi3,old_yi3);
			ctx.bezierCurveTo((xi-old_xi1)/smoothing+old_xi2,
						(yi-old_yi1)/smoothing+old_yi2,
						xi-(xi-old_xi2)/smoothing,
						yi-(yi-old_yi2)/smoothing,
						xi,
						yi
						);
			ctx.stroke();
		},
		draw_scribble : function(graph,ctx,series,start,end){
			if (end - start < 3){
				this.draw_line(graph,ctx,series,start,end)
			}
			graph.points_drawn+=end-start;
			xi = graph.units_to_pixels(graph.data[series][0][start],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start],'y');
			old_xi1 = xi;
			old_yi1 = yi;
			old_xi2 = xi;
			old_yi2 = yi;
			old_xi3 = graph.units_to_pixels(graph.data[series][0][start+1],'x');
			old_yi3 = graph.units_to_pixels(graph.data[series][1][start+1],'y');
			xi = graph.units_to_pixels(graph.data[series][0][start+2],'x');
			yi = graph.units_to_pixels(graph.data[series][1][start+2],'y');
			ctx.beginPath();
			var smoothing = .2;
			ctx.moveTo(old_xi1,old_yi1);
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi1,
						(old_yi3-old_yi1)/smoothing+old_yi1,
						old_xi3-(xi-old_xi1)/smoothing,
						old_yi3-(yi-old_yi1)/smoothing,
						old_xi3,
						old_yi3
						);
			ctx.moveTo(old_xi2,old_yi2);
			for (j =start+2;j<end;j++){
				xi = graph.units_to_pixels(graph.data[series][0][j],'x');
				yi = graph.units_to_pixels(graph.data[series][1][j],'y');
				
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi2,
						(old_yi3-old_yi1)/smoothing+old_yi2,
						old_xi3-(xi-old_xi2)/smoothing,
						old_yi3-(yi-old_yi2)/smoothing,
						old_xi3,
						old_yi3
						);
				old_xi1 = old_xi2;
				old_yi1 = old_yi2;
				old_xi2 = old_xi3;
				old_yi2 = old_yi3;
				old_xi3 = xi;
				old_yi3 = yi;
			}
			xi = graph.units_to_pixels(graph.data[series][0][end-1],'x');
			yi = graph.units_to_pixels(graph.data[series][1][end-1],'y');
			//ctx.moveTo(old_xi3,old_yi3);
			ctx.bezierCurveTo((xi-old_xi1)/smoothing+old_xi2,
						(yi-old_yi1)/smoothing+old_yi2,
						xi-(xi-old_xi2)/smoothing,
						yi-(yi-old_yi2)/smoothing,
						xi,
						yi
						);
			ctx.stroke();
		},
	},
	set_data : function (data){
	"use strict";
		this.transform_index = -1;
		for (var i = 0;i<data.length;i++){
				if (data[i][0].length != data[i][1].length){
					this.errors.push("series " + i + "had different legnth x and y arrays");
				}
		}
		
		this.data_backup = clone(data);
		transforms.clean(this.data_backup,this);
		this.data = clone(this.data_backup);
		
		//check if things are the same lengths and provide errors
		if (this.data.length != data.length){
			this.errors.push("A series was cleaned away in set_data");
		} else {
			for (var i = 0;i<data.length;i++){
				//data might be longer than this.data if series were cut out.
				if (this.data[i][0].length != data[i][0].length){
					this.errors.push("series " + i + " had non finite values");
				}
			}
		}
		
		for (var i = 0;i<this.data.length;i++){
			this.graphics_style.hidden_lines[i] = this.graphics_style.hidden_lines[i] || false;
		}
		
		this.colors = [];
		for (var i=0;i<this.data.length;i++){
			if (this.graphics_style.caption_colors){
				try {
					this.colors[i] = color_from_string( this.captions[i] ||  'label'  );
				} catch(e) {
					this.colors[i] = color_from_string( 'label' );
				}
			} else {
				this.colors[i] = get_color(i,this.data.length-1);
			}
		}
		this.colors_backup = clone(this.colors);
		
	},
	set_captions : function (captions){
	"use strict";
		this.captions_backup = clone(captions);
		this.captions = clone(captions);
		if (this.captions.length != this.data_backup.length){
			this.errors.push("number of captions and number of series don't match");
		}
		this.colors = [];
		for (var i=0;i<this.data.length;i++){
			if (this.graphics_style.caption_colors){
				this.colors[i] = color_from_string( this.captions[i] ||  'label'  );
				console.log('using cap colours');
			} else {
				this.colors[i] = get_color(i,this.data.length-1);
			}
		}
		this.colors_backup = clone(this.colors);
	},
	find_scale : function (min_point,max_point,size,guide_width,scalemode,tight){
	"use strict";
		if (scalemode === 'lin'){
			//linear scale
			var val_i = 0;
			
			if (Math.abs(min_point) > 1e-250){
			var power = Math.floor(Math.log10(Math.abs(min_point)))-10 ;
			} else {
			power = -250;
			} 
			
			
			var notgood = 1;
			var scale = 0;
			var width;
			var extra_sections = 0;
			if (tight){
			extra_sections = 0;
			} else {
			extra_sections = 2;
			}
			var best_sections = Math.floor( size / guide_width  ) +extra_sections;
		
			
			
			
			var scale = vals[val_i]* Math.pow(10,power);
			
		
			
			var sections = Math.ceil(max_point/scale)-Math.floor(min_point/scale)+extra_sections;
			
			while (sections > best_sections ){
				val_i+=1;	
				if (val_i == 3){
					val_i = 0;
					power +=1;
				}
				scale = vals[val_i]* Math.pow(10,power);
				sections = Math.ceil(max_point/scale)-Math.floor(min_point/scale)+extra_sections;
				
				
			}
			
			if (sections == 0){	width = size;}
			else{width = size/sections;	}
			
			if (tight){
				var lowpoint = Math.floor(min_point/scale)*scale;
				var highpoint = Math.ceil(max_point/scale)*scale; 
			} else {
				var lowpoint = Math.floor(min_point/scale-1)*scale; // bring low one section lower.
				var highpoint = Math.ceil(max_point/scale+1)*scale; //one section higher
			}
			return the_scale = {
				lowpoint : lowpoint,
				highpoint : highpoint,
				scale : scale,
				width : width,
				val_i : val_i,
				val_i_low : 1, //not used
				power_low : 1, //not used
				val_i_high : 1, //not used
				power_high : 1, //not used
				scalemode : scalemode
			}
		}
		
		if (scalemode === 'log'){
		//log scale
		var val_i = 0;
		var power = 100;
		var log_vals_i = -1;
		var do_not_use_linear = false;
		var required_secions = Math.floor( size / guide_width/2  );
		sections = 0;
		while (sections < required_secions){
			log_vals_i +=1;
			power = Math.ceil(Math.log10(min_point))+1;
			val_i = 0;
			while (log_vals[log_vals_i][val_i] * Math.pow(10,power) >= min_point){
				//roll down to find the low
				val_i -=1;
				if (val_i < 0){
					power -= 1;
					val_i = log_vals[log_vals_i].length-1;
				}
			}
			//roll down one more, this marks the low point
			if (tight === false){
				val_i -=1;
				if (val_i < 0){
					power -= 1;
					val_i = log_vals[log_vals_i].length-1;
				}
			}
			var val_i_low = val_i;
			var power_low = power;
			//roll up to find the high point and index keeping track on the number of sections
			sections = 0;
			while (log_vals[log_vals_i][val_i] * Math.pow(10,power) <= max_point){
				
				val_i +=1;
				sections +=1;
				if (val_i >= log_vals[log_vals_i].length){
					power += 1;
					val_i = 0;
				}
			}
			if (tight === false){
				//roll up one more
				val_i +=1;
				sections +=1;
				if (val_i >= log_vals[log_vals_i].length){
					power += 1;
					val_i = 0;
				}
			}
			var val_i_high = val_i;
			var power_high = power;
			
			if ( (log_vals_i >= log_vals.length || Math.log10(max_point)-Math.log10(min_point) < 0.6) && do_not_use_linear == false ){
				sections = required_secions;
				
				the_scale = this.find_scale(min_point,max_point,size,guide_width,'lin',tight);
				if (the_scale.lowpoint <= 0){do_not_use_linear = true; sections = 0;}
				//the lowpoint from the linear scale can be negative or zero !
				lowpoint = Math.log10(the_scale.lowpoint);
				highpoint = Math.log10(the_scale.highpoint);
				scale = the_scale.scale;
				width = the_scale.width;
				log_vals_i = the_scale.val_i;
			} else {
				 lowpoint = Math.log10(  log_vals[log_vals_i][val_i_low] * Math.pow(10,power_low) ) ;//far left point
				 highpoint = Math.log10(  log_vals[log_vals_i][val_i_high] * Math.pow(10,power_high) ); //far right point
				 scale = -1; //not used! // the width of a section on the graph.
				 width = -1; //also not used! //is the width of one section in pixels
				 log_vals_i = log_vals_i; //which log scale to use. . .
			}
		}
		
		if (scale < 0){
			//this corrects for the log finding scale loop.
			//it addes one at the end which is not needed if
			//the scale is ok. 
			//log_vals_i -=1;
		}
		if (log_vals_i == 0 && sections > 2*required_secions){
		//do the far zoomed out log scale.
		
		the_scale = this.find_scale( Math.max(-249,Math.log10(min_point)),Math.min(249,Math.log10(max_point)),size,guide_width,'lin',tight);
		
		lowpoint = the_scale.lowpoint; //308 is the javascript float maxamum and minimum
		highpoint = the_scale.highpoint;
		scale = the_scale.scale;
		scalemode = 'log';
		width = the_scale.width;
		log_vals_i = -1; // ! this is the flag to use the zoomed out view.
		}
		
		return the_scale = {
					lowpoint : lowpoint,
					highpoint : highpoint,
					scale : scale, 
					width : width, 
					val_i : log_vals_i,
					val_i_low : val_i_low,
					power_low : power_low,
					val_i_high : val_i_high,
					power_high : power_high,
					scalemode : scalemode
				}
		}
		if (scalemode ==='time'){
		//min_point,max_point,size,guide_width,scalemode,tight
			if (tight){
			var extra_sections = 0;
			} else {
			var extra_sections = 2;
			}
			var required_sections = Math.floor( size / guide_width  ) +extra_sections;
			var target_time_diff = (max_point-min_point)/required_sections;
			var i = 0;
			while (allowed_intervals[i] < target_time_diff){i++;}
			//i++;
			//can only go up to intervals of 500years.
			//so cap i at 43 :allowed_intervals.length-1;
			i = Math.min(i,allowed_intervals.length-1);
			
			extra_sections/=2;
			
			var start_time = min_point-(min_point%allowed_intervals[i]) - extra_sections*allowed_intervals[i];
			var high_time = max_point-(max_point%allowed_intervals[i]) + extra_sections*allowed_intervals[i];// +allowed_intervals[i] ;
			
			
			if (allowed_intervals[i]>=31536000000){
				//using years
				var d = new Date(start_time);
				d = new Date(d.getFullYear(),0,0);
				start_time = d.getTime();
				
				var d = new Date(high_time);
				d = new Date(d.getFullYear() + Math.round(allowed_intervals[i]/1000/60/60/24/365) + Math.round( d.getMonth()/12 ),0,0);
				high_time = d.getTime();
			}
			
			if (allowed_intervals[i]>=2592000000  && allowed_intervals[i]< 31536000000){
				//using months
				var d = new Date(start_time);
				d = new Date(d.getFullYear(),d.getMonth(),1);
				start_time = d.getTime();
				var d = new Date(high_time);
				if (d.getDate() < 15){
					d = new Date(d.getFullYear(),d.getMonth(),1);
				} else {
					d = new Date(d.getFullYear(),d.getMonth()+1,1);
				}
				high_time = d.getTime()+allowed_intervals[i];
			}
			
			if (allowed_intervals[i]>=43200000  && allowed_intervals[i]< 2592000000){
				//using days
				var d = new Date(start_time);
				var c = new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);
				start_time = c.getTime();
				
				var d = new Date(high_time);
				d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);
				high_time = d.getTime()+allowed_intervals[i];
			}
			
			if (allowed_intervals[i]>=1800000  && allowed_intervals[i]<= 21600000){
				//using hours
				var d = new Date(start_time);
				var c = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),0,0,0);
				start_time = c.getTime();
				
				var d = new Date(high_time);
				d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours()+1,0,0,0);
				high_time = d.getTime();
			}
			
			if (allowed_intervals[i]==7200000 ){
				//every two hours
				var d = new Date(start_time);
				var c = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(d.getHours()/2)*2,0,0,0);
				start_time = c.getTime();
				
				var d = new Date(high_time);
				d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(1+d.getHours()/2)*2,0,0,0);
				high_time = d.getTime();
			}
			
			if (allowed_intervals[i]==10800000 ){
				//every three hours
				console.log('every three horus');
				var d = new Date(start_time);
				var c = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(d.getHours()/3)*3,0,0,0);
				start_time = c.getTime();
				
				var d = new Date(high_time);
				d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(1+d.getHours()/3)*3,0,0,0);
				high_time = d.getTime();
			}
			if (allowed_intervals[i]==21600000 ){
				//every six hours
				console.log('every six horus');
				var d = new Date(start_time);
				var c = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(d.getHours()/6)*6,0,0,0);
				start_time = c.getTime();
				
				var d = new Date(high_time);
				d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Math.floor(1+d.getHours()/6)*6,0,0,0);
				high_time = d.getTime();
			}
			if (allowed_intervals[i]<1800000 ){
				high_time += allowed_intervals[i];
			}
			
			var number_of_sections = Math.floor((high_time-start_time)/allowed_intervals[i]);
			var scale = size/number_of_sections;
			var number_of_minor_ticks = Math.floor((high_time-start_time)/time_ticks[i]);
			var tick_scale = size/number_of_minor_ticks;
			var the_scale;
			return the_scale = {
					lowpoint : start_time,
					highpoint : high_time,
					scale : scale, 
					width : tick_scale, //abuse here 
					val_i : i,
					val_i_low : 0,
					power_low : 0,
					val_i_high : 0,
					power_high : 0,
					scalemode : 'time'
				}
		}
	},
	find_limits : function(data,automin,automax,manualmin,manualmax,scale,name){
		"use strict";
		//data is [   [],[],...]
		// automax and automin are bools
		//manualmax and manual min are values for the min and max
		//scale is a string, e.g. 'log','lin'.
		//return object has:
		// limits.low limits.high
		// limits.scale //it can change to log or lin by looking at the data.
		//limits.automax
		//limits.automin //can change if a scale uses the autos or not. 
		//name is a string so that errors are more useful to the user.
		//protect agains +- infinity.
		manualmax = Math.min(manualmax,1e250);
		manualmin = Math.max(manualmin,-1e250);
		//protect against numbers smaller than 1e-250
		if (scale === 'log'){
			manualmax = Math.max(manualmax,2e-250);
			manualmin = Math.max(manualmin,2e-250);
		}
		//protect against times really far away. this could be improved.
		if (scale === 'time'){
			manualmax = Math.min(manualmax,+100000000000000);
			manualmin = Math.max(manualmin,-100000000000000);
		}
		
		
			//protect against empty data series
			this.no_data = false;
			if (data.length == 0){
				if (!automin && !automax){
					low = manualmin;
					high = manualmax;
				} else {
					low = 1;
					high = 10;
					automin = true;
					automax = true;
				}
				if (scale === 'log'){
					if (low<=0){low = 1;}
					if (high<=0 || low > high){high = 10;}
				}
				
				this.no_data = true;
				return {low:low, high:high, automax:automax,automin:automin,scale:scale};
				
			}
			//catch negatives for the log scale
			if (scale === 'log'){
				if (manualmin <= 0 && automin == false){
					automin = true;
					this.errors.push(name + " minimum was negative - using auto");
				}
				if (manualmax <= 0 && automax == false){
					automin = true;
					automax = true;
					this.errors.push(name + " maximum was negative - using auto");
				}
			}
			if ((automin == true ||
				automax == true ||
				low>=high	)){
				var amin  = 1e+307; 
				var amax = -1e+307;
				var low = 1e+307; //very high. easy to shrink
				var high = -1e+307; //very low. easy to grow
				for (i = 0;i<data.length;i++){
					var amin = Math.min.apply(null, data[i] );
					var amax = Math.max.apply(null, data[i] );
					low = Math.min(amin,low);
					high = Math.max(amax,high);
				}
			}
			//catch the case where low is high
			if (low == high){
				low = 0.6*Math.min(low,high);
				high = 1.6*Math.max(low,high);
			}
			if (this.data.length == 1 && this.data[0][0].length == 1 ){
				low = 0.6*Math.min(low,high);
				high = 1.6*Math.max(low,high);
			}
			//catch the case were it is off the range of data and trying to set the autos
			if (manualmin > high && automax && !automin){
				automin = true;
				automax = true;
				this.errors.push(name + " can't have inverted scale - using auto");
			}
			if (manualmax < low && automin && !automax){
				automin = true;
				automax = true;
				this.errors.push(name + " can't have inverted scale - using auto");
			}
			
			if (automin == false){
				low = manualmin;
			}
			if (automax == false){
				high = manualmax;
			}
			if (scale === 'log' && high <= 0){
				scale = 'lin';
				this.errors.push("all "+name+" data is negative, cant plot that log"+name);
			}
			if (scale === 'log' && low<0){
				low = 1e200;
				for (var i = 0;i<data.length;i++){
					//find lowest y that isn't zero
					for (var ii = 0;ii<this.data[i][1].length;ii++){
						if (data[i][ii] > 0 && data[i][ii] < low){
							low = data[i][ii];
						}
					}
				}
				if (low == 1e200){
					low = 1e-13;
			}
			}	
			
			/*
			if (Math.abs(high)<2e-12 && high != 0.0 && scale !=='log'){
				high = Math.sign(high) *2e-12;
				this.errors.push( name + " high is too small to cope with.");
			}
			if (Math.abs(low) <=1e-12 && low != 0.0 && scale !=='log'){
				low = Math.sign(low) * 1e-12;
				this.errors.push(name + " low is too small to cope with.");
			}
			*/
			
			return {low:low, high:high, automax:automax,automin:automin,scale:scale};
	},
	use_scale : function (the_scale,target_size,guideWidth){
		"use strict";
		var lowpoint = the_scale.lowpoint; 
		var highpoint = the_scale.highpoint;
		var scale = the_scale.scale;
		var width = the_scale.width;
		var val_i = the_scale.val_i;
		var val_i_low =the_scale.val_i_low;
		var power_low = the_scale.power_low;
		var val_i_high = the_scale.val_i_high;
		var power_high = the_scale.power_high;
		var scalemode =  the_scale.scalemode;
		//var target_size = 300;//this is going to be canvas.width or canvas.height depending which one is being used. . . 
		var many_tick_limit = 1;
		var pos = [];
		var strings = [];
		var minor_pos = [];
		var val_is;
		var power;
		var old_i;
		
		if (scalemode === 'lin'){
			var tick = 0;// for the dummy run start at the far left, even though there
			//won't be an actual label there.
			var prev_label = ' ';
			var precision = 1;
			var label = '';
			
			var zero_position = (0-lowpoint)*target_size/(highpoint - lowpoint)
			
			
			
			//dummy run to get the precision
			while (tick <= target_size) {
				i = tick/width*scale+lowpoint;
				//if (Math.abs(i)< not_zero) {i=0;}//javasript sucks.
				label = i.toPrecision(precision);
				if (label === prev_label){precision += 1;label = i.toPrecision(precision);}
				prev_label = label;
				tick += width;
			}
			
			//draw it this time
			tick = width;
			var j = 1;
			//j here is just the same as tick/width.
			//however repeated additions of width lead to annoying floating point errors.
			//using j reduces the number of floating point problums
			
			while (tick < target_size-1) {
				i = j*scale+lowpoint;
				pos.push(tick);
				//if (Math.abs(i)< not_zero) {i=0;}//javasript sucks.
				
				//within 2 pixels of zero. call it zero
				if (Math.abs(tick - zero_position) <2){
					label = (0).toFixed(Math.max(1,precision-1));
					
				} else {
					label = mjs_precision(i,precision);
				
				}
				strings.push(label);
				tick += width;
				j +=1;
			}
			
			var stepping = label.length*.7*this.graphics_style.tick_labels_font_size*this.graphics_style.scaling_factor > width;
			
			tick = 0;
			var minor_ticks = 1;
				if ( width > guideWidth*many_tick_limit) {
					minor_ticks = many_minor_ticks[val_i];
				//use many small ticks
				} else {
				//use few small ticks
					minor_ticks = few_minor_ticks[val_i];
				}
			while (tick <= target_size) {
				minor_pos.push(tick);
				tick += width/minor_ticks;
			}
		}
		//the far zoomed out view.
		if (scalemode === 'log' && val_i == -1){
			var tick = 0;// for the dummy run start at the far left, even though there
			//won't be an actual label there.
			var prev_label = ' ';
			var precision = 1;
			var label = '';
			
			//dummy run to get the precision
			while (tick <= target_size) {
				i = Math.pow(10,tick/width*scale+lowpoint);
				label = i.toPrecision(precision);
				if (label === prev_label){precision += 1;label = i.toPrecision(precision);}
				prev_label = label;
				tick += width;
			}
			
			//draw it this time
			tick = width;
			var j = 1;
			//j here is just the same as tick/width.
			//however repeated additions of width lead to annoying floating point errors.
			//using j reduces the number of floating point problums
			while (tick < target_size-1) {
				i = Math.pow(10,j*scale+lowpoint);
				pos.push(tick);
				label = mjs_precision(i,precision);
				strings.push(label);
				tick += width;
				j +=1;
			}
			
			var stepping = label.length*.7*this.graphics_style.tick_labels_font_size*this.graphics_style.scaling_factor > width;
			
			tick = 0;
			var minor_ticks = 1;
				if ( width > guideWidth*many_tick_limit) {
					minor_ticks = many_minor_ticks[val_i];
				//use many small ticks
				} else {
				//use few small ticks
					minor_ticks = few_minor_ticks[val_i];
				}
			while (tick <= target_size) {
				minor_pos.push(tick);
				tick += width/minor_ticks;
			}
		}
		 if (scalemode === 'log' && val_i != -1){
			//the pure log mode
			if (scale < 0) {
				val_is = val_i_low;
				power = power_low;
				i = log_vals[val_i][val_i_low] * Math.pow(10,power_low);
				old_i = i;
				precision = 2;
				while (i < log_vals[val_i][val_i_high] * Math.pow(10,power_high) ){
					val_is +=1; 
					if (val_is >= log_vals[val_i].length){
						power += 1;
						val_is = 0;
					}
					i = log_vals[val_i][val_is] * Math.pow(10,power);
					tick = (Math.log10(i)-lowpoint)*target_size/(highpoint - lowpoint);
					
					if (tick< target_size-10){
						strings.push(mjs_precision(i,2));
						pos.push(tick);
					}
					//use the mid point rule for minor ticks 
					if (val_i > 8){
						var mid = (Math.log10( (old_i + i)/2  )-lowpoint)*target_size/(highpoint - lowpoint);
						minor_pos.push(mid);
					}
					
					old_i = i;
				}
				//use the minor ticks array 
				if (val_i <= 8){
					i = log_vals[val_i][val_i_low] * Math.pow(10,power_low);
					val_is = val_i_low;
					power = power_low;
					while (i < log_vals[val_i][val_i_high] * Math.pow(10,power_high)){
						i = log_vals_ticks[val_i][val_is] * Math.pow(10,power);
						tick = (Math.log10(i)-lowpoint)*target_size/(highpoint - lowpoint); 
						minor_pos.push(tick);
						val_is +=1;
						if (val_is >= log_vals_ticks[val_i].length){
							power += 1;
							val_is = 0;
						}
					}
				}
			} else {
				//log mode with a linear labels and ticks( really zoomed in).
				var tick = 0;
				var prev_label = ' ';
				var precision = 1;
				var label = '';
				//dummy run to get the precision
				i = Math.pow(10,lowpoint);
				while (i <= Math.pow(10,highpoint) ) {
					label = i.toPrecision(precision);
					if (label === prev_label){precision += 1;label = i.toPrecision(precision);}
					prev_label = label;
					i += scale;
				}
				//sepping if the labels are really long. this stops them running into each other.
				//the other way of doing this is to not show every other label. or re-analyse the
				//data with a larger min_width. = label.lendth*text_size/2
				var stepping = label.length*.7*this.graphics_style.tick_labels_font_size*this.graphics_style.scaling_factor >= width;
				//draw it this time
				i = Math.pow(10,lowpoint)+scale;
				
				while (i < Math.pow(10,highpoint)-scale/2  ) {
					label = mjs_precision(i,precision);
					tick = (Math.log10(i)-lowpoint)*target_size/(highpoint - lowpoint); 
					pos.push(tick);
					strings.push(label);
					i += scale;
				}
				//draw minor ticks
				var minor_ticks = 1;
					if ( width >guideWidth*many_tick_limit) {
						minor_ticks = many_minor_ticks[val_i];
					//use many small ticks
					} else {
					//use few small ticks
						minor_ticks = few_minor_ticks[val_i];
					}
				i = Math.pow(10,lowpoint);
				while (i < Math.pow(10,highpoint)) {
					tick = (Math.log10(i)-lowpoint)*target_size/(highpoint - lowpoint); 
					minor_pos.push(tick);
					i += scale/minor_ticks;
				}
			}
		}
		
		if (scalemode ==='time'){
			var i = the_scale.val_i;
			//find the high point precision
			var total_diff = (highpoint-lowpoint);
			//find which interval to use. 
			j = 0;
			while (allowed_intervals[j] < total_diff){j++;}
			
			j--;
			
			
			var low_precision = string_precisions[i];
			var high_precision = string_precisions[j];
			
			//check that the low-precision is enough.
			
			//dummy run to get precision
			var section_time = lowpoint;
			var first_lable = mjs_date_print(section_time,high_precision,high_precision);
			var tick = 0;
			var old_label = '';
			var label = '';
			while (section_time < highpoint) {
				
				section_time+=allowed_intervals[i];
				
				if (allowed_intervals[i]>=2592000000){
					section_time = round_to_month(section_time);
				}
				
				tick = (section_time-lowpoint)/total_diff * target_size;
				
				label = mjs_date_print(section_time,high_precision,low_precision)
				if (label === old_label){
					//i--;
					low_precision++;
					//low_precision = string_precisions[i];
				}
				old_label = label;
			
			}
			var last_lable = mjs_date_print(section_time,high_precision,high_precision);
			if (last_lable === first_lable){
				high_precision++;
			}
			
			

			var section_time = lowpoint;
			var tick = 0;
			var mtick = 0;
			//for ( var section_time = lowpoint;section_time<highpoint;){
			while (section_time < highpoint-allowed_intervals[i] && tick+scale < target_size-2) {
				
				section_time+=allowed_intervals[i];
				
				
				
				if (allowed_intervals[i] >= 2592000000){
					section_time = round_to_month(section_time);
					
				}
				tick = (section_time-lowpoint)/total_diff * target_size;
				
				pos.push(tick);
				
				label = mjs_date_print(section_time,high_precision,low_precision);
				
				strings.push(label);
				
				
				while (mtick < tick) {
					mtick += width;
					minor_pos.push(mtick);
				}
				var mtick = tick;
				minor_pos.pop();
				
				
				
			}
			
			while (mtick < target_size) {
					mtick += width;
					minor_pos.push(mtick);
			}
			
			stepping = false;
			var stepping = label.length*.7*this.graphics_style.tick_labels_font_size*this.graphics_style.scaling_factor > scale;

			
			precision = low_precision;
		}
		return {pos:pos, strings:strings, minor_pos:minor_pos, stepping:stepping, precision:precision}
	},
	fit_points_drawn : 0,
	drawSimpleLine : function(ctx,x,y){
		
				var xi = this.units_to_pixels(x[0],'x');
				var yi = this.units_to_pixels(y[0],'y');
				var oxi = xi;
				var oyi = yi;
				ctx.beginPath();
				ctx.moveTo(xi,yi);
				var ongraph = true;
				var wasOngraph = true;
				for (var k = 0;k<x.length;k++){
					this.fit_points_drawn++;
					var yi = this.units_to_pixels(y[k],'y');
					var xi =  this.units_to_pixels(x[k],'x');
					ongraph = (yi > 0 && yi < this.canvas.height);
					if (ongraph && wasOngraph){
						ctx.lineTo(xi,yi);
					}
					if (!ongraph && wasOngraph){
						ctx.lineTo(xi,yi);
						ctx.stroke();
					}
					if (ongraph && !wasOngraph){
						ctx.beginPath();
						ctx.moveTo(oxi,oyi);
						ctx.lineTo(xi,yi);
						
					}
					wasOngraph = ongraph;
					oxi = xi;
					oyi=yi;
				}
				ctx.stroke();
	},
	mjs_plot : function () {
	"use strict";
	var start_time = new Date();
	//catch errors in plotting
	if (this.plot_failed){
		this.errors.push('failed for unknown reason');
		this.graphics_style = JSON.parse(JSON.stringify(this.default_graphics_style));
	}
	this.plot_failed = true; //is set to false at  the end. 
	
	// gs is the graph style.
	//get things out of gs.
	//if gs.modified is false use the default style
	if (this.graphics_style.modified == false){
		//below is a hack to get the graphics style to clone
		console.log('getting defautts');
		this.graphics_style = JSON.parse(JSON.stringify(this.default_graphics_style));
	}
	
	
	
	var gs = this.graphics_style;
	
	var ctx = this.canvas.getContext('2d');
	if (this.isSVG){var ctx = new SVGContext(ctx)};
	
	ctx.lineJoin="round";
	var canvas = this.canvas;
	
	
	
	var graph_line_thickness =gs.graph_line_thickness;
	var symbol_size = gs.symbol_size;
	var line_thickness= gs.line_thickness;
	var tick_len = gs.tick_len;
	var mode = gs.mode;
	var font_name = gs.font_name;
	var title_font_size = gs.title_font_size;
	var title = gs.title;
	var subtitle = gs.subtitle;
	var title_spacing = gs.title_spacing;
	var tick_labels_font_size = gs.tick_labels_font_size;
	var tick_lables_font_padding = gs.tick_lables_font_padding;
	var axis_labels_font_size=gs.axis_labels_font_size;
	var lable_spacing =gs.lable_spacing;
	var x_axis_title =gs.x_axis_title;
	var y_axis_title = gs.y_axis_title;
	var minor_tick_len = gs.minor_tick_len;
	var guideWidthx = gs.guideWidthx;
	var guideWidthy = gs.guideWidthy;
	var scaling_factor =gs.scaling_factor;

	// general scaling ... everything up or down with scaling_factor.
	guideWidthx *= scaling_factor;
	guideWidthy *= scaling_factor;
	lable_spacing *=scaling_factor;
	axis_labels_font_size*=scaling_factor;
	tick_lables_font_padding*=scaling_factor;
	tick_labels_font_size*=scaling_factor;
	title_spacing*=scaling_factor;
	title_font_size*=scaling_factor;
	tick_len*=scaling_factor;
	line_thickness*=scaling_factor;
	symbol_size*=scaling_factor;
	graph_line_thickness*=scaling_factor;
	minor_tick_len*=scaling_factor;
	
	/*
	//day night mode stuff
	if (gs.day_night_mode){
		gs.color_fg = '#ffffff';
		gs.color_bg = '#000000';
	} else {
		//daytime
		gs.color_fg = '#000000';
		gs.color_bg = '#ffffff';
	}
	*/
	
	//befor clearing the scrren try to draw some text to check the font is ok
	try{
		ctx.font=tick_labels_font_size + 'px ' + font_name//"24px Courier New";
		ctx.fillText('font test',10,10);
	} catch(e) {
		console.log('font faliure');
		this.errors.push("font faliure");
		font_name = "Courier New";
		gs.font_name = "Courier New";
	}
	
	// clear prevous drawing
	ctx.fillStyle = gs.color_bg;
	ctx.strokeStyle = gs.color_fg;
	
	if (this.transparent ){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	} else {
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	if (this.isSVG){
		ctx.clearAll();
		ctx.font_name = font_name;
	}
	
	//run data transforms
	//back up data so the transforms can mess it up	
	if (this.transform_index != gs.data_transforms.length ){
		this.data = clone(this.data_backup);
		this.captions = clone(this.captions_backup);
		this.colors = clone(this.colors_backup);
		this.transform_index = 0;
		this.transform_text_x = x_axis_title;//'x';
		this.transform_text_y = y_axis_title;//'y';
		//hide/show lines from the lines menu
		transforms.remove_lines(this.data,gs.hidden_lines,this);
	}
	
	//run the transforms
	while(this.transform_index<gs.data_transforms.length){
			var fun = eval("transforms." + gs.data_transforms[this.transform_index]);
			console.log('running ' + gs.data_transforms[this.transform_index]);
			fun(this.data,gs.data_transforms_args[this.transform_index],this);
			this.transform_index++;
	}
	
	//TODO use a.concat(c,b) method here and test for speed improvements.
	var xdata = [];
	var ydata = [];
	for (var i = 0;i<this.data.length;i++){
		xdata.push(this.data[i][0]);
		ydata.push(this.data[i][1]);
	}
	
	var xlimits = this.find_limits(xdata,gs.x_scale_auto_min,gs.x_scale_auto_max,gs.x_manual_min,gs.x_manual_max,gs.x_scale_mode,'x');
	var xlow = xlimits.low;
	var xhigh = xlimits.high;
	gs.x_scale_auto_min = xlimits.automin;
	gs.x_scale_auto_max = xlimits.automax;
	gs.x_scale_mode = xlimits.scale;
	
	var ylimits = this.find_limits(ydata,gs.y_scale_auto_min,gs.y_scale_auto_max,gs.y_manual_min,gs.y_manual_max,gs.y_scale_mode,'y');
	var ylow = ylimits.low;
	var yhigh = ylimits.high;
	gs.y_scale_auto_min = ylimits.automin;
	gs.y_scale_auto_max = ylimits.automax;
	gs.y_scale_mode = ylimits.scale;
	
	var the_scalex = this.find_scale(xlow,xhigh,this.canvas.width,guideWidthx,gs.x_scale_mode,gs.x_scale_tight);
	var lowpointx = the_scalex.lowpoint; //far left point
	var highpointx = the_scalex.highpoint; //far right point
	var scalex = the_scalex.scale; // the width of a section on the graph.
	var widthx = the_scalex.width;  //is the width of one section in pixels
	var val_ix = the_scalex.val_i; //the posistion in vals or log_vals
	var val_i_lowx =the_scalex.val_i_low;
	var power_lowx = the_scalex.power_low;
	var val_i_highx = the_scalex.val_i_high;
	var power_highx = the_scalex.power_high;
	//log scale
	
	var the_scaley = this.find_scale(ylow,yhigh,this.canvas.height,guideWidthy,gs.y_scale_mode,gs.y_scale_tight);
	
	//this is an experiament to use the fontsize to set the guidewidth
	//var the_scaley = this.find_scale(ylow,yhigh,this.canvas.height,tick_labels_font_size*2,gs.y_scale_mode,gs.y_scale_tight);
	//it works! but it's not ready to implement yet. as this would be a breaking api change.
	
	var lowpointy = the_scaley.lowpoint;
	var highpointy = the_scaley.highpoint;
	var scaley = the_scaley.scale;
	var widthy = the_scaley.width;
	var val_iy = the_scaley.val_i;
	var val_i_lowy =the_scaley.val_i_low;
	var power_lowy = the_scaley.power_low;
	var val_i_highy = the_scaley.val_i_high;
	var power_highy = the_scaley.power_high;
	
	//set the graphics style x_auto_max mins...
	gs.x_auto_min = lowpointx;
	gs.x_auto_max = highpointx;
	gs.y_auto_min = lowpointy;
	gs.y_auto_max = highpointy;
	var positionsx = this.use_scale(the_scalex,canvas.width,guideWidthx);
	var positionsy = this.use_scale(the_scaley,canvas.height,guideWidthy);

	
	//if the autos are on update the manual settings
	if (gs.y_scale_auto_min ){
		gs.y_manual_min = this.pixels_to_units(this.canvas.height,'y');
	}
	if (gs.y_scale_auto_max ){
		gs.y_manual_max = this.pixels_to_units(0,'y');
	}
	if (gs.x_scale_auto_min ){
		gs.x_manual_min = this.pixels_to_units(0,'x');
	}
	if (gs.x_scale_auto_max ){
		gs.x_manual_max = this.pixels_to_units(this.canvas.width,'x');
	}
	
	gs.scalex = scalex;
	gs.scaley = scaley;
	gs.widthx = widthx;
	gs.widthy = widthy;
	
	
	//draw a grid.
	if (gs.show_grid){
		ctx.strokeStyle = gs.color_fg;
		ctx.globalAlpha = 0.2; //draw them subtle dammit!
		ctx.beginPath();
		for (var i = 0;i<positionsy.pos.length;i++){
			var y = canvas.height - positionsy.pos[i];
			ctx.moveTo(0,y);
			ctx.lineTo(canvas.width,y);
		}
		for (var i = 0;i<positionsx.pos.length;i++){
			var x = positionsx.pos[i];
			ctx.moveTo(x,0);
			ctx.lineTo(x,canvas.height);
		}
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
	
	//draw the function lines
	
	//this.drawSimpleLine(ctx,fit_x,fit_y);
	var lines_start = 0;
	var lines_end = canvas.width;
	var fit_x = [];
	for (var j=lines_start; j<lines_end;j+=2){
			fit_x.push(this.pixels_to_units(j,'x'));
	}
	var fit_y = [];
	for (var i = 0; i<gs.function_lines.length;i++){
		try {
			fit_y = parseExpression(gs.function_lines[i],fit_x,fit_x);
			this.drawSimpleLine(ctx,fit_x,fit_y);
		} catch(e){
			this.errors.push('function line:y=' + gs.function_lines[i] + ' fails');
		}
	}
	
	ctx.font=tick_labels_font_size + 'px ' + font_name//"24px Courier New";
	//draw the points
	ctx.lineWidth = line_thickness;
	//ctx.strokeStyle = '#ff0000';
	var drawn_something = false;
	var drawn_caps = false;
	var points_drawn = 0;
	//for histogram find the 0 point or use the bottom of the screen.
	var hist_zero = Math.min(this.units_to_pixels(0,'y'),canvas.height);
	
	
	var full_auto_zoom = gs.y_scale_auto_min && gs.y_scale_auto_max && gs.x_scale_auto_min && gs.x_scale_auto_max
	//point drawing code here
	for (i = 0;i<this.data.length;i++){
		ctx.strokeStyle = this.colors[i];
		ctx.fillStyle = ctx.strokeStyle ;
		if (gs.symbol_mode === 'none' && gs.line_mode == 'none'){
			this.errors.push("no symbols or lines to draw");
		}
			//this chunk of code checks to find sequences of data that are on screen
			//don't waste time drawing points that aren't going to be seen.
			
			// but if the auto zoom is on, then we know everything is going to be drawn anyway.
		if ( !full_auto_zoom ){
			//save each sequency in the seq_start and seq_end arrays
			var ongraph = false;
			var wasOngraph = false;
			var graph_top = this.pixels_to_units(0,'y');
			var graph_bottom = this.pixels_to_units(canvas.height,'y');
			
			var graph_left = this.pixels_to_units(0,'x');
			var graph_right = this.pixels_to_units(canvas.width,'x');
			var seq_start = [];
			var seq_end = [];
			for (var k = 0;k<this.data[i][0].length;k++){
				ongraph = ( this.data[i][0][k] > graph_left && this.data[i][0][k] < graph_right  &&
							this.data[i][1][k] > graph_bottom && this.data[i][1][k] < graph_top );
				if (!ongraph && wasOngraph){
					seq_end.push(Math.min(k+2,this.data[i][0].length));
				}
				if (ongraph && !wasOngraph){
					seq_start.push(Math.max(k-2,0));
				}
				wasOngraph = ongraph;
			}
			//finish of the last sequence if it is open.
			if (seq_start.length > seq_end.length){
				seq_end.push(k);
			}
			//do sequence merging
			//merge sequences if they are very close to each other or overlapping
			for (k=seq_start.length-1;k>=0;k--){
				//if they are within 1 just merge the sequences together.
				if (seq_start[k] <= seq_end[k-1] +2){
					seq_end[k-1] = seq_end[k];
					//remove 
					seq_end.splice(k,1);
					seq_start.splice(k,1);
				}
			}
		} else {
			seq_start= [0];
			seq_end = [this.data[i][0].length];
		}
			
		drawn_something = drawn_something || seq_start.length > 0;
			
		//keeps the prevous 3 data points for the curves
		// order goes 1,2,3,i
		//itinilisitation:
		// j = 0 [123i, , , ]
		// j = 1 [123,i, , ]
		// j = 2 [12,3,i, , ]
		// j = 3 [1,2,3,i, , ]
		//  . . .
		// j = n [ ,  ,  , 1,2,3,i, , ,]
		//draw the sequences. 
		for (k=0;k<seq_start.length;k++){
			
			if (  gs.line_mode.indexOf('line') >-1  ){
				this.drawing_methods.draw_line(this,ctx,i,seq_start[k],seq_end[k]);
			}
			
			if (  gs.symbol_mode === 'dot'   ){
				this.drawing_methods.draw_dot(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			if (  gs.symbol_mode === 'cdot'   ){
				this.drawing_methods.draw_cdot(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			if (  gs.symbol_mode === 'circ'   ){
				this.drawing_methods.draw_circ(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			if (  gs.symbol_mode === 'box'   ){
				this.drawing_methods.draw_box(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			if (  gs.symbol_mode === 'x'   ){
				this.drawing_methods.draw_x(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			if (  gs.symbol_mode === 'cross'   ){
				this.drawing_methods.draw_cross(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			
			/*
			if (  gs.symbol_mode.indexOf('block') >-1  ){
				this.drawing_methods.draw_circ(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			if (  gs.symbol_mode.indexOf('cross') >-1  ){
				this.drawing_methods.draw_circ(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			*/
			if (  gs.line_mode.indexOf('zig') >-1  ){
				this.drawing_methods.draw_zig(this,ctx,i,seq_start[k],seq_end[k]);
			}
			if (  gs.line_mode.indexOf('zag') >-1  ){
				this.drawing_methods.draw_zag(this,ctx,i,seq_start[k],seq_end[k]);
			}
			if (  gs.line_mode.indexOf('mid') >-1  ){
				this.drawing_methods.draw_mid(this,ctx,i,seq_start[k],seq_end[k]);
			}
			if (  gs.line_mode.indexOf('approx') >-1  ){
				this.drawing_methods.draw_approx(this,ctx,i,seq_start[k],seq_end[k]);
			}
			if (  gs.line_mode.indexOf('interp') >-1  ){
				this.drawing_methods.draw_interp(this,ctx,i,seq_start[k],seq_end[k]);
			}
			if (  gs.line_mode.indexOf('hist') >-1  ){
				this.drawing_methods.draw_hist(this,ctx,i,seq_start[k],seq_end[k]);
			}
			if (this.data[i].length >=3){
				//has y error data
				this.drawing_methods.draw_y_errors(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
			if (this.data[i].length >=4){
				//has x error data
				this.drawing_methods.draw_x_errors(this,ctx,i,seq_start[k],seq_end[k],symbol_size);
			}
		}
		
	}
	ctx.lineWidth = graph_line_thickness;
	ctx.strokeStyle = gs.color_fg;//'#000000';
	ctx.fillStyle = gs.color_fg;;//'#000000';
	
	if (!drawn_something && this.no_data == false && gs.function_lines.length ==0){
		this.errors.push("there might be data around, just not where you're looking");
	}
	
	if (!this.isSVG){
		if (graph.needs_drag_image || gs.mouse_mode === 'drag'){
		
			this.graph_image_for_drag = ctx.getImageData(0,0,canvas.width,canvas.height);
			graph.needs_drag_image = false;
		}
	}
	
	//draw the ticks and the points. 
	//for x
	var l = positionsx.strings.length;
	var stepping = ctx.measureText(positionsx.strings[1]+' ').width > positionsx.pos[1] - positionsx.pos[0]  || ctx.measureText(positionsx.strings[l-1] + ' ').width > positionsx.pos[l-1] - positionsx.pos[l-2] ;
	
	if (stepping ){
		var j = -1*tick_labels_font_size/2;
		var o = tick_labels_font_size/2;
	} else {
		var j = 0;
		var o = 0;
		
	}
	ctx.textAlign="center";
	ctx.beginPath();
	for (var i = 0;i<positionsx.pos.length;i++){
		var x = positionsx.pos[i];
		var label = positionsx.strings[i];
		
		ctx.fillText(label,x,canvas.height-tick_len*1.2-tick_lables_font_padding - o - j);
		j *= -1;
		
		ctx.moveTo(x,0);
		ctx.lineTo(x,tick_len);
		ctx.moveTo(x,canvas.height);
		ctx.lineTo(x,canvas.height-tick_len);
		
	}
	ctx.stroke();
	ctx.beginPath();
	for (var i = 0;i<positionsx.minor_pos.length;i++){
		x = positionsx.minor_pos[i];
		
		ctx.moveTo(x,0);
		ctx.lineTo(x,minor_tick_len);
		ctx.moveTo(x,canvas.height);
		ctx.lineTo(x,canvas.height-minor_tick_len);
		
	}
	ctx.stroke();
	gs.x_precision = positionsx.precision;
	ctx.textAlign="left";
	ctx.beginPath();
	for (var i = 0;i<positionsy.pos.length;i++){
		var y = canvas.height - positionsy.pos[i];
		var label = positionsy.strings[i];
		//if it is near the top, don't put a label, as this is where the axis label is.
		if (y > tick_len+lable_spacing+axis_labels_font_size/2){
			ctx.fillText(label,tick_len*1.2+2,y+3);
		}
		
		ctx.moveTo(0,y);
		ctx.lineTo(tick_len,y);
		ctx.moveTo(canvas.width,y);
		ctx.lineTo(canvas.width-tick_len,y);
		
	}
	ctx.stroke();
	ctx.beginPath();
	for (var i = 0;i<positionsy.minor_pos.length;i++){
		y = canvas.height - positionsy.minor_pos[i];
		
		ctx.moveTo(0,y);
		ctx.lineTo(minor_tick_len,y);
		ctx.moveTo(canvas.width,y);
		ctx.lineTo(canvas.width-minor_tick_len,y);
		
	}
	ctx.stroke();
	gs.y_precision = positionsy.precision;

	if (gs.show_captions) {
		ctx.font=tick_labels_font_size + 'px ' + font_name//"14px Courier New";
		
		x = gs.scaling_factor*gs.caption_position.x;
		y = gs.scaling_factor*gs.caption_position.y;
		if (gs.caption_position.y>0){
			//going down from top
			y += tick_labels_font_size;
			dy = tick_labels_font_size;
			y += tick_len;
		} else {
			//up from botton
			dy = tick_labels_font_size;
			y = canvas.height + y;
			y += tick_labels_font_size - this.data.length*dy;
			y -= tick_len;
		}
		if (gs.caption_position.x>0){
			ctx.textAlign="left";
			x += tick_len;
		} else {
			ctx.textAlign="right";
			x = canvas.width + x;
			x -= tick_len;
		}
		for (i = 0;i<this.data.length;i++){
			ctx.fillStyle = this.colors[i];
			label = this.captions[i] ||  'label' ;
			var splitter = " : ";
			switch(gs.captions_display){
				case "ylast":
					label += splitter +  this.get_axis_string(this.data[i][1][this.data[i][1].length-1],'y');
					break;
				case "xlast":
					label += splitter +  this.get_axis_string(this.data[i][0][this.data[i][0].length-1],'x');
					break;
				case "xfirst":
					label += splitter +  this.get_axis_string(this.data[i][0][0],'x');
					break;
				case "yfirst":
					label += splitter +  this.get_axis_string(this.data[i][1][0],'y');
					break;
				case "xmin":
					label += splitter +  this.get_axis_string(  Math.min.apply(null, this.data[i][0] )  ,'x');
					break;	
				case "ymin":
					label += splitter +  this.get_axis_string(  Math.min.apply(null, this.data[i][1] )  ,'y');
					break;
				case "ymax":
					label += splitter +  this.get_axis_string(  Math.max.apply(null, this.data[i][1] )  ,'y');
					break;
				case "xmax":
					label += splitter +  this.get_axis_string(  Math.max.apply(null, this.data[i][0] )  ,'x');
					break;			
			}
			
			
			if (!this.transparent){
				ctx.strokeStyle = gs.color_bg;
				ctx.lineWidth = axis_labels_font_size/3;
				ctx.strokeText(label,x,y);
			}
			ctx.fillText(label,x,y);
			y += dy;
		}
		
	
	//show the 'other lines hidden' text
	if (this.data.length != this.data_backup.length){
			label = 'other lines hidden';
			if (!this.transparent){
				ctx.strokeStyle = gs.color_bg;
				ctx.lineWidth = axis_labels_font_size/3;
				ctx.strokeText(label,x,y);
			}
			ctx.fillStyle = '#808080';
			ctx.fillText(label,x,y);
		}
	}
	
	
	ctx.lineWidth = graph_line_thickness;
	ctx.strokeStyle = graph.graphics_style.color_fg;
	ctx.fillStyle = graph.graphics_style.color_fg;
	
	if (  (this.transform_text_x.length > 1 || this.transform_text_y.length > 1)&& gs.showTransformTexts   )   {
		var x_label = this.transform_text_x;
		var y_label = this.transform_text_y;
	} else {
		var x_label = x_axis_title;
		var y_label = y_axis_title;
	}
	
	//draw x axis label
	ctx.font=axis_labels_font_size + 'px ' + font_name//"14px Courier New";
	ctx.textAlign="right";
	var label = x_label;
	if (gs.x_scale_mode ==='time' && this.graphics_style.x_precision > 1 ){
		label += ' ' + mjs_date_print( this.pixels_to_units(canvas.width,'x') ,0,Math.max(this.graphics_style.x_precision-1,0));
	}
	if (stepping) {
	ctx.fillText(label,canvas.width - lable_spacing - tick_len,
					 canvas.height - tick_len-lable_spacing- 2*tick_labels_font_size);
	} else {
	ctx.fillText(label,canvas.width - lable_spacing - tick_len,
					 canvas.height - tick_len-lable_spacing-tick_labels_font_size);
	}
	ctx.textAlign="left"; 
	//draw y axis lable
	var label = y_label;
	if (gs.y_scale_mode ==='time' && this.graphics_style.y_precision > 1){
		label += ' ' + mjs_date_print( this.pixels_to_units(0,'y') ,0,Math.max(this.graphics_style.y_precision-1,0));
	}
	ctx.fillText(label,tick_len+lable_spacing,tick_len+lable_spacing);
	//draw transforms stack
	
	// draw infomation overlay if the info button is pushed.
	ctx.beginPath();
	ctx.stroke();
	
	
	var sigma = String.fromCharCode( 963 ); //σ²
	var squared = String.fromCharCode( 178 ); //σ²
	var bar = String.fromCharCode( 773 ); //put befor what you want bared e.g. bar + 'y' 
	var edge = tick_len*2.6;
	ctx.font=axis_labels_font_size + 'px ' + font_name//"14px Courier New";

	var fit_points_drawn = 0;
	if (gs.fits === 'none'){
		//dont' do anything :(
	} else {
		//do some fits or stats!!!! wooo stats. 
		ctx.textAlign="left"; 
		
		var x = gs.fit_text_position.x * canvas.width;
		var y = gs.fit_text_position.y * canvas.height;
		var dy = 1.2*axis_labels_font_size;
		
		for (i = 0;i<this.data.length;i++){	
			var label = this.captions[i] ||  'label' ;
			ctx.fillStyle = this.colors[i];
			
			//three lines of text.
			var string1 = '';
			var string2 = '';
			var string3 = '';
			
			if (!this.transparent){
				ctx.strokeStyle = gs.color_bg;
				ctx.lineWidth = axis_labels_font_size/2;
				ctx.strokeText(label,x,y);
			}
			
			ctx.fillText(label,x, y);
			ctx.fillStyle = gs.color_fg;
			
			ctx.lineWidth = line_thickness;
			if (gs.color_fits){
				ctx.strokeStyle = this.colors[i];
			} else {
				ctx.strokeStyle = gs.color_fg;
			}
			
			if (gs.fits === 'stats'){
				var stats = series_stats(this.data[i][0],this.data[i][1]);
				ctx.fillStyle = gs.color_fg;
				
				string1 =  ' n = ' +stats.n +
					',    cov(x,y) = ' + mjs_precision(stats.cov,Math.min(gs.x_precision,gs.y_precision)+3);
				string2 = bar + 'x = ' +number_quote(stats.x_mean,stats.sigma_x) +
					',   '+sigma+'(x) = ' +mjs_precision(stats.sigma_x,2);
				string3 = bar + 'y = ' + number_quote(stats.y_mean,stats.sigma_y) + 
					',   '+sigma+'(y) = ' +mjs_precision(stats.sigma_y,2);
					
				if (gs.color_fits){
				ctx.strokeStyle = this.colors[i];
				} else {
				ctx.strokeStyle = gs.color_fg;
				}
				//draw the mean and the 1 and 2 SD lines...
				//for x
				ctx.beginPath();
				for (var k = -1;k<1+1;k++){
					var yi = graph.units_to_pixels(stats.y_mean+k*stats.sigma_y,'y');
					ctx.moveTo(graph.units_to_pixels(stats.xmin,'x'),yi);
					ctx.lineTo(graph.units_to_pixels(stats.xmax,'x'),yi);
				}
				ctx.stroke();
				ctx.beginPath();
				for (var k = -1;k<1+1;k++){
					var xi = graph.units_to_pixels(stats.x_mean+k*stats.sigma_x,'x');
					ctx.moveTo(xi,graph.units_to_pixels(stats.ymax,'y'));
					ctx.lineTo(xi,graph.units_to_pixels(stats.ymin,'y'));
				}
				ctx.stroke();
				//drawEllipse(ctx, graph.units_to_pixels(stats.x_mean,'x'), graph.units_to_pixels(stats.y_mean,'y'), graph.units_to_pixels(stats.sigma_x,'x'), graph.units_to_pixels(stats.sigma_y,'y'));
				drawEllipse(ctx, stats.x_mean, stats.y_mean, stats.sigma_x, stats.sigma_y);
				drawEllipse(ctx, stats.x_mean, stats.y_mean, stats.sigma_x*2, stats.sigma_y*2);
			}
			if (gs.fits === 'old' && this.fit_data.length == 0){
				gs.fits = 'none';
			}
			if (gs.fits === 'old'){
				string1 = 'previous fit shown';
				string2 = 'pick new fit';
				//show the old fit if possible, don't make a new one.
					fit_x = this.fit_data[i][0];
					fit_y = this.fit_data[i][1];
					
					if (gs.color_fits){
					ctx.strokeStyle = this.colors[i];
					} else {
					ctx.strokeStyle = gs.color_fg;
					}
					this.drawSimpleLine(ctx,fit_x,fit_y);
					
				
			}
			
			//fit_strings = ['exp','exp_c','linear','quad', 'cubic','poly4','poly5','poly6','poly7','const','log','power','power_c'];
			//fit_funs = [fits.exponential,fits.exponential_plus_c,fits.linear,fits.poly2,fits.poly3,fits.poly4,fits.poly5,fits.poly6,fits.poly7,fits.constant,fits.log,fits.power,fits.power_plus_c];
			if (fits.fit_strings.indexOf(gs.fits)>-1){
				//if time axis, normalise befor fit.
				var fit;
				var string1;
				var string2;
				var string3;
				if (gs.x_scale_mode ==='time'){
					var normed = fits.pre_fit_normalizing(this.data[i][0]);
					
					fit = fits.fit_funs[fits.fit_strings.indexOf(gs.fits)]( normed.x ,this.data[i][1]);
					string1=fit.strings[0] + "  "+normed.s;
				} else {
					fit = fits.fit_funs[fits.fit_strings.indexOf(gs.fits)](this.data[i][0],this.data[i][1]);
					string1=fit.strings[0];
				}
				
				string2=fit.strings[1];
				string3=fit.strings[2];
				
				//draw the line
				if (gs.extrapolate){
					var fit_start =0;
					var fit_end = canvas.width;
				} else {
					var fit_start = Math.max( 0, this.units_to_pixels(Math.min.apply(null, this.data[i][0]),'x') );
					var fit_end = Math.min( canvas.width, this.units_to_pixels(Math.max.apply(null, this.data[i][0]),'x') );
				}
				
				//make array of fit_x points to get y-points from
				var fit_x = [];
				for (var j=fit_start; j<fit_end;j+=5){
					fit_x.push(this.pixels_to_units(j,'x'));
				}
				
				//if noramalisation was used. 
				if (gs.x_scale_mode ==='time'){
					
					var fit_y = fit.fun( fits.post_fit_normalizing(fit_x,normed) ,fit.parameters);
				} else {
					var fit_y = fit.fun(fit_x,fit.parameters);
				}
				
				
				//save the fit data
				this.fit_data[i] = [];
				this.fit_data[i][0] = fit_x;
				this.fit_data[i][1] = fit_y;
				
				if (gs.color_fits){
				ctx.strokeStyle = this.colors[i];
				} else {
				ctx.strokeStyle = gs.color_fg;
				}
				this.fit_points_drawn = 0;
				this.drawSimpleLine(ctx,fit_x,fit_y);
			}
			if (!this.transparent){
				ctx.strokeStyle = gs.color_bg;
				ctx.lineWidth = axis_labels_font_size/3;
				ctx.strokeText(string1,x + (label.length+1)*.6*axis_labels_font_size, y);
				ctx.fillText(string1,x + (label.length+1)*.6*axis_labels_font_size, y);
				y+=dy;
				ctx.strokeText(string2,x, y);
				ctx.fillText(string2,x, y);
				y+=dy;
				ctx.strokeText(string3,x, y);
				ctx.fillText(string3,x, y);
				y+=dy;
			} else {
			ctx.fillText(string1,x + (label.length+1)*.6*axis_labels_font_size, y);
			y+=dy;
			ctx.fillText(string2,x, y);
			y+=dy;
			ctx.fillText(string3,x, y);
			y+=dy;
			}
			
		}
	} // end of series loop
	
	
	
	ctx.lineWidth = graph_line_thickness;
	ctx.textAlign="center"; 
	ctx.strokeStyle = gs.color_fg;
	//draw title and subtitle
	ctx.fillStyle = gs.color_fg; 
	ctx.font=title_font_size + 'px ' + font_name;//"24px Courier New";
	ctx.fillText(title,canvas.width/2,tick_len+title_spacing+title_font_size);
	ctx.font=axis_labels_font_size + 'px ' + font_name;//"24px Courier New";
	ctx.fillText(gs.subtitle,canvas.width/2,tick_len+title_spacing+axis_labels_font_size+title_font_size);
	ctx.fillText(gs.subtitle2,canvas.width/2,tick_len+title_spacing+2*axis_labels_font_size+title_font_size);
	
	if (gs.data_transforms.length > 0 && gs.showTransformTexts){
		
		ctx.font=axis_labels_font_size + 'px ' + font_name;//"24px Courier New";
		var label = '['+gs.data_transforms.join('|')+']';
		var labely = title_spacing+title_font_size+tick_len+axis_labels_font_size;
		if (gs.subtitle.length>0){labely += axis_labels_font_size;}
		if (gs.subtitle2.length>0){labely += axis_labels_font_size;}
		//top center
		ctx.fillText(label,canvas.width/2,labely);
		//bottom left
		//ctx.fillText(label,lable_spacing + tick_len, canvas.height - tick_len-lable_spacing-tick_labels_font_size);
	}
	
	ctx.beginPath();
	ctx.stroke();
	if (gs.i >= 1){
		ctx.strokeStyle = gs.color_fg;
		//white out the bg
		ctx.lineWidth = graph_line_thickness;
		ctx.fillStyle = gs.color_bg;
		ctx.rect(2*edge,2*edge,canvas.width - 4*edge,canvas.height - 4*edge);
		ctx.fill();
		ctx.stroke();
		//graph.pre_mouse_mode = gs.mouse_mode;
		//gs.mouse_mode = 'i';
		ctx.fillStyle = gs.color_fg;
		ctx.textAlign="left";
		var y = 3*edge;
		var dy = axis_labels_font_size*1.5;
		ctx.fillText('canvas width : ' + canvas.width,3*edge,y); y +=dy;
		ctx.fillText('canvas height : ' + canvas.height,3*edge,y);y +=dy;
		ctx.fillText('canvas ID : ' + this.canvas_name,3*edge,y);y +=dy;
		ctx.fillText('graph name : ' + this.graph_name,3*edge,y);y +=dy;
		ctx.fillText('No. series : ' + this.data.length + ' of ' + this.data_backup.length,3*edge,y);y +=dy;
		ctx.fillText('Points drawn : ' + this.points_drawn,3*edge,y);y +=dy;
		ctx.fillText('Drawn points for fits : ' + fit_points_drawn,3*edge,y);y +=dy;
		ctx.fillText('Touch : ' + is_touch_device(),3*edge,y);y +=dy;
		
		var end_time = new Date();
		graph.ui.draw_time = end_time.getTime() - start_time.getTime();
		ctx.fillText('Draw Time : ' + graph.ui.draw_time+'ms',3*edge,y);y +=dy;
		ctx.fillText('Copy Time : ' + graph.ui.copy_time+'ms',3*edge,y);y +=dy;
		ctx.textAlign="right"; 
		var label = "MJS"+"2015"; 
		ctx.fillText(label,canvas.width-tick_len-2*edge,canvas.height - axis_labels_font_size-2*edge);
		var label = 'version: ' + MJS_PLOT_VERSION;
		ctx.fillText(label,canvas.width-tick_len-2*edge,canvas.height - axis_labels_font_size*2.5-2*edge);
		var label = 'web:' + MJS_PLOT_WEBSITE;
		ctx.fillText(label,canvas.width-tick_len-2*edge,canvas.height - axis_labels_font_size*3.5-2*edge);
	}
	this.points_drawn =0;
	
	//print any errors to the screen
	//graph.errors = ['some error']
	if (this.errors.length >0){
		ctx.font=axis_labels_font_size + 'px ' + font_name;//"24px Courier New";
		//make the text red
		var oldfill = ctx.fillStyle;
		ctx.fillStyle = "#FF0000";
		ctx.textAlign="center"; 
		for (var i = 0;i<this.errors.length;i++){
			var s = "error > " + this.errors[i];
			var x = canvas.width/2;
			var y = 2*tick_len+title_spacing+axis_labels_font_size+canvas.height/2 - axis_labels_font_size*this.errors.length/2 + axis_labels_font_size*i;
			ctx.fillText(s,x,y);
		}
		// return the fill colour
		ctx.fillStyle = oldfill;
	}
	
	//clear the error list.
	this.errors = [];
	ctx.textAlign="left"; 
	//flush the drawing code
	ctx.beginPath();
	ctx.stroke();
	
	//draw box around the graph
	ctx.beginPath();
	ctx.rect(graph_line_thickness/2,
					graph_line_thickness/2,
					canvas.width-graph_line_thickness,
					canvas.height-graph_line_thickness);
	ctx.lineWidth = graph_line_thickness;
	ctx.strokeStyle = gs.color_fg;
	ctx.stroke();
	
	gs.modified = true;
	//cookie stuff
	save_gs(this.graph_name, gs);
	if (!this.isSVG){
	this.graph_image = ctx.getImageData(0,0,canvas.width,canvas.height);
	}
	this.plot_failed = false;
	for (var i =0;i<this.onPlotFunctions.length;i++){
		this.onPlotFunctions[i]();
	}
	
},//end of plot function
	units_to_pixels : function (number,axis){//converts a number to its position in pixels
	
		if (axis === 'x'){
			if (this.graphics_style.x_scale_mode ==='lin' || this.graphics_style.x_scale_mode ==='time'){
				return (number-this.graphics_style.x_auto_min)*this.canvas.width/(this.graphics_style.x_auto_max - this.graphics_style.x_auto_min);
			}
			if (this.graphics_style.x_scale_mode ==='log'){
				return (Math.log10(number)-this.graphics_style.x_auto_min)*this.canvas.width/(this.graphics_style.x_auto_max - this.graphics_style.x_auto_min) || 0.0;
			}
		}
		if (axis === 'y'){
			if (this.graphics_style.y_scale_mode ==='lin'  || this.graphics_style.y_scale_mode ==='time'){
				return this.canvas.height - (number-this.graphics_style.y_auto_min)*this.canvas.height/(this.graphics_style.y_auto_max - this.graphics_style.y_auto_min);
			}
			if (this.graphics_style.y_scale_mode ==='log'){
				return this.canvas.height - (Math.log10(number)-this.graphics_style.y_auto_min)*this.canvas.height/(this.graphics_style.y_auto_max - this.graphics_style.y_auto_min) || canvas.height;
			}
		}
		
	},
	pixels_to_units : function (pixels,axis){ // convertis pixels over the graph to the corrisponding value on the graph
			if (axis === 'x'){
				if (this.graphics_style.x_scale_mode ==='lin' || this.graphics_style.x_scale_mode ==='time'){
					return  pixels / this.canvas.width * (this.graphics_style.x_auto_max - this.graphics_style.x_auto_min )+this.graphics_style.x_auto_min;
				}
				if (this.graphics_style.x_scale_mode ==='log'){
					return Math.pow(10,pixels / this.canvas.width * (this.graphics_style.x_auto_max - this.graphics_style.x_auto_min )+this.graphics_style.x_auto_min);
				}
			}
			if (axis === 'y'){
				if (this.graphics_style.y_scale_mode ==='lin' || this.graphics_style.y_scale_mode ==='time'){
					return (this.graphics_style.y_auto_max - this.graphics_style.y_auto_min) * (this.canvas.height-pixels) / this.canvas.height + this.graphics_style.y_auto_min;
				}
				if (this.graphics_style.y_scale_mode ==='log'){
					return Math.pow(10,(this.canvas.height-pixels)  / this.canvas.height * (this.graphics_style.y_auto_max - this.graphics_style.y_auto_min )+this.graphics_style.y_auto_min);
				}
				
			}
		},
	get_axis_string : function (n, axis){
		if (axis == 'x'){
			if (this.graphics_style.x_scale_mode ==='lin' || this.graphics_style.x_scale_mode ==='log'){
				return mjs_precision(n,this.graphics_style.x_precision+1);
			}
			if (this.graphics_style.x_scale_mode ==='time'){
				return mjs_date_print(n,0,this.graphics_style.x_precision+1);
			}
		}
		if (axis == 'y'){
			if (this.graphics_style.y_scale_mode ==='lin' || this.graphics_style.y_scale_mode ==='log'){
				return mjs_precision(n,this.graphics_style.y_precision+1);
			}
			if (this.graphics_style.y_scale_mode ==='time'){
				return mjs_date_print(n,0,this.graphics_style.y_precision+1);
			}
		}
	
	},
	make_full_screen : function (graph){
		
		var doc = window.document;
		full_screen_graph = graph;
		var docEl = full_screen_graph.canvas;
		full_screen_graph.orignal_canvas_width = full_screen_graph.canvas.width;
		full_screen_graph.orignal_canvas_height = full_screen_graph.canvas.height;

		var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
		if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);
			
			full_screen_graph.isFullscreen = true;
			full_screen_graph.canvas.width = window.innerWidth;
			full_screen_graph.canvas.height = window.innerHeight;
			document.addEventListener("fullscreenchange", full_screen_graph.full_screen_handler);
			document.addEventListener("webkitfullscreenchange",  full_screen_graph.full_screen_handler);
			document.addEventListener("mozfullscreenchange",  full_screen_graph.full_screen_handler);
			document.addEventListener("MSFullscreenChange",  full_screen_graph.full_screen_handler);
			
			// was window
			window.addEventListener('resize', full_screen_graph.keep_full_screen, true);
			
		} else {
			full_screen_graph.errors.push("can't go fullscreen");
			full_screen_graph.isFullscreen = false;
		}
		
	},
	full_screen_handler : function(){
		if (
			document.fullscreenElement ||
			document.webkitFullscreenElement ||
			document.mozFullScreenElement ||
			document.msFullscreenElement
		) {
		//console.log('handler going fullscreen');
		} else {
		full_screen_graph.exit_full_screen();
		}
	},
	exit_full_screen : function(){
		//fired when fullscreen is changed. do nothing when going to full screen but
		//on the way back return the canvas size to what it was
		// and detach the keep_full_screen handler.
		full_screen_graph.isFullscreen = false;
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
		window.removeEventListener('resize', full_screen_graph.keep_full_screen, true);
		full_screen_graph.canvas.width = full_screen_graph.orignal_canvas_width;
		full_screen_graph.canvas.height = full_screen_graph.orignal_canvas_height;
		
		full_screen_graph.mjs_plot();

	},
	keep_full_screen : function (){
		full_screen_graph.canvas.width = window.innerWidth;
		full_screen_graph.canvas.height = window.innerHeight;
		full_screen_graph.mjs_plot();
},

};//end of graph object
	graph.canvas = canvas;
	make_interactive(graph);
	return graph;
}//end of new_graph()

,
get_graph_style : function (){
	// set 'drag' to default mode on mobile, 'zoom' on desktops.
	if (is_touch_device()){
		var mouse_mode = 'drag'
	} else {
		var mouse_mode = 'zoom'
	}
	return  {
	 graph_line_thickness : 1, // for the graph generally.
	 symbol_size : 5,
	 line_thickness: 2, // for plotted lines
	 tick_len : 7,
	 mode : 'dot line', //'circles', 'dot', or 'line'
	 symbol_mode : 'dot', // dot block circle croxx
	 line_mode : 'line', // line approx interp zig zag mid hist
	 font_name : "serif",
	 title_font_size : 20,// in px (24)
	 title : "Title",
	 subtitle : "",
	 subtitle2 : "",
	 title_spacing : 2, // extra space from the top, in px.
	 tick_labels_font_size : 10,//10
	 tick_lables_font_padding : 2, // px extra space up from the ticks
	 axis_labels_font_size: 10,//12
	 lable_spacing : 8,//pixels away from the tick lables
	 x_axis_title : 'x axis (units)',
	 y_axis_title : 'y axis (units)',
	 minor_tick_len : 5,
	 guideWidthx : 35, //pixels accross
	 guideWidthy : 30, //pixels a across
	 scaling_factor : 1,//scales up everything together...
	 mouse_mode : mouse_mode, //changes the function of the mouse. between 'zoom' and 'drag' and 'measure'
	 fits : 'none', //what fitting is applied
	 extrapolate : false, //if the fit should extrapolate beyond the data
	 color_fits : false, //if the fit lines should be black or with the color of the series
	 x_scale_auto_max : true,
	 x_scale_auto_min : true,
	 y_scale_auto_max : true,
	 y_scale_auto_min : true,
	 x_manual_min : 0.0,
	 x_manual_max : 1.0,
	 y_manual_min : 0.0,
	 y_manual_max : 1.0,
	 x_scale_mode : 'lin', //linear or log
	 y_scale_mode : 'lin',
	 x_scale_tight : false, //data goes right to the edges. 
	 y_scale_tight : false, // otherwise there will be a nice 1 section space on all sides.
	 show_captions : true,
	 showTransformTexts : true, //show the stack of transforms and modify the axis titles.
	 captions_display : "none",//xmin xmax ymin ymax yfirst ylast xfirst xlast or non
	 color_fg : '#111111', //foreground color
	 color_bg : '#eeeeee', //background color
	 color_mg : '#555555', //midground color, for the grid.
	 show_grid: false,
	 v : MJS_PLOT_VERSION, //version of mjsplot
	 caption_colors : false, // generate colors from the captions
	 hidden_lines : [], // array of booleans if each line should be hidden.
	 data_transforms : [], //a list of the transform functions
	 data_transforms_args : [], // the arguments for each transform
	 i : 0, //state of the infomation button
	 o : 0, //state of the options button
	 modified : false,  //changes to true as soon as the user does anything to customise the style
	 x_precision :2, //the number of sf to use when printing numbers on the x axis
	 y_precision :2, //as above for y
	 fit_text_position:{x:0.1,y:0.2}, //fraction accross and fraction down.
	 caption_position:{x:-10,y:10}, //raw pixels down and accross (is then scaled by scaling_factor)
	 function_lines :[] // userdefined lines that are drawn over the graph. each item in the array is a string of the function
	 }
}
,
	
convert_time_strings : function (array_of_strings){
	//converts an array of time strings to milliseconds from epoc
	//example time strings:
	/*
	ISO-8601 and other strings (browser dependent)
	March 2 2015
	March 2 2015 12:45
	2014/11/02 12:54
	12:53 2014/11/02
	2014
	2/3/2014 ( MM/DD/YYYY)
	Mon, 25 Dec 1995 13:30:00 GMT
	2011-11-12
	
	This does not include
	dd/mm/yyyy hh:mm:ss
	or
	yyy-mm-dd hh:mm:ss
	
	as that is some crazy non-standard old time brittish thing and you will end up with a mess. 
	
	*/
	var r = [];
	for (var i = 0 ; i < array_of_strings.length;i++){
		r.push( Date.parse( array_of_strings[i] ) );
	}
	return r;
}

};



return mjs_plot;

}());