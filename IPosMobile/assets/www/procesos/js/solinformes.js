var seleccion;
var categoria = [] 
var producto = []  
var precio_base = []
var descuento = []	
var pto_venta = []

$("#filtro").live("pageinit",function(e) {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/categoriaproducto",{},getCategoria);
})

$("#filtro").live("pageshow",function(e) {
	seleccion=getParameterByName("informe");
	categoria = [] 
	producto = []  
	precio_base = []
	descuento = []	
	pto_venta = []
})

$("#search").live("click",function() {
	if ($('#formulario').validate({
		errorPlacement: function(error, element) {
			if ($(element).is('select')) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		if(seleccion == "1") {
			popup('Mensaje', 'Funcionalidad en construccion',"solicitudes.html");
			//$.getJSON("http://locahost:8080/wsanywhere/services/p2s/querys/",{},getSolicitudesProductos);		
		}
		else if(seleccion == "2") {
			popup('Mensaje', 'Funcionalidad en construccion',"solicitudes.html");
			//$.getJSON("http://locahost:8080/wsanywhere/services/p2s/querys/",{},getSolicitudesDevolucion);		
		}
		else {
			ptovta = "1";
			$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/solicitudescambioprecio/" + ptovta + "/" + $("#cat").val() ,{},getSolicitudesCambiosPrecio);		
		}
	}
});

function getSolicitudesProductos(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
		});
	});	
	$(location).attr("href","#productos");
}

function getSolicitudesDevolucion(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
		});
	});	
	$(location).attr("href","#devoluciones");
}

function getSolicitudesCambiosPrecio(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			categoria.push(val2[3].value); 
			producto.push(val2[1].value); 
			precio_base.push(val2[6].value); 
			descuento.push(val2[7].value); 
			pto_venta.push(val2[5].value); 			
		});
	});	
	$(location).attr("href","#cambios_precio");
}

function getCategoria(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#cat").append($("<option>", {value : val2[0].value}).text(val2[1].value));
		});
	});	
}

$("#cambios_precio").live("pageshow", function() {
	columna1 =  '<div class="ui-block-a" style="background-color:#CCCCCC;font-weight:bold;text-align:left">Categoria</div>';
	columna2 =  '<div class="ui-block-b" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Producto</div>';
	columna3 =  '<div class="ui-block-c" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Precio Base</div>';
	columna4 =  '<div class="ui-block-d" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Tope Descuento</div>';
	columna5 =  '<div class="ui-block-e" style="background-color:#CCCCCC;font-weight:bold;text-align:center">Punto Venta</div>';
	contenido = "";
	for(x=0;x<categoria.length;x++) {
		contenido = contenido + '<div class="ui-block-a" style="background-color:#EEEEEE;text-align:left">' + categoria[x] + '</div>';
		contenido = contenido + '<div class="ui-block-b" style="background-color:#EEEEEE;text-align:center">' + producto[x] + '</div>'; 
		contenido = contenido + '<div class="ui-block-c" style="background-color:#EEEEEE;text-align:center">' + precio_base[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-d" style="background-color:#EEEEEE;text-align:center">' + descuento[x] + '</div>';		
		contenido = contenido + '<div class="ui-block-e" style="background-color:#EEEEEE;text-align:center">' + pto_venta[x] + '</div>';	
	}
	$("div.ui-grid-d").html(columna1 + columna2 + columna3 + columna4 + columna5 + contenido);
})












function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}