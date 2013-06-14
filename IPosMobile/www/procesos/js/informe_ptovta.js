var aIndex = new Array();
var pag = 0;

$("#ventas").live('pageshow', function() {
	$('#listado_ventas').listview('refresh');
});

$("#detalle").live('pageshow', function() {
	$('#listado_detalle').listview('refresh');
});

$('#buscar').live('click', function(e) {
	if ($('#formulario').validate({
		errorPlacement: function(error, element) {
			if ($(element).is('select') || $(element).find('[data-role="datebox"]')) {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	}).form() == true) {
		fecha_inicio = moment($('#fecha_inicio').val(), 'DD/MM/YYYYY').format('YYYYMMDD');
		fecha_termino = moment($('#fecha_termino').val(), 'DD/MM/YYYYY').format('YYYYMMDD');
		periodo = $('#periodo').val();		
		$.getJSON('http://www.anywhere.cl/wsanywhere/services/p2s/querys/ventasporfecha/1/' + fecha_inicio + '/' + fecha_termino + '/' + periodo, getVentasPorFecha); 
	 }
});

$('#listado_ventas li a').live('click', function(e) {
	data = $(this).jqmData('params');
	globalParams = data !== null ? data : null;
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: 'http://www.anywhere.cl/wsanywhere/services/p2s/querys/indiceproductosporfecha/1/' + getUrlVars(globalParams)['fecha_inicio'] + '/' + getUrlVars(globalParams)['fecha_termino'],
		data: { },
		crossDomain : true,
		success: function(data,status,jqXHR) {
			if(data.length==0 || data == undefined) {
				alert("No existen productos para esta seleccion");
			}
			else {
				var i=0;
				$.each(data, function(key, val) {
					$.each(val, function(key2, val2) {
						aIndex[i++] = val2[0].value;
					});
				});	
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { },
		complete: function(data) {}	
	})
	$.ajax({ 
		type: "GET",
		dataType:"json",
		url: "http://www.anywhere.cl/wsanywhere/services/p2s/query/productoporfecha/1/" + getUrlVars(globalParams)['fecha_inicio'] + '/' + getUrlVars(globalParams)['fecha_termino'],
		data: { },
		crossDomain : true,
		success: function(data,status,jqXHR) {
			getListadoProducto(data);
			top.location.href = "#listado";
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { },
		complete: function(data) {}	
	})		
});

$("#next").live('click', function() { next(); });	

function getVentasPorFecha(data) {
	if(data != null || data != "") {
		$('#listado_ventas').children().remove('li');
		$.each(data, function(key, val) {
			$.each(val, function(key2, val2) {
				fecha_inicio =  val2[5].value;
				fecha_termino =  val2[6].value;
				$('#listado_ventas').append('<li><a href="#detalle" data-params="fecha_inicio='+ fecha_inicio +'&fecha_termino='+ fecha_termino +'">Dia de Venta: '+ 
										 val2[0].value + '<span class="ui-li-count">Total Ventas ' + val2[1].value + '</span></a></li>');
			});
 		});
		$(location).attr('href', '#ventas');
	}
	else {
		popup('Mensaje','No hay datos para esta seleccion','');
	}
}

function getDetalleVentasPorFecha(data) {
	$('#listado_detalle').children().remove('li');
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#listado_detalle').append('<li><a href="#" data-params="id='+ val2[0].value +'">'+ val2[2].value +', '+ val2[5].value +', '+ val2[6].value +'</a></li>');
		});
	});
	$(location).attr('href', '#detalle');
}

function getListadoProducto(data) {
	if(data!= "" || data!= undefined) {
		$('#idproducto').val(data.h[2].value);
		$('#producto').val(data.h[3].value);
		$('#cantidad').val(data.h[5].value);
		$('#preciounidad').val(data.h[6].value);
		$('#neto').val(data.h[7].value);
		$('#descuento').val(data.h[8].value);
		$('#venta').val(data.h[10].value);
	}
}

function next() {
	pag = pag + 1;
	if(pag >= aIndex.length) {
		alert("No existen mas productos, desea volver al principio?");
		pag = 0;
	}
	else {
		fecha_inicio = moment($('#fecha_inicio').val(), 'DD/MM/YYYYY').format('YYYYMMDD');
		fecha_termino = moment($('#fecha_termino').val(), 'DD/MM/YYYYY').format('YYYYMMDD');
		$.ajax({ 
			type: "GET",
			dataType:"json",
			url: 'http://www.anywhere.cl/wsanywhere/services/p2s/query/productoporfechaporid/1/' + fecha_inicio + '/' + fecha_termino + '/' + aIndex[pag],
			data: { },
			crossDomain : true,
			success: function(data,status,jqXHR) {
				getListadoProducto(data);
				top.location.href = "#listado";
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { },
			complete: function(data) {}	
		})
	}		
}