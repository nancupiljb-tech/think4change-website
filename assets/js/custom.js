(function ($) {
	
	"use strict";

	// Page loading animation
	$(window).on('load', function() {

        $('#js-preloader').addClass('loaded');

    });


	// Hide the CEO quote masthead on scroll so only the header remains visible
	if ($('.ceo-masthead').length) {
		$(window).on('scroll', function() {
			if ($(window).scrollTop() > 40) {
				$('body').addClass('masthead-hidden');
			} else {
				$('body').removeClass('masthead-hidden');
			}
		});
	}


	// Crossfade slideshow for the intro block photo
	if ($('.intro-block-img').length) {
		var $introSlides = $('.intro-block-img img');
		var introSlideIndex = 0;

		if ($introSlides.length > 1) {
			setInterval(function() {
				$introSlides.eq(introSlideIndex).removeClass('is-active');
				introSlideIndex = (introSlideIndex + 1) % $introSlides.length;
				$introSlides.eq(introSlideIndex).addClass('is-active');
			}, 4000);
		}
	}


	// Rotate the gear graphic in "Nuestros valores" at a rate tied to how far/fast you scroll
	if ($('.bloque-valores-gear').length) {
		var $gearSection = $('.bloque-valores');
		var $gearIcon = $('.bloque-valores-gear i');
		var degreesPerPixel = 0.5;

		var updateGearRotation = function() {
			var sectionTop = $gearSection.offset().top;
			var scrollTop = $(window).scrollTop();

			var relativeScroll = Math.max(scrollTop - sectionTop, 0);
			var degrees = relativeScroll * degreesPerPixel;
			$gearIcon.css('transform', 'rotate(' + degrees + 'deg)');
		};

		$(window).on('scroll resize', updateGearRotation);
		updateGearRotation();
	}


	// Fade/slide each heading+paragraph block into view as it's scrolled to
	if ($('.valor-block').length) {
		var revealObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
				}
			});
		}, { threshold: 0.3 });

		document.querySelectorAll('.valor-block').forEach(function(block) {
			revealObserver.observe(block);
		});
	}


	// Slot-machine style scramble reveal for the stat values in "Nuestro trabajo"
	if (document.querySelector('.stat-square .value')) {
		var DIGIT_CHARS = '0123456789';
		var LETTER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		var randomCharLike = function(ch) {
			if (/[0-9]/.test(ch)) {
				return DIGIT_CHARS.charAt(Math.floor(Math.random() * DIGIT_CHARS.length));
			}
			if (/[a-zA-Z]/.test(ch)) {
				var random = LETTER_CHARS.charAt(Math.floor(Math.random() * LETTER_CHARS.length));
				return ch === ch.toLowerCase() ? random.toLowerCase() : random;
			}
			return ch;
		};

		var runSlotEffect = function(el) {
			var finalText = el.textContent;
			var perCharDelay = 60;
			var scrambleInterval = 40;
			var settleStart = 200;
			var settled = new Array(finalText.length).fill(false);

			var intervalId = setInterval(function() {
				var display = '';
				for (var i = 0; i < finalText.length; i++) {
					display += settled[i] ? finalText[i] : randomCharLike(finalText[i]);
				}
				el.textContent = display;
			}, scrambleInterval);

			for (var i = 0; i < finalText.length; i++) {
				(function(index) {
					setTimeout(function() {
						settled[index] = true;
					}, settleStart + index * perCharDelay);
				})(i);
			}

			setTimeout(function() {
				clearInterval(intervalId);
				el.textContent = finalText;
			}, settleStart + finalText.length * perCharDelay + scrambleInterval);
		};

		var slotObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					runSlotEffect(entry.target);
					slotObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.5 });

		document.querySelectorAll('.stat-square .value').forEach(function(el) {
			slotObserver.observe(el);
		});
	}

	var $bannerCarousel = $('.owl-banner');

	function syncBannerVideo() {
		var $video = $('#banner-video');
		if (!$video.length) {
			return;
		}

		var showVideo = $bannerCarousel.find('.owl-item.active .item.item-1').length > 0;

		if (showVideo) {
			$video.addClass('is-active');
			var video = $video.get(0);
			if (video.paused) {
				video.play().catch(function() {});
			}
		} else {
			$video.removeClass('is-active');
			$video.get(0).pause();
		}
	}

	$bannerCarousel.on('initialized.owl.carousel translated.owl.carousel changed.owl.carousel', syncBannerVideo);

	$bannerCarousel.owlCarousel({
	  center: true,
      items:1,
      loop:true,
      nav: true,
	  dots:true,
	  autoplay: true,
	  autoplayTimeout: 5000,
	  autoplayHoverPause: true,
	  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      margin:30,
      responsive:{
        992:{
            items:1
        },
		1200:{
			items:1
		}
      }
	});

	syncBannerVideo();
	$(window).on('load', syncBannerVideo);

	var width = $(window).width();
		$(window).resize(function() {
		if (width > 767 && $(window).width() < 767) {
			location.reload();
		}
		else if (width < 767 && $(window).width() > 767) {
			location.reload();
		}
	})

	const elem = document.querySelector('.properties-box');
	const filtersElem = document.querySelector('.properties-filter');
	if (elem) {
		const rdn_events_list = new Isotope(elem, {
			itemSelector: '.properties-items',
			layoutMode: 'masonry'
		});
		if (filtersElem) {
			filtersElem.addEventListener('click', function(event) {
				if (!matchesSelector(event.target, 'a')) {
					return;
				}
				const filterValue = event.target.getAttribute('data-filter');
				rdn_events_list.arrange({
					filter: filterValue
				});
				filtersElem.querySelector('.is_active').classList.remove('is_active');
				event.target.classList.add('is_active');
				event.preventDefault();
			});
		}
	}


	// Mobile menu: slide-in sidebar
	var $mobileNav = $('.header-area .main-nav .nav');
	var $mobileNavOverlay = $('.mobile-nav-overlay');

	var closeMobileNav = function() {
		$('.menu-trigger').removeClass('active');
		$mobileNav.removeClass('is-open');
		$mobileNavOverlay.removeClass('is-open');
	};

	if ($('.menu-trigger').length) {
		$(".menu-trigger").on('click', function() {
			$(this).toggleClass('active');
			$mobileNav.toggleClass('is-open');
			$mobileNavOverlay.toggleClass('is-open');
		});
	}

	$mobileNavOverlay.on('click', closeMobileNav);

	$mobileNav.find('a').on('click', function() {
		closeMobileNav();
	});

	$(document).on('keydown', function(e) {
		if (e.key === 'Escape') {
			closeMobileNav();
		}
	});


	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					closeMobileNav();
				}
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});


	// Page loading animation
	$(window).on('load', function() {
		if($('.cover').length){
			$('.cover').parallax({
				imageSrc: $('.cover').data('image'),
				zIndex: '1'
			});
		}

		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});
    


})(window.jQuery);