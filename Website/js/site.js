/*
site
*/

$(document).ready(function(){
 	
	$('.gridLayout').masonry({
	  itemSelector: '.post_tile',
	  columnWidth: 300
	});

	$(".post_tile").hover(function(){
    	$(this).children('.text_overlay').toggleClass('active');
    	$(this).find('.postText').toggleClass('active');
 	});

});
