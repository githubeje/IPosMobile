$('#principal').live( 'pageinit',function(event) {
	getFechaActual();
	
	$("#setDataToServer").click(
		function() {
			
			popup('Mensaje','Registro Guardado');
			
			var direccion = document.getElementById("direccion_fisica").value;
			$.ajax({ 
				type: "POST",
				url: "http://www.anywhere.cl/wsanywhere/services/upload/facing",
				data: { a1 : facingImage, a2 : "1", a3 : "Nada por el momento", a4 : pto_de_vta, a5 : producto, a6 : posLatitud, a7 : posLongitud, a8 : direccion },
				crossDomain : true,
				success: function(data,status,jqXHR) { }
			})
	});
	
	function getFechaActual() {
		f = new Date();
		$('#fecha').val(f.getFullYear() + '/' + (f.getMonth() +1) + '/' + f.getDate() + '  ' + 
				        f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds()  );
	}
});

