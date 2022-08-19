$(function(){
	let wSize = $(window).width();
	let listTabWrap = $('.cp-download-center__model-list-wrap');
	let listTabOuter = $('.cp-download-center__model-list-outer');
	let listTabBtn = listTabWrap.find('.cp-download-center__list-btn');
	let listTabParent = $('.cp-download-center__model-list-item');
	let listTabParentLength = listTabParent.length;
	let listTabCont = $('.cp-download-center__list-tab .cp-download-center__list');
	let indicatorBtn = $('.cp-download-center__model-list-indicator span');
	
	listTabBtn.on('click', function(e){
		e.preventDefault();
		listTabCont.css({'height' : 'auto'});
		let _this = $(this);
		let tabItemIdx = _this.closest(listTabParent).index();
		let listTabHgt = listTabCont.eq(tabItemIdx).height();
		let listTabOuterHgt = listTabCont.parent().height() - listTabHgt;
		let listTabOuterHgtSum = listTabCont.parent().height() - listTabOuterHgt + 172; // main.css line 309 : padding 86px, 8.6rem;
		listTabCont.removeAttr('style');
		_this.closest(listTabParent).addClass('is-active').siblings().removeClass('is-active');
		setTimeout(function(){
			if (wSize > 767) {
				listTabCont.parent().css('height', listTabOuterHgtSum);
			} else {
				listTabCont.parent().css('height', listTabOuterHgtSum - 42);
			}
			listTabCont.eq(tabItemIdx).css({'height' : listTabHgt}).addClass('is-active').siblings().removeAttr('style').removeClass('is-active');
			listTabCont.parent().addClass('is-active');
			indicatorBtn.eq(tabItemIdx).addClass('on').siblings().removeClass('on');
		}, 0);
		setTimeout(function(){
			listTabCont.eq(tabItemIdx).removeAttr('style');
		}, 500);
		
		$(window).on('resize', function(){
			scrdlTabWid ();
		});

		function scrdlTabWid () {
			let listTabItemWid = listTabParent.width();
			listTabParent.closest(listTabWrap).animate({scrollLeft : listTabItemWid * tabItemIdx}, 500);
		}
		scrdlTabWid ();
	});

	listTabWrap.on('scroll', function(){
		let _this = $(this);
		let scrPos = _this.scrollLeft();
		listTabWrap.parent().find('.x-scroll').css('left', scrPos / listTabWrapWid * listTabWrapSum);
	});
	
	listTabWrap.parent().prepend('<div class="x-scroll"></div>');
	listTabOuter.addClass('col' + listTabParentLength);

	$(window).on('resize', function(){
		scrAutoHgt ();
	});

	function scrAutoHgt () {
		listTabWrapWid = listTabWrap.outerWidth(true);
		listTabWrapSum = listTabWrapWid * listTabWrapWid / listTabWrap[0].scrollWidth;
		listTabWrap.parent().find('.x-scroll').css('width', listTabWrapSum);
	}
	scrAutoHgt ();

	indicatorBtn.on('click', function(){
		let _this = $(this);
		let numIdx = _this.index();
		_this.addClass('on').siblings().removeAttr('class');
		listTabBtn.eq(numIdx).trigger('click');
	});
});