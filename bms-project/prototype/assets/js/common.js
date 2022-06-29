jQuery.event.add(window, 'load', function () {
	const tabTar = $('.js-tab');
	const inpItem = $('.input-item');

	inpItem.on('keyup', function () {
		let inpItemVal = $(this).val();
		if (inpItemVal == 0) {
			$(this).parent().removeClass('active');
		} else {
			$(this).parent().addClass('active');
		}
	});

	$('.btn-reset').on('click', function (e) {
		let returnTar = $(e.target).prev();
		$(this).closest('.input-box').removeClass('active').find(inpItem).val(null);
		returnTar.focus();
	});

	$('.pop-open').on('click', function (e) {
		e.preventDefault();
		popupOpen($(this));
	});

	//checkbox all select 
	$(".check-terms").on("click", ".all input", function () {
		$(this).parents(".check-terms").find('input').prop("checked", $(this).is(":checked"));
	});

	//checkbox part select 
	$(".check-terms").on("click", ".normal input", function() {
		var is_checked = true;

		$(".check-terms .normal input").each(function(){
			is_checked = is_checked && $(this).is(":checked");
		});

		$(".all input").prop("checked", is_checked);
	});

	$('.btn-top-box').on('click', '.btn-top', function (e) {
		e.preventDefault();
		if (!$('.lineup-wrap').length == 0) {
			lineWrapPos = $('.lineup-wrap').offset().top;
		}
		if (!$(this).hasClass('main')) {
			$('html, body').animate({scrollTop:'0'}, '0');
			$(this).blur();
			chkBool = true;
		} else {
			$('html, body').stop().animate({scrollTop:lineWrapPos}, secVal[4], 'easeInOutQuint');
		}
	});

	$(window).scroll(function(){
		if ( $(this).scrollTop() > 0 ){
			$('.btn-top-box').addClass('active');
		}
		else {
			$('.btn-top-box').removeClass('active');
		}
	});
	
	function checkAgent () {
		let UserAgent = navigator.platform;
		let agentBrowser = navigator.userAgent.toLowerCase();
		if (UserAgent.match(/i(Phone|Pod)/i) != null) {
			$('html').addClass('ios');
		} else {
			$('html').addClass('android');
		}
		if ((navigator.appName == 'Netscape' && agentBrowser.indexOf('trident') != -1) || (agentBrowser.indexOf("msie") != -1)) {
			$('html').addClass('ie11');
		}
	}
	checkAgent ();

	// accordion common
	function accordion(){
		$('.accordion').off()
		$('.accordion').on('click', '.tit-btn', function() {
			var accordionItem = $(this).parent('.item');
			accordionItem.toggleClass('active').siblings('.item').removeClass('active');
			$('.accordion .item').find('.cont').slideUp(0);
			if(accordionItem.hasClass('active')) {
				accordionItem.find('.cont').slideDown(300);
			} else {
				accordionItem.find('.cont').slideUp(300);
			}
		})
	};
	accordion();

	jsTab();

	// autocomplete
	function autocomplete(){
		$('.autocomplete-area .input-email').on('focus keyup',function(){
			const inputLeft = $(this).offset().left;
			const inputTop = $(this).offset().top;
			$('.autocomplete').show().offset({ left: inputLeft, top: inputTop + 30 });
		});
		$('.autocomplete > ul li, .autocomplete button').on('click', function(){
			$('.autocomplete').hide();
			$('.autocomplete-area .input-email').val('').attr('placeholder','');
		});
		$('.autocomplete > ul li').on('click', function(){
			const text = $(this).text();
			let liItem = "<li class='result-area'>";
			liItem += "<span>"+text+"</span>";
			liItem += "<button onclick='$(this).parent().remove()'></button>";
			liItem += "</li>";
			$('.autocomplete-area .input-area').before(liItem);
		});
	}
	autocomplete();

});

function jsTab() {
	$('.js-tab .tab-box-list > li').on('click', function (e) {
		const tabRoot = $(this).closest('.js-tab');
		const tabBoxItem = $('.js-tab-cont > div');
		let tabIdx = $(this).index();

		if( $(this).children('a').attr('href') == "#" ){
			e.preventDefault();
		}
		$(this).addClass('active').siblings().removeClass('active');
		tabRoot.find(tabBoxItem).removeClass('active').eq(tabIdx).addClass('active');

		// tabScrCenter($(this));
		// function tabScrCenter (target) {
			const target = $(this);
			const tabScrBox = target.closest('.js-tab.x-scroll').find('.tab-box-list');
			const tabScrBoxItem = tabScrBox.find('li');
			let tabScrBoxHarf = tabScrBox.width() / irNum[1];
			let tabScrPos;
			let tabListWidth = 0;
			let tabTarLeft = 0;
			let tabPdValue = parseInt(tabScrBoxItem.parent().css('padding-left'));
			tabScrBoxItem.each(function () {
				tabListWidth += $(this).outerWidth();
			});
			for (let i = 0; i < target.index(); i++) tabTarLeft += tabScrBoxItem.eq(i).outerWidth();
			let tabTarPos = (tabTarLeft + target.outerWidth() / irNum[1] + tabPdValue);
			if (tabTarPos <= tabScrBoxHarf) {
				tabScrPos = 0;
			} else if (tabListWidth - tabTarPos <= tabScrBoxHarf) {
				tabScrPos = tabListWidth - tabScrBox.width() + (tabPdValue * irNum[1]);
			} else {
				tabScrPos = tabTarPos - tabScrBoxHarf;
			}
			tabScrBox.stop().animate({scrollLeft:tabScrPos}, secVal[2]);
		// }
	});

	// error 페이지 헤더&푸터 제외 높이값 설정
	let headerHeight = $('.bms-header').outerHeight();
	let footerHeight = $('.bms-footer').outerHeight();
	let windowHeight = $(window).outerHeight();
	console.log(windowHeight);
	$('#bmsContainer.error-all').height(windowHeight - (headerHeight + footerHeight));
};

function designSelect(select) {
	//default selectbox
	select.on('click', '.selected-value', function (e) {
		if($(this).parent().hasClass('active')) {
			$(this).parent().removeClass('active');
		} else {
			$('div.select-box').removeClass('active');
			$(this).parent().addClass('active');
		};
		// $(this).parent().removeClass('on');

		//select option text
		select.find('.select-items').on('click', 'li', function () {
			//default selectbox
			var selectItem = $(this).text()
			$(this).addClass('selected').siblings('li').removeClass('selected');
			$(this).parent().siblings('.selected-value').text(selectItem);
			$(this).parents('div.select-box').removeClass('active').addClass('on');
		});
	});
}

function customSelect() {
	designSelect($('div.select-box'));

	//status desabled
	if($('div.select-box.disabled')) {
		$('div.select-box.disabled').off('click');
	};

	let disableChk = true;
	$('.direct-input').find('input[type=checkbox]').on('change', (e) => {
		if(disableChk) {
			$(e.currentTarget).parents('.direct-input').find('.input-item').removeClass('disabled').attr("disabled", false);
			$(e.currentTarget).parents('.direct-input').find('div.select-box').removeClass('disabled');
			designSelect($(e.currentTarget).parents('.direct-input').find('div.select-box'));
			disableChk = false;
		} else {
			$(e.currentTarget).parents('.direct-input').find('.input-item').addClass('disabled').attr("disabled", true);
			$(e.currentTarget).parents('.direct-input').find('div.select-box').removeClass('on').addClass('disabled');
			$(e.currentTarget).parents('.direct-input').find('div.select-box').off('click');
			$(e.currentTarget).parents('.direct-input').find('.input-box').removeClass('val-error');
			disableChk = true;
		}
	});
	
	//outside click
	$('.bms-wrap').on('click', function (e) {
		if(!$('div.select-box').has(e.target).length) {
			$('div.select-box').removeClass('active');
		}
	});

	$('.textarea-box').on('focusin focusout keyup', 'textarea', function (e) {
		if (e.type == 'focusin') {
			$(this).parent().addClass('focus');
		} else if (e.type == "focusout") {
			$(this).parent().removeClass('focus');
		} else {
			if ($(this).val() == 0) {
				$(this).parent().removeClass('active');
			} else {
				$(this).parent().addClass('active');
			}
		}
	});

	//filebox
	var fileTarget = $('.filebox .upload-hidden');		
	fileTarget.on('change', function(){ 
		var filename = $(this)[0].files[0].name; 
		$(this).parent('.filebox').find('.upload-name').val(filename);
		$(this).parent().find('.btn-reset').show();
	});
};

function popupOpen (target) {
	const bodyWid = $('body').width();
	const hgtSize = $(window).height() - 80;
	const popIdx = target.attr('data-pop-idx');
	popCont = $('.layer-popup-cont');
	popWrap = $('.layer-popup-wrap' + '[data-pop-idx=' + popIdx + ']');
	chkSwitch = true;
	popWrap.fadeIn(secVal[3], function () {
		popAutoHgt();
	});
	popCont.fadeIn(secVal[3]);
	if (!popWrap.hasClass('full')) {
		$('body').css({'overflow':'hidden', 'width':bodyWid});
	}
	setObj(function () {
		popWrap.find(popCont).focus().append('<a href="#" class="tar-loop"></a>');
		$('.tar-loop').focusin(function () {
			popCont.focus();
		});
	}, 0);
	setObj(function () {
		popIdxHgt = popWrap.find(popCont).outerHeight(true);
		if (hgtSize < popIdxHgt && popBottomHgt == 0) {
			popCont.parent().css('height', 'auto');
			popWrap.stop().animate({scrollTop:0}, secVal[2]);
		}
	}, secVal[5]);

	$('.layer-popup-wrap').on('click', function (e) {
		const _this = $(this).closest('.layer-popup-wrap');
		// const tarItem = $('.layer-popup-cont > div, .layer-title,'
		//  + '.layer-cont *:not(.btn-close, .btn-del), .bottom-fixed *:not(.btn-close)');
		const tarItem = $('.layer-popup-body, .btn-close');
		if ($(e.target).is(tarItem)) {
			if ($(this).scrollTop() !== 0) {
				if (hgtSize < popIdxHgt) {
					popWrap.stop().animate({scrollTop:0}, secVal[2], function () {
						popClose (_this);
					});
				}
			} else {
				popClose (_this);
			}
		}
	});
}

function popClose (target) {
	target.fadeOut(secVal[3]);
	target.find(popCont).fadeOut(secVal[3]).parent().removeAttr('style');
	target.find('.tar-loop').remove();
	chkSwitch = false;
	setObj(function () {
		if (!target.hasClass('inner-pop')) {
			$('body').css({'overflow':'auto', 'width':'auto'});
		}
		if ($('.swiper-container').length >= irNum[0]) {
			$('.swiper-wrapper').css('transform', 'translate3d(0, 0, 0)');
		}
		popCont.parent().css('height', '100%');
	}, secVal[4]);
}

function popAutoHgt () {
	let popHeaderHgt = parseInt(popWrap.find('.layer-title').outerHeight(true));
	popBottomHgt = parseInt(popWrap.find('.bottom-fixed').outerHeight(true)) || 0;
}

//쿠기활용동의 팝업
function cookiePop() {
	let cookiePopWrap = $('.cookie-pop-wrap');

	if ($('body').find(cookiePopWrap).length == 1) {
		$('body').css('overflow', 'hidden');
	} else {
		$('body').css('overflow', 'auto');
	}		

	cookiePopWrap.find('.btn-close').on('click',function(){
		cookiePopWrap.fadeOut(secVal[4]);
		$('body').css('overflow', 'auto');
	})
}

// 휴대전화번호 체크
function telInputCheck(num){
	num.value = num.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1'); // 숫자만
}