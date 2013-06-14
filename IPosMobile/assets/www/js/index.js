$("#principal").live("pageinit",function(event) {
	$("#close").click(
		function() {
			navigator.app.exitApp()
		}
	);
});