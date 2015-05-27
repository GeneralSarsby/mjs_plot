function [ output_args ] = MJSplot( data, captions, titlestr, xaxis,yaxis )

%data: A cell array like {x1 y1 x2 y2}
%captions: a cell array of strings {'r8' 'r1'};
%titlestr: a string 'title';
%xaxis = 'x axis';
%yaxis = 'y axis';
% e.g. MJSplot({x y},{'Thing'},'Temperature of a thing','Angle','Temp');
%% do some work fixing the direction of the data
for i = 1:size(data,2)
    if size(data{i},2) > size(data{i},1)
        %data is the wrong way around. 
        data{i} = data{i}';
    end
end

%% protect against massive data sets!
limit = 10000;
for i = 1:size(data,2)
    if size(data{i},1) > limit
        data{i} = downsample(data{i},floor(size(data{i},1)/limit)+1);
        warning('downsampling large data sets');
    end
end

%%
titles = {};
o = '';

for i = 1:size(data,2)
    
    titles{i} = strcat('s',num2str(i));
    o = [o titles{i} '=['];
    for j = 1:size(data{i},1)-1
        o = [o num2str( data{i}(j)),','];
    end
    o = [o num2str( data{i}(j+1)) '];' sprintf('\n')];
end
%%
t = '[';
for i = 1:size(titles,2)
    if mod(i,2) == 1
        t = [t '[' titles{i} ','];
    end
    if mod(i,2) == 0
        t = [t titles{i} ']'];
        if i < size(titles,2)
            t = [t ','];
        end
    end
   
end
t = [t ']'];
%%
c = '[';
captions;
for i = 1:size(captions,2)
    c = [c '"' captions{i} '"'];
    if i < size(captions,2)
            c = [c ','];
    end
end
c = [c ']'];

%%
head = '<!DOCTYPE html><html><head><meta http-equiv="content-type" content="text/html; charset=windows-1252"><meta name="viewport" content="initial-scale=1.0"><style>body,canvas,html{margin: 0px;padding:0px;overflow:hidden}html,body{width:100%;height:100%;}</style><script src="mjs_plot_0_2_n.js"></script></head><body onresize="draw_graphs()" onload="draw_graphs()"><canvas id="MJSplotcanvas"></canvas></body>';
startfunstring = '<script>	var matlab_graph = new_graph("matlab_graph","MJSplotcanvas");';
setdatastring = strrep('matlab_graph.set_data(##);','##',t);
setcaptionsstring = strrep('matlab_graph.set_captions(##);','##',c);
titlestring = strrep('matlab_graph.default_graphics_style.title = "##";','##',titlestr);
xaxisstring = strrep('matlab_graph.default_graphics_style.x_axis_title =  "##";','##',xaxis);
yaxisstring = strrep('matlab_graph.default_graphics_style.y_axis_title =  "##";','##',yaxis);
updatestring = 'function draw_graphs(){	matlab_graph.canvas.width = window.innerWidth; matlab_graph.canvas.height = window.innerHeight;	matlab_graph.mjs_plot();}';
endfunstring = '</script> </html>';

%%
filename = 'matlabplot.html';
fid = fopen(filename,'w');
fprintf(fid,'%s',head);
fprintf(fid,'%s',startfunstring);
fprintf(fid,'%s',o);
fprintf(fid,'%s',setdatastring);
fprintf(fid,'%s',setcaptionsstring);
fprintf(fid,'%s',titlestring);
fprintf(fid,'%s',xaxisstring);
fprintf(fid,'%s',yaxisstring);
fprintf(fid,'%s',updatestring);
fprintf(fid,'%s',endfunstring);

fclose(fid);

end

