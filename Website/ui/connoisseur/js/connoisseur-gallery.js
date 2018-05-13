var pageLoaded = false;

// Ready to go

$(document).ready(function(){
	
	// IE fixes
	
	var oldIE = false;
	if(window.IE!==undefined){ $("html").addClass("ie"+window.IE); if(window.IE<9) oldIE=true; }
	
	var isIE8 = $("html").is(".ie8");
	var isIE9 = $("html").is(".ie9");
	
	fixIE8 = function(){
		$("p:last-child").addClass("last-child");
	}
	
	if(isIE8)
	{
		fixIE8();
	}
	
	// Transit animation fallback for older browsers
	
	var normalDuration = 500;
	var longerDuration = 600;
	var shortDuration = 300;
	
	var easeInOut = "ease-in-out";
	if(!Modernizr.csstransitions)
	{
		$.fn.transition = $.fn.animate;
		easeInOut = "easeInOutQuint";
		
		normalDuration = 0;
		longerDuration = 0;
		shortDuration = 0;
	}
	
	
	// International/local
	
	if($("body").is(".local"))
	{
		var siteType = "local";
		var minus = "-1";
	}
	else
	{
		var siteType = "international";
		var minus = "1";
	}
	
	// Detect SVG as img
		
	var supportsSVG = Modernizr.svgasimg;
	
		
	// Prevent AJAX caching
	
	$.ajaxSetup ({
	    cache: false
	});
	
	
	// Hammer defaults
	
	if(Modernizr.csstransitions && !Modernizr.mousehover)
	{
		Hammer.defaults.domEvents = true;
		Hammer.defaults.direction = Hammer.DIRECTION_HORIZONTAL;
	}
	
	
	// Prevent Dropzone init
	
	if(typeof Dropzone === 'function')
	{
		Dropzone.autoDiscover = false;
	}
	
	// Get base URL for use in scripts
	
	//var baseURL = window.sitePath;
	var baseURL = location.protocol + "//" + location.hostname + (location.port && ":" + location.port);
	
	// CMS
	
	var ToGo = window.ToGo;
	
	// Banner
	
	var $topBanner = $("#top-banner");
	var hasBanner = $topBanner.length;
	
	
	// Add body class
	
	$("body").attr("class", $("#scroller, #overlay").data("body-class"));
	
	
	// Banner
	
	removeBanner = function(){

		hasBanner = false;
				
		$("#top-banner").remove();
		$("body").removeClass("has-banner");
		$("#international-content, #local-content, #intro-white-full, #international-nav, #local-nav, #country-scroller, #close-arrow").removeAttr("style");

		if(scrollInterval)
			clearInterval(scrollInterval);
	}
	
	if(hasBanner)
	{
		if($("#scroller").is(".home") || $("#scroller").is(".category"))
			removeBanner();
		else
			$("body").addClass("has-banner");
	}
	
	// Fix wrong height on iOS7 iPad Landscape
    
    var isIpad = false;
    
    if(navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone)
	{
	  	isIpad = true;
	    $("html").addClass("ipad ios7");
	}
	
	var iOS = false;
	if(navigator.userAgent.match(/iPhone|iPod|iPad/))
	{
		$("html").addClass("ios");
		iOS = true;
	}
	
	if(navigator.appVersion.indexOf("Win")!=-1)
	{
		$("html").addClass("win");
	}
		
	if(navigator.userAgent.indexOf("Trident")!=-1 || navigator.userAgent.indexOf("Edge")!=-1)
	{
		$("html").addClass("ie");
	}
	
	// Add Modernizr mix-blend-mode test
	Modernizr.addTest('mixblendmode', function(){
		if(oldIE)
			return false;
	    else
	    	return Modernizr.testProp('mixBlendMode') || window.getComputedStyle(document.body).mixBlendMode;
	});

	
	// Wrap videos
	
	$.fn.initVideos = function() {		
		return this.each(function() {
			
			var $container = $(this);
		
			$container.find("iframe").each(function(){
				var $iframe = $(this);
				
				if($iframe.attr("src").indexOf("youtube") > -1)
				{
					if($iframe.attr("src").indexOf("?") > -1)
						$iframe.attr("src", $iframe.attr("src") + "&rel=0&amp;showinfo=0&amp;controls=0&amp;iv_load_policy=3&amp;modestbranding=1&amp;enablejsapi=1");
					else
						$iframe.attr("src", $iframe.attr("src") + "?rel=0&amp;showinfo=0&amp;controls=0&amp;iv_load_policy=3&amp;modestbranding=1&amp;enablejsapi=1");
															
					if(!$iframe.parent().is(".video-holder"))
						$iframe.wrap('<div class="video-holder"></div>');
					
					var $holder = $iframe.parent();
					var $slider = $holder.parents(".slider");
					
					var player = new YT.Player($iframe.get(0), { events: { 'onStateChange': function(){					
						if(player.getPlayerState() != -1)
						{
							$iframe.addClass("started");
							
							if(!Modernizr.mousehover)
							{
								if($iframe.parents(".slide").length && $iframe.attr("src").indexOf("youtube") > -1)
								{				
									$holder.addClass("js-controlled");
									
									controlVideo = function(){					
										if(!$iframe.is(".playing"))
										{
											callPlayer($(this).find("iframe")[0], 'playVideo');
											$iframe.addClass("playing");
										}
										else
										{
											callPlayer($(this).find("iframe")[0], 'pauseVideo');
											$iframe.removeClass("playing");
										}
									}
									
									$holder.on("click", controlVideo);
								}
							}
						}
							
						if(player.getPlayerState() == 0)
						{
							$holder.removeClass("playing");
							
							if($slider.length)
								$slider.nextSlide();
						}
					} } });
					
					var $parent = $holder.parent();
					
					if($parent.is(".slide-holder"))
					{
						$parent.removeClass("loading");
						var $slider = $parent.parents(".slider");
						
						/*$iframe[0].onload = function() {
					    	var iframeBody = $iframe[0].contentWindow.document.body;
												
							$(iframeBody).hammer({ dragMinDistance: 30 }).on("swipe dragstart", function(e) {
							    e.stopPropagation();
							    e.preventDefault();
															
							    if(e.gesture.direction == "left")
							    	$slider.nextSlide();
							    else if(e.gesture.direction == "right")
							    	$slider.prevSlide();
							});
						}*/
					}
		
					$holder.addClass("initialised");
				}
			});
		});
	}
	
	window.onYouTubeIframeAPIReady = function(){
		$("#scroller, #single-scroller").initVideos();
	}
		
	// Slider

	var slideDuration = 1000;
	if(!Modernizr.csstransitions) slideDuration = 0;
	if(!Modernizr.mousehover) slideDuration = 650;
	
 	$.fn.initSlider = function() { 			
		return this.each(function() {
			var $slider = $(this);
			
			var hasCaptions = false;
			var isAnimating = false;
			
			var $allSlides = $slider.find(".slide");
			var $currentSlide = $allSlides.eq(0);
			
			if($allSlides.length == 2)
			{
				$allSlides.eq(0).clone().attr("data-index", 3).insertBefore("#next-button");
				$allSlides.eq(1).clone().attr("data-index", 4).insertBefore("#next-button");

				$allSlides = $slider.find(".slide");				
				$currentSlide = $allSlides.eq(0);
			}
			
			$slider.addClass("initialised");
			
			var $captions = $slider.find(".caption");
			var $caption = false;
			
			if($captions.length)
			{
				hasCaptions = true;
				$slider.append('<div class="fixed-caption"></div>');
				$caption = $slider.find(".fixed-caption");
				$caption.append($captions.eq(0).html());
				$caption.loadImage();
			}
			else
			{
				$slider.addClass("no-captions");
			}
					
			var $nextSlide = $currentSlide.next();
			if(!$nextSlide.length) $nextSlide = $allSlides.first();
			$nextSlide.addClass("next-slide");
					
			var $prevSlide = $currentSlide.prev();
			if(!$prevSlide.length) $prevSlide = $allSlides.last();
			$prevSlide.addClass("prev-slide");
			
			$currentSlide.loadImage().addClass("current slide-loaded");
			$slider.attr("data-index", "1").attr("data-total", $allSlides.length);	
			
			setTimeout(function(){
				$nextSlide.loadImage().addClass("slide-loaded");
				$prevSlide.loadImage().addClass("slide-loaded");
			}, 1000);
			
			var $dots = $("<ul class='dots'></ul>")
			
			var $counter = 0;
			
			$allSlides.each(function(){
				$counter++;
				if($counter == 1)
					var $current = " class='active'";
				else
					var $current = "";
				
				$dots.append("<li><a data-slide='" + $counter + "'" + $current + "><span></span></a></li>")
			})
			
			$dots.appendTo($slider);
			
			if($allSlides.length <= 1)
				$slider.find(".dots").addClass("transparent");
			
			$(this).data('sliderVars', {
		        allSlides: $allSlides,
		        currentSlide: $currentSlide,
		        nextSlide: $nextSlide,
		        prevSlide: $prevSlide,
		        caption: $caption,
		        hasCaptions: hasCaptions,
		        isAnimating: isAnimating,
		        dots: $slider.find(".dots")        
		    });
		    
		    if(Modernizr.csstransitions && !Modernizr.mousehover)
			{
				$slider.hammer().on("swipe", function(e) {
				    e.stopImmediatePropagation();
				    e.stopPropagation();
					e.preventDefault();
										
					if(e.gesture)
					{				
						if(e.gesture.direction == 2)
					    	$(this).nextSlide();
					    else if(e.gesture.direction == 4)
					    	$(this).prevSlide();
					}
				});
			}
		});
	};
		
 	$.fn.loadSlider = function() { 			
		return this.each(function() {
			
			var $slider = $(this);
			var $slides = $slider.find(".slider-holder");
			var contextID = $slider.parents(".scroller").attr("id");
			
			$slides.each(function(){
		   		var $thumb = $(this);
		   		
		   		$thumb.waypoint(function(){
			   		$thumb.loadImage();
			   		$thumb.waypoint("destroy");
			   	}, { context: "#" + contextID, offset: "125%", triggerOnce: true });
			});
		});
	};

 	$.fn.nextSlide = function() {		
		return this.each(function() {
						
			var $slider = $(this);
			var $allSlides = $slider.data("sliderVars").allSlides;
			var $nextSlide = $slider.data("sliderVars").nextSlide;
			var $prevSlide = $slider.data("sliderVars").prevSlide;
			var $currentSlide = $slider.data("sliderVars").currentSlide;
			var $caption = $slider.data("sliderVars").caption;
			var isAnimating = $slider.data("sliderVars").isAnimating;
			var $dots = $slider.data("sliderVars").dots;
			
			if(!isAnimating && $allSlides.length > 1)
			{
				$slider.data("sliderVars").isAnimating = true;
			
				var hOffset = slideWidth;
				
				if($slider.data("sliderVars").hasCaptions && windowWidth >= 768)
				{
					$caption.transition({ opacity: 0 }, slideDuration/2, "easeInOutQuint", function(){
						$caption.empty().append($nextSlide.find(".caption").html());
						$caption.transition({ opacity: 1 }, slideDuration/2, "easeInOutQuint");
					});
				}
				
				var nextHeight = $nextSlide.find(".slide-holder").outerHeight();
				var currentHeight = $currentSlide.find(".slide-holder").outerHeight();
				
				if(windowWidth < 768)
				{
					var resizeTimeout = 0;
					
					if(nextHeight < currentHeight)
						resizeTimeout = slideDuration*2/3;
					
					setTimeout(function(){
						var $slideCaption = $nextSlide.find(".caption");
						
						var captionHeight = 0;
						if($slideCaption.length)
							captionHeight = $slideCaption[0].scrollHeight + 36;
						else
							captionHeight = 60;
						
						if($slider.data("sliderVars").hasCaptions)	
							$caption.empty().append($slideCaption.html()).attr("style", "top: " + Math.round(nextHeight + 20) + "px");
						
						$slider.attr("style", "height: " + Math.round(nextHeight + captionHeight) + "px");
						$dots.attr("style", "top: " + Math.round(nextHeight) + "px");
					}, resizeTimeout);
				}
								
				var $oldCurrentSlide = $currentSlide;
				var $oldPrevSlide = $prevSlide;
				
				var $futureNextSlide = $nextSlide.next(".slide");
				if(!$futureNextSlide.length)
					$futureNextSlide = $allSlides.first();
							
				$nextSlide.transition({ x: (hOffset - $nextSlide.width()) / 2  }, slideDuration, "easeInOutQuint", function(){
					
					$prevSlide = $currentSlide;
					$prevSlide.removeClass("current").addClass("prev-slide");
					
					$oldPrevSlide.removeClass("prev-slide");
					
					$currentSlide = $nextSlide;
					$currentSlide.removeClass("next-slide").addClass("current");
					
					$nextSlide = $futureNextSlide;
					
					if(!$nextSlide.is(".slide-loaded"))
						$nextSlide.loadImage().addClass("slide-loaded");
					
					$nextSlide.addClass("next-slide");
					
					$slider.data("sliderVars").isAnimating = false;
					
					var $newIframe = $currentSlide.find("iframe");
					if($newIframe.length && $newIframe.attr("src").indexOf("youtube") > -1 && $newIframe.is(".started") && windowWidth >= 768)
					{
						callPlayer($newIframe[0], 'playVideo');
					}
					
					$slider.data("sliderVars").nextSlide = $nextSlide;
					$slider.data("sliderVars").prevSlide = $prevSlide;
					$slider.data("sliderVars").currentSlide = $currentSlide;
				});
				
				$oldCurrentSlide.transition({ x: slidePreview - $oldCurrentSlide.width() }, slideDuration, "easeInOutQuint");
				$oldPrevSlide.transition({ x: slidePreview - $oldCurrentSlide.width() - $oldPrevSlide.width() }, slideDuration, "easeInOutQuint");
				$futureNextSlide.transition({ x: hOffset*3/2 }, 0).transition({ x: hOffset - slidePreview - scrollBarWidth }, slideDuration, "easeInOutQuint");
				
				if($("#overlay").length)
					var $scrollDiv = $("#overlay").find(".scroller");
				else
					var $scrollDiv = $("#scroller");
				
				if(!Modernizr.mousehover)
					$scrollDiv = $scrollDiv.find(".scroll-container");
								
				if(($("#section-heading").outerHeight() + $slider.height() > windowHeight - menuOffset) && (windowWidth >= 768))
				{
					var positionTop = $slider.position().top;
									
					if(iOS)
						positionTop += $scrollDiv.scrollTop();
					
					$scrollDiv.animate({ scrollTop: positionTop - 60 }, slideDuration, "easeInOutQuint");
				}
			
				$("#next-button, #prev-button").attr("style", "width: " + ((hOffset - $nextSlide.width())/2) + "px;");
			
				var $iframe = $currentSlide.find("iframe");
				if($iframe.length && $iframe.attr("src").indexOf("youtube") > -1 && $iframe.is(".started") && windowWidth >= 768)
				{
					callPlayer($iframe[0], 'pauseVideo');
				}
				
				$dots.find(".active").removeClass("active");
				$dots.find("li").eq($nextSlide.data("index")-1).find("a").addClass("active"); 
			}
		});
	}

 	$.fn.prevSlide = function() {		
		return this.each(function() {
						
			var $slider = $(this);
			var $allSlides = $slider.data("sliderVars").allSlides;
			var $nextSlide = $slider.data("sliderVars").nextSlide;
			var $prevSlide = $slider.data("sliderVars").prevSlide;
			var $currentSlide = $slider.data("sliderVars").currentSlide;
			var $caption = $slider.data("sliderVars").caption;
			var isAnimating = $slider.data("sliderVars").isAnimating;
			var $dots = $slider.data("sliderVars").dots;
	
			if(!isAnimating && $allSlides.length > 1)
			{
				$slider.data("sliderVars").isAnimating = true;
			
				var hOffset = slideWidth;
				
				if($slider.data("sliderVars").hasCaptions && windowWidth >= 768)
				{
					$caption.transition({ opacity: 0 }, slideDuration/2, "easeInOutQuint", function(){
						$caption.empty().append($prevSlide.find(".caption").html());
						$caption.transition({ opacity: 1 }, slideDuration/2, "easeInOutQuint");
					});
				}
				
				var prevHeight = $prevSlide.find(".slide-holder").outerHeight();
				var currentHeight = $currentSlide.find(".slide-holder").outerHeight();
				
				if(windowWidth < 768)
				{
					var resizeTimeout = 0;
					
					if(prevHeight < currentHeight)
						resizeTimeout = slideDuration*2/3;
					
					setTimeout(function(){
						var $slideCaption = $prevSlide.find(".caption");
						
						var captionHeight = 0;
						if($slideCaption.length)
							captionHeight = $slideCaption[0].scrollHeight + 36;
						else
							captionHeight = 60;
						
						if($slider.data("sliderVars").hasCaptions)	
							$caption.empty().append($slideCaption.html()).attr("style", "top: " + Math.round(prevHeight + 20) + "px");
												
						$slider.attr("style", "height: " + Math.round(prevHeight + captionHeight) + "px");
						$dots.attr("style", "top: " + Math.round(prevHeight) + "px");
					}, resizeTimeout);
				}
				
				var $oldCurrentSlide = $currentSlide;
				var $oldNextSlide = $nextSlide;
				
				var $futurePrevSlide = $prevSlide.prev(".slide");
				if(!$futurePrevSlide.length)
					$futurePrevSlide = $allSlides.last();
				
				$prevSlide.transition({ x: (hOffset - $prevSlide.width()) / 2  }, slideDuration, "easeInOutQuint", function(){
					
					$nextSlide = $currentSlide;
					$nextSlide.removeClass("current").addClass("next-slide");
					
					$oldNextSlide.removeClass("next-slide");
					
					$currentSlide = $prevSlide;
					$currentSlide.removeClass("prev-slide").addClass("current");
					
					$prevSlide = $currentSlide.prev(".slide");
					if(!$prevSlide.length)
						$prevSlide = $allSlides.last();
					
					if(!$prevSlide.is(".slide-loaded"))
						$prevSlide.loadImage().addClass("slide-loaded");
					
					$prevSlide.addClass("prev-slide");
					
					$slider.data("sliderVars").isAnimating = false;
					
					var $newIframe = $currentSlide.find("iframe");
					if($newIframe.length && $newIframe.attr("src").indexOf("youtube") > -1 && $newIframe.is(".started") && windowWidth >= 768)
					{
						callPlayer($newIframe[0], 'playVideo');
					}
					
					$slider.data("sliderVars").nextSlide = $nextSlide;
					$slider.data("sliderVars").prevSlide = $prevSlide;
					$slider.data("sliderVars").currentSlide = $currentSlide;
				});
				
				$oldCurrentSlide.transition({ x: hOffset - slidePreview - scrollBarWidth }, slideDuration, "easeInOutQuint");
				$oldNextSlide.transition({ x: hOffset*3/2 }, slideDuration, "easeInOutQuint");
				$futurePrevSlide.transition({ x: slidePreview - $futurePrevSlide.width() - $oldCurrentSlide.width() }, 0).transition({ x: slidePreview - $futurePrevSlide.width()  }, slideDuration, "easeInOutQuint");
				
				if($("#overlay").length)
					var $scrollDiv = $("#overlay").find(".scroller");
				else
					var $scrollDiv = $("#scroller");
			
				if(!Modernizr.mousehover)
					$scrollDiv = $scrollDiv.find(".scroll-container");
				
				if(($("#section-heading").outerHeight() + $slider.height() > windowHeight - menuOffset) && (windowWidth >= 768))
				{
					var positionTop = $slider.position().top;
					
					if(iOS)
						positionTop += $scrollDiv.scrollTop();
					
					$scrollDiv.animate({ scrollTop: positionTop - 60 }, slideDuration, "easeInOutQuint");
				}
							
				$("#next-button, #prev-button").attr("style", "width: " + ((hOffset - $prevSlide.width())/2) + "px;");
				
				var $iframe = $currentSlide.find("iframe");
				if($iframe.length && $iframe.attr("src").indexOf("youtube") > -1 && $iframe.is(".started") && windowWidth >= 768)
				{
					callPlayer($iframe[0], 'pauseVideo');
				}
				
				$dots.find(".active").removeClass("active");
				$dots.find("li").eq($prevSlide.data("index")-1).find("a").addClass("active"); 
			}
		});
	}
	
	
	// Replace inline SVGs if browser doesn't support them
	
	replaceInlineSVG = function(){
				
		if($("#logo").length)
		{			
			$("#logo").find("img").each(function(){
				$(this).attr("src", $(this).attr("src").replace(".svg", ".png"));
			});
	    }
	}
	
	if(!supportsSVG)
	{
		replaceInlineSVG();
	}
	
	
	// Resize handler
	
	var windowWidth;
	var slideWidth;
	var sliderWidth;
	var sliderHeight;
	var windowHeight;
	var initialWidth;
	var $isotopeGrids = null;
	var widthIndex = 0;
	var scrollContainer = !Modernizr.mousehover;
	var menuOffset = 60;
	var slidePreview = 60;
	var countryOffset = 2*menuOffset;
	var scrollBarWidth = 0;
	
	handleResize = function(e){
	
		var resizeEvent = typeof e !== 'undefined' ? e : false;
			
		if(resizeEvent && pageLoaded)
			$("html").addClass("resizing");
		
		var oldWindowWidth = windowWidth;
		var reportedWidth = $(window).width();
		
		if(Modernizr.mousehover)
		{
			var $container = $("<div>").css({ height: 1, overflow: "scroll" }).appendTo("body");
			var $child = $("<div>").css({ height: 2 }).appendTo($container);
			
			scrollBarWidth = $container.width() - $child.width();
			
			if($child.width() != $container.width())
			{
				//windowWidth = $child.width();
				$("#inline-clone").width($("#scroller").width() - scrollBarWidth);
				$("#close-single").attr("style", "right: " + scrollBarWidth + "px");
			}
			/*else
			{
				windowWidth = reportedWidth;
			}*/
			
			windowWidth = reportedWidth;
			
			$container.remove();
		}
		else
		{
			windowWidth = reportedWidth;
		}
		
		if(windowWidth > 1024)
			menuOffset = 60;
		else if(windowWidth == 1024)
			menuOffset = 40;
		else
			menuOffset = 0;
		
		if(windowWidth > 1024)
			slidePreview = 60;
		else if(windowWidth == 1024)
			slidePreview = 40;
		else if(windowWidth >= 768)
			slidePreview = 20;
		else
			slidePreview = 0;
		
		countryOffset = 2*menuOffset
		
		slideWidth = reportedWidth - menuOffset;
		
		widthIndex++;
		if(widthIndex == 1)
			initialWidth = windowWidth;
				
		if(isIpad && windowWidth == 1024)
			windowHeight = 672;
		else
			windowHeight = $(window).height();
		
		// VW / VH fixes
		if(iOS || !Modernizr.cssvwunit || !Modernizr.cssvhunit)
		{
			$(".side-bar").outerWidth(windowHeight);
		}
		// Prevent rounding errors CSS
		
		var $grids = $(".grid-container");
		
		if($grids.length)
		{
			$grids.each(function(){
			
				var $grid = $(this);
				
				if(windowWidth >= 768)
				{
					var columnCount = Math.round(windowWidth / $grid.find(".thumb").eq(0).outerWidth());		
					$grid.outerWidth(windowWidth + (columnCount - windowWidth%columnCount));
				}
				else
					$grid.removeAttr("style");
			});
		}
		
		// Resize slider
		
		$(".slider").each(function(){			
			var $slider = $(this);
			
			if($slider.is(".initialised"))
			{
				var $parent = $slider.parents("#overlay, #scroller");
				
				sliderWidth = $slider.width();
				
				if($parent.is(".single-finalist") || $slider.is(".no-captions"))
					var slideBottom = 60;
				else if($parent.is(".home"))
					var slideBottom = 160;
				else if($parent.is(".partners"))
					var slideBottom = 150;
				else
					var slideBottom = 126;
								
				if(windowWidth > 1024)
					var slideOffset = 360;
				else if(windowWidth == 1024)
					var slideOffset = 200;
				else if(windowWidth >= 768)
					var slideOffset = 120;
				else	
					var slideOffset = 0;
							
				// Resize slideshow images
				
				if(windowWidth >= 768)
				{	
					var $dots = $slider.data("sliderVars").dots;
					var $caption = $slider.data("sliderVars").caption;
					
					if(oldWindowWidth < 768)
					{
						$slider.removeAttr("style");
						$caption.removeAttr("style");
						$dots.removeAttr("style");
					}
					
					if(navigator.userAgent.match(/iphone|ipod|ipad/) || !Modernizr.cssvwunit || !Modernizr.cssvhunit)
					{
						if(windowWidth <= 1024)
							$slider.outerHeight(windowHeight - 100);
						else
							$slider.outerHeight(windowHeight - 120);
					}

					sliderHeight = $slider.height();
					
					var potentialImgWidth = Math.floor(sliderHeight*3/4);
					
					$slider.data("sliderVars").allSlides.each(function(){
						var $slideObj = $(this);
						var $slideImg = $slideObj.find("img, video, iframe");
						var imgWidth = Math.floor((sliderHeight - slideBottom)*$slideImg.attr("width")/$slideImg.attr("height"));
						var singleWidth =  Math.min(imgWidth, sliderWidth - slideOffset);
						
						if(oldWindowWidth < 768)
							$slideImg.removeAttr("style");
						
						if(imgWidth > sliderWidth - slideOffset)
						{
							$slideObj.addClass("fit-horizontal");
							$slideObj.find(".slide-holder").attr("style", "height: " + Math.round(singleWidth*$slideImg.attr("height")/$slideImg.attr("width")) + "px");
						}
						else
						{
							$slideObj.removeClass("fit-horizontal");
							$slideObj.find(".slide-holder").removeAttr("style");
						}
						
						if($slideObj.is(".current"))
						{
							$slideObj.attr("style", "width: " + singleWidth + "px; display: block;").transition({ x: Math.round((sliderWidth - singleWidth) / 2) }, 0);
							$("#next-button, #prev-button").attr("style", "width: " + Math.round((sliderWidth - singleWidth)/2) + "px;");
						}
						else if($slideObj.is(".next-slide"))
						{
							$slideObj.attr("style", "width: " + Math.round(singleWidth) + "px; display: block;").transition({ x: Math.round(sliderWidth - slidePreview) }, 0);
						}
						else if($slideObj.is(".prev-slide"))
						{
							$slideObj.attr("style", "width: " + Math.round(singleWidth) + "px; display: block;").transition({ x: Math.round(slidePreview - singleWidth) }, 0);
						}
						else
						{
							$slideObj.attr("style", "width: " + Math.round(singleWidth) + "px; display: block;").transition({ x: Math.round(2*sliderWidth) }, 0);
						}
					});
				}
				else
				{
					var $dots = $slider.data("sliderVars").dots;
					var $caption = $slider.data("sliderVars").caption;
					
					$slider.data("sliderVars").allSlides.each(function(){
						var $slideObj = $(this);
						var $slideImg = $slideObj.find("img, video, iframe");
						var $slideHolder = $slideObj.find(".slide-holder");
						var $slideCaption = $slideObj.find(".caption");
						
						$slideObj.removeClass("fit-horizontal").attr("style", "height: " + Math.round(sliderWidth*$slideImg.attr("height")/$slideImg.attr("width")) + "px");
						$slideHolder.removeAttr("style");
						
						var slideHeight = $slideHolder.outerHeight();
						
						/*var $slideImg = $slideHolder.find("img");
												
						if($slideImg.length)
							$slideHolder.fitImages();*/
						
						if($slideObj.is(".current"))
						{
							var captionHeight = 0;
							if($slideCaption.length)
								captionHeight = $slideCaption[0].scrollHeight + 36;
							else
								captionHeight = 60;
							
							$slider.attr("style", "height: " + Math.round(slideHeight + captionHeight) + "px");
							$dots.attr("style", "top: " + Math.round(slideHeight) + "px");
							
							if($caption.length)
								$caption.attr("style", "top: " + Math.round(slideHeight + 20) + "px");
										
							$slideObj.transition({ x: 0 }, 0);
						}
						else if($slideObj.is(".next-slide"))
						{
							$slideObj.transition({ x: sliderWidth }, 0);
						}
						else if($slideObj.is(".prev-slide"))
						{
							$slideObj.transition({ x: -sliderWidth }, 0);
						}
						else
						{
							$slideObj.transition({ x: 2*sliderWidth }, 0);
						}
					});
				}
				
				setTimeout(function(){
					$slider.addClass("resized");
				}, 250);
			}
			
			// Resize slideshow videos
			
			/*var $videos = $("#slider").find(".video-holder");
			
			$videos.each(function(){
				var potentialVideoHeight = sliderWidth / $(this).data("ratio");
				
				if(potentialVideoHeight > sliderHeight)
				{
					$(this).attr("style", "width: " + sliderHeight*$(this).data("ratio") + "px; height: " + sliderHeight + "px; padding-bottom: 0;");
				}
				else
					$(this).attr("style", "width: " + sliderWidth + "px; height: " + potentialVideoHeight + "px; padding-bottom: 0;");
			});*/
			
		});
		
		if($("#map").length)
		{
			if(windowWidth > 1024)
				var mapOffset = 360;
			else if(windowWidth == 1024)
				var mapOffset = 200;
			else if(windowWidth >= 768)
				var mapOffset = 120;
			else	
				var mapOffset = 0;
					
			$("#map").width(Math.round(Math.min($("#map").outerHeight()*2, $("#map-holder").width() - mapOffset)));
		}
		
		// Resize navigation
		
		if($("html").is(".country-selector-visible") || $("html").is(".mobile-menu-open"))
		{
			if((windowWidth < 1024 && oldWindowWidth >= 1024) || (windowWidth >= 1024 && oldWindowWidth < 1024))
			{
				$("#country-nav, #mobile-country-selector, #mobile-language-chooser, #mobile-menu-back, #"+ siteType +"-nav, #"+ siteType +"-content, #scroller, #overlay, #nav-gradient, #close-arrow").removeAttr("style");				
				$("html").removeClass("country-selector-visible mobile-menu-open");
			}
			else if($("html").is(".country-selector-visible"))
			{
				$("#country-nav, #"+ siteType +"-nav, #" + siteType + "-content").transition({ x: minus*(-windowWidth + countryOffset) }, 0);
			}
		}
		
		// Isotope grids
		
		if($isotopeGrids !== null)
		{
			$isotopeGrids.each(function(){
			
				var $grid = $(this);
				if(windowWidth >= 768 && !$grid.is(".isotope"))
				{			
					$grid.initIsotope();
				}
				else if(windowWidth < 768 && $grid.is(".isotope"))
				{
					$grid.removeClass("isotope");
					$grid.isotope("destroy");
				}
			});
			
			if(windowWidth < 768 && oldWindowWidth >= 768)
			{
				$isotopeGrids.find(".thumb").removeAttr("style");
			}
		}
		
		// Banner
		
		if(hasBanner)
		{
			if(windowWidth <= 1024)
				removeBanner();
			else if(windowWidth < 1280)
			{
				var bannerHeight = $topBanner.outerHeight();
				$("#international-content, #local-content, #intro-white-full").css("margin-top", (bannerHeight + 60) + "px");
				$("#international-nav, #local-nav, #country-scroller, #close-arrow").css("margin-top", bannerHeight + "px");
			}
			else
			{
				$("#international-content, #local-content, #intro-white-full, #international-nav, #local-nav, #country-scroller, #close-arrow").removeAttr("style");
			}
		}
		
		$(".fit-img").fitImages();
		
		if(resizeEvent && pageLoaded)
			setTimeout(function(){
				$("html").removeClass("resizing");
			
				if(contactMap)
					contactMap.setCenter(mapLat, mapLng);
			}, 150);
		
	}
	
	if(!("orientationchange" in window))
  	{	
		$(window).resize(function() {
	  		handleResize(true);
		});
  	}
  	else
  	{
  		$('body').bind('orientationchange',function(event){  		
	  		$("body").addClass("orientation-change");

	        setTimeout(function(){
		        handleResize(true);
		        
		        setTimeout(function(){
		        	$("body").removeClass("orientation-change");
		        }, 500);
	        }, 100);
	    });
	}
	
	handleResize(false);
	
	
	// Thumbs padding
	
	imgPadding = function(){
		
		$(".img-holder").each(function(){
			var $holder = $(this);
			
			if(!$holder.is(".padded") && !$holder.is(".no-padding"))
			{
				var $img = $holder.find("img, video");
				var ratio = $img.attr("height")/$img.attr("width");
				
				$holder.css("padding-bottom", ratio*100 + "%").addClass("padded");
				if($holder.parent().is(".logo-partner") && ratio >= 0.4)
				{
					$holder.parent().addClass("limit-width");
				}
			}
		});
		
		Waypoint.refreshAll();
	}
	
	$.fn.initIsotope = function() {		
		return this.each(function() {
						
			var $grid = $(this);
			
			if(!$grid.is(".isotope"))
			{
				$grid.isotope({
					itemSelector: '.thumb',
					transitionDuration: 0
				});
				
				$grid.addClass("isotope");
			}
		});
	}

	imgPadding();
	
	var $isotopeGrids;
	
	doIsotope = function(){
	
		$isotopeGrids = $(".archive-grid, .instagram-grid, .content-grid").find(".grid-container");
		
		if($isotopeGrids.length && windowWidth >= 768)
			$isotopeGrids.initIsotope();
	}
	
	doIsotope();
	
	// Load Images
	
	$.fn.loadImages = function() {		
		return this.each(function() {
			
			var $parent = $(this);
			
			if($parent.is(".scroller"))
			{
				var $context = $parent;
			}
			else
			{
				var $context = $parent.find(".scroller");
				
				if(!$context.length)
					$context = $parent.parents(".scrolller");
			}
			
			$parent.find(".img-holder").each(function(){
		   		var $holder = $(this);
		   		var $isInlineVideo = $holder.parent().is(".inline-video");
		   		
		   		$holder.waypoint({
		   			handler: function(direction){
				   		if(!$isInlineVideo || ($isInlineVideo && !Modernizr.video))
				   		{
				   			$holder.loadImage();
						}
						else
						{
							var $video = $holder.find("video");
							$video.attr("src", $video.data("src"));
							$video[0].load();
						}
						
				   		this.destroy();
				   	},
				   	context: $context[0],
				   	offset: "125%"
				});
				
				if($isInlineVideo && Modernizr.video)
				{
					var $inlineVideo = $holder.find("video");
					
					var inview = new Waypoint.Inview({
						element: $holder[0],
						entered: function() {
							$inlineVideo[0].play();
						},
						exited: function(direction) {
							$inlineVideo[0].pause();
						}
					});
				}
			});
		});
	}
	
	
	// Infinite scroll image loading/unloading
	
	var tinyGif = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
	
	$.fn.infiniteInView = function() {		
		return this.each(function() {
			
			var $parent = $(this);
			
			if($parent.is(".scroller"))
			{
				var $context = $parent;
			}
			else
			{
				var $context = $parent.find(".scroller");
				
				if(!$context.length)
					$context = $parent.parents(".scrolller");
			}
			
			$parent.find(".img-holder").each(function(){
		   		var $holder = $(this);
		   		var $img = $holder.find("video,img")
		   		
		   		$holder.waypoint({
		   			handler: function(direction){
				   		if(direction == "down")
				   		{
					   		$img.attr("src", tinyGif);
				   		}
						else if(direction == "up")
						{
							$img.attr("src", $img.data("src"));
						}
				   	},
				   	context: $context[0],
				   	offset: "-400%"
				});
			});
		});
	}
	
	
	// Async FB buttons
	
	$.fn.loadFacebook = function($context) {		
		return this.each(function() {
			
			var $obj = $(this);
			
			$obj.waypoint({
				handler: function(){
		   			FB.XFBML.parse($obj[0]);
		   					   			
		   			this.destroy();
		   		},
		   		context: $context[0],
		   		offset: "100%"
			});
		});
	}
	
	$.fn.fullPageFacebook = function(context) {		
		return this.each(function() {
			
			var $obj = $(this);
			
			var $buttons = $obj.find(".fb-holder, .fb-embed");
			$buttons.loadFacebook($obj);
		});
	}
	
	doFacebook = function(){		
		$("#scroller, #single-scroller").fullPageFacebook();
	}
	
	doTwitter = function(){
		twttr.widgets.load();
	}
		
	window.fbAsyncInit = doFacebook;
	
	
	// Infinite Load
		
	$.fn.initInfinite = function() {		
		return this.each(function() {
			
			var $grid = $(this);
			
			if($grid.parent().find(".load-more").length)
			{
				var $scroller = $grid.parents(".scroller");
				
				$grid.infiniteInView();
				
				var infinite = new Waypoint.Infinite({
					element: $grid[0],
					handler: function() {},
					context: $scroller[0],
					items: '.thumb',
					more: '.load-more',
					loadingClass: 'infinite-loading',
					onBeforePageLoad: function(){
											
						if(!$("#loader").length)
							$scroller.parent().append("<div id='loader' class='loader bottom-loader animated-grad'></div>");
												
					},
					onAfterPageLoad: function($appended){
						
						imgPadding();
						
						if($grid.is(".isotope"))
						{													
							$grid.isotope("insert", $appended);
						}
						
						if(isIE8)
						{
							fixIE8();
						}
						
						handleResize();
						addTargetBlank();
							
						setTimeout(function(){					
							$appended.loadImages();
							$appended.loadFacebook($scroller);
							$appended.infiniteInView();
						}, 150);
						
						$("#loader").attr("class", "loader bottom-loader opacity-zero");
									
						setTimeout(function(){
							$("#loader").remove();
						}, 500);
					}
				});
			}
		});
	}

	
	var $grids = $(".grid-container");
	
	if($grids.length)
	{
		$grids.initInfinite();
	}
	
	// Load thumbs in background on single pages
	
	var noScroller = false;
	
	if($("#overlay").length)
	{
		noScroller = true;
		
		$("#overlay").addClass("top-level");
		//$("#content-overlay").attr("style", "visibility: visible; opacity: 1;");
	}

	// Handle scroll
	
	var isScrolling = false;
	var scrollTop = 0;
	var scrollBottom = 0;
	var waypointsInterval;
	
	initInlineClone = function(){
		
		var $scrollDiv = $("#scroller");
		if(!Modernizr.mousehover)
			$scrollDiv = $scrollDiv.find(".scroll-container");
		
		$("#inline-menu").clone().attr("id", "inline-clone").attr("class", "bar inline-bar inline-clone").appendTo($scrollDiv.parent());
		
		$("#inline-menu").waypoint({
   			handler: function(direction){
		   		if(direction == "down")
		   		{
			   		$("#inline-clone").attr("style", "top: 0; width: " + ($("#scroller").width() - scrollBarWidth) + "px");
			   		$("#inline-menu").attr("style", "opacity: 0");
		   		}
		   		else if(direction == "up")
		   		{
			   		$("#inline-clone").removeAttr("style");
			   		$("#inline-menu").removeAttr("style");
		   		}
		   	},
		   	context: $scrollDiv[0],
		   	offset: 0
		});
	}
	
	if($("#inline-menu").length)
		initInlineClone();
	
	handleScroll = function(){
				
		if(isScrolling)
		{
			/*var $scrollDiv = $("#scroller");
			if(!Modernizr.mousehover)
				$scrollDiv = $scrollDiv.find(".scroll-container");
			
			var lastScrollTop = scrollTop;
			scrollTop = $scrollDiv.scrollTop();
			scrollBottom = $scrollDiv[0].scrollHeight - windowHeight - scrollTop;*/
		}
	}
	
	// Scroll interval
	
	var scrollInterval;
	
	if(hasBanner)
		scrollInterval = setInterval(function(){		
			if(isScrolling && !$("#intro").length)
				removeBanner();
		}, 25);
	
	// Handle scroll / touch events
	
	$.fn.bindScroll = function(context) {		
		return this.each(function() {
			
			var $scroller = $(this);			
			var $body = $("body");
			var timer;
		
			scrollEndActions = function(){
				if((Modernizr.mousehover || (!Modernizr.mousehover && windowWidth >= 768)) && $scroller.attr("id") == "scroller")
					handleScroll();
				
				Waypoint.refreshAll();
				
				setTimeout(function() {
					isScrolling = false;
				}, 0);
			}
						
			if(Modernizr.mousehover)
			{
				$scroller.on("scroll", function() {
					isScrolling = true;
								
					/*clearTimeout(timer);
					
					if(!$body.hasClass('disable-hover') && scrollBottom > 1){
				        $body.addClass('disable-hover');
				    }
				
				    timer = setTimeout(function(){
				        $body.removeClass('disable-hover');
				    }, 150);*/
				}).on("scrollstart", function() {			
					isScrolling = true;
				}).on("scrollend", function() {			
					scrollEndActions();		
				});
			}
			else
			{
				$scroller.find(".scroll-container").on("scroll", function(e) {
					isScrolling = true;		
				}).on("scrollend", function() {			
					scrollEndActions();		
				});	
			}
		})
	}
	
	$("#scroller, #single-scroller").bindScroll();
	
	// Touchmove
	
	if(!Modernizr.mousehover)
	{	
		$(document).on("touchmove", function(e) {
			e.preventDefault();
						
			if(windowWidth >= 768)
			{
				isScrolling = true;			
				handleScroll();
			}
			
			Waypoint.refreshAll();
						
			setTimeout(function() {
				isScrolling = false;
			}, 0);
		});
		
		// Touch overflow fix
		var scrolling = false;
		
		$("body").on("touchstart", ".scroll-container", function(e){		    
		    if(!scrolling)
		    {			    
				scrolling = true;
			    
			    if(e.currentTarget.scrollTop===0){
			        e.currentTarget.scrollTop = 1;
			    }else if(e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight){
			        e.currentTarget.scrollTop-=1;
			    }
			    
			    scrolling = false;
			}
		});
		
		$("body").on("touchmove", "#inline-menu, #inline-clone", function(e) {
			e.stopPropagation();
		});
		
		// Countries scroll
		
		countriesScroll = function(e){
			
			if($("#navigation").is(".countries-open"))
			{
				e.stopPropagation();
			}
			
		}
		
		$("body").on("touchmove", "#country-scroller", function(e) {
			if(!scrollContainer)
				countriesScroll(e);
		});
		
		$("body").on("touchmove", "#country-scroller .scroll-container", function(e) {
			if(scrollContainer)
				countriesScroll(e);
		});
		
		// Main scroll
		
		mainScroll = function(e){
			e.stopPropagation();	
							
			if(windowWidth >= 768)
			{
				isScrolling = true;			
				handleScroll();
								
				waypointsInterval = setInterval(function(){		
					Waypoint.refreshAll();
				}, 500);
			}
			
			Waypoint.refreshAll();
		}
		
		$("body").on("touchmove", "#scroller", function(e) {
			if(!scrollContainer)
				mainScroll(e);			
		});
		
		$("body").on("touchmove", "#scroller .scroll-container", function(e) {
			if(scrollContainer)
				mainScroll(e);			
		});
		
		singleScroller = function(e){
			e.stopPropagation();
						
			Waypoint.refreshAll();
			
			if(windowWidth >= 768)
			{				
				waypointsInterval = setInterval(function(){		
					Waypoint.refreshAll();
				}, 500);	
			}
		}
		
		$("body").on("touchmove", "#single-scroller", function(e) {
			if(!scrollContainer)
				singleScroller(e);
		});
		
		$("body").on("touchmove", "#single-scroller .scroll-container", function(e) {
			if(scrollContainer)
				singleScroller(e);
		});
		
		/*$("body").on("touchmove", "#single-scroller .scroll-container", function(e) {
			if(scrollContainer)
			{
				e.stopPropagation();
				
				isScrolling = true;
				
				Waypoint.refreshAll();
			}
		});*/
		
		$(document).on("touchend", function(e) {
			
			if(windowWidth >= 768)
			{
				isScrolling = true;			
				handleScroll();
			}
			
			Waypoint.refreshAll();
		});
	}

	
	// Slider
		
	/*if(Modernizr.csstransitions && !Modernizr.mousehover)
	{
		$(document).hammer({ swipeVelocityX: 0.3 }).on("swipe", ".slider", function(e) {
		    e.stopImmediatePropagation();
		    e.stopPropagation();
		    e.preventDefault();
										
		    if(e.gesture.direction == "left")
		    	$(this).nextSlide();
		    else if(e.gesture.direction == "right")
		    	$(this).prevSlide();
		});
	}*/
	
	$(document).on("click", ".next-slide", function(e) {
	    if(windowWidth >= 768)
	    {
		    e.preventDefault();
			
			var $slider = $(this).parents(".slider");						
		    $slider.nextSlide();
	    }
	});
	
	$(document).on("click", ".prev-slide", function(e) {
	    if(windowWidth >= 768)
	    {
		    e.preventDefault();
									
		    var $slider = $(this).parents(".slider");						
		    $slider.prevSlide();
	    }
	});
	
	$(document).on("click", ".next-button", function(e) {
		e.preventDefault();
										
		var $slider = $(this).parents(".slider");						
		$slider.nextSlide();
	});
	
	$(document).on("click", ".prev-button", function(e) {
		e.preventDefault();
										
		var $slider = $(this).parents(".slider");						
		$slider.prevSlide();
	});
	
	/*$(document).on("click", ".dots a", function(){
		if(!$(this).is(".active"))
		{
			var slideIndex = $(this).data("slide");
			if(slideIndex < $slider.data("sliderVars").currentSlide.data("index"))
			{
				$slider.data("sliderVars").prevSlide = $slider.data("sliderVars").allSlides.eq(slideIndex - 1);
				$slider.prevSlide();
			}
			else
			{
				$slider.data("sliderVars").nextSlide = $slider.data("sliderVars").allSlides.eq(slideIndex - 1);
				$slider.nextSlide();
			}
		}
	});*/
	
	// Handle keyboard navigation
     
    $(document).keydown(function(e) {                 
		switch(e.keyCode) { 
			case 39:
				// RIGHT
				e.preventDefault();
				
				/*if($("#slider").length)
					nextSlide();*/
		 
				break;
			case 37:
				// LEFT
				e.preventDefault();
				
				/*if($("#slider").length)
					prevSlide();*/
				
				break;
			case 38:
				// UP
				//e.preventDefault();
												 
				break;
			case 40:
				// DOWN
				
				break;
			case 27:
				// ESC
				e.preventDefault();
				
				if($("#overlay").length)
					$("#close-single").trigger("click", true);
					             
				break;
			case 32:
				// Spacebar
				
				break;
        }
    });


    // Scroll top
	
	var scrollingToTop = false;
	
	$(document).on("click", ".back-top", function(){
		scrollingToTop = true;
		
		if($("#overlay").length)
			var $scrollDiv = $("#overlay").find(".scroller");
		else
			var $scrollDiv = $("#scroller");
		
		if(!Modernizr.mousehover)
			$scrollDiv = $scrollDiv.find(".scroll-container");
		
		$scrollDiv.animate({ scrollTop: 0 }, 1000, "easeInOutQuint", function(){
			$scrollDiv.scrollTop(0);
			scrollingToTop = false;
		});
	});
	
	
	// Make external links open in new window
	
	addTargetBlank = function(){
	
		$("a[rel=external], a[href^='http:']:not([href*='" + window.location.host + "']), a[href^='https:']:not([href*='" + window.location.host + "'])").each(function(){
			$(this).attr("target", "_blank").attr("rel", "external");
		});
	}
	
	addTargetBlank();
	
	
	// Intro
	
	playIntro = function(){
				
		$("#intro-img").loadImage(function(){
			$("#intro-logo").loadImage(function(){			
				$(".slider").each(function(){
					var $slider = $(this);
					
					$slider.initSlider();
				});
				
				handleResize(false);
				
				$("#scroller, #single-scroller").loadImages();
				
				if(hasBanner)
					$("#top-banner").loadImage();
			});
			$("#intro-heading").transition({ opacity: 1 }, 750, easeInOut, function(){
				$("#intro-gradient").attr("style", "visibility: visible");
				
				setTimeout(function(){
					$("#intro-heading").transition({ opacity: 0 }, 750, easeInOut);
					$("#intro-img").transition({ opacity: 1 }, 2000, easeInOut);
					
					if(!Modernizr.mixblendmode)
						$("#intro-gradient").transition({ opacity: 1 }, 2000, easeInOut);
				
					setTimeout(function(){
						$("#intro-logo").transition({ opacity: 1 }, 750, easeInOut);
						
						setTimeout(function(){
							$("#intro-logo").transition({ opacity: 0 }, slideDuration*2/3, easeInOut);
							$("#intro-bg").transition({ opacity: 1 }, slideDuration - 100, easeInOut);
							
							if(windowWidth < 1024)
								$("#intro-white").transition({ y: -windowHeight }, slideDuration, "easeInOutQuint", function(){
									$("#intro").removeClass("loading").transition({ opacity: 0 }, 1000, easeInOut, function(){
										$("#intro").empty().remove();
									});
								});
							else
								$("#intro-white").transition({ x: minus*windowWidth }, slideDuration, "easeInOutQuint", function(){
									$("#intro").removeClass("loading").transition({ opacity: 0 }, 1000, easeInOut, function(){
										$("#intro").empty().remove();
									});
								});
						}, 1250);
					}, 1000);
				}, 250);
			});	
		});
	}
	
	if($("#intro-logo").length)
	{		
		if($("#scroller").is(".home") && !oldIE && (document.referrer.indexOf(baseURL) == -1))// && !Cookies.get('intro'))
		{
			$("#intro").attr("style", "background: #000");
			Cookies.set('intro', true, { expires: 7 });
			playIntro();
		}
		else
		{
			// Init slider
			
			$(".slider").each(function(){
				var $slider = $(this);
				
				$slider.initSlider();
			});
						
			$("#scroller, #single-scroller").loadImages();
			if(hasBanner)
				$("#top-banner").loadImage();
				
			$("#intro").empty().remove();
			
			handleResize(false);
		}
	}
	else
	{
		$(".slider").each(function(){
			var $slider = $(this);
			
			$slider.initSlider();
		});
					
		$("#scroller, #single-scroller").loadImages();
		if(hasBanner)
			$("#top-banner").loadImage();
		
		handleResize(false);
	}
	
	/* Handle links */
	
	$(document).on("click", "a[rel=external], .category, .fb-holder", function(e){
		e.stopPropagation();
	});
	
	$(document).on("click", ".big-thumb", function(e){
		e.preventDefault();
		e.stopPropagation();
		
		var externalLink = $(this).data("external-href");
		
		if(externalLink)
		{
			window.open(externalLink, '_blank');
		}
	});
		
	/* AJAX nav */
	
	var human = false;
	var historyPages = [];
	var ajaxInProgress = false;
	var siteTitle = window.siteTitle;
	
	if(Modernizr.history && !ToGo)
	{
		updateHistory = function(href, title, isSingle, fromInlineMenu) {
		
			if(human)
			{
				var metaTitle = siteTitle;
				var pageTitle = title;
				
				if(pageTitle !== "Home" && pageTitle !== "HOME" && pageTitle !== metaTitle && pageTitle)
					metaTitle = pageTitle + " - " + metaTitle;
								
		    	History.pushState({single: isSingle, filter: fromInlineMenu}, metaTitle, href);
		    			    	
		    	window.document.title = metaTitle;
		    	historyPages.push(History.getCurrentIndex());		
		    	
		    	// Google Analytics Tracking code
		    	
		    	if(typeof(ga) == "function")
		    	{
			    	var trackUrl = href.replace(baseURL, "");				
					ga('send', 'pageview', {'page': trackUrl,'title': metaTitle});
				}
			}
		}
		
		
		// Top level pages
		
		$(document).on("click", "#main-nav a, .inline-bar a", function(e){
			e.stopPropagation();
			
			if(windowWidth >= 768 && !ajaxInProgress)
			{
				e.preventDefault();

				var $clickedItem = $(this);
				var targetHref = $clickedItem.attr("href");
				var targetTitle = $clickedItem.data("title");
				var fromInlineMenu = !$clickedItem.parents("#main-nav").length;
				
				ajaxInProgress = true;
						
				if(e.originalEvent)
		   		{
					human = true;
				}
				
				loadPage(targetHref, targetTitle, fromInlineMenu, false);
			}			
		});
				
		
		// Pop/push history state
		
		History.Adapter.bind(window, 'statechange', function(){
	        var State = History.getState();
	       		       	
	        if(!human)
	        {
	        	noScrollOnce = true;
				
				/*if(!State.data.section)
					window.location.reload();*/
				
				/*if($("#overlay").length && !State.data.single)
					var $historyLink = $("#close-single");
				else
				{
					var $historyLink = $("body").find('a[href$="' + State.url.replace(baseURL, "") + '"]').last();								
				}*/
																
				/*if(!$historyLink.length)
				{*/
					if(!ajaxInProgress)
					{
						ajaxInProgress = true;
						
						if(State.data.single)
						{
							loadSingle(State.url, State.title, true);
						}
						else
						{
							loadPage(State.url, State.title, State.data.filter, true);
						}
					}
				/*}
				else
				{
					$historyLink.trigger("click");
				}*/
		    }
		    else
		    {
			    setTimeout(function(){
			    	human = false;
				}, 100);
			}
	    });
	}
	else
	{
		$(document).on("click", ".thumb", function(e){
			e.preventDefault();
			e.stopPropagation();
			
			var $obj = $(this);
			
			if(!$obj.is(".comingsoon") && !$obj.is(".nolink") && !$obj.is(".content-thumb"))
			{
				var externalLink = $obj.data("external-href");
				
				if(externalLink)
				{
					window.open(externalLink, '_blank');
				}
				else
				{
					var $clickedItem = $obj.find("a").eq(0);
					
					if($clickedItem.length)
						window.location.href = $clickedItem.attr("href");
					
				}
			}
		});
		
		$(document).on("click", ".home .current, .partners .current, .category .current", function(e){
			e.preventDefault();
			e.stopPropagation();
			
			var $clickedItem = $(this).find("a").eq(0);
			window.location.href = $clickedItem.attr("href");
		});
	}
	
	
	// Main pages
	
	loadPage = function(targetHref, targetTitle, fromInlineMenu, fromHistory){
		
		var fromMobileMenu = $("html").is(".mobile-menu-open");
		var animationDelay = 0;
		
		if(fromInlineMenu && !fromHistory)
		{			
			var contentID = "#inline-content";
			$("#inline-menu, #inline-clone").find(".selected").removeClass("selected");
			$("#inline-menu, #inline-clone").find('a[href="' + targetHref.replace(baseURL, "") + '"]').parent().addClass("selected");
		}
		else
		{
			var contentID = "#scroller";
			$("#main-nav").find(".selected").removeClass("selected");
			$("#main-nav").find('a[href="' + targetHref.replace(baseURL, "") + '"]').parent().addClass("selected");
		}
		
		if(!noScroller)
			var $content = $(contentID).find(".content").eq(0);
		
		Waypoint.destroyAll();
		
		if($("#overlay").length)
		{
			animationDelay = longerDuration + 150;
			
			if(!noScroller)
			{
				$content.attr("style", "opacity: 0;");
				$("#content-overlay, #inline-clone").attr("style", "opacity: 0;");
				
				$("#overlay").transition({ opacity: 0 }, longerDuration, easeInOut, function(){
					$("#overlay, #inline-clone").unLoadImages().empty().remove();
					$content.unLoadImages().empty().remove();
					$("#content-overlay").removeAttr("style");
				});
				
				/*$("#content-overlay").transition({ opacity: 0 }, longerDuration, easeInOut, function(){
					$("#content-overlay").removeAttr("style");
					
					$content.unLoadImages().empty().remove();
				});
				
				$("#overlay").transition({ x: -windowWidth + menuOffset }, normalDuration, "easeInOutQuint", function(){
					$("#overlay").unLoadImages().empty().remove();
				});*/
			}
			else
			{
				$("#overlay").transition({ opacity: 0 }, longerDuration, easeInOut, function(){
					$("#overlay").unLoadImages().empty().remove();
				});
			}
		}
		else if(fromInlineMenu && !fromHistory)
		{
			animationDelay = 2*longerDuration + 150;
			
			var $scrollDiv = $("#scroller");
			if(!Modernizr.mousehover)
				$scrollDiv = $scrollDiv.find(".scroll-container");
			
			$(contentID).height($(contentID).height());
			
			$scrollDiv.animate({ scrollTop: $("#inline-menu").position().top }, longerDuration, "easeInOutQuint", function(){	
				$content.transition({ opacity: 0 }, longerDuration, easeInOut, function(){
					$content.unLoadImages().empty().remove();
				});
			});
		}
		else if(!fromMobileMenu)
		{			
			animationDelay = longerDuration + 150;
			
			$content.transition({ opacity: 0 }, longerDuration, easeInOut, function(){
				$content.unLoadImages().empty().remove();
			});
			
			if($("#inline-clone").length)
				$("#inline-clone").transition({ opacity: 0 }, longerDuration, easeInOut, function(){
					$("#inline-clone").empty().remove();
				});
		}
		else
		{
			$content.unLoadImages().empty().remove();
			$("#inline-clone").empty().remove();

			$("#hamburger").trigger("click");
			
			animationDelay = normalDuration + 150;			
		}
		
		setTimeout(function(){
			if(!$("#loader").length)
				$("#international-content, #local-content").append("<div id='loader' class='loader centered-loader animated-grad'></div>");				
			
			$('<div></div>').load(targetHref + " " + contentID, { ajax: 1 }, function(response, status){ 
			    
			    if(status !== "error")
				{
				    var $ajaxContent = $(this).children();
				    
				    if(!noScroller)
				    	var $newContent = $ajaxContent.find(".content").eq(0).addClass("opacity-zero");
				    else
				    	var $newContent = $ajaxContent.addClass("opacity-zero");
				    
				    targetTitle = $ajaxContent.data("meta-title");
				    
				    if(!fromInlineMenu)
				    {
					    var loadedClass = $ajaxContent.attr("class");
				    	$("#scroller").attr("class", loadedClass);
				    }
				    
				    if(contentID == "#scroller")
				    {
				    	if(!noScroller)
				    		var $appendedContent = $newContent.appendTo($(contentID).find(".scroll-container"));
						else
							var $appendedContent = $newContent.appendTo($("#international-content, #local-content"));
				    }
				    else
				    {
				    	var $appendedContent = $newContent.appendTo($(contentID));
				    	$(contentID).removeAttr("style");
				    }
				    
				    // Init new content
				    
				    addTargetBlank();
				    
				    $("#scroller, #scroller .scroll-container").off("scroll scrollend");
				    $("#scroller").bindScroll();
				    
				    if(isIE8)
					{
						fixIE8();
					}
					
					imgPadding();
				    
					doIsotope();
					
					$(contentID).find(".slider").each(function(){
						var $slider = $(this);
						$slider.initSlider();
					});
					
					$("#scroller").initVideos();
					$("#scroller").loadImages();
					
					if($("#map").length)
					{
						contactMap = null;
						initContactMap();
				    }
					
					handleResize(false);				    
					
				    if(Modernizr.history && !ToGo)
					    updateHistory(targetHref, targetTitle, false, fromInlineMenu);
				    
				    setTimeout(function(){
						$("#loader").attr("style", "opacity: 0");
						
						$appendedContent.transition({ opacity: 1 }, longerDuration, easeInOut, function(){
							$appendedContent.removeClass("opacity-zero").removeAttr("style");
							
							setTimeout(function(){
								if($("#inline-menu").length && !$("#inline-clone").length)
									initInlineClone();
								
								if($("#loader").length)
									$("#loader").remove();	
								
								$("#scroller").fullPageFacebook();
								doTwitter();
								
								$appendedContent.find(".grid-container").initInfinite();
								
								Waypoint.refreshAll();
							}, 150);
						});
						
						noScroller = false;
						ajaxInProgress = false;
					}, 150);
				}
				else
				{
					if($("#loader").length)
						$("#loader").remove();	
					
					ajaxInProgress = false;
				}
			});
		}, animationDelay);
	}
	
	// Single pages
		
	loadSingle = function(targetHref, targetTitle, fromHistory){
		
		var animationDelay = 0;
		var overlayExists = $("#overlay").length;
		var $content;
		
		//Waypoint.destroyAll();
				
		if(overlayExists)
		{			
			animationDelay = longerDuration + 150;
			$content = $("#overlay").find(".content");
			
			$content.transition({ opacity: 0 }, longerDuration, easeInOut, function(){
				$content.unLoadImages().empty();
			});
		}
		
		if(fromHistory)
		{
			$("#main-nav").find(".selected").removeClass("selected");
		}
		
		setTimeout(function(){
			if(!$("#loader").length)
				$("#international-content, #local-content").append("<div id='loader' class='loader centered-loader animated-grad'></div>");				

			$('<div></div>').load(targetHref + "?ajax=1 #overlay", function(response, status){ 
			    
			    if(status !== "error")
			    {
				    var $ajaxContent = $(this).children();
					//var loadedClass = $ajaxContent.attr("class");
				    var targetTitle = $ajaxContent.data("meta-title");
				    	    		
				   	if(overlayExists)
				    	var $appendedContent = $ajaxContent.find(".content").children().appendTo($content);
				   	else		    
				    	var $appendedContent = $ajaxContent.addClass("offscreen").appendTo($("#international-content, #local-content"));
				    			    
				    // Init new content
				    
					addTargetBlank();
				    
				    $("#single-scroller, #single-scroller .scroll-container").off("scroll scrollend");
				    $("#single-scroller").bindScroll();
				    
				    if(isIE8)
					{
						fixIE8();
					}
					
					imgPadding();
				    
					doIsotope();
					
					$("#single-scroller").find(".slider").each(function(){
						var $slider = $(this);
						$slider.initSlider();
					});
					
					$("#single-scroller").initVideos();
					$("#single-scroller").loadImages();
					
					handleResize(false);				    
	
				    if(Modernizr.history && !ToGo)
					    updateHistory(targetHref, targetTitle, true, false);
				    	    
				    setTimeout(function(){
				    	$("#loader").attr("style", "opacity: 0");
				    	
				    	if(fromHistory)
						{
							$("#main-nav").find('a[href="' + $("#overlay").data("parent-url") + '"]').parent().addClass("selected");
						}
				    					    	
				    	if(overlayExists)
				    	{
					    	$content.transition({ opacity: 1 }, longerDuration, easeInOut, function(){
								$content.removeAttr("style");
								
								$("#single-scroller").fullPageFacebook();
								doTwitter();
								
								if($("#related").length)
									fixRelated();
								
								$appendedContent.find(".grid-container").initInfinite();
								
								Waypoint.refreshAll();
								
								if($("#loader").length)
									$("#loader").remove();							
							});
				    	}
				    	else
				    	{
					    	$content = $("#overlay");
					    	
					    	$("#content-overlay").css("visibility", "visible").transition({ opacity: 1 }, longerDuration, easeInOut);
												
							$content.transition({ x: minus*(windowWidth - menuOffset) }, normalDuration, "easeInOutQuint", function(){
								$content.removeClass("offscreen").removeAttr("style");
								
								$("#single-scroller").fullPageFacebook();
								doTwitter();
								
								if($("#related").length)
									fixRelated();
								
								$appendedContent.find(".grid-container").initInfinite();
								
								Waypoint.refreshAll();
								
								/*if(!Modernizr.mousehover && windowWidth < 768)
									$("#overlay").hammer({threshold: 50}).on("swipe", function(e) {
										if($("#scroller").length && e.gesture)
										{
											if(e.gesture.direction == 2)
											{
										    	$("#close-single").trigger("click", true);
									    	}
										}
									});*/
								
								if($("#loader").length)
									$("#loader").remove();							
							});
						}
						
						ajaxInProgress = false;
					}, 150);
				}
				else
				{
					if($("#loader").length)
						$("#loader").remove();	
					
					ajaxInProgress = false;
				}
			});
		}, animationDelay);
	}
	
	if(Modernizr.mousehover)
	{
		$(document).on("mouseenter", ".home .current, .category .current", function(e){
			var $slider = $(this).parents(".slider");
			var $caption = $slider.data("sliderVars").caption;
			$caption.addClass("fake-hover")
		});
		
		$(document).on("mouseleave", ".home .current, .category .current", function(e){
			var $slider = $(this).parents(".slider");
			var $caption = $slider.data("sliderVars").caption;
			$caption.removeClass("fake-hover")
		});
	}

	
	// Single posts
		
	$(document).on("click", ".thumb, .home .current, .partners .current, .category .current", function(e){
		e.preventDefault();
		e.stopPropagation();
					
		var $obj = $(this);
		var externalLink = $obj.data("external-href");
		var $clickedItem = $obj.find("a").eq(0);
		
		if($clickedItem.is(".internal") && !ajaxInProgress)
		{
			ajaxInProgress = true;
				
			if(e.originalEvent)
	   		{
				human = true;
			}
			
			var targetHref = $clickedItem.attr("href");
			var targetTitle = $clickedItem.data("title");
							
			loadPage(targetHref, targetTitle, false, false);
		}
		else if(!$obj.is(".comingsoon") && !$obj.is(".nolink") && !$obj.is(".content-thumb"))
		{
			if(externalLink)
			{
				window.open(externalLink, '_blank');
			}
			else if(!ajaxInProgress)
			{
				ajaxInProgress = true;
					
				if(e.originalEvent)
		   		{
					human = true;
				}
				
				var targetHref = $clickedItem.attr("href");
				var targetTitle = $clickedItem.data("title");
								
				loadSingle(targetHref, targetTitle, false);
			}
		}
	});
	
	// Close single
	
	$(document).on("click", "#close-single", function(e, fakeClick){
		e.preventDefault();
		
		if(e.originalEvent || fakeClick)
   		{
			human = true;
		}
		
		var $clickedItem = $(this);
		var targetHref = $clickedItem.attr("href");
		var targetTitle = $("#scroller").data("meta-title");
		
		var section = "boards";
		
		if(Modernizr.history && !ToGo)
		{
			updateHistory(targetHref, targetTitle, false, false);
		}
		
		$("#content-overlay").transition({ opacity: 0 }, longerDuration, easeInOut, function(){
			$("#content-overlay").removeAttr("style");
		});
		

		//$("#bar-hamburger").removeClass("closeburger");
								
		$("#overlay").transition({ x: minus*(-windowWidth + menuOffset) }, normalDuration, "easeInOutQuint", function(){
			setTimeout(function(){
				$("#overlay").unLoadImages().empty().remove();
			}, shortDuration);
		});
	});
	
	/*if(!Modernizr.mousehover && windowWidth < 768)
		$(document).hammer({ dragMinDistance: 50 }).on("swipe dragstart", "#overlay", function(e) {
			if($("#scroller").length && e.gesture.direction == "left")
			{		   
		    	e.stopPropagation();
				e.preventDefault();
										
		    	$("#close-single").trigger("click", true);
			}
		});*/

	
	/* Country Selector */
	
	closeCountries = function()
	{
		$("#close-arrow").addClass("invisible");
		
		$("#"+ siteType +"-content").transition({ x: 0, y: 0 }, longerDuration, "easeInOutQuint").promise().done(function(){
			$("html").removeClass("country-selector-visible");
			$("#"+ siteType +"-content, #"+ siteType +"-nav, #country-nav, #scroller, #overlay, #nav-gradient, #close-arrow, #inline-clone").removeAttr("style");
			
			setTimeout(function(){
				$("#close-arrow").removeClass("invisible");		
			}, 300);
		});
		
		$("#"+ siteType +"-nav").css("visibility", "visible").transition({ x: 0, y: 0, opacity: 1 }, longerDuration, "easeInOutQuint");	
		
		$("#country-nav").transition({ x: 0, y: 0, opacity: 0 }, longerDuration, "easeInOutQuint");	
		
		if($("#overlay").length)
			$("#overlay").find(".content").css("visibility", "visible").transition({ opacity: 1 }, longerDuration, "easeInOutQuint");
		else
			$("#scroller").css("visibility", "visible").transition({ opacity: 1 }, longerDuration, "easeInOutQuint");
		
		if($("#inline-clone").length)
			$("#inline-clone").css("visibility", "visible").transition({ opacity: 1 }, longerDuration, "easeInOutQuint");
				
		$("#nav-gradient").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
		
		$(document).off("click", "#"+ siteType +"-content", closeCountries);	
	}
	
	$(document).on("click", ".country-selector", function(){
		$("#"+ siteType +"-content").transition({ x: minus*(-windowWidth + countryOffset), y: 0}, longerDuration, "easeInOutQuint").promise().done(function(){
			$("html").addClass("country-selector-visible");
			$(document).on("click", "#"+ siteType +"-content", closeCountries);	
		});
		
		$("#"+ siteType +"-nav").transition({ x: minus*(-windowWidth + countryOffset), y: 0, opacity: 0 }, longerDuration, "easeInOutQuint");	
		
		$("#country-nav").attr("style", "visibility: visible").transition({ x: minus*(-windowWidth + countryOffset), y: 0, opacity: 1 }, longerDuration, "easeInOutQuint");	
		
		if($("#overlay").length)
			$("#overlay").find(".content").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
		else
			$("#scroller").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
		
		if($("#inline-clone").length)
			$("#inline-clone").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
		
		$("#nav-gradient").transition({ opacity: 1 }, longerDuration, "easeInOutQuint");
	});
	
	$(document).on("click", "#close-arrow", closeCountries);
	
	transitionSite = function(targetHref){
		$("body").addClass("loading site-transition");
					
		$('<div></div>').load(targetHref + " #ajax", { ajax: 1 }, function(response, status){ 
		    
		    if(status !== "error")
			{
			    var $ajaxContent = $(this).children();
			    
			    var oldSiteType = siteType;
			    
			    if(siteType == "local")
			    {
			    	siteType = "international";
					minus = 1;
			    }
			    else
			    {
			    	siteType = "local";
					minus = -1;
			    }
			    
			    var $newContent = $ajaxContent.find("#"+ siteType +"-content").addClass("opacity-zero");
			    var $newNav = $ajaxContent.find("#"+ siteType +"-nav").addClass("opacity-zero");
			    				    
			    var targetTitle = $ajaxContent.find("#scroller").data("meta-title");
			    
			    $("#"+ oldSiteType +"-content").replaceWith($newContent);
				$("#"+ oldSiteType +"-nav").replaceWith($newNav);
								    
			    // Init new content
			    
			    addTargetBlank();
			    
			    $("#scroller, #scroller .scroll-container").off("scroll scrollend");
			    $("#scroller").bindScroll();
			    
			    if(isIE8)
				{
					fixIE8();
				}
				
				imgPadding();
			    
				doIsotope();
				
				$("#scroller").find(".slider").each(function(){
					var $slider = $(this);
					$slider.initSlider();
				});
				
				$("#scroller").initVideos();
				$("#scroller").loadImages();
				
				handleResize(false);				    

			    if(Modernizr.history && !ToGo)
				    updateHistory(targetHref, targetTitle, false, false);
			    
			    $("body").attr("class", siteType);
			    
			    setTimeout(function(){
				    $("#scroller").addClass("opacity-zero");
				    
				    $("#"+ siteType +"-content").removeClass("opacity-zero").transition({ x: minus*(-windowWidth + menuOffset), y: 0}, 0).transition({ x: 0, y: 0 }, longerDuration, "easeInOutQuint", function(){
					    
					    $("#scroller, #"+ siteType +"-nav").transition({ opacity: 1 }, 1000, easeInOut).promise().done(function(){
							$("#scroller, #"+ siteType +"-nav, #"+ siteType +"-content, #nav-gradient, #close-arrow, #country-nav").removeClass("opacity-zero").removeAttr("style");
							
							$("#scroller").find(".grid-container").initInfinite();
					
							Waypoint.refreshAll();
						});
				    });
				    
				    $("#nav-gradient").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
					
					noScroller = false;
					ajaxInProgress = false;
				}, 150);
			}
			else
			{
				window.location.href = targetHref;
			}
		});
	}

	$(document).on("click", "#go-international", function(e){
		e.preventDefault();
		
		if(e.originalEvent)
   		{
			human = true;
		}

		var targetHref = $(this).attr("href");
		
		$("#"+ siteType +"-content").transition({ x: minus*(-windowWidth + menuOffset), y: 0}, longerDuration, "easeInOutQuint").promise().done(function(){			
			transitionSite(targetHref);
		});
		
		$("#"+ siteType +"-nav").transition({ x: minus*(-windowWidth + menuOffset), y: 0, opacity: 0 }, longerDuration, "easeInOutQuint");	
		
		if($("#overlay").length)
			$("#overlay").find(".content").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
		else
			$("#scroller").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
		
		$("#nav-gradient").transition({ opacity: 1 }, longerDuration, "easeInOutQuint");
	});
	
	$(document).on("click", "#country-scroller a", function(e){
		if(($(this).hasClass("intsite"))){
			e.preventDefault();
			window.location.href = 'http://www.elitemodellook.com/int/en/home/index.htm';
		}else{
			if(windowWidth >= 1024 && !($(this).attr("rel") == "external")){
				e.preventDefault();
				
				if(e.originalEvent)
		   		{
					human = true;
				}
		
				var targetHref = $(this).attr("href");

				$("html").removeClass("country-selector-visible");
			
				$("#country-nav").transition({ opacity: 0 }, longerDuration, "easeInOutQuint");
				
				$("#"+ siteType +"-content").transition({ x: minus*(-windowWidth + menuOffset), y: 0}, longerDuration, "easeInOutQuint").promise().done(function(){		
					
					transitionSite(targetHref);
				});
			}
		} 
	});

	
	/* Mobile menu */
	
	$(document).on("click", "#hamburger", function(e){
		e.preventDefault();
		
		var $burger = $(this);
		
		if($burger.is(".closeburger"))
		{
			$("html").removeClass("mobile-menu-open");
			$burger.removeClass("closeburger");
			$("#"+ siteType +"-content").transition({ x: 0, y: 0 }, normalDuration, "easeInOutQuint");
			$("#nav-gradient").transition({ opacity: 0 }, normalDuration, "easeInOutQuint");
		
			if($("#navigation").is(".countries-open"))
			{
				$("#mobile-language-chooser, #mobile-menu-back").css("visibility", "visible").transition({ opacity: 1 }, normalDuration, "easeInOutQuint", function(){
					$("#country-nav, #mobile-country-selector, #mobile-language-chooser, #mobile-menu-back, #"+ siteType +"-nav").removeAttr("style");
				});
				$("#country-nav, #mobile-menu-back").transition({ opacity: 0 }, normalDuration, "easeInOutQuint");
			}
			
			if($("#navigation").is(".newsletter-open"))
			{
				$("#mobile-language-chooser, #mobile-newsletter-back").css("visibility", "visible").transition({ opacity: 1 }, normalDuration, "easeInOutQuint", function(){
					$("#country-nav, #mobile-country-selector, #mobile-language-chooser, #mobile-menu-back, #"+ siteType +"-nav, #mobile-newsletter-toggle, #mobile-newsletter").removeAttr("style");
				});
				$("#mobile-newsletter-back, #mobile-newsletter").transition({ opacity: 0 }, normalDuration, "easeInOutQuint");
			}
		}
		else
		{
			$("html").addClass("mobile-menu-open");
			$burger.addClass("closeburger");
			$("#"+ siteType +"-content").transition({ x: 0, y: windowHeight}, normalDuration, "easeInOutQuint");
			$("#nav-gradient").transition({ opacity: 1 }, normalDuration, "easeInOutQuint");
		}
	});
	
	mobileOpenCountries = function(){
		$("#navigation").addClass("countries-open");
		
		$("#"+ siteType +"-nav").transition({ x: -minus*windowWidth, y: 0, opacity: 0 }, normalDuration, "easeInOutQuint");
		$("#country-nav").transition({ x: -minus*windowWidth, y: 0, opacity: 1 }, normalDuration, "easeInOutQuint");
		$("#mobile-country-selector, #mobile-language-chooser, #mobile-newsletter-toggle").transition({ opacity: 0 }, normalDuration, "easeInOutQuint").promise().done(function(){
			$("#mobile-country-selector, #mobile-language-chooser, #mobile-newsletter-toggle").css("visibility",  "hidden");
		});
		$("#mobile-menu-back").attr("style", "visibility: visible").transition({ opacity: 1 }, 1.5*normalDuration, "easeInOutQuint");
	}
	
	mobileCloseCountries = function(){		
		$("#"+ siteType +"-nav").transition({ x: 0, y: 0, opacity: 1 }, normalDuration, "easeInOutQuint");
		$("#country-nav").transition({ x: 0, y: 0, opacity: 0 }, normalDuration, "easeInOutQuint");
		$("#mobile-country-selector, #mobile-language-chooser, #mobile-newsletter-toggle").css("visibility", "visible").transition({ opacity: 1 }, normalDuration, "easeInOutQuint").promise().done(function(){
			$("#mobile-country-selector, #mobile-language-chooser, #mobile-menu-back, #mobile-newsletter-toggle").removeAttr("style");
			$("#navigation").removeClass("countries-open");
		});
		$("#mobile-menu-back").transition({ opacity: 0 }, 0.5*normalDuration, "easeInOutQuint");
	}
	
	$(document).on("click", "#mobile-country-selector", function(e){
		e.preventDefault();
	
		mobileOpenCountries();
	});
	
	$(document).on("click", "#mobile-menu-back", function(e){
		e.preventDefault();
	
		mobileCloseCountries();
	});
	
	
	/* Related height fix */
	
	fixRelated = function(){
		var maxRatio = 0;
		
		$("#related").find("img").each(function(){
			var $img = $(this);
			maxRatio = Math.max(maxRatio, $img.attr("height")/$img.attr("width")*100)
		});
		
		$("#related").find(".equal-height").attr("style", "padding-bottom: "+ maxRatio + "%");
	}
	
	if($("#related").length)
		fixRelated();
	
	
	/* Newsletter */
	
	// Popup
	
	if(!Cookies.get('hide-newsletter'))
		$("html").addClass("show-newsletter");
	
	closeNewsletterPopup = function(){
		Cookies.set('hide-newsletter', true, { expires: 7 });
		
		$("#newsletter-popup").transition({ y: $("#newsletter-popup").outerHeight() + 30 }, normalDuration, "easeInOutQuint", function(){
			$("html").removeClass("show-newsletter");
		});
		
	}
	
	$("#newsletter-popup-form").on("submit", function(e){
		e.preventDefault();
		
		// Add newsletter submission actions here
		var email = $('#newsletter-popup-form #emailSubscriber').val();
		var country = $(location).prop('pathname').split('/')[1];
		json = {
			'action': 'addSubscriber',
			'email': email,
			'country': country
		};
		
		$.ajax({
			url : '/service.app',
			type : 'POST',
			data : json,
			dataType : 'text',
			success : function(a) {
				// Closes newsletter popup
				closeNewsletterPopup();
			},
			error : function(a) {
				shake('#newsletter-popup-form');
			}
		});
		
	});
	
	$("#newsletter-close").on("click", closeNewsletterPopup);
	
	// Mobile
	
	mobileOpenNewsletter = function(){
		$("#navigation").addClass("newsletter-open");
		
		$("#"+ siteType +"-nav").transition({ x: windowWidth, y: 0, opacity: 0 }, normalDuration, "easeInOutQuint");
		$("#mobile-newsletter").transition({ x: windowWidth, y: 0, opacity: 1 }, normalDuration, "easeInOutQuint");
		$("#mobile-country-selector, #mobile-language-chooser, #mobile-newsletter-toggle").transition({ opacity: 0 }, normalDuration, "easeInOutQuint").promise().done(function(){
			$("#mobile-country-selector, #mobile-language-chooser, #mobile-newsletter-toggle").css("visibility",  "hidden");
		});
		$("#mobile-newsletter-back").attr("style", "visibility: visible").transition({ opacity: 1 }, 1.5*normalDuration, "easeInOutQuint");
	}
	
	mobileCloseNewsletter = function(){		
		$("#"+ siteType +"-nav").transition({ x: 0, y: 0, opacity: 1 }, normalDuration, "easeInOutQuint");
		$("#mobile-newsletter").transition({ x: 0, y: 0, opacity: 0 }, normalDuration, "easeInOutQuint");
		$("#mobile-country-selector, #mobile-language-chooser, #mobile-newsletter-toggle").css("visibility", "visible").transition({ opacity: 1 }, normalDuration, "easeInOutQuint").promise().done(function(){
			$("#mobile-country-selector, #mobile-language-chooser, #mobile-newsletter-back, #mobile-newsletter-toggle, #mobile-newsletter").removeAttr("style");
			$("#navigation").removeClass("newsletter-open");
			$("#mobile-newsletter").find("input").eq(0).val("");
		});
		$("#mobile-newsletter-back").transition({ opacity: 0 }, 0.5*normalDuration, "easeInOutQuint");
	}
	
	$("#newsletter-mobile-form").on("submit", function(e){
		e.preventDefault();
		
		// Add newsletter submission actions here
		var email = $('#newsletter-mobile-form #mobileEmailSubscriber').val();
		var country = $(location).prop('pathname').split('/')[1];
		json = {
			'action': 'addSubscriber',
			'email': email,
			'country': country
		};
		
		$.ajax({
			url : '/service.app',
			type : 'POST',
			data : json,
			dataType : 'text',
			success : function(a) {
				// Closes newsletter popup
				
				mobileCloseNewsletter();
			},
			error : function(a) {
				shake('#newsletter-mobile-form');
			}
		});
		
		
		
	});
	
	$("#mobile-newsletter-toggle").on("click", mobileOpenNewsletter);
	
	$("#mobile-newsletter-back").on("click", mobileCloseNewsletter);
	
	
	
	/* MAP */
	
	// Maps vars
	
	var contactMap;
	var eliteIcon = new google.maps.MarkerImage("/ui/connoisseur/css/images/elite-marker.svg", null, null, null, new google.maps.Size(26,26));

	var mapLat;
	var mapLng;

	// Homepage map
	
	initContactMap = function(nearest){
		
		mapLat = $("#map").attr("data-lat");
		mapLng = $("#map").attr("data-lng");
		
		contactMap = new GMaps({
			div: '#map',
			lat: mapLat,
			lng: mapLng,
			zoom: 17,
			mapTypeControl: false,
			overviewMapControl: false,
			panControl: false,
			scaleControl: false,
			streetViewControl: false,
			scrollwheel: false,
			draggable: false,
			disableDoubleClickZoom: true,
			zoomControl: false,
			styles: [
			  {
			    "featureType": "road",
			    "elementType": "geometry.fill",
			    "stylers": [
			      { "color": "#9b9b9b" }
			    ]
			  },{
			    "featureType": "road.highway",
			    "elementType": "geometry.fill",
			    "stylers": [
			      { "weight": 4 }
			    ]
			  },{
			    "featureType": "road.arterial",
			    "elementType": "geometry.fill",
			    "stylers": [
			      { "weight": 2 }
			    ]
			  },{
			    "featureType": "road.local",
			    "stylers": [
			      { "weight": 2 }
			    ]
			  },{
			    "featureType": "road",
			    "elementType": "geometry.stroke",
			    "stylers": [
			      { "visibility": "off" }
			    ]
			  },{
			    "featureType": "road",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      { "color": "#111111" }
			    ]
			  },{
			    "featureType": "road",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      { "color": "#d2d2d2" },
			      { "weight": 2 }
			    ]
			  },{
			    "featureType": "landscape.natural",
			    "stylers": [
			      { "color": "#d2d2d2" }
			    ]
			  },{
			    "featureType": "water",
			    "elementType": "geometry",
			    "stylers": [
			      { "color": "#276add" }
			    ]
			  },{
			    "featureType": "water",
			    "elementType": "labels",
			    "stylers": [
			      { "visibility": "off" }
			    ]
			  },{
			    "stylers": [
			      { "visibility": "off" }
			    ]
			  },{
			    "featureType": "road",
			    "elementType": "geometry.fill",
			    "stylers": [
			      { "visibility": "on" }
			    ]
			  },{
			    "featureType": "road",
			    "elementType": "labels",
			    "stylers": [
			      { "visibility": "on" }
			    ]
			  },{
			    "featureType": "transit.station.rail",
			    "stylers": [
			      { "visibility": "on" }
			    ]
			  },{
			    "featureType": "water",
			    "elementType": "geometry.fill",
			    "stylers": [
			      { "visibility": "on" }
			    ]
			  },{
			    "featureType": "transit.station",
			    "elementType": "labels.icon",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			  },{
			    "featureType": "transit.station",
			    "elementType": "labels.text.fill",
			    "stylers": [
			      { "color": "#111111" }
			    ]
			  },{
			    "featureType": "transit.station",
			    "elementType": "labels.text.stroke",
			    "stylers": [
			      { "color": "#d2d2d2" },
			      { "weight": 2 }
			    ]
			  }
			]
	    });
	    
	    var eliteMarker = contactMap.createMarker({
		  lat: mapLat,
		  lng: mapLng,
		  icon: eliteIcon,
		  optimized: false,
		  shadow: null
		});
	    
	    contactMap.addMarker(eliteMarker);	
	}
	
	if($("#map").length)
	{
		initContactMap();
    }
	
	if(!Modernizr.mousehover)
		FastClick.attach(document.body);
	
});

$(window).load(function(){
	
	Waypoint.refreshAll();
	pageLoaded = true;
	
});


function shake(div){                                                                                                                                                                                            
    var interval = 100;                                                                                                 
    var distance = 10;                                                                                                  
    var times = 4;                                                                                                      
    
    $(div).css('position','relative');                                                                                  

    for(var iter=0;iter<(times+1);iter++){                                                                              
        $(div).animate({ 
            left:((iter%2==0 ? distance : distance*-1))
            },interval);                                   
    }//for                                                                                                              

    $(div).animate({ left: 0},interval);                                                                                

}//shake        