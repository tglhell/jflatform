jQuery.event.add(window, 'load', function () {
    let listWrap = $('.list-wrap'),
        btnListType = listWrap.find('.list-type button');
        
    btnListType.on('click',function(){
        btnListType.removeClass('on');
        $(this).addClass('on');

        if ($(this).hasClass('type1')) {
            listWrap.removeClass('gallery');
            $(this).closest('.list-wrap').addClass('text');
        } else {
            listWrap.removeClass('text');
            $(this).closest('.list-wrap').addClass('gallery');
        }
    })

    $(window).resize(function() {
        let winWid =$( window).width();

        if(winWid < 1119) {
            listWrap.removeClass('text').addClass('gallery');
            btnListType.removeClass('on');
            $('.type2').addClass('on');
        } 
    })
    
})