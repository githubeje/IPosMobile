var punto = []
var fecha_programada = []
var fecha_visita = []
var comentario = []
var estado = []

$("#informe").live("pageinit", function() {
	ptovta="1";
	ejtvo = "13176947";
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/recorridorutasporejecutivo/" + ptovta + "/" + ejtvo,{ },getInfoRuta);
});

$("#informe").live("pageshow", function() {
	cargaPuntos();
});


function getInfoRuta(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			punto.push(val2[1].value);
			fecha_programada.push(val2[5].value);
			
			fecha_visita.push(val2[7].value?val2[7].value:"");
			comentario.push(val2[8].value?val2[8].value:"");
			
			if(val2[6].value=="0") {
				estado.push("Finalizado");	
			}
			else {
				estado.push("Pendiente");
			}
		});
	});
	cargaPuntos();
}

function cargaPuntos() {
	columna1 =  '<div class="ui-block-a" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Punto</div>';
	columna2 =  '<div class="ui-block-b" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Fecha Programada</div>';
	columna3 =  '<div class="ui-block-c" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Fecha Visita</div>';
	columna4 =  '<div class="ui-block-d" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Comentario</div>';
	columna5 =  '<div class="ui-block-e" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Estado</div>';
	contenido = "";
	for(x=0;x<punto.length;x++) {
		contenido = contenido + '<div class="ui-block-a" style="background-color:#EEEEEE;text-align:left">' + punto[x] + '</div>';
		contenido = contenido + '<div class="ui-block-b" style="background-color:#EEEEEE;text-align:center">' + fecha_programada[x] + '</div>'; 
		contenido = contenido + '<div class="ui-block-c" style="background-color:#EEEEEE;text-align:center">' + fecha_visita[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-d" style="background-color:#EEEEEE;text-align:center">' + comentario[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-e" style="background-color:#EEEEEE;text-align:center">' + estado[x] + '</div>';	
	}
	$("div.ui-grid-d").html(columna1 + columna2 + columna3 + columna4 + columna5 + contenido);	
}
