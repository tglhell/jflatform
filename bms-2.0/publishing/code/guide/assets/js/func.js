(function ($) {
	new Function (
		((l, o, s, t, j, c) => {
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
			"$.H.f=6(v){8 4=$.I({g:'J.s-g',7:'h.7',5:'a i',b:'j.f',k:0,l:K,w:'L'},v),x=3,y=$('h.y');M 3.m(6(){8 2=3,$2=$(2),n=[];c=0;2.d=$(4.g,$2);2.7=$(4.7,$2);2.5=$(4.5,$2);2.5.m(6(){8 b=$(4.b,3);b.m(6(){8 9=$(3).9();z(9==='o'){c++}})});2.5.q('N',6(){$(3).r('A')}).q('O',6(){$(3).P('A')});8 t=((c/2.5.u)*Q);n=[2.d.9(),' <e B=\"R-S\">(',c,'/',2.5.u,') - <e C=\"T:#U;\">V</e><p B=\"s-W\" X-Y=\"'+Z(t)+'%\" C=\"10: '+t+'%\"></p></e>'];2.d.11(n.12(''));2.d.q('D',()=>{2.7.13(4.w)});z(4.l||((4.k-1)===x.k(3))){2.7.14('15','16')}})};$(17).18(()=>{$('h.19').f({l:1a});$('#1b').9($('a i').u);$('a i:E').r('E');$('a j[F][F!=1]').r('1c');$('j:1d-1e .1f').G('D',()=>{$(3).1g('G')})});", 62, 79, "||self|this|settings|files|function|content|let|text|tbody|date|completed|section_title|span|state|title|div|tr|td|index|openAll|each|title_text|||bind|addClass||barChkSum|length|options|speed|all_sections|header|if|hover|class|style|click|even|rowspan|on|fn|extend|h2|false|fast|return|mouseenter|mouseleave|removeClass|100|page|count|color|16a0f0|1depth|bar|data|chk|parseInt|width|html|join|slideToggle|css|display|block|document|ready|section|true|total|multi|last|child|fcR|toggleClass".split("|"), 0, {}
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
				"7($('.w-x-y .z').b(':A')){7(e.c=='B'){7(!$(2).d().b('.3-4')){f g=$(2).C('D').d().h();f i=$(2).h();$(2).E('<p F=\"3-4\" G=\"j: H;\"><k I=\"/J'+g+i+'\"></k>')}$(2).l().m('.3-4').n({'o':(e.q-(r[8]*9[6]))+'a','s':(e.t-(u[5]+9[1]))+'a','j':'K'}).L('M','0').N()}v 7(e.c=='O'){$('.3-4').P()}v{$(2).l().m('.3-4').n({'o':(e.q-(r[8]*9[6]))+'a','s':(e.t-u[5]+9[1])+'a'})}}", 52, 52, "||this|code|preview|||if||twoDig|px|is|type|prev||const|locationUrl|text|pageNum|display|iframe|parent|find|css|top||pageY|irNum|left|pageX|secVal|else|chk|option|list|item1|checked|mouseenter|closest|td|before|class|style|none|src|publishing|block|attr|tabindex|focus|mouseleave|remove".split("|"), 0, {}
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