$("#filtro").live('pageinit', function() {
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/categoriaproducto",{},getCategoriaProducto);
});

$("#principal").live('pageinit', function() {
	var aIndex = new Array();
	var pag = 0;
	
	$("#buscar").click(
		function() {
			$.ajax({ 
				type: "GET",
				dataType:"json",
				url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/indicecierrebycategoria/" + categoria.value,
				data: { },
				crossDomain : true,
				success: function(data,status,jqXHR) {
					if(data.length==0 || data == undefined) {
						alert("No se han registrado ventas en esta categoria para los productos existentes");
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
				url: "http://www.anywhere.cl/wsanywhere/services/p2s/query/cierrebycategoria/" + categoria.value,
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
	
	$("#registrar").click(
		function() {
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
				$.ajax({ 
					type: "POST",
					url: "http://www.anywhere.cl/wsanywhere/services/cierrepuntoventa/save",
					data: { a1:idproducto.value,a2:stockapertura.value,a3:stockcierre.value,a4:precio.value,a5:diferencia.value,a6:comentario.value},
					crossDomain : true,
					success: function(data,status,jqXHR) {
						next();
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) { },
					complete: function(data) {}	
				})
			 }
	});
	
	function next() {
		pag = pag + 1;
		if(pag >= aIndex.length) {
			alert("A recorrido el listado completo de productos.  La lista se reiniciara al inicio");
			pag = 0;
		}
		$.ajax({ 
			type: "GET",
			dataType:"json",
			url: "http://www.anywhere.cl/wsanywhere/services/p2s/query/cierrebycategoriaproducto/" + categoria.value + "/" + aIndex[pag],
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
	
});

function getListadoProducto(data) {
	$('#idproducto').val(data.h[0].value);
	$('#producto').val(data.h[1].value);
	$('#stockapertura').val(data.h[4].value);
	$('#ventasdia').val(data.h[5].value);
	$('#stockcierre').val(data.h[6].value);
}

function getCategoriaProducto(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#categoria').append($('<option>', {value : val2[0].value}).text(val2[1].value));
		});
	});	
}
