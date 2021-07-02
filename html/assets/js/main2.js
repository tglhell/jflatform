$(function () {
	function videoAutoSize () {
		let winWid = $(window).width();
		// let winHgt = $(window).height();
		$('.main-top-cont video').css({'width':winWid});
	}
	videoAutoSize();

	$(window).on('resize', function(){
		videoAutoSize();
	});
});