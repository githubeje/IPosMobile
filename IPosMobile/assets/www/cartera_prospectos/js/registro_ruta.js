var markers = new Array();
var latitud = '';
var longitud = '';
var idVisita = '';
var directionsService = new google.maps.DirectionsService();
var map;
var gmarkers = [];
var pedidoIdProducto = [];
var pedidoNombreProducto = [];
var pedidoCantidad = [];
var pedidoPrecio = [];

var icons = new Array();
var datetime = null,
        date = null;

icons["red"] = new google.maps.MarkerImage("../images/marker_red.png",
										   new google.maps.Size(20, 34),
										   new google.maps.Point(0,0),
										   new google.maps.Point(9, 34));

var iconImage = new google.maps.MarkerImage("../images/marker_red.png",
											new google.maps.Size(20, 34),
											new google.maps.Point(0,0),
											new google.maps.Point(9, 34));
var iconShadow = new google.maps.MarkerImage("http://www.google.com/mapfiles/shadow50.png",
											 new google.maps.Size(37, 34),
											 new google.maps.Point(0,0),
											 new google.maps.Point(9, 34));
var iconShape = {
	coord: [9,0,6,1,4,2,2,4,0,8,0,12,1,14,2,16,5,19,7,23,8,26,9,30,9,34,11,34,11,30,12,26,13,24,14,21,16,18,18,16,20,12,20,8,18,4,16,2,15,1,13,0],
	type: "poly"
};


$("#filtro").live("pageinit", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/rutas",{ },getPuntosRuta);
});

$("#buscar").live("click", function() {
	if ($("#formulario").validate({
		 errorPlacement: function(error, element) {
			 if ($(element).is("select")) {
				 error.insertAfter($(element).parent());
			 }
			 else {
				 error.insertAfter(element);
			 }
		 }
	 }).form() == true) {
		 $(location).attr("href","#mapa");
	 }
});

$("#mapa").live("pageshow", function() {
	map = null;
	getRuta();
});

$("#cliente").live("pageshow", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/clientes",{ },getClientes);
});

$("#pedido").live("pageinit", function() {
    $.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productosvigentes",{ },getProductosVigentes);
});

$("#pedido").live("pageshow", function() {
	if(pedidoIdProducto!=null && pedidoIdProducto.length>0) {
		$("#count").show();
	}
	else {
		$("#count").hide();
	}
});

$("#registro").live("pageinit", function() {
    updateDateTime("#fecha","DD/MM/YYYY");
    updateDateTime("#hora","HH:mm:ss");
});

$("#canvas a").live("click",function(e){
    data = $(this).jqmData("params");
    globalParams = data !== null ? data : null;
	idVisita = getUrlVars(globalParams)["id"];
});

$("#agregar_producto").live("click", function() {
	if ($("#formulario2").validate({
		errorPlacement: function(error, element) {
			if ($(element).is("select")) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		pedidoIdProducto.push($("#producto").val());
		pedidoNombreProducto.push($("#producto option[value='" + $('#producto').val() + "']").text());
		pedidoCantidad.push($("#cantidad").val());
		pedidoPrecio.push($("#precio").val());
		popup("Mensaje", "Se agregado el producto al pedido","#pedido");
		limpiaForm("#formulario2");
		if(pedidoIdProducto!=null && pedidoIdProducto.length>0) {
			number = '<span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' 
					 + pedidoIdProducto.length + 
					 '</span><span class="ui-icon ui-icon-page ui-icon-shadow">&nbsp;</span></span>';
			$("#count").html(number);
			$("#count").show();
		}
	}
});

$("#grabar").live("click", function() {
	$("#canvas").gmap("getCurrentPosition", function(position, status) {
		if ( status === "OK" ) {
			latitud = position.coords.latitude;
			longitud = position.coords.longitude;
			fecha = moment().format("YYYYMMDD");
			hora = moment().format("HHmmss");
			$.ajax({ 
				type: "POST",
				url: "http://www.anywhere.cl/wsanywhere/services/registrovisita/save/",
				data: { a1:"1",						//idPuntoRuta
						a2:"1",						//idEjecutivo
						a3:$("#rut").val(),			//rutCliente
						a4:$("#estado").val(),		//estadoVisita
						a5:$("#comentario").val(),	//comentario
						a6:latitud,					//latitud
						a7:longitud,				//longitud
						"a8[]": pedidoIdProducto,	//producto
						"a9[]":pedidoCantidad,		//cantidad
						"a10[]":pedidoPrecio		//precio
					},
				crossDomain : true,
				success: function(data,status,jqXHR) { 
					popup("Mensaje", "Se ha grabado la visita","../index.html")
					limpiaForm("#formulario");
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					popup("Mensaje", "Ocurrio un error al grabar la visita","index.html")
					limpiaForm("#formulario");	
				},
				complete: function(data) {	}	
			})	

		}
	});
});

function getProductosVigentes(data) {
    $.each(data, function(key, val) {
        $.each(val, function(key2, val2) {
            $("#producto").append($("<option>", {value : val2[0].value}).addClass(val2[4].value).text(val2[1].value));
        });
    });        
}

function getClientes(data) {
    $.each(data, function(key, val) {
        $.each(val, function(key2, val2) {
            $("#rut").append($("<option>", {value : val2[0].value}).addClass("principal").text(val2[1].value + "-" + val2[2].value));
        });
    });        
}

$("#rut").live("change",function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/query/detailsbyclientes/" + $(this).val(),{ },getDatosCliente);
});

function getDatosCliente(data) {
	$("#nombre").val(data.h[3].value);
	$("#correo").val(data.h[6].value);
	$("#direccion").val(data.h[7].value);	
}

function getPuntosRuta(data) {
    markers = [];
    var x=0;
    $.each(data, function(key, val) {
        markers[x] = new Array(6);
        $.each(val, function(key2, val2) {
            markers[x][0] = val2[0].value;  //id
            markers[x][1] = val2[5].value;    //latitud
            markers[x][2] = val2[6].value;  //longitud
            markers[x][3] = val2[9].value;  //link
            markers[x][4] = val2[7].value;  //valor default
            markers[x][5] = val2[7].value;  //direccion fisica
        });
        x = x + 1;
    });
    
    for (x = 0; x < markers.length; x++) {
    	$("#inicio").append($("<option>", {value : markers[x][0]}).text(markers[x][5]));
    	$("#fin").append($("<option>", {value : markers[x][0]}).text(markers[x][5]));
    }        
}
    
function getRuta() {
	directionsDisplay = new google.maps.DirectionsRenderer();
    var enlace = new Array(); 
	var waypts = [];   
    var mapOptions = {
    		zoom: 4,
    		center: new google.maps.LatLng(-33.603182,-70.743713),
    		mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
    map = new google.maps.Map(document.getElementById("canvas"), mapOptions);
	
	if($("#indicaciones").is(":checked")) {
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById("display"));	
	}
	else {
		document.getElementById("display").innerHTML = "";
	}
	
    var bounds = new google.maps.LatLngBounds();
    var marker;    
    var x=0;
    for (x = 0; x < markers.length; x++) {
        var infowindow =  new google.maps.InfoWindow();
        if(markers[x][3] == 1) {
            enlace[x] = '<a href="#registro" ' + 'data-params="id=' + markers[x][0] + '&latitud='+ markers[x][1] +'&longitud='+ markers[x][2] + '">Registrar Visita' + '</a>';
            icono = "../images/OK.png";
        }
        else {
            enlace[x] = "";
            icono = "../images/No.png";
        }
        var pos = new google.maps.LatLng(markers[x][1] , markers[x][2]);
        bounds.extend(pos);
        var color = "yellow";
		if(markers[x][0] == $("#inicio").val()) {
			comienzo = pos ;
			color = "green";
		}
		else if(markers[x][0] ==  $("#fin").val()) {
			fin = pos ;
			color = "red";
		}
		else {
			waypts.push({ location:pos, stopover:true});
		}
		
        marker = new google.maps.Marker({
            position: pos,
            map: map,
            title : markers[x][5],
        	icon: getMarkerImage(color),
        	draggable: false
        });
        
        google.maps.event.addListener(marker, "click", 
           (
               function(marker,x) {
                   return function() {
                       infowindow.setContent(markers[x][5] + "<br>" + enlace[x]);
                       infowindow.open(map, marker);
                   }
               }
           )(marker,x));
    }
    map.fitBounds(bounds);

    var request = null;
    if($("#modo").val()=="TRANSIT") {
        request = {
           	origin: comienzo,
           	destination: fin,
           	waypoints: waypts,
           	optimizeWaypoints: true,
           	travelMode: google.maps.DirectionsTravelMode.TRANSIT,
       	    transitOptions: { departureTime: new Date() },
       	    unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: $("#autopista").is(":checked"),
            avoidTolls: $("#peaje").is(":checked")       	    
    	}
    }
	else {
	    request = {
	    	origin: comienzo,
	        destination: fin,
	        waypoints: waypts,
	        optimizeWaypoints: true,
	        travelMode: google.maps.DirectionsTravelMode[$("#modo").val()],
	        unitSystem: google.maps.UnitSystem.METRIC,    		
            avoidHighways: $("#autopista").is(":checked"),
            avoidTolls: $("#peaje").is(":checked")       	    
	    }
	}
    directionsService.route(request, RenderCustomDirections);
}

function RenderCustomDirections(request, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		var polyline = new google.maps.Polyline({
			path: [],
			strokeColor: "#FF0000",
			strokeWeight: 3
		});
		waypts = [];
        var bounds = new google.maps.LatLngBounds();
        var route = request.routes[0];
		var path = request.routes[0].overview_path;
		var legs = request.routes[0].legs;
		for (i=0;i<legs.length;i++) {
			var steps = legs[i].steps;
			for (j=0;j<steps.length;j++) {
				var nextSegment = steps[j].path;
				for (k=0;k<nextSegment.length;k++) {
					polyline.getPath().push(nextSegment[k]);
					bounds.extend(nextSegment[k]);
				}
			}
		}
		polyline.setMap(map);
		directionsDisplay.setDirections(request);
	}
}

function getMarkerImage(iconColor) {
	if ((typeof(iconColor)=="undefined") || (iconColor==null)) { 
		iconColor = "red"; 
	}
	if (!icons[iconColor]) {
		icons[iconColor] = new google.maps.MarkerImage("../images/marker_"+ iconColor +".png",
													   new google.maps.Size(20, 34),
													   new google.maps.Point(0,0),
													   new google.maps.Point(9, 34));
	} 
	return icons[iconColor];
}

$("#detalle_pedido").live("pageshow",function() {
	columna1 =  '<div class="ui-block-a" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Producto</div>';
	columna2 =  '<div class="ui-block-b" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Cantidad</div>';
	columna3 =  '<div class="ui-block-c" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Precio</div>';
	columna4 =  '<div class="ui-block-d" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Eliminar</div>';
	
	contenido = "";
	for(x=0;x<pedidoIdProducto.length;x++) {
		contenido = contenido + '<div class="ui-block-a" style="background-color:#EEEEEE;text-align:left">' + pedidoNombreProducto[x] + '</div>';
		contenido = contenido + '<div class="ui-block-b" style="background-color:#EEEEEE;text-align:center">' + pedidoCantidad[x] + '</div>'; 
		contenido = contenido + '<div class="ui-block-c" style="background-color:#EEEEEE;text-align:center">' + pedidoPrecio[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-d" style="background-color:#EEEEEE;text-align:center"> X </div>';		
	}
	$("div.ui-grid-c").html(columna1 + columna2 + columna3 + columna4 + contenido);
});

