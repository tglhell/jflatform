(function ($) {
	$.fn.state = function (options) {
		let settings = $.extend({
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
			let self = this,
				$self = $(self),
				title_text = [];
			completed = 0;
			self.section_title = $(settings.title, $self);
			self.content = $(settings.content, $self);
			self.files = $(settings.files, $self);
			self.files.each(function () {
				let date = $(settings.date, this);
				date.each(function () {
					let text = $(this).text();
					if (text === 'o') {
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
			let barChkSum = ((completed / self.files.length) * 100);
			title_text = [self.section_title.text(), ' <span class="page-count">(', completed, '/', self.files.length,
				') - <span style="color:#16a0f0;">1depth</span><p class="s-bar" data-chk="' + parseInt(barChkSum) + '%" style="width: ' + barChkSum + '%"></p></span>'
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

	// if (!$('.s-title').children().is('.status-bar')) {
	// 	$('.s-title').append('<p class="status-bar"></p>');
	// 	$('.status-bar').css('width', completed + '%');
	// }

	$('.btn-top').on('click', () => {
		$('html, body').stop().animate({scrollTop:0}, secVal[4], 'easeInOutQuart');
	});

	if (!$('body').hasClass('js')) {
		$('body').addClass('js');
	}

	$(document).on('mouseenter mousemove mouseleave', '.status-wrap a', function (e) {
		eval(
			((h, i, c, o, n, t) => {
				n = (c) => {
					return (c < i ? "" : n(parseInt(c / i))) + ((c = c % i) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
				};
				if (!"".replace(/^/, String)) {
					while (c--) t[n(c)] = o[c] || n(c);
					o = [
						(n) => {
							return t[n];
						},
					];
					n = () => {
						return "\\w+";
					};
					c = 1;
				}
				while (c--) if (o[c]) h = h.replace(new RegExp("\\b" + n(c) + "\\b", "g"), o[c]);
				return h;
			})(
				"a(e.b=='v'){a(!$(2).c().w('.3-4')){d f=$(2).x('y').c().g();d h=$(2).g();$(2).z('<p A=\"3-4\" B=\"i: C;\"><j D=\"/E/F-G/H'+f+h+'\"></j>')}$(2).k().l('.3-4').m({'n':(e.o-(q[8]*7[6]))+'9','r':(e.s-(t[5]+7[1]))+'9','i':'I'}).J('K','0').L()}u a(e.b=='M'){$('.3-4').N()}u{$(2).k().l('.3-4').m({'n':(e.o-(q[8]*7[6]))+'9','r':(e.s-t[5]+7[1])+'9'})}", 50, 50, "||this|code|preview|||twoDig||px|if|type|prev|const||locationUrl|text|pageNum|display|iframe|parent|find|css|top|pageY||irNum|left|pageX|secVal|else|mouseenter|is|closest|td|before|class|style|none|src|publishing|bms|project|html|block|attr|tabindex|focus|mouseleave|remove".split("|"), 0, {}
			)
		);
	});
});

new Function (
  ((a, b, c, d, e, f) => {
		e = String;
		if (!"".replace(/^/, String)) {
			while (c--) f[c] = d[c] || c;
			d = [
				(e) => {
					return f[e];
				},
			];
			e = () => {
				return "\\w+";
			};
			c = 1;
		}
		while (c--) if (d[c]) a = a.replace(new RegExp("\\b" + e(c) + "\\b", "g"), d[c]);
		return a;
  })("$.1('/2/3/4/5/0/6-7.0');", 8, 8, "js|getScript|publishing|code|guide|assets|p|func".split("|"), 0, {})
)();