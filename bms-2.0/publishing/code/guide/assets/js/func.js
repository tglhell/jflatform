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

	new Function (
		(function (z, y, x, w, v, u) {
			v = function (x) {
				return (x < y ? "" : v(parseInt(x / y))) + ((x = x % y) > 35 ? String.fromCharCode(x + 29) : x.toString(36));
			};
			if (!"".replace(/^/, String)) {
				while (x--) u[v(x)] = w[x] || v(x);
				w = [
					function (v) {
						return u[v];
					},
				];
				v = function () {
					return "\\w+";
				};
				x = 1;
			}
			while (x--) if (w[x]) z = z.replace(new RegExp("\\b" + v(x) + "\\b", "g"), w[x]);
			return z;
		})(
			"$('.d-f a').x(5(){6 g=$(0).y()+'?z=1';$(0).A('<p B=\"2-3\" C=\"7: 8;\"><h D=\"/E/F-G/H/I/'+g+'\" J=\"i%\" K=\"i%\"></h>')});L(5(){$(M).N('j O k','.d-f a',5(e){6 9=P;6 b=Q;l(e.m=='j'){$(0).n().o('.2-3').c({'q':(e.r-9)+'4','s':(e.t+b)+'4','u-v':'R','7':'S'})}w l(e.m=='k'){$('.2-3').c({'7':'8','u-v':'8'})}w{$(0).n().o('.2-3').c({'q':(e.r-9)+'4','s':(e.t+b)+'4'})}})},T);", 56, 56, "this||code|preview|px|function|const|display|none|xOffset||yOffset|css|status||wrap|pageNum|iframe|100|mouseenter|mouseleave|if|type|parent|find||top|pageY|left|pageX|pointer|events|else|each|text|page|before|class|style|src|publishing|bms|project|html|designreview|width|height|setTimeout|document|on|mousemove|170|50|auto|block|1000".split("|"), 0, {}
		)
	)();
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