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
				"5(e.6=='r'){5(!$(1).7().s('.3-4')){8 9=$(1).t('u').7().a();8 b=$(1).a();$(1).v('<p w=\"3-4\" x=\"c: y; z:'+'A'+'2; B:'+'C'+'2; D: E(.d, .d);\"><f F=\"/G/H-I/J'+9+b+'\"></f>')}$(1).g().h('.3-4').i({'j':(e.k-l)+'2','m':(e.n-o)+'2','c':'K'}).L('M','0').N()}q 5(e.6=='O'){$('.3-4').P()}q{$(1).g().h('.3-4').i({'j':(e.k-l)+'2','m':(e.n-o)+'2'})}", 52, 52, "|this|px|code|preview|if|type|prev|const|locationUrl|text|pageNum|display|25||iframe|parent|find|css|top|pageY|630|left|pageX|620||else|mouseenter|is|closest|td|before|class|style|none|width|1920|height|1080|transform|scale|src|publishing|bms|project|html|block|attr|tabindex|focus|mouseleave|remove".split("|"), 0, {}
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