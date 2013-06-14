$('#enviar1').live('click', function(e) {
	if ($('#formulario1').validate({
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
			url: 'http://www.anywhere.cl/wsanywhere/services/xxxxx/save/',
			data: { a1:'1',a2:comentario1.value,a3:fecha,a4:hora},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup('Mensaje', 'Se ha enviado la alerta','otros.html#principal')
				limpiaForm('#formulario1');
			 },
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				popup('Mensaje', 'Ocurrio un error al enviar la alerta','otros.html#principal')
				limpiaForm('#formulario1');	
			 },
			complete: function(data) { }	
		})
	 }
});
	
$('#enviar2').live('click', function(e) {
	if ($('#formulario2').validate({
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
			url: 'http://www.anywhere.cl/wsanywhere/services/xxxxxx/save/',
			data: { a1:'1',a2:comentario2.value,a3:fecha,a4:hora},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup('Mensaje', 'Se ha enviado la alerta','otros.html#principal')
				limpiaForm('#formulario2');
			 },
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				popup('Mensaje', 'Ocurrio un error al enviar la alerta','otros.html#principal')
				limpiaForm('#formulario2');	
			 },
			complete: function(data) { }	
		})
	 }
});
	
$('#enviar3').live('click', function(e) {
	 if ($('#formulario3').validate({
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
			url: 'http://www.anywhere.cl/wsanywhere/services/xxxxxx/save/',
			data: { a1:'1',a2:solicitud3.value,a2:comentario3.value,a3:fecha,a4:hora},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup('Mensaje', 'Se ha enviado la alerta','otros.html#principal')
				limpiaForm('#formulario3');
			 },
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				popup('Mensaje', 'Ocurrio un error al enviar la alerta','otros.html#principal')
				limpiaForm('#formulario3');	
			 },
			complete: function(data) { }	
		})
	 }
});
	
$('#enviar4').live('click', function(e) {
	 if ($('#formulario3').validate({
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
			url: 'http://www.anywhere.cl/wsanywhere/services/xxxxxx/save/',
			data: { a1:'1',a2:solicitud4.value,a2:comentario4.value,a3:fecha,a4:hora},
			crossDomain : true,
			success: function(data,status,jqXHR) { 
				popup('Mensaje', 'Se ha enviado la alerta','otros.html#principal')
				limpiaForm('#formulario4');
			 },
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				popup('Mensaje', 'Ocurrio un error al enviar la alerta','otros.html#principal')
				limpiaForm('#formulario4');	
			 },
			complete: function(data) { }	
		})
	 }
});