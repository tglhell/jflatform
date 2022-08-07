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
		$('html, body').stop().animate({scrollTop:0}, 500, 'easeInOutQuart');
	});

	if (!$('body').hasClass('js')) {
		$('body').addClass('js');
	}

	$(document).on('mouseenter mousemove mouseleave', '.status-wrap a', function (e) {
		eval(
			((f, a, s, t, e, r) => {
				e = (s) => {
					return (s < a ? "" : e(parseInt(s / a))) + ((s = s % a) > 35 ? String.fromCharCode(s + 29) : s.toString(36));
				};
				if (!"".replace(/^/, String)) {
					while (s--) r[e(s)] = t[s] || e(s);
					t = [
						(e) => {
							return r[e];
						},
					];
					e = () => {
						return "\\w+";
					};
					s = 1;
				}
				while (s--) if (t[s]) f = f.replace(new RegExp("\\b" + e(s) + "\\b", "g"), t[s]);
				return f;
			})(
				"2 7=x;2 8=y;9(e.f=='z'){2 g=$(h).a()/5;9(!$(3).A().B('.4-6')){2 i=($(h).b()+C)/5;2 j=$(3).D()+'?E=1';$(3).F('<p G=\"4-6\" H=\"c: k;a:'+g+'0;b:'+i+'0\"><l I=\"/J/K-L/M/N/'+j+'\" a=\"m%\" b=\"m%\"></l>')}$(3).n().o('.4-6').d({'q':(e.r-7)+'0','s':(e.t+8)+'0','u-v':'O','c':'P'})}w 9(e.f=='Q'){$('.4-6').d({'c':'k','u-v':'R'})}w{$(3).n().o('.4-6').d({'q':(e.r-7)+'0','s':(e.t+8)+'0'})}", 54, 54, "px||const|this|code||preview|xOffset|yOffset|if|width|height|visibility|css||type|wSize|window|hSize|pageNum|hidden|iframe|100|parent|find||top|pageY|left|pageX|pointer|events|else|170|50|mouseenter|prev|is|230|text|page|before|class|style|src|publishing|bms|project|html|designreview|auto|visible|mouseleave|none".split("|"), 0, {}
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