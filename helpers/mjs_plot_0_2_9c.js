/* **********************************************
                    mjs_plot

  CC MATTHEW SARSBY, 2014,Some Rights Reserved.
  
You are free to use, copy, and modify this
software in non-profit applications.
Modifications must keep this header, and a file
name in the format mjs_plot_*.js
 
mjs_plot is distributed with hope it will be useful
but WITHOUT ANY WARRANTY.

TODO:
add more functions:
 - time x axis (big project!) (3.0 target)
 + annotations system (also big!)
	- arrows
	- lines
	- text
	- annotation storage inside graphics_style
	- annotation selector, move, edit.
 - kernals graph
 - improve the interpolation algorythem
 - improve the fits printing
 - add fitting errors
 - improve the smooth function
 - improve the infobutton mouse mode handling
 - add extra caption mode for viewing last value or first false
 - document the captions modes better
 + extend graph.data type to include x and y error options
	- data = list of [x,y,y_errors]  and/or [x,y,x_errors,y_errors]
	- check the length of each series during the draw points phase
	+ include x,y,x_error_low,x_error_high,y_error_low,y_error_high
		- then expand all the function to correctally manage the propogation of errors. :/
 - add the lower law regression ax^b
 - add the logarithmic regression a+blnx
 - add the a+bx^c regression
 - add the gaussian fit. 
 - add function remove_outliers
 - add function subtract_fit
 - export menu, see data_out() for more details
 - add support for a series to use left or right axies top/bottom too
	- put arrows in the lines menu to show what axis that line is on
	- expand units_to_pixels and pixles_to_units to include which one (left/right, top/bottom)
 - add axies menu
	- which axis is active (left, right, both; top, bottom, both)
	- put log-lin mode changes here
	- put changable time modes here
- expand line menu to have per-line pickable line modes. 
- have functions work an any series, individually. not shore how this will work. 
	
 Hold ups:
  -  None. 
 
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
	   
	   
	   
	   
*********************************************** */

MJS_PLOT_VERSION = '2_2_9';
MJS_PLOT_AUTOR = 'MJS';
MJS_PLOT_DATE = '2014';


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

var mouse_down = false;
start_x = 0;
end_x = 0;

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


function bake_cookie(name, value) {
  var cookie = name + '=' + JSON.stringify(value);
  document.cookie = cookie;
}

function read_cookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));

 return result;
}

function save_gs(name, gs){
	//bake_cookie(name, gs);
	c = {g : name};
	//all the numbers
	c.n = [gs.graph_line_thickness, gs.circle_size, gs.dot_size, gs.line_thickness, gs.tick_len, gs.title_font_size, gs.title_spacing,gs.tick_labels_font_size, gs.tick_lables_font_padding, gs.axis_labels_font_size, gs.lable_spacing, gs.minor_tick_len, gs.guideWidthx, gs.guideWidthy, gs.scaling_factor, gs.x_manual_min, gs.x_manual_max, gs.y_manual_min, gs.y_manual_max, gs.show_captions,gs.i,gs.o,gs.x_precision,gs.y_precision];
	//all the strings
	c.s = [gs.mode,gs.font_name,gs.title,gs.subtitle,gs.x_axis_title,gs.y_axis_title,gs.mouse_mode,gs.fits,gs.x_scale_mode,gs.y_scale_mode,gs.color_fg,gs.color_bg,gs.v];
	//all the booleans
	c.b=[gs.x_scale_auto_max,gs.x_scale_auto_min,gs.y_scale_auto_max,gs.y_scale_auto_min,gs.x_scale_tight,gs.y_scale_tight,false,gs.caption_colors,gs.modified];
	//the arrays
    c.hl = gs.hidden_lines;
	c.dt = gs.data_transforms;
	c.dta = gs.data_transforms_args;
	if (hasLocalStorage()){
		console.log("saving to  local storage");
		var string = JSON.stringify(c);
		localStorage.setItem(name, string);
	} else {
		console.log("saving to  cookie storage");
		bake_cookie(name, c);
	}
}

function load_gs(graphname){
	gs  = get_graph_style();
	c = false;
	if (hasLocalStorage()){
		console.log("reading from  local storage");
		result = localStorage.getItem(graphname);
		result && (result = JSON.parse(result));
		result && (c = result);
	} else {
		console.log("reading from  cookie storage");
		read_cookie(graphname) && (c = read_cookie(graphname));
	}
	if (c){
	c.name;
	gs.graph_line_thickness = c.n[0];
	 gs.circle_size = c.n[1];
	 gs.dot_size= c.n[2];
	 gs.line_thickness= c.n[3];
	 gs.tick_len= c.n[4];
	 gs.mode = c.s[0];
	 gs.font_name = c.s[1];
	 gs.title_font_size = c.n[5];
	 gs.title = c.s[2];
	 gs.subtitle  = c.s[3];
	 gs.title_spacing = c.n[6];
	 gs.tick_labels_font_size = c.n[7];
	 gs.tick_lables_font_padding = c.n[8];
	 gs.axis_labels_font_size= c.n[9];
	 gs.lable_spacing = c.n[10];
	 gs.x_axis_title  = c.s[4];
	 gs.y_axis_title = c.s[5];
	 gs.minor_tick_len = c.n[11];
	 gs.guideWidthx = c.n[12];
	 gs.guideWidthy = c.n[13];
	 gs.scaling_factor= c.n[14];
	 gs.mouse_mode  = c.s[6];
	 gs.fits = c.s[7];
	 gs.x_scale_auto_max  = c.b[0];
	 gs.x_scale_auto_min  = c.b[1];
	 gs.y_scale_auto_max = c.b[2];
	 gs.y_scale_auto_min  = c.b[3];
	 gs.x_manual_min = c.n[15];
	 gs.x_manual_max = c.n[16];
	 gs.y_manual_min = c.n[17];
	 gs.y_manual_max = c.n[18];
	 gs.x_scale_mode  = c.s[8];
	 gs.y_scale_mode   = c.s[9];
	 gs.x_scale_tight = c.b[4];
	 gs.y_scale_tight = c.b[5];
	 gs.show_captions = c.n[19];
	 gs.color_fg  = c.s[10];
	 gs.color_bg  = c.s[11];
	 gs.v = c.s[12];
	 gs.caption_colors =c.b[7];
	 gs.hidden_lines=c.hl;
	 gs.data_transforms =c.dt;
	 gs.data_transforms_args =  c.dta;
	 gs.i= c.n[20];
	 gs.o= c.n[21];
	 gs.modified = c.b[8];
	 gs.x_precision = c.n[22];
	 gs.y_precision = c.n[23];
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





function polynomial_fit(data, order) {
	var lhs = [], rhs = [], a = 0, b = 0, i = 0, k = order + 1;
	for (var i = 0; i < k; i++) {
		for (var l = 0, len = data[0].length; l < len; l++) {
			a += Math.pow(data[0][l], i) * data[1][l];
		}
		lhs.push(a);
		a = 0;
		var c = [];
		for (var j = 0; j < k; j++) {
			for (var l = 0, len = data[0].length; l < len; l++) {
				b += Math.pow(data[0][l], i + j);
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
    for (var i = 0; i < data[0].length; i++) {
		fit[i] = 0;
		for (var w = 0; w < coeffs.length; w++) {
			fit[i] += coeffs[w] * Math.pow(data[0][i], w);
		}
     }
	data[0]
	var sum_x = 0;
	var sum_y = 0;
	var sum_xx = 0;
	//var sum_xy = 0;
	var sum_yy = 0;
	var sum_ff = 0;
	for (var i = 0;i<data[0].length;i++){
		sum_x += data[0][i];
		sum_xx += data[0][i]*data[0][i];
		sum_y += data[1][i];
		//sum_xy +=data[0][i]*data[1][i][i];
		sum_yy +=data[1][i]*data[1][i];
	}
	var y_mean = sum_y/data[0].length;
	var ss_reg = 0;
	var ss_res = 0;
	for (var i = 0;i<data[0].length;i++){
		ss_reg += (fit[i] - y_mean)*(fit[i] - y_mean);
		ss_res += (fit[i] - data[1][i])*(fit[i] - data[1][i]);
	}
	
	var n = data[0].length;
	var ss_tot = sum_yy - sum_y*sum_y/n;
	var ss_reg = sum_ff;
	var r_squared = 1-ss_res/ss_tot;
	//sum_xy -= sum_x*sum_y/n;
	sum_xx -= sum_x*sum_x/n;
	sum_yy -= sum_y*sum_y/n;
	var sigma_x = Math.sqrt(sum_xx / n);
	var sigma_y = Math.sqrt(sum_yy / n);
	var errors = [];
	console.log(sigma_x);
	console.log(sigma_y);
	for (var w = 0; w < coeffs.length; w++) {
			errors[w] = coeffs[w] * sigma_x/sigma_y;
	}
	var pm = String.fromCharCode( 177 ); //the plus minus sign
    var string = 'y = ';
	//TODO fix this. it sucks. 
	/*
	for(var i = coeffs.length-1; i >= 0; i--){
	  if(i > 1) string += number_quote(coeffs[i],errors[i])+ pm + mjs_precision(errors[i],2) + 'x^' + i + ' + ';
	  else if (i == 1) string += number_quote(coeffs[i],errors[i])+ pm + mjs_precision(errors[i],2) + 'x' + ' + ';
	  else string += number_quote(coeffs[i],errors[i])+ pm + mjs_precision(errors[i],2);
	}
	*/
	for(var i = coeffs.length-1; i >= 0; i--){
	  if(i > 1) string += mjs_precision(coeffs[i],5)+ 'x^' + i + ' + ';
	  else if (i == 1) string += mjs_precision(coeffs[i],5) + 'x' + ' + ';
	  else string += mjs_precision(coeffs[i],5);
	}
	//return coeffs;
	return {coeffs: coeffs,errors:errors, fit: fit, string: string,r_squared:r_squared};
};

  function exponential_fit(x,y) {
  //y = a*exp(bx)
  //x[i] = data[i][0]
  //y[i] = data[i][1]
                var sum = [0, 0, 0, 0, 0, 0],  results = [];
				var len = x.length;
                for (var n=0; n < len; n++) {
                  
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

                for (var i = 0; i < len; i++) {
                    var coordinate = A * Math.pow(Math.E, B * x[i]);
                    results.push(coordinate);
                }

                var string = 'y = ' +mjs_precision(A,5)  + 'e^(' + mjs_precision(B,5) + 'x)';

                return {equation: [A, B], points: results, string: string};
            };

			
			
function exponential_fit_plus_c(x,y){
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
	//y = a + b exp(c*x);
	results = [];
	for (var i = 0; i < len; i++) {
		var coordinate =  a + b_2*Math.exp(B_1*x[i]);
		results.push(coordinate);
	}

	var string = 'y = ' + mjs_precision(a,5) + '+'+mjs_precision(b_2,5)+'e^(' + mjs_precision(B_1,5)+ 'x)';

	return {equation: [a, b_2,B_1], points: results, string: string};
	

}


function mjs_precision(number,precision){
	precision = Math.max(1,precision);
	if (precision<1){precision =1;}
	if (precision>21){precision =21;}
	if (Math.abs(number) < 1e-13){
		number = 0;
		return number.toFixed(precision);
	}
	if (Math.abs(number) < 1e-3){
		return label = number.toExponential(precision); 
	}
	label = number.toPrecision(precision);
	//this bit of mess fixes the strings that say 3.1e+2 rather than 310.
	//as '3.1e+2' is longer (6) than '310' (3).
	if (label.length > number.toPrecision(precision+2).length){
		label = number.toPrecision(precision+2);
	}
	if (label.length > number.toPrecision(precision+1).length){
		label = number.toPrecision(precision+1);
	}
	return label
}

function number_quote(number,error){
	//returns a string which would be correct to quote to the given error.
	// assuming that error is given to 2 sig fig.
	return mjs_precision(number, Math.max(2,Math.floor(Math.log10(Math.abs(number))) -   Math.floor(Math.log10(Math.abs(error))) + 2) );
}


function drawEllipse(ctx, centerX, centerY, radiusX, radiusY) {
	ctx.beginPath();
	
	rotationAngle = 0.5;
	
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
	
	canvas = graph.canvas;
	ctx = canvas.getContext('2d');
	ctx.putImageData(graph.graph_image,0,0);
	ctx.stroke();
	rect = canvas.getBoundingClientRect();
	x = event.clientX - rect.left;
	y = event.clientY - rect.top;
	
	var edge = 	Math.min(graph.graphics_style.tick_len*2.6 * graph.graphics_style.scaling_factor,Math.min(graph.canvas.width / 22, graph.canvas.height/15))
	graph.ui.size = edge;
	if (mouse_down == false){
		px = graph.pixels_to_units(x,'x');
		py = graph.pixels_to_units(y,'y');
		cs = graph.graphics_style.circle_size * graph.graphics_style.scaling_factor;
		//not at the very edges draw interactive stuff
		ctx.fillStyle = graph.graphics_style.color_fg;
 		ctx.strokeStyle = graph.graphics_style.color_fg; 
		if (x>edge && y>edge && canvas.height-y > edge && canvas.width-x > edge ){
			
			if (graph.graphics_style.mouse_mode === 'zoom'){
				ctx.beginPath();
				
				ctx.arc(x, y, cs , 0 ,Math.PI*2, true);
				ctx.stroke();
				
				label = mjs_precision(px,graph.graphics_style.x_precision+1);
				ctx.fillText(label,x+cs,y+cs*6);
				
				label = mjs_precision(py,graph.graphics_style.y_precision+1);
				ctx.fillText(label,x-cs*6 - .6*graph.graphics_style.axis_labels_font_size*label.length,y-cs*2);
				
				ctx.beginPath();
				ctx.moveTo(x,y+cs);
				ctx.lineTo(x,canvas.height );
				ctx.moveTo(x,y-cs);
				ctx.lineTo(x,0);
				ctx.moveTo(x-cs,y);
				ctx.lineTo(0,y);
				ctx.moveTo(x+cs,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
				ctx.beginPath();
				ctx.stroke();
			}
			if (graph.graphics_style.mouse_mode === 'trim'){
				ctx.fillText('trim',x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x,canvas.height);
				ctx.moveTo(0,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
			}
			if (graph.graphics_style.mouse_mode === 'cut'){
				ctx.fillText('cut',x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x,canvas.height);
				ctx.moveTo(0,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
			}
			if (graph.graphics_style.mouse_mode === 'x-c'){
				label = mjs_precision(px,graph.graphics_style.y_precision+1);
				ctx.fillText('x-'+label,x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(x,0);
				ctx.lineTo(x,canvas.height);
				ctx.stroke();
			}
			if (graph.graphics_style.mouse_mode === 'y-c'){
				label = mjs_precision(py,graph.graphics_style.y_precision+1);
				ctx.fillText('y-'+label,x+cs*2,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(0,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.stroke();
			
			if (graph.graphics_style.mouse_mode === 'measure'){
				//measure mode
				label = mjs_precision(px,graph.graphics_style.x_precision+1);
				ctx.fillText(label,x+cs,canvas.height-2*edge);
				label = mjs_precision(py,graph.graphics_style.y_precision+1);
				ctx.fillText(label,2*edge,y-cs*2);
				ctx.beginPath();
				ctx.moveTo(x,y+edge*2);
				ctx.lineTo(x,canvas.height );
				ctx.moveTo(x,y-edge*2);
				ctx.lineTo(x,0);
				ctx.moveTo(x-edge*2,y);
				ctx.lineTo(0,y);
				ctx.moveTo(x+edge*2,y);
				ctx.lineTo(canvas.width,y);
				ctx.stroke();
				ctx.beginPath();
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(x-cs,y-cs);
				ctx.lineTo(x+cs,y+cs);
				ctx.moveTo(x-cs,y+cs);
				ctx.lineTo(x+cs,y-cs);
				
				ctx.stroke();
				ctx.beginPath();
				ctx.stroke();
			}
			if (graph.graphics_style.mouse_mode === 'drag'){
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
			if (graph.graphics_style.mouse_mode === 'reader'){
				var pi = graph.reader_index[0];
				var pj = graph.reader_index[1];
				var xi = graph.units_to_pixels(graph.data[pi][0][pj],'x');
				var yi = graph.units_to_pixels(graph.data[pi][1][pj],'y');
				label = 'x='+mjs_precision(graph.data[pi][0][pj],graph.graphics_style.x_precision+5);
				//label = 'x='+graph.data[pi][0][pj];
				ctx.fillText(label,x+2*cs,y+graph.graphics_style.axis_labels_font_size*1.6);
				
				label = 'y='+mjs_precision(graph.data[pi][1][pj],graph.graphics_style.y_precision+5);
				//label = 'y='+graph.data[pi][1][pj];
				ctx.fillText(label,x+2*cs,y);
				
				label = graph.captions[pi];
				//label = 'y='+graph.data[pi][1][pj];
				ctx.fillText(label,x+2*cs,y-graph.graphics_style.axis_labels_font_size*1.6);
				label = 'i='+pj;//the index of the data point in the series.
								//called j internally, as i if for which series. 
				//label = 'y='+graph.data[pi][1][pj];
				ctx.fillText(label,x+2*cs,y+graph.graphics_style.axis_labels_font_size*1.6*2);
				
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
			
			ctx.fillStyle = graph.graphics_style.color_bg;
			
			//dots button
			ctx.rect(0,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillRect(edge*0.5,edge*0.5,graph.graphics_style.dot_size,graph.graphics_style.dot_size);
			dot_size = graph.graphics_style.dot_size * graph.graphics_style.scaling_factor;
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.fillRect(edge*0.5-dot_size/2,edge*0.5-dot_size/2,dot_size,dot_size);
			ctx.fillStyle = graph.graphics_style.color_bg;
			//circ button
			ctx.rect(edge,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(edge*0.5+edge, edge*0.5, edge*0.3 , 0 ,Math.PI*2, true);
			ctx.stroke();
			//line button
			ctx.rect(edge*2,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*2,edge*0.5);
			ctx.lineTo(edge*3,edge*0.5);
			ctx.stroke();
			//linecirc button
			ctx.rect(edge*3,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*3,edge*0.5);
			ctx.lineTo(edge*4,edge*0.5);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(edge*3.5, edge*0.5, edge*0.3 , 0 ,Math.PI*2, true);
			ctx.stroke();
			//linedot button
			ctx.rect(edge*4,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*4,edge*0.5);
			ctx.lineTo(edge*5,edge*0.5);
			ctx.stroke();
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.fillRect(edge*4.5-dot_size/2,edge*0.5-dot_size/2,dot_size,dot_size);
			ctx.fillStyle = graph.graphics_style.color_bg;
			//scailing factor up button
			ctx.rect(edge*6,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*6.2,edge*0.5);
			ctx.lineTo(edge*6.8,edge*0.5);
			ctx.stroke();
			
			//scailing factor down button
			ctx.rect(edge*7,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*7.2,edge*0.5);
			ctx.lineTo(edge*7.8,edge*0.5);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(edge*7.5,edge*0.2);
			ctx.lineTo(edge*7.5,edge*0.8);
			ctx.stroke();

			
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
			
			//show/hide captions button
			ctx.fillStyle = graph.graphics_style.color_bg;
			ctx.rect(canvas.width-edge,0,edge,edge);
			ctx.rect(canvas.width-edge*2,0,edge,edge);
			ctx.rect(canvas.width-edge*3,0,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.font = (0.7*edge) + 'px ' + graph.graphics_style.font_name;//"24px Courier New";
			ctx.fillText('c',canvas.width-0.7*edge, edge*0.7);
			
			// infomation button
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.fillText('i',canvas.width-1.7*edge, edge*0.7);
			
			//the ... button. opens the options pane. like the info pane. 
			ctx.beginPath();
			ctx.arc(canvas.width-2.2*edge, edge*0.7, edge*0.07 , 0 ,Math.PI*2, true);
			ctx.arc(canvas.width-2.5*edge, edge*0.7, edge*0.07 , 0 ,Math.PI*2, true);
			ctx.arc(canvas.width-2.8*edge, edge*0.7, edge*0.07 , 0 ,Math.PI*2, true);
			ctx.fill();
			
			ctx.fillStyle = graph.graphics_style.color_fg;
			//flush the drawing code
			ctx.beginPath();
			ctx.stroke();
		}
		//draw bottom buttons
		if (y>canvas.height-edge){
			ctx.fillStyle = graph.graphics_style.color_bg;
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
			
			ctx.fillStyle = graph.graphics_style.color_fg;
			
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
			
			
			
			if (graph.graphics_style.x_scale_auto_max == false){
			//draw line at end of arrows
				ctx.moveTo(3.8*edge,canvas.height-0.8*edge);
				ctx.lineTo(3.8*edge,canvas.height-0.2*edge);
			}
			if (graph.graphics_style.x_scale_auto_min == false){
			//draw line at end of arrows
				ctx.moveTo(2.2*edge,canvas.height-0.8*edge);
				ctx.lineTo(2.2*edge,canvas.height-0.2*edge);
			}
			if (graph.graphics_style.y_scale_auto_max == false){
			//draw line at end of arrows
				ctx.moveTo(1.2*edge,canvas.height-0.8*edge);
				ctx.lineTo(1.8*edge,canvas.height-0.8*edge);
			}
			if (graph.graphics_style.y_scale_auto_min == false){
			//draw line at end of arrows
				ctx.moveTo(0.2*edge,canvas.height-0.2*edge);
				ctx.lineTo(0.8*edge,canvas.height-0.2*edge);
			}
			ctx.stroke();
			
			//lin log buttons
			ctx.fillStyle = graph.graphics_style.color_bg;
			ctx.rect(5*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.rect(6*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			
			if (graph.graphics_style.y_scale_mode == 'log'){
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
			if (graph.graphics_style.x_scale_mode === 'log'){
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
			
			//f() button
			ctx.fillStyle = graph.graphics_style.color_bg;
			ctx.rect(8*edge,canvas.height-edge,edge*3,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.font= (0.7*edge) + 'px ' + graph.graphics_style.font_name;//"24px Courier New";
			ctx.fillText('f()',8.2*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			//line menu button
			ctx.fillStyle = graph.graphics_style.color_bg;
			ctx.rect(11*edge,canvas.height-edge,edge*4,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.fillText('lines',11.2*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			//fits menu button
			ctx.fillStyle = graph.graphics_style.color_bg;
			ctx.rect(15*edge,canvas.height-edge,edge*4,edge);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.fillText('fits',15.2*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			//draw data out button
			ctx.fillStyle = graph.graphics_style.color_bg;
			ctx.rect(canvas.width-edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.fillText('e',canvas.width-0.7*edge, canvas.height - edge*0.3);
			ctx.stroke();
			
			
			//draw day/nightmode button
			ctx.fillStyle = graph.graphics_style.color_fg;
			ctx.beginPath();
			ctx.rect(canvas.width-2*edge,canvas.height-edge,edge,edge);
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.fillStyle = graph.graphics_style.color_bg;
			ctx.moveTo(canvas.width-2*edge,canvas.height);
			ctx.lineTo(canvas.width-edge-1,canvas.height-edge+1);
			ctx.lineTo(canvas.width-edge-1,canvas.height);
			ctx.closePath();
			ctx.fill();
			
			ctx.beginPath();
			ctx.fill();
			ctx.stroke();
		}
		
		if (graph.drawexportmenu){
			if (x > canvas.width - 8*edge && y > canvas.height-edge*7){
				ctx.font= (0.55*edge) + 'px ' + graph.graphics_style.font_name;//"24px Courier New";
				//box
				ctx.fillStyle = graph.graphics_style.color_bg;
				ctx.rect(canvas.width - 8*edge,canvas.height-edge*7,edge*8,edge*7);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = graph.graphics_style.color_fg;
				ctx.fillText('export',canvas.width - 7.8*edge, canvas.height - edge*0.1);
				ctx.fillText('data (csv)',canvas.width - 7.8*edge, canvas.height - edge*1.1);
				ctx.fillText('data (code)',canvas.width - 7.8*edge, canvas.height - edge*2.1);
				ctx.fillText('data (tabbed)',canvas.width - 7.8*edge, canvas.height - edge*3.1);
				ctx.fillText('png (hi res)',canvas.width - 7.8*edge, canvas.height - edge*4.1);
				ctx.fillText('png (low res)',canvas.width - 7.8*edge, canvas.height - edge*5.1);
				ctx.fillText('png (300dpi figure)',canvas.width - 7.8*edge, canvas.height - edge*6.1);
			} else {
				graph.drawexportmenu = false;
			}
		
		}
		
		//draw fx menue
		if (graph.drawfxmenu){
			
			if (x>8*edge && x<16*edge && y > canvas.height-edge*14){
				//f() button
				ctx.fillStyle = graph.graphics_style.color_bg;
				ctx.rect(8*edge,canvas.height-edge*14,edge*8,edge*14);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = graph.graphics_style.color_fg;
				ctx.font= (0.55*edge) + 'px ' + graph.graphics_style.font_name;//"24px Courier New";
				ctx.fillText('functions',8.2*edge, canvas.height - edge*0.3);
				ctx.stroke();
				
				//the lines seperating buttons
				ctx.beginPath();
				for (var i  = 1;i<14;i++){
					ctx.moveTo(edge*8,canvas.height - edge*i);
					ctx.lineTo(edge*16,canvas.height - edge*i);
				}
				ctx.moveTo(edge*12,canvas.height);
				ctx.lineTo(edge*12,canvas.height - edge*14);
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
				
				//ctx.fillText('sum',8.2*edge, canvas.height - edge*5.3);
				ctx.fillText('smooth',8.2*edge, canvas.height - edge*5.3);
				ctx.fillText('interpolate',8.2*edge, canvas.height - edge*6.3);
				ctx.fillText('-(mx+c)',8.2*edge, canvas.height - edge*7.3);
				ctx.fillText('dx/dy',8.2*edge, canvas.height - edge*8.3);
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
				//ctx.fillText('Kernals',12.2*edge, canvas.height - edge*6.3);
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
			
			} else {
				graph.drawfxmenu = false;
			}
		}
		
		//draw line menu buttons
		if (graph.drawlinemenu){
			//get number of lines
			var no_of_lines = graph.data_backup.length;
			//draw the menu
			if (x>11*edge && x<21*edge && y > canvas.height-edge*(no_of_lines+1)){
				ctx.font= (0.55*edge) + 'px ' + graph.graphics_style.font_name;//"24px Courier New";
				//box
				ctx.fillStyle = graph.graphics_style.color_bg;
				ctx.rect(11*edge,canvas.height-edge*(no_of_lines+1),edge*10,edge*(no_of_lines+1));
				ctx.fill();
				ctx.stroke();
				ctx.moveTo(edge*11,canvas.height - edge);
				ctx.lineTo(edge*21,canvas.height - edge);
				ctx.stroke();
				
				ctx.fillStyle = graph.graphics_style.color_fg;
				ctx.fillText('line menu',11.2*edge+0.2, canvas.height -edge*0.2);
				for (var i = no_of_lines-1;i+1>0;i--){
					var label = graph.captions_backup[i] ||  'label' ;
					ctx.fillStyle = graph.colors_backup[i];
					ctx.fillText(label,13.2*edge+0.2, canvas.height -no_of_lines*edge + edge*(i-0.2));
					//show or hide button
					if (graph.graphics_style.hidden_lines[i]){
						ctx.fillText('( )',11.2*edge+0.2, canvas.height - no_of_lines*edge + edge*(i-0.2));
					} else {
						ctx.fillText('(+)',11.2*edge+0.2, canvas.height - no_of_lines*edge + edge*(i-0.2));
					}
				}
				ctx.fillStyle = graph.graphics_style.color_fg;
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
			if (x>15*edge && x<21*edge && y > canvas.height-edge*8){
				//f() button
				ctx.fillStyle = graph.graphics_style.color_bg;
				ctx.rect(15*edge,canvas.height-edge*8,edge*6,edge*8);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = graph.graphics_style.color_fg;
				ctx.font= (0.55*edge) + 'px ' + graph.graphics_style.font_name;//"24px Courier New";
				ctx.fillText('fits',15.2*edge, canvas.height - edge*0.3);
				ctx.stroke();
				ctx.fillText('none',18.2*edge, canvas.height - edge*0.3);
				ctx.fillText('stats',18.2*edge, canvas.height - edge*1.3);
				ctx.fillText('ae^bx',18.2*edge, canvas.height - edge*2.3);
				//ctx.fillText('a+blnx',18.2*edge, canvas.height - edge*3.3);
				//ctx.fillText('ax^b',18.2*edge, canvas.height - edge*4.3);
				ctx.fillText('a+be^cx',18.2*edge, canvas.height - edge*5.3);
				ctx.fillText('linear',15.2*edge, canvas.height - edge*1.3);
				ctx.fillText('quad',15.2*edge, canvas.height - edge*2.3);
				ctx.fillText('cubic',15.2*edge, canvas.height - edge*3.3);
				ctx.fillText('poly 4',15.2*edge, canvas.height - edge*4.3);
				ctx.fillText('poly 5',15.2*edge, canvas.height - edge*5.3);
				ctx.fillText('poly 6',15.2*edge, canvas.height - edge*6.3);
				ctx.fillText('poly 7',15.2*edge, canvas.height - edge*7.3);
			
			} else {
				graph.drawfitsmenu = false;
			}
		}
	}
	ctx.beginPath();
	ctx.stroke();
	
	if (mouse_down && graph.graphics_style.mouse_mode === 'zoom'){
		//is dragging for zoom
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
	if (mouse_down && graph.graphics_style.mouse_mode === 'drag'){
		//is dragging
		oldpx = (drag_x_max - drag_x_min) * start_x / graph.canvas.width + drag_x_min;
			oldpy = (drag_y_max - drag_y_min) * (graph.canvas.height-start_y) / graph.canvas.height + drag_y_min;
			px = (drag_x_max - drag_x_min) * x / graph.canvas.width + drag_x_min;
			py = (drag_y_max - drag_y_min) * (graph.canvas.height-y) / graph.canvas.height + drag_y_min;
			dpx = (px-oldpx);
			dpy = (py-oldpy);		
		if (graph.graphics_style.x_scale_mode === 'lin'){
			graph.graphics_style.x_manual_min = drag_x_min - dpx ;
			graph.graphics_style.x_manual_max = drag_x_max - dpx;
		}
		if (graph.graphics_style.y_scale_mode === 'lin'){
			graph.graphics_style.y_manual_min = drag_y_min - dpy;
			graph.graphics_style.y_manual_max = drag_y_max - dpy ;
		}
		if (graph.graphics_style.x_scale_mode === 'log'){
			graph.graphics_style.x_manual_min = Math.pow(10,Math.log10(drag_x_min) - Math.log10(px/oldpx));
			graph.graphics_style.x_manual_max = Math.pow(10,Math.log10(drag_x_max) - Math.log10(px/oldpx));
		}
		if (graph.graphics_style.y_scale_mode === 'log' ){
			graph.graphics_style.y_manual_min = Math.pow(10,Math.log10(drag_y_min) - Math.log10(py/oldpy));
			graph.graphics_style.y_manual_max = Math.pow(10,Math.log10(drag_y_max) - Math.log10(py/oldpy));
		}
		graph.graphics_style.x_scale_auto_min = false;
		graph.graphics_style.y_scale_auto_min = false;
		graph.graphics_style.x_scale_auto_max = false;
		graph.graphics_style.y_scale_auto_max = false;
		graph.graphics_style.y_scale_tight = true;
		graph.graphics_style.x_scale_tight = true;

		graph.mjs_plot();
	}
	if (mouse_down && graph.graphics_style.mouse_mode === 'measure'){
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
	
		label = mjs_precision(px,graph.graphics_style.x_precision+1);
		ctx.fillText(label,x+cs,canvas.height-1.5*edge);
				
		label = mjs_precision(py,graph.graphics_style.y_precision+1);
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
	
		label = mjs_precision(px_start,graph.graphics_style.x_precision+1);
		ctx.fillText(label,start_x+cs,canvas.height-2*edge);
				
		label = mjs_precision(py_start,graph.graphics_style.y_precision+1);
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
			label = mjs_precision(px-px_start, graph.graphics_style.x_precision );
			ctx.fillText(label,(x+start_x)/2-.3*graph.graphics_style.scaling_factor*graph.graphics_style.axis_labels_font_size*label.length,x_meas-.4*graph.graphics_style.axis_labels_font_size);
			
		}
		
		//show dy infomation
		if (dy > edge/2 || dy < -edge/2){
			y_meas = Math.min(x,start_x)-edge;
			label = mjs_precision(py-py_start, graph.graphics_style.y_precision );
			label_pos = y_meas - .7*graph.graphics_style.axis_labels_font_size*graph.graphics_style.scaling_factor*label.length;
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
			grad = mjs_precision(grad, Math.min(graph.graphics_style.y_precision,graph.graphics_style.x_precision));
			ctx.fillText('g = ' + grad,x+cs,y-cs);
			//show tau if semi log y graph.
			if ( graph.graphics_style.y_scale_mode === 'log' && graph.graphics_style.x_scale_mode === 'lin'){
				var tau =  (Math.log10(py)-Math.log10(py_start)) / (px-px_start);
				tau = mjs_precision(tau, Math.min(graph.graphics_style.y_precision,graph.graphics_style.x_precision));
				ctx.fillText('tau =' + tau,x+cs,y+cs);
				
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
			if ( graph.graphics_style.y_scale_mode === 'log' && graph.graphics_style.x_scale_mode === 'log'){
				var powerlaw =  (Math.log10(py)-Math.log10(py_start)) / (Math.log10(px)-Math.log10(px_start));
				powerlaw = mjs_precision(powerlaw, Math.min(graph.graphics_style.y_precision,graph.graphics_style.x_precision));
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
	
	if (mouse_down && graph.graphics_style.mouse_mode === 'trim'){
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
	if (mouse_down && graph.graphics_style.mouse_mode === 'cut'){
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
	if (mouse_down && graph.graphics_style.mouse_mode === 'x-c'){
		label = mjs_precision(px,graph.graphics_style.y_precision+1);
		ctx.fillText('x-'+label,x+cs*2,y-cs*2);
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x,canvas.height);
		ctx.stroke();
		ctx.beginPath();
		ctx.stroke();
	}
	if (mouse_down && graph.graphics_style.mouse_mode === 'y-c'){
		label = mjs_precision(py,graph.graphics_style.y_precision+1);
		ctx.fillText('y-'+label,x+cs*2,y-cs*2);
		ctx.beginPath();
		ctx.moveTo(0,y);
		ctx.lineTo(canvas.width,y);
		ctx.stroke();
		ctx.beginPath();
		ctx.stroke();
	}
	
}

function mouse_down_event(event,graph){
		mouse_down = true;
		canvas = graph.canvas;
		ctx = canvas.getContext('2d');
		rect = canvas.getBoundingClientRect();
		start_x = event.clientX - rect.left;
		start_y = event.clientY - rect.top;
		//freeze the scaling stuff in place for the duration of the drag
		drag_x_max = graph.pixels_to_units(canvas.width,'x');
		drag_x_min = graph.pixels_to_units(0,'x');
		drag_y_max = graph.pixels_to_units(0,'y');
		drag_y_min = graph.pixels_to_units(canvas.height,'y');
		
		
}
dotcount = 0;

function mouse_out_event(event,graph){
	canvas = graph.canvas;
	ctx = canvas.getContext('2d');
	ctx.putImageData(graph.graph_image,0,0);
}

function keypress_event(event,graph){
	console.log('in keypress');
	var c = String.fromCharCode(event.keyCode || event.charCode);
	console.log(c);
	console.log('in keypress');
}

function mouse_up_event(event,graph){
	canvas = graph.canvas;
	ctx = canvas.getContext('2d');
	mouse_down = false;
	rect = canvas.getBoundingClientRect();
	end_x = event.clientX - rect.left;
	end_y = event.clientY - rect.top;
	
	no_drag_size = graph.graphics_style.tick_len;
	edge = graph.ui.size;
	
	if (graph.graphics_style.o >=1){
		var names = ['scale width x','scale width y','circle size','dot size','line thickness','tick length','minor tick length','title font size','ticks font size','axis font size','title spacing','tick padding','label spacing','graph line thickness'];
		var values = ['guideWidthx', 'guideWidthy','circle_size', 'dot_size','line_thickness','tick_len','minor_tick_len', 'title_font_size','tick_labels_font_size','axis_labels_font_size','title_spacing','tick_lables_font_padding','lable_spacing','graph_line_thickness'];

		var item = Math.ceil((end_y - 3*edge - graph.graphics_style.tick_labels_font_size * graph.graphics_style.scaling_factor*0.75)/(graph.graphics_style.tick_labels_font_size* graph.graphics_style.scaling_factor*1.2));
		var button = Math.ceil((end_x - 2.5*edge) / (graph.graphics_style.tick_labels_font_size* graph.graphics_style.scaling_factor))-1;
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
		var strings  = ['font_name','title','subtitle','x_axis_title','y_axis_title','color_fg','color_bg'];
		var string_names = ['font','title','subtitle','x-axis','y-axis','fg color','bg color'];
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
			var temp =graph.graphics_style.o;
		    //graph.graphics_style = get_graph_style();
			//graph.graphics_style = graph.default_graphics_style;
			graph.graphics_style = JSON.parse(JSON.stringify(graph.default_graphics_style));
			graph.graphics_style.modified = false;
			graph.graphics_style.o = temp;
			console.log('doing reset');
			//need to force the data transforms to run to update the axies titles
			graph.transform_index--;
		}
		
	}
	
	//zooming with rectangle. 
	if (graph.graphics_style.mouse_mode === 'zoom'){
		console.log('mouse zoom');
		if (Math.abs(start_x - end_x) > no_drag_size && Math.abs(start_y - end_y) > no_drag_size){
			 start_x = graph.pixels_to_units(start_x,'x');
			 start_y = graph.pixels_to_units(start_y,'y');
			 end_x = graph.pixels_to_units(end_x,'x');
			 end_y = graph.pixels_to_units(end_y,'y');
			
			graph.graphics_style.x_manual_min = Math.min(start_x,end_x);
			graph.graphics_style.x_manual_max = Math.max(start_x,end_x);
			graph.graphics_style.y_manual_min = Math.min(start_y,end_y);
			graph.graphics_style.y_manual_max = Math.max(start_y,end_y);
			graph.graphics_style.x_scale_auto_min = false;
			graph.graphics_style.y_scale_auto_min = false;
			graph.graphics_style.x_scale_auto_max = false;
			graph.graphics_style.y_scale_auto_max = false;
			graph.graphics_style.y_scale_tight = true;
			graph.graphics_style.x_scale_tight = true;
			graph.mjs_plot();
			return;
		}  
	}

	
	//top buttons
	if (end_y < edge){
		if ( end_x < edge){
		//dot button
		graph.graphics_style.mode = 'dots';
		dotcount++;
		if (dotcount>15){
			graph.graphics_style.mode = 'scribble';
		}
		} else {
		dotcount = 0;
		}
		if ( end_x < 2*edge && end_x > 1*edge){
		//circ button
		graph.graphics_style.mode = 'circles';
		}
		
		var mode = graph.graphics_style.mode;
		var line_modes = ['line','approx','interp','zig','zag','mid','hist'];
		
		if ( end_x < 3*edge && end_x > 2*edge){
			//line button
			if (mode.indexOf(' ')>-1){
				mode = 'line';
			} else {
				mode.trim();
				var n = line_modes.indexOf(mode)+1;
				mode = line_modes[n%line_modes.length] ;
			}
		}
		if ( end_x < 4*edge && end_x > 3*edge){
			//line circ button
			if (  mode.indexOf('circle ') >-1  ) {
				mode = mode.split(' ')[1];
				mode.trim();
				var n = line_modes.indexOf(mode)+1;
				mode = 'circle ' + line_modes[n%line_modes.length] ;
			} else {
				mode = 'circle line';
			}
		}
		
		if ( end_x < 5*edge && end_x > 4*edge){
		//line dot button
			if (  mode.indexOf('dot ') >-1  ) {
				mode = mode.split(' ')[1];
				mode.trim();
				var n = line_modes.indexOf(mode)+1;
				mode = 'dot ' + line_modes[n%line_modes.length] ;
			} else {
				mode = 'dot line';
			}
		
		}
		graph.graphics_style.mode = mode;
		if ( end_x < 7*edge && end_x > 6*edge){
		//scailing factor up button
		graph.graphics_style.scaling_factor *= 0.9;
		}
		if ( end_x < 8*edge && end_x > 7*edge){
		//scailing factor up button
		graph.graphics_style.scaling_factor *= 1.1;
		}
		
		if ( end_x < 10*edge && end_x > 9*edge){
		//drag button
		graph.graphics_style.mouse_mode = 'drag';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < 11*edge && end_x > 10*edge){
		//zoom button
		graph.graphics_style.mouse_mode = 'zoom';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < 12*edge && end_x > 11*edge){
		//measure button
		graph.graphics_style.mouse_mode = 'measure';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < 13*edge && end_x > 12*edge){
		//data reader button
		graph.graphics_style.mouse_mode = 'reader';
		mouse_move_event(event,graph);
		return;
		}
		if ( end_x < canvas.width && end_x > canvas.width - edge){
		//show/hide captions
			graph.graphics_style.show_captions =  (graph.graphics_style.show_captions + 1)%4;//a quad state button.
		}
		if ( end_x < canvas.width - edge && end_x > canvas.width - 2*edge){
		//infomation button 
			graph.graphics_style.i =  (graph.graphics_style.i + 1)%2;//a three state button.
			graph.graphics_style.o = 0;
		}
		if ( end_x < canvas.width - edge*2 && end_x > canvas.width - 3*edge){
		//options button 
			graph.graphics_style.o =  (graph.graphics_style.o + 1)%2;//a three state button.
			graph.graphics_style.mouse_mode = 'options';
			graph.graphics_style.i = 0;
		}
		
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
	}
	
	
	//function buttons
	if (graph.drawfxmenu){
		var n = graph.graphics_style.data_transforms.length;
		
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
			
			if (graph.graphics_style.mode === 'hist dot'){
				graph.graphics_style.mode = 'line dot';
			}
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*1){
			// pop button
			console.log('pop');
			graph.graphics_style.data_transforms.pop();
			graph.graphics_style.data_transforms_args.pop();
		}
		if ( end_x < 12*edge && end_x >8*edge && end_y > canvas.height - edge*14 && end_y < canvas.height - edge*13){
			// y vs y button
			console.log('y vs y');
			if (graph.graphics_style.data_transforms[n-1] == "y_vs_y"){
				graph.graphics_style.data_transforms_args[n-1][0] += 1;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "y_vs_y";
				graph.graphics_style.data_transforms_args[n] = [1];
			}
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*3 && end_y < canvas.height - edge*2){
			// cut button button
			console.log('cut button');
			graph.pre_mouse_mode = graph.graphics_style.mouse_mode;
			graph.graphics_style.mouse_mode = 'cut';
			graph.drawfxmenu = false;
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*4 && end_y < canvas.height - edge*3){
			// normalise button
			console.log('normalise');
			if (graph.graphics_style.data_transforms[n-1] == "normalise"){
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "normalise";
				graph.graphics_style.data_transforms_args[n] = [0];
			}
			graph.graphics_style.y_scale_auto_min = true;
			graph.graphics_style.y_scale_auto_max = true;
			
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// y-c button
			console.log('y-c');
			graph.pre_mouse_mode = graph.graphics_style.mouse_mode;
			graph.graphics_style.mouse_mode = 'y-c';
			graph.drawfxmenu = false;
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// x-c button
			console.log('x-c');
			graph.pre_mouse_mode = graph.graphics_style.mouse_mode;
			graph.graphics_style.mouse_mode = 'x-c';
			graph.drawfxmenu = false;
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*6 && end_y < canvas.height - edge*5){
			// smooth button
			console.log('smooth');
			if (graph.graphics_style.data_transforms[n-1] == "smooth"){
				graph.graphics_style.data_transforms_args[n-1][0] = graph.graphics_style.data_transforms_args[n-1][0]*1.467799;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "smooth";
				graph.graphics_style.data_transforms_args[n] = [2.1544339];
			}
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*7 && end_y < canvas.height - edge*6){
			// interpolate button
			console.log('interpolate');
			if (graph.graphics_style.data_transforms[n-1] == "interpolate"){
				graph.graphics_style.data_transforms_args[n-1][0] *= 2;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "interpolate";
				graph.graphics_style.data_transforms_args[n] = [20];
			}
			
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*8 && end_y < canvas.height - edge*7){
			// subtract baseline button
			console.log('-baseline');
			
			graph.graphics_style.data_transforms[n] = "remove_linear";
			graph.graphics_style.data_transforms_args[n] = [];
		}
		if ( end_x < 12*edge && end_x > 8*edge && end_y > canvas.height - edge*9 && end_y < canvas.height - edge*8){
			// differentiate button
			console.log('dy/dx');
			graph.graphics_style.data_transforms[n] = "differentiate";
			graph.graphics_style.data_transforms_args[n] = [0];
			graph.graphics_style.y_scale_auto_min = true;
			graph.graphics_style.y_scale_auto_max = true;
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// e to the power x button
			console.log('ex');
			if (graph.graphics_style.data_transforms[n-1] == "ln_x"){
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "e_to_x";
				graph.graphics_style.data_transforms_args[n] = [0];
			}
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// ln x button
			console.log('lnx');
			if (graph.graphics_style.data_transforms[n-1] == "e_to_x"){
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "ln_x";
				graph.graphics_style.data_transforms_args[n] = [0];
			}
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// ten to the x button
			console.log('10^x');
			if (graph.graphics_style.data_transforms[n-1] == "log_x"){
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "ten_to_x";
				graph.graphics_style.data_transforms_args[n] = [0];
			}
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// log x button
			console.log('logx');
			if (graph.graphics_style.data_transforms[n-1] == "ten_to_x"){
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "log_x";
				graph.graphics_style.data_transforms_args[n] = [0];
			}
			
		
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// x over 10 button
			console.log('x/10');
			if (graph.graphics_style.data_transforms[n-1] == "scale_x"){
				console.log('incresing scaling');
				graph.graphics_style.data_transforms_args[n-1][0] *= 0.1;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "scale_x";
				graph.graphics_style.data_transforms_args[n] = [0.1];
			}
			graph.graphics_style.x_manual_min *=0.10;
			graph.graphics_style.x_manual_max *=0.10;
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// ten x button
			console.log('10x');
			if (graph.graphics_style.data_transforms[n-1] == "scale_x"){
				console.log('incresing scaling');
				graph.graphics_style.data_transforms_args[n-1][0] *= 10;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "scale_x";
				graph.graphics_style.data_transforms_args[n] = [10];
			}
			graph.graphics_style.x_manual_min *=10;
			graph.graphics_style.x_manual_max *=10;
		}
		if ( end_x < 12*edge && end_x > 10*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// one over x button
			console.log('1/x');
			if (graph.graphics_style.data_transforms[n-1] == "one_over_x"){
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "one_over_x";
				graph.graphics_style.data_transforms_args[n] = [];
			}
			
		}
		if ( end_x < 10*edge && end_x > 8*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// neg x button
			console.log('-x');			
			if (graph.graphics_style.data_transforms[n-1] == "scale_x"){
				console.log('incresing scaling');
				graph.graphics_style.data_transforms_args[n-1][0] *= -1;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "scale_x";
				graph.graphics_style.data_transforms_args[n] = [-1];
			}
			var oldmin = graph.graphics_style.x_manual_min*-1;
			var oldmax = graph.graphics_style.x_manual_max*-1;
			graph.graphics_style.x_manual_min = Math.min(oldmin,oldmax);
			graph.graphics_style.x_manual_max = Math.max(oldmin,oldmax);
		}
		
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*2 && end_y < canvas.height - edge*1){
			// swap button
			console.log('x<->y');	
			if (graph.graphics_style.data_transforms[n-1] == "swap_x_y"){
				console.log('undoing swap');
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "swap_x_y";
				graph.graphics_style.data_transforms_args[n] = [];
			}
			
			
			var temp = graph.graphics_style.x_manual_min;
			graph.graphics_style.x_manual_min =graph.graphics_style.y_manual_min;
			graph.graphics_style.y_manual_min =temp;
			temp =graph.graphics_style.x_manual_max;
			graph.graphics_style.x_manual_max =graph.graphics_style.y_manual_max;
			graph.graphics_style.y_manual_max =temp;
			temp = graph.graphics_style.x_scale_mode;
			graph.graphics_style.x_scale_mode = graph.graphics_style.y_scale_mode;
			graph.graphics_style.y_scale_mode = temp;
			
			
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*3 && end_y < canvas.height - edge*2){
			// trim button
			console.log('trim');
			graph.pre_mouse_mode = graph.graphics_style.mouse_mode;
			graph.graphics_style.mouse_mode = 'trim';
			graph.drawfxmenu = false;
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*4 && end_y < canvas.height - edge*3){
			// y^(n) button
			console.log('y^(n)');
			if (graph.graphics_style.data_transforms[n-1] == "y_pow_n"){
				console.log('incresing power');
				graph.graphics_style.data_transforms_args[n-1][0] += 1;
				var pwr = graph.graphics_style.data_transforms_args[n-1][0];
				graph.graphics_style.y_manual_min = Math.pow(graph.graphics_style.y_manual_min,pwr/(pwr-1));
				graph.graphics_style.y_manual_max = Math.pow(graph.graphics_style.y_manual_max,pwr/(pwr-1));
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "y_pow_n";
				graph.graphics_style.data_transforms_args[n] = [2];
				graph.graphics_style.y_manual_min = Math.pow(graph.graphics_style.y_manual_min,2);
				graph.graphics_style.y_manual_max = Math.pow(graph.graphics_style.y_manual_max,2);
			}
			
			
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*4 && end_y < canvas.height - edge*3){
			// some button
			console.log('x^(n)');
			if (graph.graphics_style.data_transforms[n-1] == "x_pow_n"){
				console.log('incresing power');
				graph.graphics_style.data_transforms_args[n-1][0] += 1;
				var pwr = graph.graphics_style.data_transforms_args[n-1][0];
				graph.graphics_style.x_manual_min = Math.pow(graph.graphics_style.x_manual_min,pwr/(pwr-1));
				graph.graphics_style.x_manual_max = Math.pow(graph.graphics_style.x_manual_max,pwr/(pwr-1));
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "x_pow_n";
				graph.graphics_style.data_transforms_args[n] = [2];
				graph.graphics_style.x_manual_min = Math.pow(graph.graphics_style.x_manual_min,2);
				graph.graphics_style.x_manual_max = Math.pow(graph.graphics_style.x_manual_max,2);
			}
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// some button
			console.log('sqrty');
			if (graph.graphics_style.data_transforms[n-1] == "y_nth_root"){
				console.log('incresing power');
				graph.graphics_style.data_transforms_args[n-1][0] += 1;
				var pwr = graph.graphics_style.data_transforms_args[n-1][0];
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "y_nth_root";
				graph.graphics_style.data_transforms_args[n] = [2];
				var pwr = 2;
			}
			var rtmin = Math.pow(Math.abs(graph.graphics_style.y_manual_min),1/2);
			var rtmax = Math.pow(Math.abs(graph.graphics_style.y_manual_max),1/2)
			if (graph.graphics_style.y_manual_min < 0 && graph.graphics_style.y_manual_max > 0){
			//if graph is accross zero then make the minimum zero. max could be ether still.
				var make_zero = 0;
			} else {make_zero = 1;}
			graph.graphics_style.y_manual_min = Math.min( rtmin,rtmax)*make_zero;
			graph.graphics_style.y_manual_max = Math.max( rtmin,rtmax);
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*5 && end_y < canvas.height - edge*4){
			// some button
			console.log('sqrtx');
			if (graph.graphics_style.data_transforms[n-1] == "x_nth_root"){
				console.log('incresing power');
				graph.graphics_style.data_transforms_args[n-1][0] += 1;
				var pwr = graph.graphics_style.data_transforms_args[n-1][0];
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "x_nth_root";
				graph.graphics_style.data_transforms_args[n] = [2];
				var pwr = 2;
			}
			var rtmin = Math.pow(Math.abs(graph.graphics_style.x_manual_min),1/2);
			var rtmax = Math.pow(Math.abs(graph.graphics_style.x_manual_max),1/2)
			if (graph.graphics_style.x_manual_min < 0 && graph.graphics_style.x_manual_max > 0){
			//if graph is accross zero then make the minimum zero. max could be ether still.
				var make_zero = 0;
			} else {make_zero = 1;}
			graph.graphics_style.x_manual_min = Math.min( rtmin,rtmax)*make_zero;
			graph.graphics_style.x_manual_max = Math.max( rtmin,rtmax);
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*6 && end_y < canvas.height - edge*5){
			// some button
			console.log('B-A');
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*6 && end_y < canvas.height - edge*5){
			// some button
			console.log('sum');
			graph.graphics_style.data_transforms[n] = "sum";
			graph.graphics_style.data_transforms_args[n] = [];
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*7 && end_y < canvas.height - edge*6 &&
			graph.graphics_style.i === 1 && graph.pre_mouse_mode === 'cut'){
			// some button
			console.log('Kernals');
			graph.graphics_style.data_transforms[n] = "add_me";
			graph.graphics_style.data_transforms_args[n] = [0];
			graph.graphics_style.x_scale_auto_max = true;
			graph.graphics_style.x_scale_auto_min = true;
			graph.graphics_style.y_scale_auto_max = true;
			graph.graphics_style.y_scale_auto_min = true;
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*8 && end_y < canvas.height - edge*7){
			// some button
			console.log('Hist');
			graph.graphics_style.data_transforms[n] = "hist";
			graph.graphics_style.data_transforms_args[n] = [0];
			graph.graphics_style.x_scale_auto_max = true;
			graph.graphics_style.x_scale_auto_min = true;
			graph.graphics_style.y_scale_auto_max = true;
			graph.graphics_style.y_scale_auto_min = true;
			graph.graphics_style.x_scale_mode = 'lin';
			graph.graphics_style.y_scale_mode = 'lin';
			graph.graphics_style.mode = 'hist dot';
		}
		if ( end_x < 16*edge && end_x > 12*edge && end_y > canvas.height - edge*9 && end_y < canvas.height - edge*8){
			// some button
			console.log('Intergrate');
			graph.graphics_style.data_transforms[n] = "intergrate";
			graph.graphics_style.data_transforms_args[n] = [0];
			graph.graphics_style.y_scale_auto_min = true;
			graph.graphics_style.y_scale_auto_max = true;
			
		}
	
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// some button
			console.log('ey');
			graph.graphics_style.data_transforms[n] = "e_to_y";
			graph.graphics_style.data_transforms_args[n] = [0];
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*10 && end_y < canvas.height - edge*9){
			// some button
			console.log('lny');
			graph.graphics_style.data_transforms[n] = "ln_y";
			graph.graphics_style.data_transforms_args[n] = [0];
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// some button
			console.log('10^y');
			graph.graphics_style.data_transforms[n] = "ten_to_y";
			graph.graphics_style.data_transforms_args[n] = [0];
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*11 && end_y < canvas.height - edge*10){
			// some button
			console.log('logy');
			graph.graphics_style.data_transforms[n] = "log_y";
			graph.graphics_style.data_transforms_args[n] = [0];
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// some button
			console.log('y/10');
			if (graph.graphics_style.data_transforms[n-1] == "scale_y"){
				console.log('incresing scaling');
				graph.graphics_style.data_transforms_args[n-1][0] *= 0.1;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "scale_y";
				graph.graphics_style.data_transforms_args[n] = [0.1];
			}
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*12 && end_y < canvas.height - edge*11){
			// some button
			console.log('10y');
			if (graph.graphics_style.data_transforms[n-1] == "scale_y"){
				console.log('incresing scaling');
				graph.graphics_style.data_transforms_args[n-1][0] *= 10;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "scale_y";
				graph.graphics_style.data_transforms_args[n] = [10];
			}
			
		}
		if ( end_x < 16*edge && end_x > 14*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// some button
			console.log('1/y');
			
			if (graph.graphics_style.data_transforms[n-1] == "one_over_y"){
				graph.graphics_style.data_transforms.pop();
				graph.graphics_style.data_transforms_args.pop();
			} else {
				graph.graphics_style.data_transforms[n] = "one_over_y";
			graph.graphics_style.data_transforms_args[n] = [];
			}
			
		}
		if ( end_x < 14*edge && end_x > 12*edge && end_y > canvas.height - edge*13 && end_y < canvas.height - edge*12){
			// some button
			console.log('-y');
			if (graph.graphics_style.data_transforms[n-1] == "scale_y"){
				console.log('incresing scaling');
				graph.graphics_style.data_transforms_args[n-1][0] *= -1;
				graph.transform_index--;
			} else {
				graph.graphics_style.data_transforms[n] = "scale_y";
				graph.graphics_style.data_transforms_args[n] = [-1];
			}
			var oldmin = graph.graphics_style.y_manual_min*-1;
			var oldmax = graph.graphics_style.y_manual_max*-1;
			graph.graphics_style.y_manual_min = Math.min(oldmin,oldmax);
			graph.graphics_style.y_manual_max = Math.max(oldmin,oldmax);
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
			var item = Math.floor(no_of_lines-((canvas.height-end_y) / edge -1));
			graph.graphics_style.hidden_lines[item] = !graph.graphics_style.hidden_lines[item];
		}
		//all button
		if ( end_x < 17*edge && end_x > 15*edge && end_y > canvas.height-edge){
			console.log('all');
			for (var k = 0;k<graph.graphics_style.hidden_lines.length;k++){
				graph.graphics_style.hidden_lines[k] = false;
			} 
		}
		//none button
		if ( end_x < 19*edge && end_x > 17*edge && end_y > canvas.height-edge){
			console.log('non');
			for (var k = 0;k<graph.graphics_style.hidden_lines.length;k++){
				graph.graphics_style.hidden_lines[k] = true;
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
		if ( end_y > canvas.height -1*edge && end_y < canvas.height -0*edge){
			
			return;
		}
		if ( end_y > canvas.height -2*edge && end_y < canvas.height -1*edge){
			console.log('csv');
			var theBody = document.getElementsByTagName('body')[0];
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
					text += "</br>";
				}
			theBody.innerHTML = text;
		}
		if ( end_y > canvas.height -3*edge && end_y < canvas.height -2*edge){
			console.log('code');
			var theBody = document.getElementsByTagName('body')[0];
			var text = '';
			for (i = 0;i<graph.data.length;i++){
				text += graph.captions[i].replace( /\W/g, "")+'_x = [';
				for (ii = 0;ii<graph.data[i][0].length-1;ii++){
					text += graph.data[i][0][ii] + ','
				}
				text += graph.data[i][0][ii] + '];<br>';
				
				text += graph.captions[i].replace( /\W/g, "")+'_y = [';
				for (ii = 0;ii<graph.data[i][1].length-1;ii++){
					text += graph.data[i][1][ii] + ','
				}
				text += graph.data[i][1][ii] + '];<br>';
				
				
			}
			theBody.innerHTML = text;
		}
		if ( end_y > canvas.height -4*edge && end_y < canvas.height -3*edge){
			console.log('tabbed');
			//kill the whole page just to write out the file. 
			var theBody = document.getElementsByTagName('body')[0];
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
						text += graph.data[i][0][ii].toString() + "\t"+ graph.data[i][1][ii].toString() + "\t";
						} catch(e){
						text += "\t\t";
						}
					}
					text += "</br>";
				}
			theBody.innerHTML = text;
	
		}
		if ( end_y > canvas.height -5*edge && end_y < canvas.height -4*edge){
			console.log('png hi');
			graph.canvas.width *= 3;
			graph.canvas.height *= 3;
			graph.graphics_style.scaling_factor *= 3;
			graph.mjs_plot();
			var dataUrl = graph.canvas.toDataURL();
			window.open(dataUrl, "toDataURL() image", "width=600, height=400");
			graph.graphics_style.scaling_factor /= 3;
			graph.canvas.width /= 3;
			graph.canvas.height /= 3;
			graph.mjs_plot();
		}
		if ( end_y > canvas.height -6*edge && end_y < canvas.height -5*edge){
			console.log('png low');
			graph.mjs_plot();
			var dataUrl = graph.canvas.toDataURL();
			window.open(dataUrl, "toDataURL() image", "width=600, height=400");
		}
		if ( end_y > canvas.height -7*edge && end_y < canvas.height -6*edge){
			console.log('png (4x3 figure)');
			//TODO should figure out a way to allways get the fonts to be the correct size. 
			var temp_width = graph.canvas.width;
			var temp_height = graph.canvas.height;
			graph.canvas.width = 1000;
			graph.canvas.height = 750;
			graph.graphics_style.scaling_factor *= 2.5;
			graph.mjs_plot();
			var dataUrl = graph.canvas.toDataURL();
			window.open(dataUrl, "toDataURL() image", "width=1000, height=750");
			graph.graphics_style.scaling_factor /= 2.5;
			graph.canvas.width  = temp_width;
			graph.canvas.height = temp_height;
			graph.mjs_plot();
		}
		return;
	}
	
	//fit menu buttons
	if (graph.drawfitsmenu){
		
		if ( end_x < 21*edge && end_x > 18*edge && end_y > canvas.height-edge){
			//pressed none fits button
			graph.graphics_style.fits = 'none';
		}
		if ( end_y > canvas.height-2*edge && end_y < canvas.height-1*edge){
			graph.graphics_style.fits = 'lin';
		}
		if ( end_y > canvas.height-2*edge && end_y < canvas.height-1*edge && end_x < 21*edge && end_x > 18*edge){
			graph.graphics_style.fits = 'stats';
		}
		if ( end_y > canvas.height-3*edge && end_y < canvas.height-2*edge && end_x < 21*edge && end_x > 18*edge){
			graph.graphics_style.fits = 'exp';
		}
		if ( end_y > canvas.height-4*edge && end_y < canvas.height-3*edge && end_x < 21*edge && end_x > 18*edge){
			graph.graphics_style.fits = 'a+blnx';
		}
		if ( end_y > canvas.height-5*edge && end_y < canvas.height-4*edge && end_x < 21*edge && end_x > 18*edge){
			graph.graphics_style.fits = 'ax^b';
		}
		if ( end_y > canvas.height-6*edge && end_y < canvas.height-5*edge && end_x < 21*edge && end_x > 18*edge){
			graph.graphics_style.fits = 'exp_c';
		}
		
		//exp_c
		if ( end_y > canvas.height-3*edge && end_y < canvas.height-2*edge && end_x < 18*edge){
			graph.graphics_style.fits = 'quad';
		}
		if ( end_y > canvas.height-4*edge && end_y < canvas.height-3*edge && end_x < 18*edge){
			graph.graphics_style.fits = 'cubic';
		}
		if ( end_y > canvas.height-5*edge && end_y < canvas.height-4*edge && end_x < 18*edge){
			graph.graphics_style.fits = 'poly4';
		}
		if ( end_y > canvas.height-6*edge && end_y < canvas.height-5*edge && end_x < 18*edge){
			graph.graphics_style.fits = 'poly5';
		}
		if ( end_y > canvas.height-7*edge && end_y < canvas.height-6*edge && end_x < 18*edge){
			graph.graphics_style.fits = 'poly6';
		}
		if ( end_y > canvas.height-8*edge && end_y < canvas.height-7*edge && end_x < 18*edge){
			graph.graphics_style.fits = 'poly7';
		}
		
		graph.mjs_plot();
		
		if ( end_x < 18*edge && end_x > 15*edge && end_y > canvas.height-edge){
			//pressed the fit menu button again
			graph.drawfitsmenu = false;
		}
		if ( end_x < 21*edge && end_x > 18*edge && end_y > canvas.height-edge){
			//pressed none fits button
			graph.graphics_style.fits = 'none';
			graph.graphics_style.i =0;
			graph.drawfitsmenu = false;
			
		}
		console.log(graph.graphics_style.fits);
		mouse_move_event(event,graph);
		return;
	}
	
	//bottom buttons
	if (y>canvas.height-edge){
		if ( end_x < 1*edge && end_x > 0*edge){
			graph.graphics_style.y_scale_auto_min = true;
			graph.graphics_style.y_scale_tight = false;
		}
		if ( end_x < 2*edge && end_x > 1*edge){
			graph.graphics_style.y_scale_auto_max = true;
			graph.graphics_style.y_scale_tight = false;
		}
		if ( end_x < 3*edge && end_x > 2*edge){
			graph.graphics_style.x_scale_auto_min = true;
			graph.graphics_style.x_scale_tight = false;
		}
		if ( end_x < 4*edge && end_x > 3*edge){
			graph.graphics_style.x_scale_auto_max = true;
			graph.graphics_style.x_scale_tight = false;
		}
		
		if ( end_x < 6*edge && end_x > 5*edge){
			//y scalemode button
			if (graph.graphics_style.y_scale_mode === 'log' ){
				graph.graphics_style.y_scale_mode = 'lin';
			} else {
				graph.graphics_style.y_scale_mode = 'log';
			}
		}
		if ( end_x < 7*edge && end_x > 6*edge){
			//x scalemode button
			if (graph.graphics_style.x_scale_mode === 'log' ){
				graph.graphics_style.x_scale_mode = 'lin';
			} else {
				graph.graphics_style.x_scale_mode = 'log';
			}
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
			//graph.graphics_style.day_night_mode = !graph.graphics_style.day_night_mode;
			var temp = graph.graphics_style.color_fg 
			graph.graphics_style.color_fg = graph.graphics_style.color_bg;
			graph.graphics_style.color_bg = temp;
		}
		
		graph.mjs_plot();
		mouse_move_event(event,graph);
		return;
	
	}
	
	//zoom without drag
	if (graph.graphics_style.mouse_mode === 'zoom'){
		ctx.rect(start_x-no_drag_size*0.5,start_y-no_drag_size*0.5,no_drag_size,no_drag_size);
		ctx.stroke();
		 if( event.button=== 0){
			//console.log('was left click');
			graph.graphics_style.x_scale_auto_min = true;
			graph.graphics_style.y_scale_auto_min = true;
			graph.graphics_style.x_scale_auto_max = true;
			graph.graphics_style.y_scale_auto_max = true;
			graph.graphics_style.y_scale_tight = false;
			graph.graphics_style.x_scale_tight = false;
		}
		else if(event.button === 2){
			//console.log('was right click');
			graph.graphics_style.x_scale_auto_min = false;
			graph.graphics_style.y_scale_auto_min = false;
			graph.graphics_style.x_scale_auto_max = false;
			graph.graphics_style.y_scale_auto_max = false;
			graph.graphics_style.y_scale_tight = false;
			graph.graphics_style.x_scale_tight = false;
			var m = 0;
			if (graph.graphics_style.x_scale_mode === 'lin'){
				m = (graph.graphics_style.x_manual_min + graph.graphics_style.x_manual_max)/2;
				graph.graphics_style.x_manual_min = m - 1.2*(m - graph.graphics_style.x_manual_min);
				graph.graphics_style.x_manual_max = m - 1.2*(m - graph.graphics_style.x_manual_max);
			}
			if (graph.graphics_style.y_scale_mode === 'lin'){
				m = (graph.graphics_style.y_manual_min + graph.graphics_style.y_manual_max)/2;
				graph.graphics_style.y_manual_min = m - 1.2*(m - graph.graphics_style.y_manual_min);
				graph.graphics_style.y_manual_max = m - 1.2*(m - graph.graphics_style.y_manual_max);
			}
			if (graph.graphics_style.x_scale_mode === 'log'){
				graph.graphics_style.x_manual_min *=0.7 ;
				graph.graphics_style.x_manual_max *=1.4 ;
			}
			if (graph.graphics_style.y_scale_mode === 'log' ){
				graph.graphics_style.y_manual_min *=0.7 ;
				graph.graphics_style.y_manual_max *=1.4 ;
			}
			
		}
		
	}
	
	if (graph.graphics_style.mouse_mode === 'reader'){
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
	
	if (graph.graphics_style.mouse_mode === 'trim'){
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
		var n = graph.graphics_style.data_transforms.length;
		graph.graphics_style.data_transforms[n] = "trim";
		graph.graphics_style.data_transforms_args[n] = [xlow,xhigh,ylow,yhigh];
		graph.graphics_style.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	
	if (graph.graphics_style.mouse_mode === 'cut'){
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
		var n = graph.graphics_style.data_transforms.length;
		graph.graphics_style.data_transforms[n] = "cut";
		graph.graphics_style.data_transforms_args[n] = [xlow,xhigh,ylow,yhigh];
		graph.graphics_style.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	
	if (graph.graphics_style.mouse_mode === 'y-c'){
		//running cut
		console.log('y-c');
		var c = graph.pixels_to_units(end_y,'y');
		var n = graph.graphics_style.data_transforms.length;
		graph.graphics_style.data_transforms[n] = "y_c";
		graph.graphics_style.data_transforms_args[n] = [c];
		graph.graphics_style.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	if (graph.graphics_style.mouse_mode === 'x-c'){
		//running cut
		console.log('y-c');
		var c = graph.pixels_to_units(end_x,'x');
		var n = graph.graphics_style.data_transforms.length;
		graph.graphics_style.data_transforms[n] = "x_c";
		graph.graphics_style.data_transforms_args[n] = [c];
		graph.graphics_style.mouse_mode = graph.pre_mouse_mode;
		graph.mjs_plot();
		return;
	}
	
	// if the mouse mode is 'i' then the covering rectangle hides everything
	// clicking in this mode changes the mouse to zoom and remove the info panel.
	//this should stop users feeling stuck.
	if (graph.graphics_style.mouse_mode === 'i'){
		graph.graphics_style.mouse_mode = graph.pre_mouse_mode;
		graph.graphics_style.i = 0;
		//if the last mouse mode was laso 'i' then just switch to zoom. a psudo default.
		if (graph.graphics_style.mouse_mode === 'i'){
			graph.graphics_style.mouse_mode = 'zoom';
		}
	}
	
	
	
	graph.mjs_plot();
	
}


function change_scaling_factor(graph,factor){
	graph.graphics_style.scaling_factor *= factor;
	graph.mjs_plot();
}


function get_graph_style(){
	//modifications here need to included in the save_gs and load_gs functions too.. 
	return graph_style = {
	 graph_line_thickness : 1, // for the graph generally.
	 circle_size : 5,
	 dot_size : 4,
	 line_thickness: 2, // for plotted lines
	 tick_len : 8,
	 mode : 'dot line', //'circles', 'dot', or 'line'
	 font_name : "Courier New",
	 title_font_size : 24,// in px (24)
	 title : "Title",
	 subtitle : "",
	 title_spacing : 10, // extra space from the top, in px.
	 tick_labels_font_size : 12,//10
	 tick_lables_font_padding : 2, // px extra space up from the ticks
	 axis_labels_font_size: 12,//12
	 lable_spacing : 10,//pixels away from the tick lables
	 x_axis_title : 'x axis (units)',
	 y_axis_title : 'y axis (units)',
	 minor_tick_len : 5,
	 guideWidthx : 45, //pixels accross
	 guideWidthy : 20, //pixels accross
	 scaling_factor : 1,//scales up everything together...
	 mouse_mode : 'zoom', //changes the function of the mouse. between 'zoom' and 'drag' and 'measure'
	 fits : 'none', //what fitting is applied
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
	 show_captions : 2, //0=dont show. 1=caps 2=caps&lastpoint 3=caps on graph
	 color_fg : '#000000', //foreground color
	 color_bg : '#ffffff', //background color
	 v : MJS_PLOT_VERSION, //version of mjsplot
	 caption_colors : false, // generate colors from the captions
	 hidden_lines : [], // array of booleans if each line should be hidden.
	 data_transforms : [], //a list of the transform functions
	 data_transforms_args : [], // the arguments for each transform
	 i : 0, //state of the infomation button
	 o : 0, //state of the options button
	 modified : false,
	 x_precision :2, //the number of sf to use when printing numbers on the x axis
	 y_precision :2 //as above for y
	 }
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
		transforms.clean(data);
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
		transforms.clean(data);
		
	},
	ln_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = Math.log(data[i][0][j]);
			}
		}
		transforms.clean(data);
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
		transforms.clean(data);
		graph.transform_text_y= 'log('+graph.transform_text_y +')';
	},
	ln_y: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][1].length;j++){
				data[i][1][j] = Math.log(data[i][1][j]);
			}
		}
		transforms.clean(data);
		
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
		transforms.clean(data);
		graph.transform_text_y= '1/('+graph.transform_text_y +')';
	},
	one_over_x: function(data,args,graph){
		for (i = 0;i<data.length;i++){
			for (j = 0;j<data[i][0].length;j++){
				data[i][0][j] = 1.0 / data[i][0][j];
			}
		}
		transforms.clean(data);
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
					data[i][0].splice(ii,1);
					data[i][1].splice(ii,1);
				}
			}
		}
		for (var ii = data.length - 1; ii >= 0; ii--){
			if (data[ii][0].length == 0){
				data.splice(ii,1);
				graph.captions.splice(ii,1);
				graph.colors.splice(ii,1);
			}
		}
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
					data[i][0].splice(ii,1);
				data[i][1].splice(ii,1);
				} 
			}
		}
		for (var ii = data.length - 1; ii >= 0; ii--){
			if (data[ii][0].length == 0){
				data.splice(ii,1);
				graph.captions.splice(ii,1);
				graph.colors.splice(ii,1);
			}
		}
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
	clean: function(data){
		//cut off any infinites NaNs
		for (i = 0;i<data.length;i++){
			for(var ii = data[i][0].length - 1; ii >= 0; ii--) {
				if(  !isFinite(data[i][1][ii])  ) {
					data[i][0].splice(ii,1);
					data[i][1].splice(ii,1);
				}
				if(  !isFinite(data[i][0][ii])  ) {
					data[i][0].splice(ii,1);
					data[i][1].splice(ii,1);
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
			data[i][1][0] = 0.0;
			for (j = 0;j<data[i][0].length-1;j++){
				tally += (data[i][0][j+1] - data[i][0][j]) * (data[i][1][j+1] + data[i][1][j])/2;
				data[i][1][j+1] = tally;
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
		transforms.clean(data);
		
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
		transforms.clean(data);
		graph.transform_text_y= 'd/dx('+graph.transform_text_y +')';
	}
}
function new_graph(graphname,canvasname){
	canvas = document.getElementById(canvasname);
	
	gs = load_gs(graphname);
	if (gs.v === MJS_PLOT_VERSION){
		console.log('version is same');
	} else {
		gs  = get_graph_style();
		console.log('version changed, get new style');
	}
	graph = {
	graphics_style : gs,
	default_graphics_style : get_graph_style(),
	graph_name : graphname,
	drawfxmenu : false,
	drawlinemenu : false,
	drawfitsmenu : false,
	plot_failed : false,
	fits : 'none',
	errors : [],
	data : [],
	data_backup : [],
	colors : [],
	colors_backup : [],
	captions_backup : [],
	captions : [],
	reader_index:[0,0],//the i,j indices in the data of the picked reader point. 
	transform_index : -1,
	transform_text_x : 'x',
	ui : {size:20}, //contains ui infomation.
	transform_text_y : 'y',
	set_data : function (data){
		this.transform_index == -1;
		
		for (var i = 0;i<data.length;i++){
				if (data[i][0].length != data[i][1].length){
					this.errors.push("series " + i + "had different legnth x and y arrays");
				}
		}
		
		this.data_backup = clone(data);
		transforms.clean(this.data_backup);
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
		if (scalemode === 'lin'){
			//linear scale
			var val_i = 0;
			var power = -13 ;
			var notgood = 1;
			var scale = 0;
			//var width = 100;
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
				
				if (sections == 0){	width = size;}
				else{width = size/sections;	}
			}
			
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
			val_i_low = val_i;
			power_low = power;
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
			val_i_high = val_i;
			power_high = power;
			
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
	},
	find_limits : function(data,automin,automax,manualmin,manualmax,scale,name){
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
			//protect against empty data series
			this.no_data = false;
			if (data.length == 0){
				low = 1;
				high = 10;
				automin = true;
				automax = true;
				this.errors.push("There is no "+name+" data to plot");
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
			if (this.data.length == 1 && this.data[0][0].length == 1 ){
				low = 0.6*Math.min(low,high);
				high = 1.6*Math.max(low,high);
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
			if (scale === 'log' && low<1e-13){
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
			if (Math.abs(high)<2e-12 && high != 0.0){
				high = Math.sign(high) *2e-12;
				this.errors.push( name + " high is too small to cope with.");
			}
			if (Math.abs(low) <=1e-12 && low != 0.0){
				low = Math.sign(low) * 1e-12;
				this.errors.push(name + " low is too small to cope with.");
			}
			return {low:low, high:high, automax:automax,automin:automin,scale:scale};
	},
	use_scale : function (the_scale,target_size,guideWidth){
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
		var not_zero = 1e-23;//1e-12;
		if (scalemode === 'lin'){
			var tick = 0;// for the dummy run start at the far left, even though there
			//won't be an actual label there.
			var prev_label = ' ';
			var precision = 1;
			var label = '';
			
			//dummy run to get the precision
			while (tick <= target_size) {
				i = tick/width*scale+lowpoint;
				if (Math.abs(i)< not_zero) {i=0;}//javasript sucks.
				label = i.toPrecision(precision);
				if (label === prev_label){precision += 1;label = i.toPrecision(precision);}
				prev_label = label;
				tick += width;
			}
			var stepping = label.length*.7*this.graphics_style.tick_labels_font_size*this.graphics_style.scaling_factor > width;
			//draw it this time
			tick = width;
			var j = 1;
			//j here is just the same as tick/width.
			//however repeated additions of width lead to annoying floating point errors.
			//using j reduces the number of floating point problums
			while (tick < target_size-1) {
				i = j*scale+lowpoint;
				pos.push(tick);
				if (Math.abs(i)< not_zero) {i=0;}//javasript sucks.
				strings.push(mjs_precision(i,precision));
				tick += width;
				j +=1;
			}
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
		if (scalemode === 'log'){
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
						mid = (Math.log10( (old_i + i)/2  )-lowpoint)*target_size/(highpoint - lowpoint);
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
					if (Math.abs(i)< not_zero) {i=0;}//javasript sucks.
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
					if (Math.abs(i)< not_zero) {i=0;}//javasript sucks.
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
		return {pos:pos, strings:strings, minor_pos:minor_pos, stepping:stepping, precision:precision}
	},
	mjs_plot : function () {
	
	//catch errors in plotting
	if (this.plot_failed){
		this.errors.push('failed for unknown reason');
		this.graphics_style = JSON.parse(JSON.stringify(this.default_graphics_style));
	}
	this.plot_failed = true; //is set to false at  the end. 
	
	// gs is the graph style.
	//get things out of gs.
	
	//if gs.modified is false use the default style
	if (this.graphics_style.modified === false){
		//this.graphics_style = this.default_graphics_style;
		//below is a hack to get the graphics style to clone
		this.graphics_style = JSON.parse(JSON.stringify(this.default_graphics_style));
	}
	
	var gs = this.graphics_style;
	var ctx = this.canvas.getContext('2d');
	var canvas = this.canvas;
	
	var graph_line_thickness =gs.graph_line_thickness;
	var circle_size = gs.circle_size;
	var dot_size = gs.dot_size;
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
	dot_size*=scaling_factor;
	circle_size*=scaling_factor;
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
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.rect(graph_line_thickness/2,
					graph_line_thickness/2,
					canvas.width-graph_line_thickness,
					canvas.height-graph_line_thickness);
	ctx.lineWidth = graph_line_thickness;
	ctx.strokeStyle = gs.color_fg;
	ctx.stroke();
	
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
			//console.log(gs.data_transforms_args[i].toString());
			this.transform_index++;
	}
	
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
	/*
	ctx.strokeStyle = '#808080';
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
	*/
	
	ctx.font=tick_labels_font_size + 'px ' + font_name//"24px Courier New";
	//draw the points
	ctx.lineWidth = line_thickness;
	//ctx.strokeStyle = '#ff0000';
	var not_drawn_something = true;
	var drawn_caps = false;
	for (i = 0;i<this.data.length;i++){
		ctx.strokeStyle = this.colors[i];
		ctx.fillStyle = ctx.strokeStyle ;
		
		 // to see if all the data is offscreen put up a message
		for (j =0;j<this.data[i][0].length;j++){
			xi = this.units_to_pixels(this.data[i][0][j],'x');
			yi = this.units_to_pixels(this.data[i][1][j],'y');
			if (not_drawn_something){
				if (xi >= 0 && xi <= this.canvas.width && yi >= 0 && yi <= this.canvas.height){
					not_drawn_something = false; //as we have now drawn something
				}
			}
			if (j===0){
				old_xi1 = xi;
				old_yi1 = yi;
				old_xi2 = xi;
				old_yi2 = yi;
				old_xi3 = xi;
				old_yi3 = yi;
			}

			//keeps the prevous 3 data points for the curves
			// order goes 1,2,3,i
			//itinilisitation:
			// j = 0 [123i, , , ]
			// j = 1 [123,i, , ]
			// j = 2 [12,3,i, , ]
			// j = 3 [1,2,3,i, , ]
			//  . . .
			// j = n [ ,  ,  , 1,2,3,i, , ,]
			
			ctx.beginPath();
			if (  mode.indexOf('circle') >-1  ){
				ctx.arc(xi, yi, circle_size, 0 ,Math.PI*2, true);
			}
			if (  mode.indexOf('dot') >-1  ){
				ctx.fillRect(xi-dot_size/2,yi-dot_size/2,dot_size,dot_size);
			}
			if (  mode.indexOf('line') >-1  ) {
				if (j!=0){
					ctx.moveTo(old_xi3,old_yi3);
					ctx.lineTo(xi,yi);
				}
			}
			if (  mode.indexOf('zag') >-1  ) {
				if (j!=0){
					ctx.moveTo(old_xi3,old_yi3);
					ctx.lineTo(xi,old_yi3);
					ctx.lineTo(xi,yi);
				}
			}
			if (  mode.indexOf('hist') >-1  ) {
				if (j>1){
					ctx.moveTo((old_xi3+old_xi2)/2,canvas.height);
					ctx.lineTo((old_xi3+old_xi2)/2,old_yi3);
					ctx.lineTo((old_xi3+xi)/2,old_yi3);
					ctx.lineTo((old_xi3+xi)/2,canvas.height);
				}
				if (j == this.data[i][0].length-1){
					ctx.moveTo((old_xi3+xi)/2,canvas.height);
					ctx.lineTo((old_xi3+xi)/2,yi);
					ctx.lineTo(xi+(xi-old_xi3)/2,yi);
					ctx.lineTo(xi+(xi-old_xi3)/2,canvas.height);
				}
				if (j == 1){
					ctx.moveTo(old_xi3-(xi-old_xi3)/2,canvas.height);
					ctx.lineTo(old_xi3-(xi-old_xi3)/2,old_yi3);
					ctx.lineTo((xi+old_xi3)/2,old_yi3);
					ctx.lineTo((xi+old_xi3)/2,canvas.height);
				}
			}
			if (  mode.indexOf('mid') >-1  ) {
				if (j!=0){
					ctx.moveTo((old_xi3+old_xi2)/2,old_yi3);
					ctx.lineTo((old_xi3+xi)/2,old_yi3);
					ctx.lineTo((old_xi3+xi)/2,yi);
				}
				if (j == this.data[i][0].length-1){
					ctx.moveTo((old_xi3+xi)/2,yi);
					ctx.lineTo(xi,yi);
				}
			}
			
			if (  mode.indexOf('zig') >-1  ) {
				if (j!=0){
					ctx.moveTo(old_xi3,old_yi3);
					ctx.lineTo(old_xi3,yi);
					ctx.lineTo(xi,yi);
				}
			}
			if (  mode.indexOf('approx') >-1  ) {
				if (j>1){
					ctx.moveTo((old_xi2+old_xi3)/2,(old_yi2+old_yi3)/2);
					ctx.quadraticCurveTo(old_xi3,old_yi3,(old_xi3+xi)/2,(old_yi3+yi)/2);
				}
				if (j===1){
				ctx.moveTo(old_xi1,old_yi1);
				ctx.lineTo((old_xi1+xi)/2,(old_yi1+yi)/2);
				}
				if (j == this.data[i][0].length-1) {
					ctx.moveTo((old_xi3+xi)/2,(old_yi3+yi)/2);
					ctx.lineTo(xi,yi);
				}
			}
			if (  mode.indexOf('interp') >-1  ) {
			var smoothing = 5;
				if (j>2){
					ctx.moveTo(old_xi2,old_yi2);
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi2,
						(old_yi3-old_yi1)/smoothing+old_yi2,
						old_xi3-(xi-old_xi2)/smoothing,
						old_yi3-(yi-old_yi2)/smoothing,
						old_xi3,
						old_yi3
						);
					
				}
				if (j===2){
				ctx.moveTo(old_xi1,old_yi1);
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi1,
						(old_yi3-old_yi1)/smoothing+old_yi1,
						old_xi3-(xi-old_xi1)/smoothing,
						old_yi3-(yi-old_yi1)/smoothing,
						old_xi3,
						old_yi3
						);
				}
				if (j == this.data[i][0].length-1) {
					ctx.moveTo(old_xi3,old_yi3);
					ctx.bezierCurveTo((xi-old_xi2)/smoothing+old_xi3,
						(yi-old_yi2)/smoothing+old_yi3,
						xi-(xi-old_xi3)/smoothing,
						yi-(yi-old_yi3)/smoothing,
						xi,
						yi
						);
				}
			}
			if (  mode.indexOf('scribble') >-1  ) {
			var smoothing = .2;
				if (j>2){
					ctx.moveTo(old_xi2,old_yi2);
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi2,
						(old_yi3-old_yi1)/smoothing+old_yi2,
						old_xi3-(xi-old_xi2)/smoothing,
						old_yi3-(yi-old_yi2)/smoothing,
						old_xi3,
						old_yi3
						);
					
				}
				if (j===2){
				ctx.moveTo(old_xi1,old_yi1);
					ctx.bezierCurveTo((old_xi3-old_xi1)/smoothing+old_xi1,
						(old_yi3-old_yi1)/smoothing+old_yi1,
						old_xi3-(xi-old_xi1)/smoothing,
						old_yi3-(yi-old_yi1)/smoothing,
						old_xi3,
						old_yi3
						);
				}
				if (j == this.data[i][0].length-1) {
					ctx.moveTo(old_xi3,old_yi3);
					ctx.bezierCurveTo((xi-old_xi2)/smoothing+old_xi3,
						(yi-old_yi2)/smoothing+old_yi3,
						xi-(xi-old_xi3)/smoothing,
						yi-(yi-old_yi3)/smoothing,
						xi,
						yi
						);
				}
			}
			old_xi1 = old_xi2;
			old_yi1 = old_yi2;
			old_xi2 = old_xi3;
			old_yi2 = old_yi3;
			old_xi3 = xi;
			old_yi3 = yi;
			ctx.stroke();
		}
	}
	ctx.lineWidth = graph_line_thickness;
	ctx.strokeStyle = gs.color_fg;//'#000000';
	ctx.fillStyle = gs.color_fg;;//'#000000';
	
	if (not_drawn_something && this.no_data == false){
		this.errors.push("there might be data around, just not where you're looking");
	}
	
	
	//draw the ticks and the points. 
	//for x
	
	var stepping = positionsx.stepping;
	if (stepping ){
		var j = -1*tick_labels_font_size/2;
		var o = tick_labels_font_size/2;
	} else {
		var j = 0;
		var o = 0;
		
	}
	for (var i = 0;i<positionsx.pos.length;i++){
		var x = positionsx.pos[i];
		var label = positionsx.strings[i];
		ctx.fillText(label,x-label.length*.3*tick_labels_font_size,canvas.height-tick_len*1.2-tick_lables_font_padding - o - j);
		j *= -1;
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x,tick_len);
		ctx.moveTo(x,canvas.height);
		ctx.lineTo(x,canvas.height-tick_len);
		ctx.stroke();
	}
	for (var i = 0;i<positionsx.minor_pos.length;i++){
		x = positionsx.minor_pos[i];
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x,minor_tick_len);
		ctx.moveTo(x,canvas.height);
		ctx.lineTo(x,canvas.height-minor_tick_len);
		ctx.stroke();
	}
	gs.x_precision = positionsx.precision;
	var stepping = positionsx.stepping;
	
	
	for (var i = 0;i<positionsy.pos.length;i++){
		var y = canvas.height - positionsy.pos[i];
		var label = positionsy.strings[i];
		//if it is near the top, don't put a label, as this is where the axis label is.
		if (y > tick_len+lable_spacing+axis_labels_font_size/2){
			ctx.fillText(label,tick_len*1.2+2,y+3);
		}
		ctx.beginPath();
		ctx.moveTo(0,y);
		ctx.lineTo(tick_len,y);
		ctx.moveTo(canvas.width,y);
		ctx.lineTo(canvas.width-tick_len,y);
		ctx.stroke();
	}
	for (var i = 0;i<positionsy.minor_pos.length;i++){
		y = canvas.height - positionsy.minor_pos[i];
		ctx.beginPath();
		ctx.moveTo(0,y);
		ctx.lineTo(minor_tick_len,y);
		ctx.moveTo(canvas.width,y);
		ctx.lineTo(canvas.width-minor_tick_len,y);
		ctx.stroke();
	}
	
	gs.y_precision = positionsy.precision;

	if (this.hasOwnProperty('captions') && gs.show_captions >0) {
		ctx.font=axis_labels_font_size + 'px ' + font_name//"14px Courier New";
		for (i = 0;i<this.data.length;i++){
			ctx.strokeStyle = this.colors[i];
			ctx.fillStyle = ctx.strokeStyle ;
			if (gs.show_captions >=2){
				label = mjs_precision(this.data[i][1][this.data[i][1].length-1],gs.y_precision+1);
			} else {
				label = '';
			}
			xi = canvas.width - (circle_size + tick_len + 2 + tick_labels_font_size*1) - 0.6*(label.length)*axis_labels_font_size;
			yi = (circle_size+axis_labels_font_size)*i + tick_len + 2 + axis_labels_font_size*2;
			if (gs.show_captions >=2){
				ctx.fillText(label,xi,yi);
				xi -= 0.6*axis_labels_font_size*2;
			} 
			label = this.captions[i] ||  'label' ;
			
			ctx.fillText(label,xi-2*circle_size-0.6*label.length*axis_labels_font_size,yi);

			yi -= 0.5*axis_labels_font_size;
			ctx.beginPath();
			if (  mode.indexOf('circle') >-1  ){
				ctx.arc(xi, yi, circle_size, 0 ,Math.PI*2, true);
			}
			if (  mode.indexOf('dot') >-1  ){
				ctx.fillRect(xi-dot_size/2,yi-dot_size/2,dot_size,dot_size);
			}
			if (  mode.indexOf('line') >-1 ) {
				ctx.moveTo(xi-circle_size,yi-circle_size);
				ctx.lineTo(xi+circle_size,yi+circle_size);
			}
			if (  mode.indexOf('zag') >-1 ) {
				ctx.moveTo(xi,yi-circle_size*1.6);
				ctx.lineTo(xi,yi);
				ctx.lineTo(xi+circle_size*1.6,yi);
			}
			if (  mode.indexOf('zig') >-1 ) {
				ctx.moveTo(xi-circle_size*1.6,yi);
				ctx.lineTo(xi,yi);
				ctx.lineTo(xi,yi+circle_size*1.6);
			}
			if (  mode.indexOf('mid') >-1 ) {
				ctx.moveTo(xi-circle_size*1.6,yi-circle_size);
				ctx.lineTo(xi-circle_size*1.6,yi);
				ctx.lineTo(xi+circle_size*1.6,yi);
				ctx.lineTo(xi+circle_size*1.6,yi+circle_size);
			}
			if (  mode.indexOf('hist') >-1 ) {
				ctx.moveTo(xi-circle_size*1.6,yi+circle_size*1.6);
				ctx.lineTo(xi-circle_size*1.6,yi);
				ctx.lineTo(xi+circle_size*1.6,yi);
				ctx.lineTo(xi+circle_size*1.6,yi+circle_size*1.6);
			}
			if (  mode.indexOf('approx') >-1 ) {
				ctx.moveTo(xi-circle_size*1.6,yi+circle_size*1.6);
				ctx.quadraticCurveTo(xi,yi,xi+circle_size*1.6,yi);
			}
			if (  mode.indexOf('interp') >-1 ) {
				ctx.moveTo(xi-circle_size*1.6,yi+circle_size*1.6);
				ctx.bezierCurveTo(xi+circle_size*1.6,yi+circle_size*1.6,xi-circle_size*1.6,yi-circle_size*1.6,xi+circle_size*1.6,yi-circle_size*1.6);
			}
			ctx.stroke();
			
		}
	//show the 'other lines hidden' text
	
		if (this.data.length != this.data_backup.length){
			i++;
			yi = (circle_size+axis_labels_font_size)*i + tick_len + 2 + axis_labels_font_size*2;
			label = 'other lines hidden';
			xi = canvas.width - (circle_size + tick_len + 2 + tick_labels_font_size*1) - 0.6*(label.length)*axis_labels_font_size;
			ctx.fillStyle = '#808080';
			ctx.fillText(label,xi,yi);
		}
	}
	//draw the captions over the graph
	if (this.hasOwnProperty('captions') && gs.show_captions ==3){
		ctx.font=tick_labels_font_size + 'px ' + font_name//"24px Courier New";	
		ctx.lineWidth = line_thickness;
		var cap_dir = 0;
		var label_distance = circle_size*2 + tick_len;
		var edge_distance = tick_len*2 + circle_size*2;
		for (i = 0;i<this.data.length;i++){			
			var drawn_caps = false;
			var j=0;
			while (j<this.data[i][0].length && drawn_caps == false){
				j++;
				xi = this.units_to_pixels(this.data[i][0][j],'x');
				yi = this.units_to_pixels(this.data[i][1][j],'y');
				//draw captions on the graph with the data
				if (drawn_caps == false &&
					gs.show_captions ==3 &&
					xi >edge_distance*3 &&
					xi < canvas.width - edge_distance &&
					yi > edge_distance*3 &&
					yi < canvas.height - edge_distance ) {
					drawn_caps = true;
					ctx.fillStyle = gs.color_bg;
					ctx.strokeStyle = gs.color_fg;
					label = this.captions[i] ||  'label' ;
					switch (cap_dir){
						case 0:
							dx = label_distance;
							dy = label_distance;
							break;
						case 1:
							dx = -label_distance;
							dy = label_distance;
							break;
						case 2:
							dx = -label_distance;
							dy = -label_distance;
							break;
						case 3:
							dx = label_distance;
							dy = -label_distance;
							break;
					}
						cap_dir = (cap_dir + 1)%4;
						ctx.beginPath();
						ctx.moveTo(xi,yi);
						ctx.lineTo(xi+dx,yi-dy);
						ctx.stroke();
						ctx.beginPath();
						ctx.fillRect(xi+dx - 0.6*tick_labels_font_size, yi-dy+0.6*tick_labels_font_size, (label.length+2)*0.6*tick_labels_font_size, -1.8*tick_labels_font_size);
						ctx.rect(xi+dx - 0.6*tick_labels_font_size, yi-dy+0.6*tick_labels_font_size, (label.length+2)*0.6*tick_labels_font_size, -1.8*tick_labels_font_size);
						ctx.stroke();
						ctx.strokeStyle = this.colors[i];
						ctx.fillStyle = ctx.strokeStyle ;
						ctx.fillText(label,xi+dx,yi-dy);
				}
			}
		}
	}
	ctx.lineWidth = graph_line_thickness;
	ctx.strokeStyle = graph.graphics_style.color_fg;
	ctx.fillStyle = graph.graphics_style.color_fg;
	
	if (this.transform_text_x.length > 1 || this.transform_text_y.length > 1){
		var x_label = this.transform_text_x;
		var y_label = this.transform_text_y;
	} else {
		var x_label = x_axis_title;
		var y_label = y_axis_title;
	}
	//draw x axis label
	ctx.font=axis_labels_font_size + 'px ' + font_name//"14px Courier New";
	if (stepping) {
	ctx.fillText(x_label,canvas.width - lable_spacing - tick_len - x_label.length*.6*axis_labels_font_size,
					 canvas.height - tick_len-lable_spacing- 2*tick_labels_font_size);
	} else {
	ctx.fillText(x_label,canvas.width - lable_spacing - tick_len - x_label.length*.6*axis_labels_font_size,
					 canvas.height - tick_len-lable_spacing-tick_labels_font_size);
	}
	
	//draw y axis lable
	ctx.fillText(y_label,tick_len+lable_spacing,tick_len+lable_spacing);
	//draw transforms stack
	if (gs.data_transforms.length > 0){
		ctx.font=axis_labels_font_size + 'px ' + font_name;//"24px Courier New";
		var label = '['+gs.data_transforms.join('|')+']';
		//top center
		ctx.fillText(label,canvas.width/2 -label.length/2*axis_labels_font_size/2,2*tick_len+title_spacing+axis_labels_font_size*2);
		//bottom left
		//ctx.fillText(label,lable_spacing + tick_len, canvas.height - tick_len-lable_spacing-tick_labels_font_size);
	}
	// draw infomation overlay if the info button is pushed.
	ctx.beginPath();
	ctx.stroke();
	
	
	var sigma = String.fromCharCode( 963 ); //σ²
	var squared = String.fromCharCode( 178 ); //σ²
	var bar = String.fromCharCode( 773 ); //put befor what you want bared e.g. bar + 'y' 
	var edge = tick_len*2.6;
	ctx.font=axis_labels_font_size + 'px ' + font_name//"14px Courier New";
	if (gs.i >= 1){
		//white out the bg
		ctx.fillStyle = gs.color_bg;
		ctx.rect(2*edge,2*edge,canvas.width - 4*edge,canvas.height - 4*edge);
		ctx.fill();
		ctx.stroke();
		//graph.pre_mouse_mode = gs.mouse_mode;
		//gs.mouse_mode = 'i';
		ctx.fillStyle = gs.color_fg;
		var label = "MJS"+"2014"; //not using the variables up top.
		ctx.fillText(label,canvas.width-label.length*.6*axis_labels_font_size-tick_len-2*edge,canvas.height - axis_labels_font_size-2*edge);
		var label = 'version: ' + MJS_PLOT_VERSION;
		ctx.fillText(label,canvas.width-label.length*.6*axis_labels_font_size-tick_len-2*edge,canvas.height - axis_labels_font_size*2.5-2*edge);
	}
	if (gs.fits === 'none'){
		//dont' do anything :(
		//console.log('no fits');
	} else {
		//do some fits or stats!!!! wooo stats. 
		for (i = 0;i<this.data.length;i++){	
			var label = this.captions[i] ||  'label' ;
			ctx.fillStyle = this.colors[i];
			ctx.fillText(label,3*edge, 3*edge + i * edge*3);
			ctx.fillStyle = gs.color_fg;
			if (gs.fits === 'stats'){
				var stats = series_stats(this.data[i][0],this.data[i][1]);
				ctx.fillStyle = gs.color_fg;
				
				ctx.fillText( ' n = ' +stats.n +
					',    cov(x,y) = ' + mjs_precision(stats.cov,Math.min(gs.x_precision,gs.y_precision)+3)
					,4*edge + label.length*.6*axis_labels_font_size, 3*edge + i * edge*3);
				ctx.fillText(bar + 'x = ' +number_quote(stats.x_mean,stats.sigma_x) +
					',   '+sigma+'(x) = ' +mjs_precision(stats.sigma_x,2)
					,4*edge, 4*edge + i * edge*3);
				ctx.fillText(bar + 'y = ' + number_quote(stats.y_mean,stats.sigma_y) + 
					',   '+sigma+'(y) = ' +mjs_precision(stats.sigma_y,2)
					,4*edge, 5*edge + i * edge*3);
				if (gs.i >= 1){
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
			if (gs.fits === 'lin'){
				var stats = series_stats(this.data[i][0],this.data[i][1]);
				ctx.fillStyle = gs.color_fg;
				ctx.fillText( 'r'+squared+' = ' + number_quote(stats.r_2,1-stats.r_2)
					,4*edge + label.length*.6*axis_labels_font_size, 3*edge + i * edge*3);
				ctx.fillText('intecept a = ' + number_quote(stats.a,stats.s_a) +
					',   S(a) = ' +mjs_precision(stats.s_a,2),4*edge, 4*edge + i * edge*3);
				ctx.fillText('slope b = ' + number_quote(stats.b,stats.s_b) + 
					',   S(b) = ' +mjs_precision(stats.s_b,2),4*edge, 5*edge + i * edge*3);
				//draw on the lines. . . 
				ctx.beginPath();
				//get an approxamate number of nodes for the line
				var n = Math.ceil(Math.max(canvas.width,canvas.height)/10);
				//put y to the start of the line
				if (gs.i >= 1){
				ctx.strokeStyle = this.colors[i];
				} else {
				ctx.strokeStyle = gs.color_fg;
				}
				var xi =  graph.units_to_pixels(stats.xmin,'x');
				var yi = graph.units_to_pixels(stats.xmin*stats.b+stats.a,'y');
				ctx.moveTo(xi,yi);
				for (var k = 0;k<n+1;k++){
					var yi = graph.units_to_pixels((stats.xmin+k*(stats.xmax-stats.xmin)/n)*stats.b+stats.a,'y');
					var xi =  graph.units_to_pixels(stats.xmin+k*(stats.xmax-stats.xmin)/n,'x');
					ctx.lineTo(xi,yi);
				}
				ctx.stroke();
				
			}
			
			//exponential_fit(x,y)
			if (gs.fits === 'exp'){
				var fit = exponential_fit(this.data[i][0],this.data[i][1]);
				//return {equation: [A, B], points: results, string: string};
				ctx.fillText(fit.string,3*edge, 4*edge + i * edge*3);
				
				if (gs.i >= 1){
				ctx.strokeStyle = this.colors[i];
				} else {
				ctx.strokeStyle = gs.color_fg;
				}
				ctx.beginPath();
				for (var k = 0;k<this.data[i][0].length;k++){
					yi = graph.units_to_pixels(fit.points[k],'y');
					xi =  graph.units_to_pixels(this.data[i][0][k],'x');
					ctx.lineTo(xi,yi);
				}
				ctx.stroke();
			}
			//exponential_fit_plus_c(x,y){
			if (gs.fits === 'exp_c'){
				var fit = exponential_fit_plus_c(this.data[i][0],this.data[i][1]);
				//return {equation: [A, B], points: results, string: string};
				ctx.fillText(fit.string,3*edge, 4*edge + i * edge*3);
				
				if (gs.i >= 1){
				ctx.strokeStyle = this.colors[i];
				} else {
				ctx.strokeStyle = gs.color_fg;
				}
				ctx.beginPath();
				for (var k = 0;k<this.data[i][0].length;k++){
					yi = graph.units_to_pixels(fit.points[k],'y');
					xi =  graph.units_to_pixels(this.data[i][0][k],'x');
					ctx.lineTo(xi,yi);
				}
				ctx.stroke();
			}
			
			var polys = ['quad', 'cubic','poly4','poly5','poly6','poly7']
			if (polys.indexOf(gs.fits)>-1){
				var fit = polynomial_fit(this.data[i],polys.indexOf(gs.fits)+2);
				//{coeffs: coeffs, fit: results, string: string};
				ctx.fillText(fit.string,3*edge, 4*edge + i * edge*3);
				ctx.fillText( 'r'+squared+' = ' + number_quote(fit.r_squared,1-fit.r_squared)
					,4*edge + label.length*.6*axis_labels_font_size, 3*edge + i * edge*3);
				if (gs.i >= 1){
				ctx.strokeStyle = this.colors[i];
				} else {
				ctx.strokeStyle = gs.color_fg;
				}
				ctx.beginPath();
				
				for (var k = 0;k<this.data[i][0].length;k++){
					yi = graph.units_to_pixels(fit.fit[k],'y');
					xi =  graph.units_to_pixels(this.data[i][0][k],'x');
					ctx.lineTo(xi,yi);
				}
				ctx.stroke();
			}
			
		}
	}
	
	if (gs.o >= 1){
		//draw the options plane.
		ctx.fillStyle = gs.color_bg;
		ctx.rect(2*edge,2*edge,canvas.width - 4*edge,canvas.height - 4*edge);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = gs.color_fg;
		var values = [gs.guideWidthx, gs.guideWidthy,gs.circle_size, gs.dot_size, gs.line_thickness, gs.tick_len,gs.minor_tick_len, gs.title_font_size,gs.tick_labels_font_size,gs.axis_labels_font_size,gs.title_spacing,gs.tick_lables_font_padding,gs.lable_spacing,gs.graph_line_thickness];
		var names = ['scale width x','scale width y','circle size','dot size','line thickness','tick length','minor tick length','title font size','ticks font size','axis font size','title spacing','tick padding','label spacing','graph line thickness'];
		ctx.font=tick_labels_font_size + 'px ' + font_name//"14px Courier New";
		for (var i = 0;i<values.length;i++){
			ctx.rect(2.5*edge,3*edge + i * tick_labels_font_size*1.2 -tick_labels_font_size*0.75 ,tick_labels_font_size,tick_labels_font_size);
			ctx.rect(2.5*edge+tick_labels_font_size*1.2,3*edge + i * tick_labels_font_size*1.2 -tick_labels_font_size*0.75 ,tick_labels_font_size,tick_labels_font_size);
			ctx.fillText( '+ -' ,2.5*edge, 3*edge + i * tick_labels_font_size*1.2);
			ctx.fillText( names[i] + ' = ' + mjs_precision(values[i],3) ,2.5*edge+tick_labels_font_size*3, 3*edge + i * tick_labels_font_size*1.2);
		}
		ctx.stroke();
		//the strings
		var strings  = [gs.font_name,gs.title,gs.subtitle,gs.x_axis_title,gs.y_axis_title,gs.color_fg,gs.color_bg];
		var string_names = ['font','title','subtitle','x-axis','y-axis','fg color','bg color'];
		j=0;
		for (var i = values.length;i<values.length+strings.length;i++){
			ctx.rect(2.3*edge,3*edge + i * tick_labels_font_size*1.2 -tick_labels_font_size*0.75 ,tick_labels_font_size*3,tick_labels_font_size);
			ctx.fillText( 'edit' ,2.5*edge, 3*edge + i * tick_labels_font_size*1.2);
			ctx.fillText( string_names[j] + ' = ' + strings[j] ,2.5*edge+tick_labels_font_size*3, 3*edge + i * tick_labels_font_size*1.2);
			j++;
		}
		ctx.stroke();
		i++;
		ctx.rect(2.3*edge,3*edge + i * tick_labels_font_size*1.2 -tick_labels_font_size*0.75 ,tick_labels_font_size*4,tick_labels_font_size);
		ctx.stroke();
		ctx.fillText( 'Reset' ,2.5*edge, 3*edge + i * tick_labels_font_size*1.2);
		
		gs.mouse_mode = 'options';
		
	}
	
	ctx.strokeStyle = gs.color_fg;
	//draw title and subtitle
	ctx.fillStyle = gs.color_fg; 
	ctx.font=title_font_size + 'px ' + font_name;//"24px Courier New";
	ctx.fillText(title,canvas.width/2 -title.length/2*title_font_size/2,2*tick_len+title_spacing);
	ctx.font=axis_labels_font_size + 'px ' + font_name;//"24px Courier New";
	ctx.fillText(subtitle,canvas.width/2 -subtitle.length/2*axis_labels_font_size/2,2*tick_len+title_spacing+axis_labels_font_size);
	
	//print any errors to the screen
	//graph.errors = ['some error']
	if (this.errors.length >0){
		ctx.font=axis_labels_font_size + 'px ' + font_name;//"24px Courier New";
		//make the text red
		var oldfill = ctx.fillStyle;
		ctx.fillStyle = "#FF0000";
		for (var i = 0;i<this.errors.length;i++){
			var s = "error > " + this.errors[i];
			var x = canvas.width/2 -s.length/2*axis_labels_font_size/2;
			var y = 2*tick_len+title_spacing+axis_labels_font_size+canvas.height/2 - axis_labels_font_size*this.errors.length/2 + axis_labels_font_size*i;
			ctx.fillText(s,x,y);
		}
		// return the fill colour
		ctx.fillStyle = oldfill;
	}
	
	//clear the error list.
	this.errors = [];
	
	//flush the drawing code
	ctx.beginPath();
	ctx.stroke();
	gs.modified = true;
	//cookie stuff
	//bake_cookie(this.graph_name, gs);
	save_gs(this.graph_name, gs);
	this.graph_image = ctx.getImageData(0,0,canvas.width,canvas.height);
	this.plot_failed = false;
	
},//end of plot function
	units_to_pixels : function (number,axis){//converts a number to it's position in pixels
	
		if (axis === 'x'){
			if (this.graphics_style.x_scale_mode ==='lin'){
				return (number-this.graphics_style.x_auto_min)*this.canvas.width/(this.graphics_style.x_auto_max - this.graphics_style.x_auto_min);
			}
			if (this.graphics_style.x_scale_mode ==='log'){
				return (Math.log10(number)-this.graphics_style.x_auto_min)*this.canvas.width/(this.graphics_style.x_auto_max - this.graphics_style.x_auto_min);
			}
		}
		if (axis === 'y'){
			if (this.graphics_style.y_scale_mode ==='lin'){
				return this.canvas.height - (number-this.graphics_style.y_auto_min)*this.canvas.height/(this.graphics_style.y_auto_max - this.graphics_style.y_auto_min);
			}
			if (this.graphics_style.y_scale_mode ==='log'){
				return this.canvas.height - (Math.log10(number)-this.graphics_style.y_auto_min)*this.canvas.height/(this.graphics_style.y_auto_max - this.graphics_style.y_auto_min);
			}
		}
		
	},
	pixels_to_units : function (pixels,axis){ // convertis pixels over the graph to the corrisponding value on the graph
			if (axis === 'x'){
				if (this.graphics_style.x_scale_mode ==='lin'){
					return  pixels / this.canvas.width * (this.graphics_style.x_auto_max - this.graphics_style.x_auto_min )+this.graphics_style.x_auto_min;
				}
				if (this.graphics_style.x_scale_mode ==='log'){
					return Math.pow(10,pixels / this.canvas.width * (this.graphics_style.x_auto_max - this.graphics_style.x_auto_min )+this.graphics_style.x_auto_min);
				}
			}
			if (axis === 'y'){
				if (this.graphics_style.y_scale_mode ==='lin'){
					return (this.graphics_style.y_auto_max - this.graphics_style.y_auto_min) * (this.canvas.height-pixels) / this.canvas.height + this.graphics_style.y_auto_min;
				}
				if (this.graphics_style.y_scale_mode ==='log'){
					return Math.pow(10,(this.canvas.height-pixels)  / this.canvas.height * (this.graphics_style.y_auto_max - this.graphics_style.y_auto_min )+this.graphics_style.y_auto_min);
				}
				
			}
		}
};//end of graph object
	graph.canvas = canvas;
	make_interactive(graph);
	return graph;
	
}//end of new_graph()

function make_interactive(graph){
	graph.canvas.addEventListener('mousemove', function(event){mouse_move_event(event,graph);}, false);
	graph.canvas.addEventListener('mousedown', function(event){mouse_down_event(event,graph);}, false);
	graph.canvas.addEventListener('mouseup', function(event){mouse_up_event(event,graph);} , false);
	graph.canvas.addEventListener('mouseout', function(event){mouse_out_event(event,graph);} , false);
	graph.canvas.oncontextmenu = function (e) {e.preventDefault();};
	// TODO get keyboard to work. z for zoom, m for measure, c for cut etc....
	//graph.canvas.addEventListener('keydown', function(event){keypress_event(event,graph);} , false);
}