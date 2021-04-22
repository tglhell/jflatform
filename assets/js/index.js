$(function(){
	const progressIndicator = '<div class="page-scroll-indicator"></div>';
	$('body').append(progressIndicator);
	
	$(window).on('scroll', function(){
		let currentPercentage = ($(window).scrollTop() / ($(document).outerHeight() - $(window).height())) * 100;
		$('.page-scroll-indicator').width(currentPercentage + '%');
	});
});