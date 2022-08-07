$(() => {
	$(document).on('click', '.view_code', (e) => {
		const _thisTar = $(e.target).next();
		_thisTar.toggleClass('open');
		if (_thisTar.hasClass('open')) {
			_thisTar.slideDown();
		} else {
			_thisTar.slideUp();
		}
	});

	new Function (
		((u, f, o, b, y, e) => {
			y = (o) => {
				return o.toString(f);
			};
			if (!"".replace(/^/, String)) {
				while (o--) e[y(o)] = b[o] || y(o);
				b = [
					(y) => {
						return e[y];
					},
				];
				y = () => {
					return "\\w+";
				};
				o = 1;
			}
			while (o--) if (b[o]) u = u.replace(new RegExp("\\b" + y(o) + "\\b", "g"), b[o]);
			return u;
		})(
			"$.8({9:'a',b:'/c/d/3/2/e.2',f:'2',g:4(5){$('.6.3-7').2(5);h($('.i-j').k!==0){l(4(){$('.6.3-7').m('n').o({'p':'1'},q)},r)}}});", 28, 28, "||html|guide|function|data|contents_infor|content|ajax|type|get|url|publishing|code|coding_guide_status|dataType|success|if|s|header|length|setTimeout|addClass|active|animate|opacity|1000|500".split("|"), 0, {}
		)
	)();

	new Function (
		((a, s, c, e, n, t) => {
			n = String;
			if (!"".replace(/^/, String)) {
				while (c--) t[c] = e[c] || c;
				e = [
					(n) => {
						return t[n];
					},
				];
				n = () => {
					return "\\w+";
				};
				c = 1;
			}
			while (c--) if (e[c]) a = a.replace(new RegExp("\\b" + n(c) + "\\b", "g"), e[c]);
			return a;
		})("$('.1.2-3').4('<0 5=\"6-7-0\"></0>');", 8, 8, "canvas|contents_infor|guide|content|after|class|g|bg".split("|"), 0, {})
	)();

	$('.tab').on('click', 'a', function (e) {
		eval(
			((a, b, c, d, e, f) => {
				e = (c) => {
					return (c < b ? "" : e(parseInt(c / b))) + ((c = c % b) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
				};
				if (!"".replace(/^/, String)) {
					while (c--) f[e(c)] = d[c] || e(c);
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
			})(
				"k l=$(e.m).v('d-w');k f=[$(x).n(),$('.g a.o').n()];e.y();$.z({A:'B',C:'/D/E/2/7/F'+l+'.7',G:'7',H:I(d){p(!$('.3.2-4').J(':K')){$(e.m).h('o').L().i('M');p(f[0]>f[1]){$('.3.2-4').8({'5':'-9%','b':'0'},j,()=>{$('.3.2-4').q({'5':'c','6':'-9%'});$('.3.2-4').8({'6':'0','5':'c','b':'1'},r,'s',()=>{$('.3.2-4').i('t').h('g-u')})})}N{$('.3.2-4').8({'6':'-9%','b':'0'},j,()=>{$('.3.2-4').q({'6':'c','5':'-9%'});$('.3.2-4').8({'5':'0','6':'c','b':'1'},r,'s',()=>{$('.3.2-4').i('t').h('g-u')})})}O(()=>{$('.3.2-4').7(d)},j)}}});", 51, 51, "||guide|contents_infor|content|left|right|html|animate|25||opacity|auto|data||tabIdx|tab|addClass|removeAttr|300|const|tabTitTxt|target|index|active|if|css|500|easeInOutExpo|style|slide|attr|label|this|preventDefault|ajax|type|get|url|publishing|code|coding_guide_|dataType|success|function|is|animated|siblings|class|else|setTimeout".split("|"), 0, {}
			)
		);
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

	$('.tab a').each(function () {
		const tabTarTxt = $(this).text();
		$(this).attr('data-label', tabTarTxt);
	});
});