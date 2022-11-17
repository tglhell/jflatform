(function ($) {
	new Function (
		(function (l, o, s, t, j, c) {
			j = (s) => {
				return (s < o ? "" : j(parseInt(s / o))) + ((s = s % o) > 35 ? String.fromCharCode(s + 29) : s.toString(36));
			};
			if (!"".replace(/^/, String)) {
				while (s--) c[j(s)] = t[s] || j(s);
				t = [
					(j) => {
						return c[j];
					},
				];
				j = () => {
					return "\\w+";
				};
				s = 1;
			}
			while (s--) if (t[s]) l = l.replace(new RegExp("\\b" + j(s) + "\\b", "g"), t[s]);
			return l;
		})(
			"$.U.9=6(C){4 5=$.V({n:'W.s-n',a:'7.a',8:'e q',f:'c.9',r:0,t:X,D:'Y'},C),E=3,F=$('7.F');Z 3.g(6(){4 2=3,$2=$(2),u=[];h=0;2.i=$(5.n,$2);2.a=$(5.a,$2);2.8=$(5.8,$2);2.8.g(6(){4 f=$(5.f,3);f.g(6(){4 b=$(3).b();v(b==='o'){h++}})});2.8.w('10',6(){$(3).x('G')}).w('11',6(){$(3).12('G')});4 y=((h/2.8.j)*H);u=[2.i.b(),' <k l=\"13-14\">(',h,'/',2.8.j,') - <k I=\"15:#16;\">17</k><p l=\"s-z\" J-K=\"'+L(y)+'%\" I=\"M: '+y+'%\"></p></k>'];2.i.18(u.19(''));2.i.w('N',()=>{2.a.1a(5.D)});v(5.t||((5.r-1)===E.r(3))){2.a.O('1b','1c')}})};$(1d).1e(()=>{m=0;4 A=$('c.9').j;$('c.9').g(6(){4 P=$(3).b();v(P==='o'){m++}});$('7.1f').9({t:1g});$('#d').b($('e q').j);$('e q:Q').x('Q');$('e c[R][R!=1]').x('1h');$('c:1i-1j .1k').S('N',()=>{$(3).1l('S')});4 B=((m/A)*H);$('.1m-1n').1o('<7 l=\"d-T-z\"><7 l=\"d-K-9\">1p : ('+m+'/'+A+')</7></7>');$('.d-T-z').1q('J-d-1r',L(B)+'%').O('M',B+'%')});",
			62, 90, "||self|this|let|settings|function|div|files|state|content|text|td|total|tbody|date|each|completed|section_title|length|span|class|chkItemNum|title|||tr|index||openAll|title_text|if|bind|addClass|barChkSum|bar|stAllItem|totalChkSum|options|speed|all_sections|header|hover|100|style|data|chk|parseInt|width|click|css|stChkText|even|rowspan|on|result|fn|extend|h2|false|fast|return|mouseenter|mouseleave|removeClass|page|count|color|16a0f0|1depth|html|join|slideToggle|display|block|document|ready|section|true|multi|last|child|fcR|toggleClass|status|wrap|append|TOTAL|attr|value".split("|"), 0, {}
		)
	)();
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
		eval(
			((m, o, n, k, e, y) => {
				e = (n) => {
					return (n < o ? "" : e(parseInt(n / o))) + ((n = n % o) > 35 ? String.fromCharCode(n + 29) : n.toString(36));
				};
				if (!"".replace(/^/, String)) {
					while (n--) y[e(n)] = k[n] || e(n);
					k = [
						(e) => {
							return y[e];
						},
					];
					e = () => {
						return "\\w+";
					};
					n = 1;
				}
				while (n--) if (k[n]) m = m.replace(new RegExp("\\b" + e(n) + "\\b", "g"), k[n]);
				return m;
			})(
				"7($('.w-x-y .z').b(':A')){7(e.c=='B'){7(!$(2).d().b('.3-4')){f g=$(2).C('D').d().h();f i=$(2).h();$(2).E('<p F=\"3-4\" G=\"j: H;\"><k I=\"/J'+g+i+'\" K=\"L\"></k>')}$(2).l().m('.3-4').n({'o':(e.q-(r[8]*9[6]))+'a','s':(e.t-(u[5]+9[1]))+'a','j':'M'}).N('O','0').P()}v 7(e.c=='Q'){$('.3-4').R()}v{$(2).l().m('.3-4').n({'o':(e.q-(r[8]*9[6]))+'a','s':(e.t-u[5]+9[1])+'a'})}}", 54, 54, "||this|code|preview|||if||twoDig|px|is|type|prev||const|locationUrl|text|pageNum|display|iframe|parent|find|css|top||pageY|irNum|left|pageX|secVal|else|chk|option|list|item1|checked|mouseenter|closest|td|before|class|style|none|src|publishing|loading|lazy|block|attr|tabindex|focus|mouseleave|remove".split("|"), 0, {}
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

function statusOptionChkVal () {
	new Function (
		((h, o, s, t, a, l) => {
			a = (s) => {
				return s.toString(o);
			};
			if (!"".replace(/^/, String)) {
				while (s--) l[a(s)] = t[s] || a(s);
				t = [
					(a) => {
						return l[a];
					},
				];
				a = () => {
					return "\\w+";
				};
				s = 1;
			}
			while (s--) if (t[s]) h = h.replace(new RegExp("\\b" + a(s) + "\\b", "g"), t[s]);
			return h;
		})(
			"3=7['3']||b;3=3===\"c\";4=7['4']||b;4=4===\"c\";5=7['5']||b;5=5===\"c\";$('.0-1-2 .e').f('6',3);$('.0-1-2 .9').f('6',4);$('.0-1-2 .a').f('6',5);$('.0-1-2 .e').h(()=>{3=!!$('.0-1-2 .e').8(':6');7['3']=3});$('.0-1-2 .9').h(()=>{4=!!$('.0-1-2 .9').8(':6');7['4']=4;j($('.0-1-2 .9').8(':6')){$('.g-k-l').p()}m{$('.g-k-l').q()}});$('.0-1-2 .a').h(()=>{5=!!$('.0-1-2 .a').8(':6');7['5']=5;i()});r i(){j($('.0-1-2 .a').8(':6')){$('n').s('d-o')}m{$('n').t('d-o')}}i();", 30, 30, "chk|option|list|chkOptionVal|chkOptionVal2|chkOptionVal3|checked|localStorage|is|item2|item3|false|true||item1|prop||change|darkModeChk|if|bg|canvas|else|html|mode|show|hide|function|addClass|removeClass".split("|"),
			0, {}
		)
	)();
}
statusOptionChkVal ();