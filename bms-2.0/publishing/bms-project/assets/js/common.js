$(function(){
	const tabTar = $('.js-tab');
	const inpItem = $('.input-item');

	// gnb
	$('.bms-header .menu, .bms-header .inner-content-bg').on('mouseover', function(){
		$('.bms-header .sub-menu').stop().animate({height: '523px', paddingTop: '48px'},300);
		$('.bms-header .inner-content-bg').stop().animate({height: '524px'},300);
		$('.bms-header .inner-content-bg').removeClass('bd-hidden');
		$('.bms-header').addClass('menu-open');
	})

	$('.bms-header .menu .menu-first-li > a').on('mouseover',function(){
		$(this).addClass('hover').parent('li').siblings('li').find('> a').removeClass('hover');
		$('.bms-header .sub-menu').hide();
		$(this).next('.sub-menu').show().parent('li').siblings('li').find('.sub-menu').hide();
	})

	$('.bms-header .menu, .bms-header .inner-content-bg').on('mouseleave',function(){
		$('.bms-header .menu .menu-first-li > a').removeClass('hover');
		$('.bms-header').removeClass('menu-open');
		$('.bms-header .sub-menu').stop().animate({height: '0', paddingTop: 0},300);
		$('.bms-header .inner-content-bg').stop().animate({height: '0'},300);
		$('.bms-header .inner-content-bg').addClass('bd-hidden');
	})

	$('.bms-header .gnb-hamburger').on('click', (e) => {
		e.preventDefault();
		$('.bms-header .right-gnb').addClass('active');
		$('html, body').css('overflow-y', 'hidden');
	})

	$('.bms-header .right-gnb .right-gnb-close').on('click', (e) => {
		e.preventDefault();
		$('.bms-header .right-gnb').removeClass('active');
		$('html, body').css('overflow-y', 'auto');
	})

	$('.bms-header .right-gnb .right-gnb-content .menu-depth03 > li').each(function(){
		if($(this).find('ul').length > 0) {
			$(this).parents('li').addClass('have-ul');
		}
	})
	// $('.bms-header .right-gnb .right-gnb-content .menu-depth03 > li.have-ul > a').on('click', (e) => {
	// 	e.preventDefault();
	// 	$(e.currentTarget).next('ul').toggle().parent('li').siblings('li').find('ul').hide();
	// 	$(e.currentTarget).toggleClass('active').parent('li').siblings('li').find('> a').removeClass('active');
	// })

	inpItem.on('keyup focus', function () {
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

	// main
	$('.main .search-area .search-input .search-inner input').focus();

	$('.main .search-area .search-input .search-inner input').on('keyup', () => {
		if(!!$('.main .search-area .search-input .search-inner input').val()) {
			$('.main .search-area .search-input .search-inner .tit').animate({'color':'#E4DCD3'}, 100);
			$('.main .search-area .search-input .search-inner .result').show();
		} else {
			$('.main .search-area .search-input .search-inner .tit').animate({'color':'#333'}, 100);
			$('.main .search-area .search-input .search-inner .result').hide();
		}
	});

	$('.main .search-area .search-input .search-inner .result .btn-close').on('click', (e) => {
		$(e.currentTarget).parents('.result').hide();
		$('.main .search-area .search-input .search-inner input').focus();
		return false;
	})

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

	// checking list
	$(document).on('click','.checking-list-box .btn-edit', (e) => {
		const $chkBox = $(e.currentTarget).parents('.checking-list-box').find('.chk-box')
		const $editBox = $(e.currentTarget).parents('.checking-list-box').find('.edit-box')
		const $listContentsTxt = $(e.currentTarget).parents('.checking-list-box').find('.list-contents')
		const $length = $chkBox.find('strong');
		let chkHtml = "<label class='chk'>";
		chkHtml += "<input name='chkList' type='checkbox'>";
		chkHtml += '<span>';
		chkHtml += '</span>';
		chkHtml += '</label>';

		const $listContentsTxtAll = $(e.currentTarget).parents('.checking-list-box').find('.list-contents-all')
		let chkHtmlAll = "<label class='chk'>";
		chkHtmlAll += "<input class='chkAll' type='checkbox'>";
		chkHtmlAll += '<span>';
		chkHtmlAll += '</span>';
		chkHtmlAll += '</label>';

		$chkBox.show();
		$editBox.hide();
		$listContentsTxt.prepend(chkHtml).addClass('active');
		$listContentsTxtAll.prepend(chkHtmlAll).addClass('active');
		$length.text('0');

		$('.checking-list-box .btn-cancel, .checking-list-box .common-toggle-btns, .checking-list-box2 .common-toggle-btns ').on('click', () => {
			$editBox.show();
			$chkBox.hide();
			$listContentsTxt.removeClass('active').children('.chk').remove();
			$listContentsTxtAll.removeClass('active').children('.chk').remove();
			$length.text('0');
			$('.checking-list-box .list').removeClass('dimm');
		});
		$('.checking-list-box li').on('click', () => {
			let length = $(".checking-list input:checkbox[name='chkList']:checked").length
			$length.text(length);
		});
		$('.checking-list-box input:checkbox').on('click', function() {
			const _this = $(this)
			const _list = $(this).closest('.list')
			if( _this.is(':checked') ) {
				_list.addClass('dimm');
			}
			else {
				_list.removeClass('dimm');
			}

		});

		$('.checking-list-box .chkAll').on('click', function() {
			const _this = $(this)
			const _chk = $(this).parents('.list-contents-all').siblings('.checking-list').find('input:checkbox')
			if( _this.is(':checked') ) {
				_chk.prop('checked',true)
			}
			else {
				_chk.prop('checked',false)
			}
			_chk.on('click', function() {
				const _this = $(this)
				if(!( _this.is(':checked')) ) {
					_this.closest('.checking-list').siblings('span').find('input:checkbox').prop('checked',false)
				}
			});
		});

		$('.checking-list-box .list-contents input:checkbox').on('click', function() {
			const _this = $(this)
			const lists =  _this.closest('.checking-list').children('.list-contents')
			const listLength =  lists.length
			const chkedLength = lists.find("input:checked").length
			const chkAll = _this.closest('.list').find('.chkAll')
			if ( listLength == chkedLength ) {
				chkAll.prop('checked', true)
			}
			else {
				chkAll.prop('checked', false)
			}
		});
	});

	$(document).on('click','.checking-list-box3 .btn-edit', (e) => {
		const $chkBox = $(e.currentTarget).parents('.checking-list-box3').find('.chk-box')
		const $editBox = $(e.currentTarget).parents('.checking-list-box3').find('.edit-box')
		const $listContentsTxt = $(e.currentTarget).parents('.checking-list-box3').find('.swiper-slide')
		const $length = $chkBox.find('strong');
		let chkHtml = "<label class='chk'>";
		chkHtml += "<input name='chkList' type='checkbox'>";
		chkHtml += '<span>';
		chkHtml += '</span>';
		chkHtml += '</label>';

		$chkBox.show();
		$editBox.hide();
		$listContentsTxt.prepend(chkHtml).addClass('active');
		$length.text('0');

		$('.checking-list-box3 .btn-cancel, .checking-list-box3 .common-toggle-btns').on('click', () => {
			$editBox.show();
			$chkBox.hide();
			$listContentsTxt.removeClass('active').children('.chk').remove();
			$length.text('0');
			$('.checking-list-box3 .swiper-slide').removeClass('dimm');
		});
		$('.checking-list-box3 .swiper-wrapper').on('click', () => {
			let length = $(".checking-list-box3  input:checkbox[name='chkList']:checked").length
			$length.text(length);
		});
		$('.checking-list-box3 input:checkbox').on('click', function() {
			const _this = $(this)
			const _list = $(this).closest('.swiper-slide')
			if( _this.is(':checked') ) {
				_list.addClass('dimm');
			}
			else {
				_list.removeClass('dimm');
			}
		});
		// $('.checking-list-box .chkAll').on('click', function() {
		// 	const _this = $(this)
		// 	const _chk = $(this).parents('.list-contents-all').siblings('.checking-list').find('input:checkbox')
		// 	if( _this.is(':checked') ) {
		// 		_chk.prop('checked',true)
		// 	}
		// 	else {
		// 		_chk.prop('checked',false)
		// 	}
		// });
	});

	// 갤러리&리스트 토글
	$('.checking-list-box .common-toggle-btns p, .checking-list-box2 .common-toggle-btns p').on('click', function(e){
		const $checkingList = $(e.currentTarget).parents('.checking-list-box, .checking-list-box2')
		if( $(this).index() === 0){
			$checkingList.find('.list-type').hide().siblings('.cont-type').show();
			$(this).addClass('active').siblings().removeClass('active');
		}
		else {
			$checkingList.find('.gallery-type').hide().siblings('.cont-type').show();
			$(this).addClass('active').siblings().removeClass('active');
		}
	});

	$('.bookmark').on('click',function() {
		$(this).toggleClass('active');
	});

	// sidebar
	$('.support-newsletter-list .newsletter-list-open').on('click', function(){
		$('.support-newsletter-list .newsletter-sidebar').toggleClass('active');
	})
	$('.support-newsletter-list .newsletter-sidebar-close').on('click', function(e){
		e.preventDefault();
		$('.support-newsletter-list .newsletter-sidebar').removeClass('active');
	})
	$('.support-newsletter-list .sidebar-content-wrap').find('a').on('click', function(e){
		e.preventDefault();
		$(this).addClass('active');
		$(this).siblings('a').removeClass('active');
		$(this).closest('.sidebar-content-wrap').siblings().find('a').removeClass('active');
	});

	if ( $(window).scrollTop() > 0 ){
		$('.bms-header').addClass('fixed');
	}
	else {
		$('.bms-header').removeClass('fixed');
	}

	$(window).scroll(function(){
		if ( $(this).scrollTop() > 0 ){
			$('.bms-header').addClass('fixed');
			$('.btn-top-box').addClass('active');
		}
		else {
			$('.bms-header').removeClass('fixed');
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
		$(document).on('click', '.accordion .tit-btn', function() {
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

	customSelect();

	// tooltip-box
	function tooltip () {
		$('.tooltip-btn.on').on('click', function(e){
			e.preventDefault();
			if( $(this).parent().hasClass('img-box-inner')  == true) {
				const width = $('.cont-outer').offset().left + 488
				const offsetL = $(this).offset().left
				const _this = $(this)

				let imgBoxInner = _this.closest('.img-box').find('.img-box-inner')
				let imgBoxInnerPosL = imgBoxInner.position().left

				if( width < offsetL ) {
					_this.closest('.img-box').find('.tooltip').css({"display":"block","right":imgBoxInnerPosL, "left":"unset"});
				}
				else {
					_this.closest('.img-box').find('.tooltip').css({"display":"block","left":imgBoxInnerPosL,"right":"unset"});
				}
				// _this.hide();
				// _this.siblings('.tooltip-btn.off').show();
				_this.parents('.edit-inner,.edit-template-wrap,.swiper-slide').siblings().find('.tooltip,.tooltip-btn.off').hide();
				_this.parents('.edit-inner,.edit-template-wrap,.swiper-slide').siblings().find('.tooltip-btn.on').show();
				$('.carousel-type4').find('.swiper-button-prev, .swiper-button-next').css({"z-index":"0"});
			}
			else {
				const _this = $(this)
				_this.closest('.volume-type').find('.tooltip').css({"display":"block"});
				_this.siblings('.tooltip-btn.off').css({"display":"inline-block"})
			}
		});
		$('.tooltip .btn-close').on('click', function(e){
			e.preventDefault();
			const _this = $(this)
			_this.closest('.img-box, .volume-type').find('.tooltip').hide();
			_this.siblings('.tooltip-btn.on').show();
			$('.carousel-type4').find('.swiper-button-prev, .swiper-button-next').css({"z-index": "3"});
		});
		$('.swiper-button-next, .swiper-button-prev, .checking-list-box3 .btn-area').on('click mouseleave', () => {
			$('.tooltip, .tooltip-btn.off').hide();
			$('.tooltip-btn.on').show();
		});
		$('.carousel-type4 .img-box img').on('mousedown', () => {
			// alert();
			$('.carousel-type4').find('.swiper-button-prev, .swiper-button-next').css({"z-index":"3"});
				$('.tooltip, .tooltip-btn.off').hide();
				$('.tooltip-btn.on').show();
		});
	}
	tooltip();
	$(window).on('resize', function(){
		const _this = $('.tooltip-btn.off')
		_this.hide();
		_this.closest('.img-box').find('.tooltip').hide();
		_this.siblings('.tooltip-btn.on').show();
		$('.carousel-type4').find('.swiper-button-prev, .swiper-button-next').css({"z-index":"3"});
	});

	// training video
	function trainingVideo(){
		const playVideo = $('.training-video .play video');
		const playVideoTitle = $('.training-video .play p');

		// video & thumbnail img switch
		$('.training-video .play-list .thumb img').on('click', function(){
			const _top = $('.video-outer').position().top + 20;
			const videoName = $(this).attr('src').split('/').reverse()[0].split('.')[0];
			let videoTitle = $(this).parent('.thumb').next('.tit').text();
			const imgName = playVideo.attr('src').split('/').reverse()[0].split('.')[0];
			let imgTitle = playVideoTitle.text();
			const imgExtension = $(this).attr('src').split('/').reverse()[0].split('.')[1];
			playVideo.attr('src', '../../assets/video/' + videoName + '.mp4' );
			playVideoTitle.text(videoTitle);
			$(this).attr('src', '../../assets/images/brand/' + imgName + '.' + imgExtension);
			$(this).parent('.thumb').next('.tit').text(imgTitle);
			$('html, body').animate({scrollTop: _top}, 400)
		});

		// video title show & hide
		const isPaused = playVideo.get(0)?.paused || false;
		playVideo.on('play', (e) => {
			playVideoTitle.css('opacity', 0)
		});
		playVideo.on('pause', (e) => {
			playVideoTitle.css('opacity', 1);
		});
	}
	trainingVideo();

	// editor popup input file upload
	$('.img-input .img-input-inner .input-button input').on('change',function(){
		const fileName = $(this).val().split('\\').reverse()[0];
		const uploadInput = $(this).parent('.input-button').prev();
		uploadInput.val(fileName);
		uploadInput.addClass('disabled');
	  });
});

function jsTab() {
	$('.js-tab').each(function(){
		const $this = $(this);

		$this.find('.tab-box-list > li').on('click', function(e){
			const tabRoot = $(this).closest('.js-tab');
			const tabBoxItem = $(this).closest('.js-tab').find('> .tab-box-cont > div');
			let tabIdx = $(this).index();

			if( $(this).children('a').attr('href') == "#" ){
				e.preventDefault();
			}
			$(this).addClass('active').siblings().removeClass('active');
			tabBoxItem.removeClass('active').eq(tabIdx).addClass('active');

			// tabScrCenter($(this));
			// function tabScrCenter (target) {
			// const target = $(this);
			// const tabScrBox = target.closest('.js-tab.x-scroll').find('.tab-box-list');
			// const tabScrBoxItem = tabScrBox.find('li');
			// let tabScrBoxHarf = tabScrBox.width() / irNum[1];
			// let tabScrPos;
			// let tabListWidth = 0;
			// let tabTarLeft = 0;
			// let tabPdValue = parseInt(tabScrBoxItem.parent().css('padding-left'));
			// tabScrBoxItem.each(function () {
			// 	tabListWidth += $(this).outerWidth();
			// });
			// for (let i = 0; i < target.index(); i++) tabTarLeft += tabScrBoxItem.eq(i).outerWidth();
			// let tabTarPos = (tabTarLeft + target.outerWidth() / irNum[1] + tabPdValue);
			// if (tabTarPos <= tabScrBoxHarf) {
			// 	tabScrPos = 0;
			// } else if (tabListWidth - tabTarPos <= tabScrBoxHarf) {
			// 	tabScrPos = tabListWidth - tabScrBox.width() + (tabPdValue * irNum[1]);
			// } else {
			// 	tabScrPos = tabTarPos - tabScrBoxHarf;
			// }
			// tabScrBox.stop().animate({scrollLeft:tabScrPos}, secVal[2]);
			// }
		})
	})

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
		const tarItem = $('.layer-popup-wrap:not(.alert-popup) .layer-popup-body, .btn-close');
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

	// Editor slide popup
	if($('#editorSlideBox').length > 0) {
		let editorSlideBox = document.getElementById("editorSlideBox");
		new Sortable(editorSlideBox, {
			animation: 150,
			filter: '.inputFileBox',
			onMove: function (evt) {
				return evt.related.className.indexOf('inputFileBox') === -1;
			}
		});
		$(".editor-slide-pop input[type='file']").on('change', function(e){
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(){
				let photoFrame = "<div class='grid-square'>";
				photoFrame += `<img src='${reader.result}'/>`;
				photoFrame += "</div>";
				$('.editor-slide-pop .inputFileBox').before(photoFrame);
				e.target.value = "";
			}
		});
	}

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

//login
function motionLogin () {
	$('.login .login_cover_bg').delay(500).animate({'opacity':0}, 1000);
	setTimeout(function(){
		$('.login .login_cover_txt > p').animate({'opacity':1},
				700, () => {
					$('.login .login_cover_txt > p:first-child').delay(1000).fadeOut(700);
					$('.login .login-area').delay(1800).animate({'opacity':1}, 700);
				});
	}, 1200);

	$('.login .login-area .input-area input').on('keyup', (e) => {
		if (!!$('input[name=user]').val() && $('input[name=password]').val()) {
			$('.login .login-area .input-area .btn-login').addClass('active');
		} else {
			$('.login .login-area .input-area .btn-login').removeClass('active');
		}
	});
	$('.login .login-area .input-area .btn-reset').on('click', (e) => {
		$('.login .login-area .input-area .btn-login').removeClass('active');
	});
}
// motionLogin();

function staticLogin () {
	$('.login .login_cover_bg').css({"opacity":"0"});
	$('.login-area').css({"opacity":"1"});

	$('.login .login-area .input-area input').on('keyup', (e) => {
		if (!!$('input[name=user]').val() && $('input[name=password]').val()) {
			$('.login .login-area .input-area .btn-login').addClass('active');
		} else {
			$('.login .login-area .input-area .btn-login').removeClass('active');
		}
	});
	$('.login .login-area .input-area .btn-reset').on('click', (e) => {
		$('.login .login-area .input-area .btn-login').removeClass('active');
	});
}
// staticLogin();

// autocomplete
function autocomplete(){
	$('.autocomplete-area .input-email').on({
		keyup: function(){
			let $this = $(this)
			const $val = $(this).val();
			if( $val.length >= 3 ){
				autocompletePopOpen($this);
			}
		},
		change: function(){
			let $this = $(this)
			const $val = $(this).val();
			if( $val.length >= 3 ){
				autocompletePopOpen($this);
				$('html').on('click', function(e){
					if( !($(e.target).parents().hasClass('autocomplete')) ){
						if( $('.autocomplete').hasClass('active') ) {
							const inputText = $('.autocomplete-area .input-area input').val();
							let liItem = "<li class='result-area'>";
							liItem += "<span>"+inputText+"</span>";
							liItem += "<button></button>";
							liItem += "</li>";
							$('.autocomplete-area .input-area').before(liItem);
							// $('.autocomplete-area .input-area input').focus();
						}
						autocompletePopClose();
					}
				});
			}
		}
	});
	$('.autocomplete > ul li').on('click', function(){
		const text = $(this).text();
		let liItem = "<li class='result-area'>";
		liItem += "<span>"+text+"</span>";
		liItem += "<button></button>";
		liItem += "</li>";
		$('.autocomplete-area .input-area').before(liItem);
		// $('.autocomplete-area .input-area input').focus();
		autocompletePopClose();
	});
	$('.autocomplete button').on('click', function(){
		autocompletePopClose();
	});
	$(document).on('click', '.autocomplete-area .result-area > button', function(){
		$(this).parent().remove();
	});
}
autocomplete();

function autocompletePopOpen(target) {
	console.log(target)
	const inputLeft = target.offset().left;
	const inputTop = target.offset().top;
	$('.autocomplete').addClass('active').offset({ left: inputLeft, top: inputTop + 30 });
}

function autocompletePopClose() {
	$('.autocomplete').removeClass('active');
	$('.autocomplete-area .input-email').val('').attr('placeholder','');
	// $('.autocomplete-area .input-area input').focus();
}
