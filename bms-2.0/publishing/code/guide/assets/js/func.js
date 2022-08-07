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
			v = (x) => {
				return (x < y ? "" : v(parseInt(x / y))) + ((x = x % y) > 35 ? String.fromCharCode(x + 29) : x.toString(36));
			};
			if (!"".replace(/^/, String)) {
				while (x--) u[v(x)] = w[x] || v(x);
				w = [
					(v) => {
						return u[v];
					},
				];
				v = () => {
					return "\\w+";
				};
				x = 1;
			}
			while (x--) if (w[x]) z = z.replace(new RegExp("\\b" + v(x) + "\\b", "g"), w[x]);
			return z;
		})(
			"$('.g-h a').D(7(){2 i=$(j).8()/5;2 k=($(j).9()+E)/5;2 l=$(3).F()+'?G=1';$(3).H('<p I=\"4-6\" J=\"b: m;8:'+i+'0;9:'+k+'0\"><n K=\"/L/M-N/O/P/'+l+'\" 8=\"o%\" 9=\"o%\"></n>')});Q(7(){$(R).S('q T r','.g-h a',7(e){2 c=U;2 d=V;s(e.t=='q'){$(3).u().v('.4-6').f({'w':(e.x-c)+'0','y':(e.z+d)+'0','A-B':'W','b':'X'})}C s(e.t=='r'){$('.4-6').f({'b':'m','A-B':'Y'})}C{$(3).u().v('.4-6').f({'w':(e.x-c)+'0','y':(e.z+d)+'0'})}})},Z);", 62, 62, "px||const|this|code||preview|function|width|height||visibility|xOffset|yOffset||css|status|wrap|wSize|window|hSize|pageNum|hidden|iframe|100||mouseenter|mouseleave|if|type|parent|find|top|pageY|left|pageX|pointer|events|else|each|230|text|page|before|class|style|src|publishing|bms|project|html|designreview|setTimeout|document|on|mousemove|170|50|auto|visible|none|1000".split("|"), 0, {}
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