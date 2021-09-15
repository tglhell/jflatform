jQuery.event.add(window, 'load', function () {
    const listWrap = $('.list-wrap');
    const btnListType = listWrap.find('.list-type button');
        
    btnListType.on('click', function () {
        btnListType.removeClass('on');
        $(this).addClass('on');

        if ($(this).hasClass('type1')) {
            listWrap.removeClass('gallery');
            $(this).closest('.list-wrap').addClass('text');
        } else {
            listWrap.removeClass('text');
            $(this).closest('.list-wrap').addClass('gallery');
        }
    });

    function autoSize() {
        if ($(window).width() <= tbl) {
            listWrap.removeClass('text').addClass('gallery');
            btnListType.removeClass('on');
            $('.type2').addClass('on');
        } 
    }
    autoSize();

    $(window).resize(function () {
        autoSize();
    });
})