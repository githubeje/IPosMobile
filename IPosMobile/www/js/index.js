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
