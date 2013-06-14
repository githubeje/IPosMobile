var idApp = "1";
var senderId = "350862029601";
var idUsuario = "13176947";
var idMessage;
var pushNotification;
var typeDevice = null;
var idDevice;
var pictureSource; 
var destinationType;
var facingImage = "";

$("#principal").live("pageinit",function(event) {
	$("#close").click(
		function() {
			navigator.app.exitApp()
		}
	);
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	try { 
		pushNotification = window.plugins.pushNotification;
		typeDevice=(device.platform == "android" || device.platform == "Android")?0:1;
		if (device.platform == 'android' || device.platform == 'Android') {
			pushNotification.register(successHandler, errorHandler, {"senderID":senderId,"ecb":"onNotificationGCM"});
		}
		else {
			pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
		}
	}
	catch(err) { 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
	}
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function successHandler (result) { }

function errorHandler (error) { }

function tokenHandler (result) {
	idDevice = result;
	$.getJSON("http://www.anywhere.cl/wsanywhere/services/p2s/querys/listamensajes/" + idUsuario + "/" + idApp,{ },getMensajes);
}

function onNotificationAPN(e) {
	if (e.alert) {
		navigator.notification.alert(e.alert);
	}
	if (e.sound) {
		var snd = new Media(e.sound);
		snd.play();
	}
	if (e.badge) {
		pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
	}
}

function onNotificationGCM(e) {
	switch( e.event ) {
		case "registered":
				if ( e.regid.length > 0 ) {
					idDevice = e.regid;
					$.ajax({ 
						type: "POST",
						url: "http://www.anywhere.cl/wsanywhere/services/enrolamiento/update",
						data: {  a1:idUsuario, a2:idDevice, a3:senderId },
						crossDomain : true,
						success: function(data,status,jqXHR) { },
						error: function(XMLHttpRequest, textStatus, errorThrown) { console.log("transaccion incompleta"); }
					});		
				} 
				break;
		case "message":
				$.ajax({ 
					type: "POST",
					url: "http://www.anywhere.cl/wsanywhere/services/notificacion/tracking/save",
					data: {  a1:idDevice, a2:idUsuario, a3:idApp, a4:e.payload.msgcnt, a5:"1" },
					crossDomain : true,
					success: function(data,status,jqXHR) { console.log("transaccion guardada"); },
					error: function(XMLHttpRequest, textStatus, errorThrown) { console.log("transaccion incompleta"); }
				});				
				if (e.foreground) {
					var my_media = new Media("/android_asset/www/" + e.soundname);
					my_media.play();
				}
				else if(e.coldstart) { }
				else { }
				idMessage = e.payload.msgcnt;
				var url = "#mensaje";    
				$(location).attr("href",url);
				$("#txt_mensaje").html(e.payload.message);
				$("#btn_responder").removeClass("ui-disabled");  
				break;
		case "error":
				console.log("ERROR -> MSG:" + e.msg);
				break;
		default:
				console.log("EVENT -> Unknown, an event was received and we do not know what it is");
		break;
	}
}

capturePhotoEdit = function(source) {
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 50,
		destinationType : destinationType.DATA_URL,
		sourceType : source
	});
}

onFail = function(message) {
	alert('Failed because: ' + message);
}
		
onPhotoDataSuccess = function(imageData) {
	var capturefacing = document.getElementById("capturefacing");
	capturefacing.style.display = "block";
	capturefacing.src = "data:image/jpeg;base64," + imageData;
	facingImage = imageData;
}

function getMensajes(data) {
	$("#lvw_mensajes").empty();
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$("#lvw_mensajes").append('<li><a href="#mensaje" data-params="mensaje='+ escape(val2[2].value) +'">'+ 
			val2[2].value + '<span class="ui-li-count">' + val2[0].value + '</span></a></li>');
		});
	});
	$("#lvw_mensajes").listview("refresh");
}

$("#enrolar").live("click",
		function() {
			if(facingImage == null) {
				alert("Debe tomar una fotografia del usuario");
				return;
			}
			else {
				if ($("#formulario1").validate({
					errorPlacement: function(error, element) {
						if ($(element).is("select")) {
							error.insertAfter($(element).parent());
						}
						else {
							error.insertAfter(element);
						}
					}
				}).form() == true) {
					if(idDevice!=null && senderId !=null) {
						$.ajax({ 
							type: "POST",
							url: "http://www.anywhere.cl/wsanywhere/services/enrolamiento/save",
							data: {  a1 : $("#txt_rut").val(), a2 : $("#txt_password").val(), a3 : idDevice, a4 : typeDevice, 
									 a5 : senderId, a6 : direccion, a7 : latitud, a8 : longitud, a9 : facingImage
							},
							crossDomain : true,
							beforeSend: function() {
								$.mobile.showPageLoadingMsg();
							},				
							success: function(data,status,jqXHR) {
								 alert("Se ha guardado el registro")
								 limpiaForm("#formulario1");
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
								alert("Ocurri&oacute; un error al guardar el registro")
								limpiaForm("#formulario1");
							},
							complete: function(data) {
								$.mobile.hidePageLoadingMsg();
								$(location).attr("href","#principal");
							}
						});
					}	
				}
			}
	});

	$("#desenrolar").live("click",
		function() {
			pushNotification.unregister(successHandler, errorHandler);
			$.ajax({ 
				type: "POST",
				url: "http://www.anywhere.cl/wsanywhere/services/enrolamiento/delete",
				data: {  a1:$("#txt_rut").val(), a2:$("txt_password").val(), a3:idDevice },
				crossDomain : true,
				beforeSend: function() {
					$.mobile.showPageLoadingMsg();
				},
				success: function(data,status,jqXHR) {
					alert("Se ha desenrolado el dispositivo")
					limpiaForm("#formulario1");
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					alert("Ocurri&oacute; un error al desenrolar el dispositivo")
					limpiaForm("#formulario1");
				},
				complete: function(data) {
					$.mobile.hidePageLoadingMsg();
					$(location).attr("href","login.html");
				}
			});
		});