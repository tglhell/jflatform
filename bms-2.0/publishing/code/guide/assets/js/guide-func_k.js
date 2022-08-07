$(() => {
	$('.view_code').on('click', () => {
		const _thisTar = $(this).next('.code-toolbar');
		_thisTar.toggleClass('open');
		if (_thisTar.hasClass('open')) {
			_thisTar.slideDown();
		} else {
			_thisTar.slideUp();
		}
	});

	$.ajax({
		type: 'get',
		url: '/publishing/code/guide/html/coding_guide_status.html',
		dataType : 'html',
		success: function(data) {
			$('.contents_infor.guide-content').html(data);
			if ($('.s-header').length !== 0) {
				setTimeout(function () {
					$('.contents_infor.guide-content').addClass('active');
				}, 500);
			}
		}
	});

	$('.contents_infor.guide-content').after('<div class="g-bg-canvas"></div>');

	$('.tab').on('click', 'a', (e) => {
		const tabTitTxt = $(e.target).attr('data-label');
		const tabIdx = [$(this).index(), $('.tab a span.active').parent().index()];
		e.preventDefault();
		$.ajax({
			type: 'get',
			url: '/publishing/code/guide/html/coding_guide_' + tabTitTxt + '.html',
			dataType : 'html',
			success: function(data) {
				if (!$('.contents_infor.guide-content').is(':animated')) {
					$(e.target).parent().addClass('active').siblings().removeAttr('class');
					if (tabIdx[0] > tabIdx[1]) {
						$('.contents_infor.guide-content').animate({'left':'-25%', 'opacity':'0'}, 300, () => {
							$('.contents_infor.guide-content').css({'left':'auto', 'right':'-25%'});
							$('.contents_infor.guide-content').animate({'right':'0', 'left':'auto', 'opacity':'1'}, 500, 'easeInOutExpo', () => {
								$('.contents_infor.guide-content').removeAttr('style').addClass('tab-slide');
							});
						});
					} else {
						$('.contents_infor.guide-content').animate({'right':'-25%', 'opacity':'0'}, 300, () => {
							$('.contents_infor.guide-content').css({'right':'auto', 'left':'-25%'});
							$('.contents_infor.guide-content').animate({'left':'0', 'right':'auto', 'opacity':'1'}, 500, 'easeInOutExpo', () => {
								$('.contents_infor.guide-content').removeAttr('style').addClass('tab-slide');
							});
						});
					}
					setTimeout(() => {
						$('.contents_infor.guide-content').html(data);
					}, 300);
				}
			}
		});
	});

	if ($('.btn-top').length !== null) {
		$(window).scroll(() => {
			var ScrollPos = $(window).scrollTop();
			if (ScrollPos > 72) {
				$('.btn-top').addClass('active');
			} else {
				$('.btn-top').removeClass('active');
			}
		});
	}

	$('.btn-top').on('click', () => {
		$('html, body').stop().animate({scrollTop:0}, 500, 'easeInOutCirc');
	});

	function addDataText () {
		$('.tab a').each(function () {
			const tabTarTxt = $(this).text();
			$(this).attr('data-label', tabTarTxt);
		});
	}
	addDataText ();
});

// $.getScript('/publishing/code/guide/assets/js/p-func.js');