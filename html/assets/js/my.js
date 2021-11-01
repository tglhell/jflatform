jQuery.event.add(window, 'load', function () {
    
    let checkBox = $('.check-terms input');
    
    checkBox.on('click',function(){
        let otherCheckBox =  $(this).closest('li').hasClass('other');
        
        if(otherCheckBox) {
            $('.other-textarea').slideDown(200);
        } else {
            $('.other-textarea').slideUp(200);
        }
    })
        
})