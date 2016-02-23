TODO
====

things to get done

Bugfixes
--------

None known. If found please inform.

Features
--------

Get advanced curve fitting. Use the itterative method,. make a different fit object that can cache the data so that it isn't doing a full fit each time, only when it needs do. There sould be quite a few pre written shapes. As well as a fit your own option.
The use will need to write the number of fitting parameters, define the equation in the form y=p[0]*x + 1/p[1] etc, then give starting values to each of parameters to the fitter. This can be saved in the form [2,"p[0]*x+1/p[1]","[3.4,0.001]"]
in the custom fits part of the graphics style.

Fit masks. apply a mask to the data, a list of rects, that can be applied like trim and cut. This can be applied after all the data is drawn.
save trim rects, and cut rests as an array.
Have tools in the fit menu to clear mask, view mask (draw darkened sections to the screen), add to mask (rect like tool), remove from mask(reck like tool too).
The process that a use will take to disregard a point will be, fit menu>mask>add to mask> user draws rect that covers the bad point.

0_4_n 
-----

This is the next big version. It will have API breaking changes.
and ajax data loading support!
better responsive design handling.
load a background image?

 
