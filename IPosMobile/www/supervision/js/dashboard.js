$('#principal').live('pageshow',function() {
	var line1=[['2008-09-30', 4], ['2008-10-30', 6.5], ['2008-11-30', 5.7], ['2008-12-30', 9], 
    ['2009-01-30', 8.2], ['2009-02-28', 7.6], ['2009-03-30', 11.4], ['2009-04-30', 16.2], 
    ['2009-05-30', 21.8], ['2009-06-30', 19.3], ['2009-07-30', 29.7], ['2009-08-30', 36.7], 
    ['2009-09-30', 38.7], ['2009-10-30', 33.7], ['2009-11-30', 49.7], ['2009-12-30', 62.7]];
     
    var plot1 = $.jqplot('ventas_periodo', [line1], {
        title:'Rotated Axis Text',
        axes:{
            xaxis:{
                renderer:$.jqplot.DateAxisRenderer, 
                rendererOptions:{
                    tickRenderer:$.jqplot.CanvasAxisTickRenderer
                },
                tickOptions:{ 
                    fontSize:'8pt', 
                    fontFamily:'Tahoma', 
                    angle:-40
                }
            },
            yaxis:{
                rendererOptions:{
                    tickRenderer:$.jqplot.CanvasAxisTickRenderer},
                    tickOptions:{
                        fontSize:'8pt', 
                        fontFamily:'Tahoma', 
                        angle:30
                    }
            }
        },
        series:[{ lineWidth: 1 }],
        
    });
	
	$(window).resize(function() {
        
            plot1.replot();
        
    });
});



