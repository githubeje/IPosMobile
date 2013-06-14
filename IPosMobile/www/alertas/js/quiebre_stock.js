// JavaScript Document
$("#principal").live('pageinit', function() {
	$.getJSON('http://www.anywhere.cl/wsanywhere/services/p2s/querys/productosipos',{ },getProductos);
});

$('#grabar').live('click', function(e) {
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
		 fecha = moment().format('YYYYMMDD');
		 hora = moment().format('HHmmss');
		 fecha_muestra = moment($('#fecha_muestra').val(), 'DD/MM/YYYYY').format('YYYYMMDD');
		 hora_muestra = moment($('#hora_muestra').val()+':00', 'HH:mm:ss').format('HHmmss');
		 $.ajax({ 
			type: 'POST',
			url: 'http://www.anywhere.cl/wsanywhere/services/alertaquiebrestock/save/',
			data: { a1:'1',a2:producto.value,a3:stock.value,a4:fecha_muestra,a5:hora_muestra,a6:fecha,a7:hora},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup('Mensaje', 'Se ha enviado la alerta','index.html')
				limpiaForm('#formulario');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				popup('Mensaje', 'Ocurrio un error al enviar la alerta','index.html')
				limpiaForm('#formulario');	
			 },
			complete: function(data) { }	
		})
	}
});	

function getProductos(data){
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#producto').append($('<option>', {value : val2[0].value}).text(val2[1].value));
		});
	});
}