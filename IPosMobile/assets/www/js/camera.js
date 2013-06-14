var pictureSource; 
var destinationType;
var facingImage = "";

$(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		pictureSource = navigator.camera.PictureSourceType;
		destinationType = navigator.camera.DestinationType;
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
});


