function drawnLine(tagname,data,label,seriex) {
	document.getElementById(tagname).innerHTML = "";
	var plot2 = $.jqplot (tagname,data, {
	    title: "Plot With Options",
	    axesDefaults: {
	    	labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	    },
	    axes: {
			xaxis: {
				label: "X Axis",
				pad: 0
			},
			yaxis: {
				label: "Y Axis"
			}	
	    }
	 });
}

function drawnBarStack(tagname,data,label,seriex) {
	document.getElementById(tagname).innerHTML = "";
  	plot1 = jQuery.jqplot (tagname, data, 
    {
  	  stackSeries: true,
  	  captureRightClick: true,
      seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
            	fillToZero: true,
        	  	barMargin: 10,
        	  	highlightMouseDown: true
            },
			pointLabels: { show: true }
      }, 
      series: label,
	  legend: {
            show: true,
			location: "e",
      		placement: "outside"
        },
      axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: seriex
            },
            yaxis: {
				padMin : 0
            }
        }
    });
}

function drawnBar(tagname, ticks,data,label) {
  	plot1 = jQuery.jqplot (tagname, data, 
    {
      seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            barMargin: 10,
            rendererOptions: {fillToZero: true },
			pointLabels: { show: true }
      }, 
      series: label,
	  legend: {
            show: true,
			location: "e",
      		placement: "outside"
        },
      axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            yaxis: {
                pad: 1.2,
				min: 0
            }
        }
    });
}


function limpiaForm(miForm) {
	$(":input", miForm).each(function() {
		var type = $(this).attr("type");
		var tag = this.tagName.toLowerCase();
		if (type == "text" || type == "password" || tag == "textarea" || type == "number"){
			$(this).val("");
		}
		else if (type == "checkbox" || type == "radio")
			this.checked = false;
		else if (tag == "select"){
			$(this).val(0);
			$(this).selectmenu("refresh");
		}
	});
}

function popup(asunto, msg, url){
	$("html").simpledialog2({
		mode: "button",
   		headerText: asunto,
    	headerClose: true,
    	buttonPrompt: msg,
    	buttons : {
    		"OK": {
    			click: function () { 
    				$("#buttonoutput").text("OK");
    				if(url!=""){
    					$(location).attr("href",url);
    				}
    				return true;
    			}
    		},
			"Cancel": {
				click: function () { 
					$("#buttonoutput").text("Cancel");
				},
				icon: "delete",
				theme: "c"
			}
    	}
	});
}

function popup(asunto, msg, url1, url2) {
	$("html").simpledialog2({
		mode : "button",
		headerText : asunto,
		headerClose : true,
		buttonPrompt : msg,
		buttons : {
			"OK" : {
				click : function() {
					$("#buttonoutput").text("OK");
					if (url1 != '') {
						$(location).attr("href", url1);
					}
					return true;
				}

			},
			"Cancel" : {
				click : function() {
					$("#buttonoutput").text("Cancel");
					$(location).attr("href", url2);
				},
				icon : "question",
				theme : "c"
			},
		}
	});
}

function getUrlVars(params) {
	var vars = [], hash;
	var hashes = params.split("&");
	for ( var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split("=");
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function updateDateTime(field,format) {
    now = moment(new Date());
	$(field).val(now.format(format));
};

function detectBrowser(namediv) {
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById(namediv);

	if (useragent.indexOf("iPhone") != -1 || useragent.indexOf("Android") != -1 ) {
		mapdiv.style.width = "100%";
		mapdiv.style.height = "100%";
	}
	else {
		mapdiv.style.width = $(window).width();
		mapdiv.style.height = $(window).height();
	}
}
