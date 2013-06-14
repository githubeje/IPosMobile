var ventas = [];
var metas = [];
var productos = [];
var seriex = [];

$('#listado').live('pageshow', function() {
	$('#listado_metas').listview('refresh');	
});

$('#grafico').live('pageinit', function() {
	$('#grafico1').bind('jqplotDataClick', function (ev, seriesIndex, pointIndex, data) {
		$('#info1').html('series: ' + seriesIndex + ', point: ' + pointIndex + ', data: ' + data);
	});
});

$('#grafico').live('pageshow', function() {
	if(filtro_metas.value == "E") {
		
	}
	else {
		drawnBarStack('grafico1',[metas,ventas],[ {label:"metas"},{label:"ventas"}],productos);
	}
});

$('#buscar').live('click', function(e) {
	if ($('#formulario').validate({
		errorPlacement: function(error, element) {
			if ($(element).is('select') || $(element).jqmData('role') == 'datebox') {
				error.insertAfter($(element).parent());
			}
			else {
				error.insertAfter(element);
			}
		}
	 }).form() == true) {
		var query = "metasporfecha";
		if(filtro_metas.value == "E") {
			$.getJSON('http://www.anywhere.cl/wsanywhere/services/p2s/querys/metasdiariasporproducto/1',getMetasUltimos90dias); 
		}
		else {
			var query = "metasporfecha";
			fecha_inicio = moment($('#fecha_inicio').val(), 'DD/MM/YYYYY').format('YYYYMMDD');
			fecha_termino = moment($('#fecha_termino').val(), 'DD/MM/YYYYY').format('YYYYMMDD');
			$.getJSON('http://www.anywhere.cl/wsanywhere/services/p2s/querys/metasporfecha/1/1/'+ fecha_inicio +'/'+ fecha_termino + '/' + filtro_metas.value,getMetasPorFecha); 
		}
	 }
});

$('#listado_metas li a').live('click', function(e) {
	data = $(this).jqmData('params');
	globalParams = data !== null ? data : null;
	$('#producto').val(getUrlVars(globalParams)['producto']);
	$('#metas').val(getUrlVars(globalParams)['metas']);
	$('#ventas').val(getUrlVars(globalParams)['ventas']);
});

function getMetasPorFecha(data) {
	ventas = [];
	metas = [];
	productos = [];
	var i=0;
	$('#listado_metas').children().remove('li');
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#listado_metas').append('<li><a href="#detalle" data-params="producto='+ val2[0].value +'&ventas='+ val2[3].value +'&metas='+ val2[2].value +'">'+ 
										 val2[1].value + '</a></li>');
			metas[i] = parseInt(val2[2].value);
			ventas[i] = parseInt(val2[3].value);
			productos[i] = val2[0].value;
			i = i + 1;									 
		});
	});
	$(location).attr('href', '#listado');
}

function getMetasUltimos90dias(data) {
	ventas = [];
	metas = [];
	productos = [];
	var i=0;
	$('#listado_metas').children().remove('li');
	$.each(data, function(key, val) {
		$.each(val, function(key2, val2) {
			$('#listado_metas').append('<li><a href="#detalle" data-params="producto='+ val2[3].value +'&ventas='+ val2[15].value +'&metas='+ val2[13].value +'">'+ 
										 val2[4].value + '</a></li>');
			metas[i] = parseInt(val2[13].value);
			ventas[i] = parseInt(val2[15].value);
			productos[i] = val2[3].value;
			i = i + 1;									 
		});
	});
	$(location).attr('href', '#listado');
}

