$("#principal").live("pageinit", function() {   
	$.validator.addMethod("rut", function(value, element) {  
        return this.optional(element) || /^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/i.test(value);  
	}, "Rut invalido: Ingresa un rut válido.");

	$("#save").click(
		function() {
			if ($("#formulario").validate({
				rules: {
	    			rut: "required rut",
	    		},				
				errorPlacement: function(error, element) {
					if ($(element).is('select')) {
						error.insertAfter($(element).parent());
					}
					else {
						error.insertAfter(element);
					}
				}
			}).form() == true) {
				direccion = calle.value + ' ' + numero.value + ', ' + comuna.value + ', ' + region.value + ', ' + pais.value;
				var identificacion = (rut.value).split("-");
				rut = identificacion[0];
				dv = identificacion[1];				
				geocoder = new google.maps.Geocoder();
				geocoder.geocode( { "address": direccion}, 
					function(results, status) {
						user = "1";
						if (status == google.maps.GeocoderStatus.OK) {
							latitud = results[0].geometry.location.lat();
							longitud = results[0].geometry.location.lng();
							save(rut,dv,nombre.value,paterno.value,materno.value,correo.value,telefono.value,user,latitud,longitud,direccion);
						}
						else {
							$("html").simpledialog2({
								mode: "button",
						   		headerText: "Precaucion",
						    	headerClose: true,
						    	buttonPrompt: "La direccion que Ud. ha indicado no se puede encontrar. Desea Guardar de todas maneras?",
						    	buttons : {
						    		"OK": {
						    			click: function () { 
						    				save(rut,dv,nombre.value,paterno.value,materno.value,correo.value,telefono.value,user,"0","0",direccion);
						    				limpiaForm("formulario");
						    			}
							    	},
									"Cancel": {
										click: function () { 
											$(location).attr("href","#principal");
										},
										icon: "delete",
										theme: "c"
									}
							    }
							});
						}
					}
				);
			}
		}
	);
	
	function save(rut,dv,nombre,paterno,materno,correo,telefono,user,latitud,longitud,direccion) {
		$.ajax({ 
			type: "POST",
			url: "http://www.anywhere.cl/wsanywhere/services/registrocliente/save",
			data: { a1:rut,a2:dv,a3:nombre,a4:paterno,a5:materno,a6:correo,a7:telefono,a8:user,a9:latitud,a10:longitud,a11:direccion},
			crossDomain : true,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg();
            },			
			success: function(data,status,jqXHR) { },
			error: function(XMLHttpRequest, textStatus, errorThrown) { },
			complete: function(data) {
				$.mobile.hidePageLoadingMsg();				
			}					
		});		
	}

	$("#mapa").live("pageshow", function() {
		direccion = calle.value + ' ' + numero.value + ', ' + comuna.value + ', ' + region.value + ', ' + pais.value;
		map = null;
		principal = "#principal";
		drawMap("canvas",direccion,principal);
	});	
});

