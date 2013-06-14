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
		 $.ajax({ 
			 type: 'POST',
			 url: 'http://www.anywhere.cl/wsanywhere/services/alertahechos/save/',
			 data: { a1:'1',a2:asunto.value,a3:comentario.value,a4:fecha,a5:hora },
			 crossDomain : true,
			 success: function(data,status,jqXHR) { 
				 popup('Mensaje', 'Se ha enviado el alerta','index.html')
				 limpiaForm('#formulario');
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) {
				 popup('Mensaje', 'Ocurrio un error al enviar el alerta','index.html')
				 limpiaForm('#formulario');	
			 },
			 complete: function(data) {	}	
		})
	 }
});	