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
			((h, i, j, a, c, k) => {
				c = (j) => {
					return (j < i ? "" : c(parseInt(j / i))) + ((j = j % i) > 35 ? String.fromCharCode(j + 29) : j.toString(36));
				};
				if (!"".replace(/^/, String)) {
					while (j--) k[c(j)] = a[j] || c(j);
					a = [
						(c) => {
							return k[c];
						},
					];
					c = () => {
						return "\\w+";
					};
					j = 1;
				}
				while (j--) if (a[j]) h = h.replace(new RegExp("\\b" + c(j) + "\\b", "g"), a[j]);
				return h;
			})(
				"0 6=w;0 7=-x;8(e.d=='y'){0 f=$(g).9()/5;8(!$(1).h().z('.3-4')){0 i=($(g).a()+A)/5;0 j=$(1).B('C').h().k();0 l=$(1).k();$(1).D('<p E=\"3-4\" F=\"b: m; 9:'+f+'2; a:'+i+'2\"><n G=\"/H/I-J/K'+j+l+'\" 9=\"L\" a=\"M\"></n>')}$(1).o().q('.3-4').c({'r':(e.s-6)+'2','t':(e.u+7)+'2','b':'N'})}v 8(e.d=='O'){$('.3-4').c({'b':'m'})}v{$(1).o().q('.3-4').c({'r':(e.s-6)+'2','t':(e.u+7)+'2'})}", 51, 51, "const|this|px|code|preview||xOffset|yOffset|if|width|height|display|css|type||wSize|window|prev|hSize|locationUrl|text|pageNum|none|iframe|parent||find|top|pageY|left|pageX|else|625|650|mouseenter|is|230|closest|td|before|class|style|src|publishing|bms|project|html|1920|1080|block|mouseleave".split("|"), 0, {}
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