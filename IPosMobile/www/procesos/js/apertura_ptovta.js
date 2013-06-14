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
				url: "http://www.anywhere.cl/wsanywhere/services/p2s/querys/indiceaperturabycategoria/" + categoria.value,
				data: { },
				crossDomain : true,
				success: function(data,status,jqXHR) {
					if(data.length==0 || data == undefined) {
						alert("No existen productos vigentes para esta categoria");
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
				url: "http://www.anywhere.cl/wsanywhere/services/p2s/query/aperturabycategoria/" + categoria.value,
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
					url: "http://www.anywhere.cl/wsanywhere/services/aperturapuntoventa/save",
					data: { a1:idproducto.value,a2:stock.value,a3:precio.value,a4:diferencia.value,a5:comentario.value},
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
			url: "http://www.anywhere.cl/wsanywhere/services/p2s/query/aperturabycategoriaproducto/" + categoria.value + "/" + aIndex[pag],
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
	if(data!= "" || data!= undefined) {
		$('#idproducto').val(data.h[0].value);
		$('#producto').val(data.h[1].value);
		$('#stock').val(data.h[4].value);
		$('#precio').val(data.h[5].value);
	}
}

function getCategoriaProducto(data) {
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#categoria').append($('<option>', {value : val2[0].value}).text(val2[1].value));
		});
	});	
}
