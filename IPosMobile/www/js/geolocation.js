var map = null;
var facingImage = "";
var posLatitud = null;
var posLongitud = null;
var pictureSource; 
var destinationType;

$(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		pictureSource = navigator.camera.PictureSourceType;
		destinationType = navigator.camera.DestinationType;
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}
	
	function onSuccess(position) {
		posLatitud = position.coords.latitude;
		posLongitud = position.coords.longitude;
		cargaPosicionActual();
	}

	function onError(error) {
		alert("Intente realizar nuevamente esta operación.  Si el problema persiste, busque un sitio con mejor recepción");
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
		var capturefacing = document.getElementById('capturefacing');
		capturefacing.style.display = 'block';
		capturefacing.src = "data:image/jpeg;base64," + imageData;
		facingImage = imageData;
	}

	inicializar = function() {
		if (GBrowserIsCompatible()) {
			map = new GMap2(document.getElementById("map"));
			var posicion = new GLatLng(-33.4565817,-70.6108061);
			map.setCenter(posicion,10);
			map.addControl(new GMapTypeControl(1));
			map.addControl(new GLargeMapControl());
			map.addControl(new GScaleControl(256));
			new GKeyboardHandler(map);
			map.enableContinuousZoom();
			map.enableDoubleClickZoom();
			var bounds = new GLatLngBounds();
			geocoder = new GClientGeocoder();
			geocoder.getLocations(posicion, mostrarDireccion);
			var marker = marcarPosicion(posicion,'<b>Edificio Recourse</b><br/><a href="http://www.recourse.cl">Empresas ECRGROUP</a>');
			map.addOverlay(marker);
		}
	};

	mostrarDireccion = function(response) {
		if (!response || response.Status.code != 200) {
			alert("Código Estado:" + response.Status.code);
		} 
		else {
			place = response.Placemark[0];
			document.getElementById("direccion").innerHTML=place.address;
			document.getElementById("direccion_fisica").value = place.address;
	    }
	};

	marcarPosicion = function(point, address) {
		var marker = new GMarker(point);
		GEvent.addListener(marker, "click", function() { marker.openInfoWindowHtml(address); } );
		return marker;
	};

	obtieneCoordenadas = function () {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition( 
				function(position) {
					posLatitud = position.coords.latitude;
					posLongitud = position.coords.longitude;
				}
			);
		}
		else {
			alert('Su navegador no soporta geolocalización');
		}
	};		

	cargaPosicionActual = function () {
		if (GBrowserIsCompatible()) {
			map = new GMap2(document.getElementById("map"));
			var posicion = new GLatLng(posLatitud,posLongitud);
			map.setCenter(posicion,15);
			map.addControl(new GMapTypeControl(1));
			map.addControl(new GLargeMapControl());
			map.addControl(new GScaleControl(256));
			new GKeyboardHandler(map);
			map.enableContinuousZoom();
			map.enableDoubleClickZoom();				
			var bounds = new GLatLngBounds();
			geocoder = new GClientGeocoder();
			geocoder.getLocations(posicion, mostrarDireccion);
			var point1 = new GLatLng(posLatitud,posLongitud);
			var address1 = '<b>Mi ubicacion</b>';
			var marker1 = marcarPosicion(point1, address1);
			map.addOverlay(marker1);
		}
	};

	fit = function() {
		map.panTo(bounds.getCenter()); 
		map.setZoom(map.getBoundsZoomLevel(bounds));
	};

	draw = function(pnt) {
		bounds = new GLatLngBounds();
		var givenRad = document.getElementById("radius").value*1;
		var givenQuality = document.getElementById("seqments").value*1;
		var centre = map.getCenter();
		drawCircle(centre,givenRad,givenQuality);
		fit();
	};
	
	drawCircle = function(center, radius, nodes, liColor, liWidth, liOpa, fillColor, fillOpa) {
		var latConv = center.distanceFrom(new GLatLng(center.lat()+0.1, center.lng()))/100;
		var lngConv = center.distanceFrom(new GLatLng(center.lat(), center.lng()+0.1))/100;
		var points = [];
		var step = parseInt(360/nodes)||10;
		for(var i=0; i<=360; i+=step) {
	    	var pint = new GLatLng(center.lat() + (radius/latConv * Math.cos(i * Math.PI/180)), 
	      						   center.lng() + (radius/lngConv * Math.sin(i * Math.PI/180)));
			points.push(pint);
	    	bounds.extend(pint);
		}
		points.push(points[0]);
		fillColor = fillColor||liColor||"#0055ff";
		liWidth = liWidth||2;
		var poly = new GPolygon(points,liColor,liWidth,liOpa,fillColor,fillOpa);
		map.addOverlay(poly);
	};

	mostrarCoordenadas = function(calle, numero, comuna, region, pais) {
		address = calle + ' ' + numero + ', ' + comuna + ', ' + region + ', ' + pais;
		geocoder = new GClientGeocoder();
		geocoder.getLatLng(
		    address,
		    function(point) {
		        if (point !== null) {
					document.getElementById("latitud").value = point.lat();
					document.getElementById("longitud").value = point.lng();
					posLatitud = point.lat();
					posLongitud = point.lng();			
		            return point;
		        }
		        else {
		        	return null;
		        }
		    }
		);	
	}
	
	mostrarCoordenadas = function(address) {
		geocoder = new GClientGeocoder();
		if( geocoder )
			return geocoder.getLatLng(address,
				function(point) {
					if (point !== null) {
						posLatitud = point.lat();
						posLongitud = point.lng();					
						document.getElementById("latitud").value = point.lat();
						document.getElementById("longitud").value = point.lng();
						return point;
					}
					else {
						return null;
					}
				}
			);
	}
});