$("#login").live("pageinit", function() {
	$.validator.addMethod("rutValidate", function(value, element) {  
        return this.optional(element) || /^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/i.test(value); 
	}, "Rut invalido: Ingresa un rut válido.");
	
	$("#formLogin").bind("submit", function () {
		if ($("#formLogin").validate({
			rules : {
				rutPer : {
					 required: true,
					 rutValidate : true
				}
			},
			errorPlacement: function(error, element) {
				error.insertAfter(element);
			}
		}).form() == true) {
			$.ajax({ 
				type: "POST",
				dataType:"json",
				url: "http://www.anywhere.cl/wsanywhere/Login/access",
				data: $(this).serialize(),
				crossDomain : true,
				success: function(data,status,jqXHR) {
					var tmp = "";
			        if (data.success == "true") {
						$.each(data,function(key,val) {
							if(key != "success") {
								sessionStorage.setItem(key,val);
								tmp = key;
							}
						});
						$(location).attr("href","index.html");
			        }
			        else {
			        	popup("Mensaje", "Usuario o clave invalido","login.html")
			        }
				},
				beforeSend: function() {
					$.mobile.showPageLoadingMsg();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					popup("Mensaje", "Aplicación no disponible en estos instantes, vuelta a intentarlo mas tarde","login.html")
				},
				complete: function(data) {
					$.mobile.hidePageLoadingMsg();
				}				
			});
		}
	});
});
