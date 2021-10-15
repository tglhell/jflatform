jQuery.event.add(window, 'load', function () {
    
    let otherCheckBox = $('.check-terms .other input');
    
    otherCheckBox.on('click',function(){
        $('.other-textarea').slideToggle(200);
    })
        
})