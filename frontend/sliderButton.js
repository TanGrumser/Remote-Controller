var initialMouse = 0;
var slideMovementTotal = 0;
var mouseSimulating = false;
var powerSlider = $('#power-slider');
var standbySlider = $('#standby-slider');
const LOCK_OPEN = 'power_settings_new';
const LOCK_OUTLINE = 'cancel';
var slider;
var locker = $('#power-locker');
var locker2 = $('#standy-locker');

powerSlider.on('mousedown touchstart', function(event){
	mouseSimulating = true;
	slideMovementTotal = $('#power-button-background').width() - $(this).width() + 10;
	initialMouse = event.clientX || event.originalEvent.touches[0].pageX;
    slider = powerSlider;
});

standbySlider.on('mousedown touchstart', function(event){
    mouseSimulating = true;
	slideMovementTotal = $('#standby-button-background').width() - $(this).width() + 10;
	initialMouse = event.clientX || event.originalEvent.touches[0].pageX;
    slider = standbySlider;
});

$(document.body).on('mouseup touchend', function (event) {
	if (!mouseSimulating)
		return;
	mouseSimulating = false;
	var currentMouse = event.clientX || event.changedTouches[0].pageX;
	var relativeMouse = currentMouse - initialMouse;

	if (relativeMouse < slideMovementTotal) {
		$('.slide-text').fadeTo(300, 1);
		slider.animate({
			left: "-10px"
		}, 300);
		return;
	}

	slider.addClass('unlocked');
    startShutdown();
	locker.text(LOCK_OUTLINE);
	setTimeout(function(){
		slider.on('click tap', function(event){
			if (!slider.hasClass('unlocked'))
				return;
			slider.removeClass('unlocked');
			locker.text(LOCK_OPEN);
            cancelCounter();
			slider.off('click tap');
		});
	}, 0);
});

$(document.body).on('mousemove touchmove', function(event){
    if (!mouseSimulating)
        return;
    
    console.log("touch moved");
        
    //event.stopPropagation();
	var currentMouse = event.clientX || event.originalEvent.touches[0].pageX;
	var relativeMouse = currentMouse - initialMouse;
	var slidePercent = 1 - (relativeMouse / slideMovementTotal);
	
	$('.slide-text').fadeTo(0, slidePercent);

	if (relativeMouse <= 0) {
		slider.css({'left': '-10px'});
		return;
	}
	if (relativeMouse >= slideMovementTotal + 10) {
		slider.css({'left': slideMovementTotal + 'px'});
		return;
	}
	slider.css({'left': relativeMouse - 10});

});