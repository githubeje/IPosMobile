// JavaScript Document
$("#grabar").click(
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
					type: 'POST',
					url: 'http://www.anywhere.cl/wsanywhere/services/alertaoutbound/save/',
					data: { a1:'1',
							a2:asunto.value,
							a3:comentario.value,
							a4:fecha.value,
							a5:hora.value,
						   },
					crossDomain : true,
					success: function(data,status,jqXHR) { },
					error: function(XMLHttpRequest, textStatus, errorThrown) { },
					complete: function(data) {
						top.location.href = "index.html";	
					}	
				})
			 }
	});	