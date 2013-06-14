var evento = "-1";
var fecha_inicio = [];
var hora_inicio = [];
var fecha_termino = [];
var hora_termino = [];
var direccionx = [];
var idregistro=null;

$("#principal").live("pageshow",function() {
	var user = "1";
	$.ajax({ 
		type: "GET",
		url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/presenciaporusuario/" + user,
		cache: false,
		crossDomain : true,
		success: function(data,status,jqXHR) {
			setLayout(data);
		}
	})		
});

$("#save").live("click",function() {
	var user = "1";
	now = moment(new Date());
	var fecha = now.format("YYYY/MM/DD");
	var hora = now.format("HH:mm:ss");
	$.ajax({ 
		type: "POST",
		url: "http://www.anywhere.cl/wsanywhere/services/registropresencia/save",
		data: { a1:user,					//usuario
				a2:evento,					//evento  (-1:indefinido , 1:entrada , 2:salida)
			    a3:fecha,					//fecha
				a4:hora,					//hora
				a5:posLatitud,				//latitud
				a6:posLongitud,				//latitud
				a7:$("#direccion").val(),	//direccion
				a8:facingImage,				//imagen
				a9:idregistro				//id registro
			},
		crossDomain : true,
		success: function(data,status,jqXHR) { 
			if(evento=="1") {
				popup("Mensaje", "Se ha grabado su ingreso","index.html")
			}
			else {
				popup("Mensaje", "Se ha grabado su salida","index.html")
			}
		},
		beforeSend: function() {
			$.mobile.showPageLoadingMsg();
		},			
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			popup("Mensaje", "Ocurrio un error en el proceso de registro, intente nuevamente","index.html")
		},
		complete: function(data) {
			$.mobile.hidePageLoadingMsg();
			idregistro=null;
		}
	})	
})

$("#in").live("click",function() {
	if (!$(this).data("disabled")) {
		capturePhotoEdit(Camera.PictureSourceType.CAMERA)
	}
})

$("#out").live("click",function() {
	if (!$(this).data("disabled")) {
		capturePhotoEdit(Camera.PictureSourceType.CAMERA)
	}
})

$("#filtro_presencia").live("pageshow",function() {
	fecha_inicio = [];
	hora_inicio = [];
	fecha_termino = [];
	hora_termino = [];
	direccionx = [];	
});

$("#search").live("click", function() {
	fi = moment($("#fecha_inicio").val(),"DD/MM/YYYYY").format("YYYY-MM-DD");
	ft = moment($("#fecha_termino").val(),"DD/MM/YYYYY").format("YYYY-MM-DD");
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/informepresencia/" + fi + "/" + ft ,{},
		function(data) {
			$.each(data, function(key, val) {
				$.each(val, function(key2, val2) {
					fecha_inicio.push(val2[0].value);
					hora_inicio.push(val2[1].value);
					fecha_termino.push(val2[2].value);
					hora_termino.push(val2[3].value);
					direccionx.push(val2[4].value);					
				});
			});
			$(location).attr("href","#informe");
	});
});

$("#informe").live("pageshow",function() {
	columna1 =  '<div class="ui-block-a" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Fecha Ingreso</div>';
	columna2 =  '<div class="ui-block-b" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Hora Ingreso</div>';
	columna3 =  '<div class="ui-block-c" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Fecha Salida</div>';
	columna4 =  '<div class="ui-block-d" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Hora Salida</div>';
	columna5 =  '<div class="ui-block-e" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Ubicaci&oacute;n  Salida</div>';
	contenido = "";
	for(x=0;x<fecha_inicio.length;x++) {
		contenido = contenido + '<div class="ui-block-a" style="background-color:#EEEEEE;text-align:left">' + fecha_inicio[x] + '</div>';
		contenido = contenido + '<div class="ui-block-b" style="background-color:#EEEEEE;text-align:center">' + hora_inicio[x] + '</div>'; 
		contenido = contenido + '<div class="ui-block-c" style="background-color:#EEEEEE;text-align:center">' + fecha_termino[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-d" style="background-color:#EEEEEE;text-align:center">' + hora_termino[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-e" style="background-color:#EEEEEE;text-align:center">' + direccionx[x] + '</div>';	
	}
	$("div.ui-grid-d").html(columna1 + columna2 + columna3 + columna4 + columna5 + contenido);
});


function setLayout(data) {
	if(data.length > 0) {
		$.each(data, function(key, val) {
			$.each(val, function(key2, val2) {
				if(val2[1].value !=null && val2[3].value == null)  {
					//habilitar el botón de salida y deshabilitar el boton de entrada
					$("#in").addClass("ui-disabled");
					$("#out").removeClass("ui-disabled");
					evento="2";
					idregistro=val2[0].value
				}
				else if(val2[1].value!=null && val2[3].value!=null ) {
					//habilitar el boton de entrada y deshabilitar el boton de entrada 
					$("#out").addClass("ui-disabled");
					$("#in").removeClass("ui-disabled");
					evento="1";
				}
			});
		});
	}
	else {
		//habilitar el boton de entrada y deshabilitar el boton de entrada 
		$("#out").addClass("ui-disabled");
		$("#in").removeClass("ui-disabled");
		evento="1";
	}
}
