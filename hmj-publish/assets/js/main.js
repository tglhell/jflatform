jQuery.event.add(window, 'load', function () {
    let topHeader = $('.main .hmj-header');

    $(window).on('scroll',function(){
        let scroll = $(this).scrollTop();
        fixHeader(scroll);
    })

    function fixHeader(scroll) {
        (scroll > 0) ? topHeader.addClass('on') :  topHeader.removeClass('on');
    }

        
})