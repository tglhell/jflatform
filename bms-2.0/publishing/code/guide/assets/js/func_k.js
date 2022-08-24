(function ($) {
	$.fn.state = function (options) {
		var settings = $.extend({
				title: 'h2.s-title',
				content: 'div.content',
				files: 'tbody tr',
				date: 'td.state',
				index: 0,
				openAll: false,
				speed: 'fast'
			}, options),
			all_sections = this,
			header = $('div.header');
		return this.each(function () {
			var self = this,
				$self = $(self),
				title_text = [],
				completed = 0;
			self.section_title = $(settings.title, $self);
			self.content = $(settings.content, $self);
			self.files = $(settings.files, $self);
			self.files.each(function () {
				var date = $(settings.date, this);
				date.each(function () {
					var text = $(this).text();
					if (text) {
						completed++;
					}
				});
			});
			self.files
				.bind('mouseenter', function () {
					$(this).addClass('hover');
				})
				.bind('mouseleave', function () {
					$(this).removeClass('hover');
				});
			title_text = [self.section_title.text(), ' <span class="page-count">(', completed, '/', self.files.length,
				') - <span style="color:#16a0f0;">1depth</span><span class="s-bar"></span></span>'
			];
			self.section_title.html(title_text.join(''));
			self.section_title.bind('click', () => {
				self.content.slideToggle(settings.speed);
			});
			if (settings.openAll || ((settings.index - 1) === all_sections.index(this))) {
				self.content.css('display', 'block');
			}
		});
	};
	$(document).ready(() => {
		$('div.section').state({
			openAll: true
		});
		$('#total').text($('tbody tr').length);
		$('tbody tr:even').addClass('even');
		$('tbody td[rowspan][rowspan!=1]').addClass('multi');

		$('td:last-child .fcR').on('click', () => {
			$(this).toggleClass('on');
		});
	});
}(jQuery));

$(() => {
	$(window).scroll(() => {
		let ScrollPos = $(window).scrollTop();
		if (ScrollPos > 72) {
			$('.btn-top').addClass('active');
		} else {
			$('.btn-top').removeClass('active');
		}
	});

	$('.btn-top').on('click', () => {
		$('html, body').stop().animate({scrollTop:0}, secVal[4], 'easeInOutQuart');
	});

	if (!$('body').hasClass('js')) {
		$('body').addClass('js');
	}

	$(document).on('mouseenter mousemove mouseleave', '.status-wrap a', function (e) {
		if ($('.chk-option-list .item1').is(':checked')) {
			if (e.type == 'mouseenter') {
				if (!$(this).prev().is('.code-preview')) {
					const locationUrl = $(this).closest('td').prev().text();
					const pageNum = $(this).text();
					$(this).before('<p class="code-preview" style="display: none;"><iframe src="/publishing' + locationUrl + pageNum + '"></iframe>');
				}
				$(this).parent().find('.code-preview').css({'top':(e.pageY - (irNum[8] * twoDig[6])) + 'px', 'left':(e.pageX - (secVal[5] + twoDig[1])) + 'px', 'display':'block'}).attr('tabindex', '0').focus();
			} else if (e.type == 'mouseleave') {
				$('.code-preview').remove();
			} else {
				$(this).parent().find('.code-preview').css({'top':(e.pageY - (irNum[8] * twoDig[6])) + 'px', 'left':(e.pageX - secVal[5] + twoDig[1]) + 'px'});
			}
		}
	});
});

$.getScript('/publishing/code/guide/assets/js/p-func.js');

function statusOptionChkVal () {
	// const chkOptionItem = {
	// 	item1 : $('.chk-option-list .item1'),
	// 	item2 : $('.chk-option-list .item2')
	// }
	
	chkOptionVal = localStorage['chkOptionVal'] || false;
	chkOptionVal = chkOptionVal === "true";
	chkOptionVal2 = localStorage['chkOptionVal2'] || false;
	chkOptionVal2 = chkOptionVal2 === "true";
	chkOptionVal3 = localStorage['chkOptionVal3'] || false;
	chkOptionVal3 = chkOptionVal3 === "true";

	$('.chk-option-list .item1').prop('checked', chkOptionVal);
	$('.chk-option-list .item2').prop('checked', chkOptionVal2);
	$('.chk-option-list .item3').prop('checked', chkOptionVal3);

	$('.chk-option-list .item1').change(() => {
		chkOptionVal = !!$('.chk-option-list .item1').is(':checked');
		localStorage['chkOptionVal'] = chkOptionVal;
	});
	$('.chk-option-list .item2').change(() => {
		chkOptionVal2 = !!$('.chk-option-list .item2').is(':checked');
		localStorage['chkOptionVal2'] = chkOptionVal2;
		if ($('.chk-option-list .item2').is(':checked')) {
			$('.g-bg-canvas').show();
		} else {
			$('.g-bg-canvas').hide();
		}
	});
	$('.chk-option-list .item3').change(() => {
		chkOptionVal3 = !!$('.chk-option-list .item3').is(':checked');
		localStorage['chkOptionVal3'] = chkOptionVal3;
		darkModeChk ();
	});

	function darkModeChk () {
		if ($('.chk-option-list .item3').is(':checked')) {
			$('html').addClass('d-mode');
		} else {
			$('html').removeClass('d-mode');
		}
	}
	darkModeChk ();
}
statusOptionChkVal ();