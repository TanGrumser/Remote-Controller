function initializeMousePad() {
    var mousePad = $('#mouse-pad');
    var mouseSimulating = false;
    var lastMousePosX;
    var lastMousePosY;
    var startMousePosX;
    var startMousePosY;
    var touchStartTime;

    mousePad.on('mousedown touchstart', function(event){
        console.log("Clicked on mouse pad");
        mouseSimulating = true;
        startMousePosX = event.clientX || event.changedTouches[0].pageX;
        startMousePosY = event.clientY || event.changedTouches[0].pageY;
        lastMousePosX = startMousePosX;
        lastMousePosY = startMousePosY;
        touchStartTime = Date.now();
    });
    
    $(document.body).on('mouseup touchend', function (event) {
        if (!mouseSimulating) 
            return;
        
        let posX = event.clientX || event.changedTouches[0].pageX;
        let posY = event.clientY || event.changedTouches[0].pageY;
        
        // This seems to not work properly.
        if ((Date.now() - touchStartTime) < 30 && Math.abs(startMousePosX - posX) < 2 && Math.abs(startMousePosY - posY) < 2) 
            sendClickMouseCommand(true);

        mouseSimulating = false;
    });
    
    $(document.body).on('mousemove touchmove', function(event){
        if (!mouseSimulating)
            return;
        
        let deltaX = (event.clientX || event.changedTouches[0].pageX) - lastMousePosX;
        let deltaY = (event.clientY || event.changedTouches[0].pageY) - lastMousePosY;
        lastMousePosX = event.clientX || event.changedTouches[0].pageX;
        lastMousePosY = event.clientY || event.changedTouches[0].pageY;
    
        event.preventDefault();
        event.stopPropagation();
        sendMoveMouseCommand(deltaX, deltaY);
    });
}