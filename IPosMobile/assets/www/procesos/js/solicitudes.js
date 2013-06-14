var	idproducto = [];
var	producto = [];
var	cantidad = [];
var	comentario = [];
var idproducto2 = [];
var producto2 = [];
var cantidad2 = [];
var comentario2 = [];
var idproducto3 = [];
var producto3 = [];
var precio_base = [];
var nuevo_precio_base = [];
var tope_descuento = [];
var comentario3 = [];

$("#productos").live("pageinit", function() {
	idproducto = [];
	producto = [];
	cantidad = [];
	comentario = [];
});

$("#productos").live("pageshow", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/categoriaproducto",{ },getCategoria1);

    updateDateTime("#fecha","DD/MM/YYYY");
    updateDateTime("#hora","HH:mm:ss");	
	if(idproducto!=null && idproducto.length>0) {
		$("#count").show();
	}
	else {
		$("#count").hide();
	}
});

$("#save_producto").live("click",
		function() {
			$.ajax({ 
				type: "POST",
				url: "http://www.anywhere.cl/wsanywhere/services/solicitudproducto/save",
				data: {  a1 : "1",a2 : "1","a3" : idproducto,"a4[]": cantidad, 
						 a5 : moment($("#fecha").val(), "DD/MM/YYYY").format("YYYY/MM/DD"),
						a6 : moment($("#hora").val(),"H:m:s").format("H:mm:ss"),
	  						"a7[]" : comentario
				},
				crossDomain : true,
				success: function(data,status,jqXHR) {
					popup("Mensaje", "Se ha guardado el registro","solicitudes.html#principal")
					limpiaForm("#formulario1");
					idproducto = [];
					producto = [];
					cantidad = [];
					comentario = [];
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					popup("Mensaje","Ocurrio un error al guardar el registro","solicitudes.html#principal")
					limpiaForm("#formulario1");
				},
				complete: function(data) {	}
			});
	});

	$("#agregar_producto").live("click", function() {
		if ($("#formulario1").validate({
			errorPlacement: function(error, element) {
				if ($(element).is("select")) {
					error.insertAfter($(element).parent());
				}
				else {
					error.insertAfter(element);
				}
			}
		}).form() == true) {
			idproducto.push($("#producto1").val());
			producto.push($("#producto1 option[value='" + $("#producto1").val() + "']").text());
			cantidad.push($("#cantidad1").val());
			comentario.push($("#comentario1").val());
			popup("Mensaje", "Se agregado el producto a la solicitud","#productos");
			limpiaForm("#formulario1");
		    updateDateTime("#fecha","DD/MM/YYYY");
		    updateDateTime("#hora","HH:mm:ss");			
			if(idproducto!=null && idproducto.length>0) {
				number = '<span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' 
						 + idproducto.length + 
						 '</span><span class="ui-icon ui-icon-page ui-icon-shadow">&nbsp;</span></span>';
				$("#count").html(number);
				$("#count").show();
			}
		}
	});


	
// --------------------------------------------------------------------------------------------------------------------------------------------------
$("#devoluciones").live("pageinit", function() {
	idproducto2 = [];
	producto2 = [];
	cantidad2 = [];
	comentario2 = [];	
})

$("#devoluciones").live("pageshow", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/categoriaproducto",{ },getCategoria2);
    updateDateTime("#fecha2","DD/MM/YYYY");
    updateDateTime("#hora2","HH:mm:ss");
	if(idproducto2!=null && idproducto2.length>0) {
		$("#count2").show();
	}
	else {
		$("#count2").hide();
	}    
});

$("#save_devolucion").live("click",
	function() {
		$.ajax({ 
			type: "POST",
			url: "http://www.anywhere.cl/wsanywhere/services/solicituddevolucion/save",
			data: { a1 : "1",a2 : "1",a3 : moment($("#fecha2").val(), "DD/MM/YYYY").format("YYYY/MM/DD"),
					a4 : moment($("#hora2").val(), "H:m:s").format("H:mm:ss"),"a5[]" : idproducto2, 
					"a6[]" : cantidad2,"a7[]" : comentario2
			},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup("Mensaje", "Se ha guardado el registro","solicitudes.html#principal")
				limpiaForm("#formulario2");
				idproducto2 = [];
				producto2 = [];
				cantidad2 = [];
				comentario2 = [];					
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				popup("Mensaje", "Ocurrio un error al guardar el registro","solicitudes.html#principal")
				limpiaForm("#formulario2");
			},
			complete: function(data) {}
		})
	}
);

$("#agregar_devolucion").live("click", function() {
	if ($('#formulario2').validate({
		errorPlacement: function(error, element) {
			if ($(element).is("select")) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		idproducto2.push($("#producto2").val());
		producto2.push($("#producto2 option[value='" + $("#producto2").val() + "']").text());
		cantidad2.push($("#cantidad2").val());
		comentario2.push($("#comentario2").val());
		popup("Mensaje", "Se agregado la devoluci&oacute;n del producto a la solicitud","#devoluciones");
		limpiaForm("#formulario2");
	    updateDateTime("#fecha2","DD/MM/YYYY");
	    updateDateTime("#hora2","HH:mm:ss");			
		if(idproducto2!=null && idproducto2.length>0) {
			number = '<span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' 
					 + idproducto2.length + 
					 '</span><span class="ui-icon ui-icon-page ui-icon-shadow">&nbsp;</span></span>';
			$("#count2").html(number);
			$("#count2").show();
		}
	}
});

// --------------------------------------------------------------------------------------------------------------------------------------------------
$("#cambio_precio").live("pageinit", function() {
	idproducto3 = [];
	producto3 = [];
	precio_base = [];
	nuevo_precio_base = [];
	tope_descuento = [];
	comentario3 = [];
});

$("#cambio_precio").live("pageshow", function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/categoriaproducto",{ },getCategoria3);	
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/usuariosautorizador/1",{ },getUsuarios);
    updateDateTime("#fecha_cambio","DD/MM/YYYY");
    updateDateTime("#hora_cambio","HH:mm:ss");
	if(idproducto3!=null && idproducto3.length>0) {
		$("#count3").show();
	}
	else {
		$("#count3").hide();
	}
});

$("#producto3").live("change", function() {
	$("#precio_base").val($("#productoprecio option[value='" + $("#producto3").val() + "']").text());
});	

$("#save_cambioprecio").live("click",
	function() {
		$.ajax({ 
			type: "POST",
			url: "http://www.anywhere.cl/wsanywhere/services/solicitudcambioprecio/save",
			data: {  a1 : "1",a2 : "1","a3[]" : idproducto3,"a4[]" : precio_base, 
					 "a5[]" : nuevo_precio_base,a6 : moment($("#fecha_cambio").val(),"DD/MM/YYYY").format("YYYY/MM/DD"),
					 a7 : moment($("#hora_cambio").val(), "H:m:s").format("H:mm:ss"),"a8[]" : comentario3,
					 a9 : usuario_autorizacion.value, "a10[]" : tope_descuento
			},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup("Mensaje", "Se ha guardado el registro","solicitudes.html#principal")
				limpiaForm("#formulario3");
				idproducto3 = [];
				producto3 = [];
				precio_base = [];
				nuevo_precio_base = [];
				tope_descuento = [];
				comentario3 = [];					
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				popup("Mensaje", "Ocurri&oacute un error al guardar el registro","solicitudes.html#principal")
				limpiaForm("#formulario3");
			},
			complete: function(data) {}
		})
});				

$("#agregar_cambioprecio").live("click", function() {
	if ($('#formulario3').validate({
		errorPlacement: function(error, element) {
			if ($(element).is("select")) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		idproducto3.push($("#producto3").val());
		producto3.push($("#producto3 option[value='" + $("#producto3").val() + "']").text());
		precio_base.push($("#precio_base").val());
		nuevo_precio_base.push($("#nuevo_precio_base").val());
		tope_descuento.push($("#tope_descuento").val());
		comentario3.push($("#comentario3").val());
		
		popup("Mensaje", "Se agregado el producto para la solicitud de cambio de precio","#cambio_precio");
		limpiaForm("#formulario3");
	    updateDateTime("#fecha_cambio","DD/MM/YYYY");
	    updateDateTime("#hora_cambio","HH:mm:ss");			
		if(idproducto3!=null && idproducto3.length>0) {
			number = '<span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">' 
					 + idproducto3.length + 
					 '</span><span class="ui-icon ui-icon-page ui-icon-shadow">&nbsp;</span></span>';
			$("#count3").html(number);
			$("#count3").show();
		}
	}
});

// -----------------------------------------------------------------------------------------------------------------------------------------------
function getUsuarios(data){
	$("#usuario_autorizacion").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#usuario_autorizacion").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});
}

function getCategoria1(data) {
	$("#categoria1").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#categoria1").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productosipos",{ },getProductos1);	
}

function getCategoria2(data) {
	$("#categoria2").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#categoria2").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productosipos",{ },getProductos2);	
}

function getCategoria3(data) {
	$("#categoria3").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#categoria3").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/productosiposptoventa/1",{ },getProductos3);
}

function getProductos1(data){
	$("#producto1").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#producto1").append($("<option>", {value : val2[0].value}).addClass( val2[3].value).text(val2[1].value));
		});
	});
	$("#producto1").chained("#categoria1");	
}

function getProductos2(data){
	$("#producto2").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#producto2").append($("<option>", {value : val2[0].value}).addClass( val2[3].value).text(val2[1].value));
		});
	});
	$("#producto2").chained("#categoria2");	
}

function getProductos3(data){
	$("#producto3").empty();
	$("#productoprecio").empty();	
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#producto3").append($("<option>", {value : val2[0].value + "," + val2[1].value}).addClass( val2[4].value).text(val2[2].value));
			$("#productoprecio").append($("<option>", {value : val2[0].value + "," + val2[1].value}).text(val2[5].value));
		});
	});
	$("#producto3").chained("#categoria3");	
}
