var map = null;
var geocoder = null;
var markers = new Array();
var latitud = null;
var longitud = null;
var LegendControlParams_;

$("#be").live("click",function() {
	$('#ejecutivo').removeClass("required").addClass("");
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
		fi = moment($("#fecha_inicio").val(),"DD/MM/YYYYY").format("YYYY-MM-DD");
		ft = moment($("#fecha_termino").val(),"DD/MM/YYYYY").format("YYYY-MM-DD");
		ka = 3;
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/ejecutivosporka/" + fi + "/" + ft + "/" + ka,{},getEjecutivos);
	}
});

$("#mensajeejecutivo").live("pageinit", function() {
    $.getJSON('http://www.anywhere.cl/wsanywhere/services/p2s/querys/eventos',{ },getTipoEvento);
    updateDateTime("#msg_fecha_creacion","DD/MM/YYYY HH:mm:ss");
    updateDateTime("#msg_fecha_activacion","DD/MM/YYYY HH:mm:ss");	
});

$('#enviarmensaje').live('click', function() {
	if ($("#formulario2").validate({
		 errorPlacement: function(error, element) {
			 if ($(element).is("select")) {
				 error.insertAfter($(element).parent());
			 }
			 else {
				 error.insertAfter(element);2
			 }
		 }
	 }).form() == true) {
		$.ajax({
            type: "POST",
            url: "http://localhost:8080/anywhere/dispatcher",
            data: $(formulario2).serialize(),
            crossDomain : true,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg();
            },
            success: function(data,status,jqXHR) {
            	popup('Mensaje', 'No hay coincidencias con su busqueda, pruebe busqueda por categorias clasificadas', '#filtro');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            },
            complete: function(data) {
                $.mobile.hidePageLoadingMsg();
            }
        });
	}
});


$('#sendmessege').live('click', function() {
	$(location).attr('href','#mensajeejecutivo');
});

$('#buscar').live('click', function() {
	$('#ejecutivo').addClass("required");
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
		var ptoventa = "1";
		nombreejecutivo = $("#ejecutivo :selected").text();
		$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/rutasejecutivo/" + ptoventa +  "/" + ejecutivo.value,{ },getPuntosRuta);
		$(location).attr('href','#visualizacion');
	}
});	

$('#mapa').live('pageshow', function() {
	map = null;
	drawMap();
});	


function getEjecutivos(data) {
	$('#ejecutivo').empty().append($('<option>', {value : "0"}).text('Escoger un ejecutivo'));
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#ejecutivo').append($('<option>', {value : val2[4].value}).text(val2[5].value));
		});
	});		
}

function getTipoEvento(data) {
	$('#id_event').empty().append($('<option>', {value : "0"}).text('Seleccionar un tipo de Mensaje'));
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#id_event').append($('<option>', {value : val2[0].value}).text(val2[1].value));
		});
	});		
}

function getPuntosRuta(data) {
    markers = [];
    var x=0;
    $.each(data, function(key, val) {
        markers[x] = new Array(6);
        $.each(val, function(key2, val2) {
            markers[x][0] = val2[0].value;  //id
            markers[x][1] = val2[5].value;  //latitud
            markers[x][2] = val2[6].value;  //longitud
            markers[x][3] = val2[9].value;  //estado de visita  //0 SI VISITADO - 1 NO VISITADO
            markers[x][4] = val2[7].value;  //valor default
            markers[x][5] = val2[7].value;  //direccion fisica
            markers[x][6] = val2[8].value;	//detalles de direccion
            markers[x][7] = val2[3].value; 	//RUT ejecutivo
            markers[x][8] = val2[10].value; //fecha ruta
        });
        x = x + 1;
    });
}

function drawMap() {	
	
	var infowindow =  new google.maps.InfoWindow(); 
    var latLng = new google.maps.LatLng(-33.43696141670727,-70.63441604375839); //plaza italia //
    var mapProperties = {
       center: latLng,
       zoom: 16,
       mapTypeId: google.maps.MapTypeId.ROADMAP 
     };

     map = new google.maps.Map(document.getElementById("canvas"), mapProperties);

     var legendDiv = document.createElement('DIV');
     var legend = new Legend(legendDiv, map);
     legendDiv.index = 1;
     map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendDiv);

     getRuta();
 }

function getRuta() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	
	var enlace = new Array(); 
	var waypts = [];   
    var bounds = new google.maps.LatLngBounds();
    var marker;    
    var x=0;
    for (x = 0; x < markers.length; x++) {
        var infowindow =  new google.maps.InfoWindow();
        if(markers[x][3] == 1) { 
            enlace[x] = '<hr><p style="text-align:center;"><a href="#mensajeejecutivo" style="color:#00303f;font:bold 11px verdana;" title="Send Message" target="_blank">Enviar Mensaje a Ejecutivo</a></p>';
            icono = "http://labs.google.com/ridefinder/images/mm_20_red.png";
        }
        else {
        	enlace[x] = "";
            icono = "http://labs.google.com/ridefinder/images/mm_20_blue.png";
        }
        
        var pos = new google.maps.LatLng(markers[x][1] , markers[x][2]);
        bounds.extend(pos);
		
        marker = new google.maps.Marker({
            position: pos,
            map: map,
            title : markers[x][5],
        	icon: icono,
        	shadow: "http://labs.google.com/ridefinder/images/mm_20_shadow.png",
        	draggable: false
        });
        
        google.maps.event.addListener(marker, "click", 
           (
               function(marker,x) {
                   return function() {
                       infowindow.setContent(
                    		    '<div id="contenidoinfo" style="margin-left:5px;margin-top:0px;overflow:hidden;">'+
                    		   		'<div id="bodyContent">' + '<center><a href="https://www.ejedigital.cl/html/portada.html" target="_blank"><img src="../images/ejedigital.png" style="width:110px;height:30px;" alt="Ejedigital"/></center></a>' +
                    		   			'<font style="color:darkblue;font:13px tahoma; margin-left:5px;">Detalles de punto de ruta : </font>' +
                    		   		'</div>'+
                    		   	'</div>' +
                    		   	'<div style="text-align:left;font:11px verdana;color:darkgreen;margin-left:5px;">' + 
                    		   		'<UL type=disc >' + 
                    		   			'<LI>Nombre Ejecutivo : '+ nombreejecutivo + '</LI><br>' + 
                    		   			'<LI>Rut Ejecutivo: ' + markers[x][7] + '-' + getDigitoVerificador(markers[x][7]) +'</LI><br>' + 
                    		   			'<LI>Fecha de Visita: ' + markers[x][8]  + '</LI><br>' +
                    		   			'<LI>Direccion : '+ markers[x][5] + '</LI><br>' + 
                    		   			'<LI>Detalles: ' + markers[x][6] + '</LI>' + 
                    		   		'</UL>' + 
                    		   		enlace[x] + 	
                    		   	'</div>');
                       infowindow.open(map, marker);
                   }
               }
           )(marker,x));
    }
    
    map.fitBounds(bounds);
    
    var request = null;
}

function Legend(controlDiv, map) {
	
	
	controlDiv.style.padding = '6px';
	var controlUI = document.createElement('DIV');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.title = 'Legend';
	controlDiv.appendChild(controlUI);

	// Setear de CSS para la Legenda
	var controlText = document.createElement('DIV');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '12px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.border = 'solid 2px #333';
	  
	//Agregar las columnas de texto
	controlText.innerHTML = '<b>Simbologia: </b><br>' +
	'<img src="http://labs.google.com/ridefinder/images/mm_20_red.png" /> Visitado <br>' +
	'<img src="http://labs.google.com/ridefinder/images/mm_20_blue.png" /> No visitado <br>' +
	'<small>*Visitas Ejecutivo</small>';
	controlUI.appendChild(controlText);
}


$("#informeruta").live("pageshow",function() {
	columna1 =  '<div class="ui-block-a" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Estado de Visita</div>';
	columna2 =  '<div class="ui-block-b" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Fecha de Visita</div>';
	columna3 =  '<div class="ui-block-c" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Direccion</div>';
	columna4 =  '<div class="ui-block-d" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Detalles</div>';
	contenido = "";
	for (x = 0; x < markers.length; x++) {
		if (markers[x][3] == 1){
			estadovisita = 'No Visitado';
		} 
		else {
			estadovisita = 'Visitado';
		}
		contenido = contenido + '<div class="ui-block-a" style="background-color:#EEEEEE;text-align:left">' + estadovisita + '</div>';
		contenido = contenido + '<div class="ui-block-b" style="background-color:#EEEEEE;text-align:left">' +  markers[x][8] + '</div>'; 
		contenido = contenido + '<div class="ui-block-c" style="background-color:#EEEEEE;text-align:left">' + markers[x][5] + '</div>';		
		contenido = contenido + '<div class="ui-block-d" style="background-color:#EEEEEE;text-align:left">' + markers[x][6] + '</div>';
		rutejecutivo = markers[x][7];
		dvrutejecutivo = getDigitoVerificador(markers[x][7]);
	}
	document.getElementById("nombreejec").defaultValue = nombreejecutivo;
	document.getElementById("rutejec").defaultValue = rutejecutivo + '-' + dvrutejecutivo;
	$("div.ui-grid-c").html(columna1 + columna2 + columna3 + columna4 + contenido);
});


function popup(asunto, msg, url1){
	$('html').simpledialog2({
		mode: 'button',
   		headerText: asunto,
    	headerClose: true,
    	buttonPrompt: msg,
    	buttons : {
    		'OK': {
    			click: function () { 
    				$('#buttonoutput').text('OK');
    				if(url1!=''){
    					$(location).attr('href',url1);
    				} 
    				return true;
    			}
    		},
    	}
	});
}

function getDigitoVerificador(rut){
    var ag=rut.split('').reverse()
    for(total=0,n=2,i=0;i<ag.length;((n==7) ? n=2 : n++),i++)
    {
        total+=ag[i]*n
    }
    var resto=11-(total%11)
    return (resto<10)?resto:((resto>10)?0:'k')
}



