"use strict";

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother, Flip);
  var body = document.querySelector("body");
  /**
   * Preloader
   */
  var preloader = document.querySelector(".preloader");
  window.addEventListener("load", function () {
    if (preloader) {
      setTimeout(function () {
        preloader.style.display = "none";
      }, 300);
    }
  });
  /**
   * Slide Up
   */
  var slideUp = function slideUp(target) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    if (!target) return;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.boxSizing = "border-box";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(function () {
      target.style.display = "none";
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  };
  /**
   * Slide Down
   */
  var slideDown = function slideDown(target) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    if (!target) return;
    target.style.removeProperty("display");
    var display = window.getComputedStyle(target).display;
    if (display === "none") display = "block";
    target.style.display = display;
    var height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(function () {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  };
  /**
   * Slide Toggle
   */
  var slideToggle = function slideToggle(target) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    if (!target) return;
    if (target.style === undefined || target.style.display === "none") {
      return slideDown(target, duration);
    }
    return slideUp(target, duration);
  };
  /**
   * Header Crossed
   */
  var scrollTimeout;
  window.addEventListener("scroll", function () {
    if (!body) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      var primaryHeader = document.querySelector(".primary-header");
      if (primaryHeader) {
        var primaryHeaderTop = primaryHeader.offsetHeight / 3;
        var scrolled = window.scrollY;
        if (scrolled > primaryHeaderTop) {
          body.classList.add("primary-header-crossed");
        } else {
          body.classList.remove("primary-header-crossed");
        }
      }
    }, 100);
  });
  /**
   * Primary Menu
   */
  var mdScreen = "(max-width: 991px)";
  var primaryHeader = document.querySelector(".primary-header");
  if (primaryHeader) {
    primaryHeader.addEventListener("click", function (e) {
      var target = e.target.closest(".has-sub-menu > a, .has-sub-2nd > a");
      if (!target) return;
      var isMobile = window.matchMedia(mdScreen).matches;
      if (isMobile) {
        e.preventDefault();
        e.stopPropagation();
        target.classList.toggle("active");
        var menuSub = target.nextElementSibling;
        if (menuSub) {
          slideToggle(menuSub, 500);
        }
      } else {
        if (!target.getAttribute("href") || target.getAttribute("href") === "#") {
          e.preventDefault();
        }
      }
    });
    window.matchMedia(mdScreen).addEventListener("change", function (e) {
      var subMenus = primaryHeader.querySelectorAll(".navigation-0__menu, .navigation-1__menu, .navigation-1__sub-menu");
      if (!subMenus.length) return;
      for (var i = 0; i < subMenus.length; i++) {
        var menu = subMenus[i];
        if (menu.style.display !== "none") {
          slideUp(menu, 0);
          var parentLink = menu.previousElementSibling;
          if (parentLink) {
            parentLink.classList.remove("active");
          }
        }
      }
    });
  }
  /**
   * Duplicate Scroller-X Item
   */
  var scrollerX = document.querySelectorAll(".scroller-x");
  function scrollerXDuplication(scroller) {
    if (scroller.dataset.duplicated === "true") return;
    var scrollerInner = scroller.querySelector(".scroller-x__list");
    if (!scrollerInner) return;
    var scrollerContent = Array.from(scrollerInner.children);
    if (!scrollerContent.length) return;
    var fragment = document.createDocumentFragment();
    scrollerContent.forEach(function (item) {
      var duplicateItem = item.cloneNode(true);
      fragment.appendChild(duplicateItem);
    });
    scrollerInner.appendChild(fragment);
    scroller.dataset.duplicated = "true";
  }
  scrollerX.forEach(function (scroller) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scrollerXDuplication(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0
    });
    observer.observe(scroller);
  });
  /**
   * Countdown Timer
   */
  function updateCountdown() {
    var countdownElements = document.querySelectorAll(".countdown");
    if (!countdownElements.length) return;
    function updateAll() {
      var currentDate = new Date().getTime();
      var activeCountdowns = false;
      countdownElements.forEach(function (countdown) {
        var targetDateStr = countdown.dataset.date;
        if (!targetDateStr) {
          console.error("Error: Target date not specified in the data-date attribute.");
          return;
        }
        var targetDate = new Date(targetDateStr).getTime();
        if (isNaN(targetDate)) {
          console.error("Error: Invalid target date format.");
          return;
        }
        var timeDifference = targetDate - currentDate;
        if (timeDifference <= 0) {
          var _selectors = [{
            sel: ".days",
            val: "00"
          }, {
            sel: ".months",
            val: "00"
          }, {
            sel: ".hours",
            val: "00"
          }, {
            sel: ".minutes",
            val: "00"
          }, {
            sel: ".seconds",
            val: "00"
          }];
          _selectors.forEach(function (_ref) {
            var sel = _ref.sel,
              val = _ref.val;
            var element = countdown.querySelector(sel);
            if (element) element.innerText = val;
          });
          return;
        }
        activeCountdowns = true;
        var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
        var hours = Math.floor(timeDifference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.floor(timeDifference % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(timeDifference % (1000 * 60) / 1000);
        var selectors = [{
          sel: ".days",
          val: days.toString().padStart(2, "0")
        }, {
          sel: ".months",
          val: months.toString().padStart(2, "0")
        }, {
          sel: ".hours",
          val: hours.toString().padStart(2, "0")
        }, {
          sel: ".minutes",
          val: minutes.toString().padStart(2, "0")
        }, {
          sel: ".seconds",
          val: seconds.toString().padStart(2, "0")
        }];
        selectors.forEach(function (_ref2) {
          var sel = _ref2.sel,
            val = _ref2.val;
          var element = countdown.querySelector(sel);
          if (element) element.innerText = val;
        });
      });
      if (!activeCountdowns) {
        clearInterval(timer);
      }
    }
    updateAll();
    var timer = setInterval(updateAll, 1000);
  }
  // Initialize countdown timer
  updateCountdown();
  /**
   * Initialize ScrollSmoother
   */
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    effects: true,
    normalizeScroll: true,
    smoothTouch: 0.1
  });
  /**
   * Animation
   */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 1200px)", function () {
    function textAnimation() {
      var items = gsap.utils.toArray(".gsap-text-animation");
      if (!items.length) return;
      var _loop = function _loop() {
          var item = items[i];
          var scrollTriggerSupport = item.dataset.scrollTrigger;
          var animationStart = item.dataset.start || "85%";
          var animationEnd = item.dataset.end || "25%";
          var animationStagger = item.dataset.stagger || "0.05";
          var animationDuration = item.dataset.duration || "1";
          var animationDelay = item.dataset.delay || "0";
          var animationY = item.dataset.y || "50";
          var animationOpacity = item.dataset.opacity || "0";
          var splitType = item.dataset.splitType || "chars";
          var scrollMarker = item.dataset.markers || false;
          var textSplit = new SplitText(item, {
            type: splitType
          });
          var itemsToAnimate;
          if (splitType === "chars") {
            itemsToAnimate = textSplit.chars;
          } else if (splitType === "words") {
            itemsToAnimate = textSplit.words;
          } else if (splitType === "lines") {
            itemsToAnimate = textSplit.lines;
          } else {
            console.error("Invalid split type:", splitType);
            return 0; // continue
          }
          if (!itemsToAnimate.length) {
            textSplit.revert();
            return 0; // continue
          }
          var tl = scrollTriggerSupport ? gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "clamp(top ".concat(animationStart, ")"),
              end: "clamp(bottom ".concat(animationEnd, ")"),
              markers: scrollMarker,
              once: true
            }
          }) : gsap.timeline();
          tl.from(itemsToAnimate, {
            opacity: parseFloat(animationOpacity),
            delay: parseFloat(animationDelay),
            yPercent: parseFloat(animationY),
            duration: parseFloat(animationDuration),
            stagger: parseFloat(animationStagger),
            ease: "back.out",
            onComplete: function onComplete() {
              textSplit.revert();
            }
          });
        },
        _ret;
      for (var i = 0; i < items.length; i++) {
        _ret = _loop();
        if (_ret === 0) continue;
      }
    }
    function imageRevealAnimation() {
      var imageContainers = gsap.utils.toArray(".gsap-image-reveal");
      if (!imageContainers.length) return;
      for (var i = 0; i < imageContainers.length; i++) {
        var image = imageContainers[i];
        var revealImage = image.querySelector("img");
        if (!revealImage) continue;
        var scrollTriggerSupport = image.dataset.scrollTrigger;
        var animationStart = image.dataset.start || "85%";
        var animationEnd = image.dataset.end || "25%";
        var scrollMarker = image.dataset.markers || false;
        var tl = scrollTriggerSupport ? gsap.timeline({
          scrollTrigger: {
            trigger: image,
            start: "clamp(top ".concat(animationStart, ")"),
            end: "clamp(bottom ".concat(animationEnd, ")"),
            markers: scrollMarker,
            once: true
          }
        }) : gsap.timeline();
        tl.set(image, {
          autoAlpha: 1
        });
        tl.from(image, {
          xPercent: -100,
          duration: 1.5,
          ease: "power2.out"
        });
        tl.from(revealImage, {
          xPercent: 100,
          ease: "power2.out",
          scale: 1.5,
          duration: 1.5,
          delay: -1.5
        });
      }
    }
    function fadeInAnimation() {
      var fadeIn = gsap.utils.toArray(".gsap-fade-in");
      if (!fadeIn.length) return;
      for (var i = 0; i < fadeIn.length; i++) {
        var item = fadeIn[i];
        var scrollTriggerSupport = item.dataset.scrollTrigger;
        var animationStart = item.dataset.start || "85%";
        var animationEnd = item.dataset.end || "25%";
        var animationStagger = item.dataset.stagger || "0";
        var animationDuration = item.dataset.duration || "1";
        var animationDelay = item.dataset.delay || "0";
        var animationY = item.dataset.y || "0";
        var animationX = item.dataset.x || "0";
        var animationOpacity = item.dataset.opacity || "0";
        var scrollMarker = item.dataset.markers || false;
        var tl = scrollTriggerSupport ? gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "clamp(top ".concat(animationStart, ")"),
            end: "clamp(bottom ".concat(animationEnd, ")"),
            markers: scrollMarker,
            once: true
          }
        }) : gsap.timeline();
        tl.from(item, {
          opacity: parseFloat(animationOpacity),
          yPercent: parseFloat(animationY),
          xPercent: parseFloat(animationX),
          delay: parseFloat(animationDelay),
          stagger: parseFloat(animationStagger),
          duration: parseFloat(animationDuration),
          ease: "back.out"
        });
      }
    }
    function zoomAnimation() {
      var zoomAnimation = gsap.utils.toArray(".gsap-zoom");
      if (!zoomAnimation.length) return;
      for (var i = 0; i < zoomAnimation.length; i++) {
        var item = zoomAnimation[i];
        var scrollTriggerSupport = item.dataset.scrollTrigger;
        var animationStart = item.dataset.start || "85%";
        var animationEnd = item.dataset.end || "25%";
        var animationOpacity = item.dataset.opacity || "1";
        var animationScale = item.dataset.scale || "1";
        var animationScrub = item.dataset.scrub || false;
        var tl = scrollTriggerSupport ? gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "clamp(top ".concat(animationStart, ")"),
            end: "clamp(bottom ".concat(animationEnd, ")"),
            scrub: parseFloat(animationScrub),
            once: true
          }
        }) : gsap.timeline();
        tl.from(item, {
          opacity: parseFloat(animationOpacity),
          scale: parseFloat(animationScale)
        });
      }
    }
    function rocketLaunch() {
      var rocketLaunch = document.querySelector(".road-map-section-1__element--1");
      if (rocketLaunch) {
        var startY = 0;
        var endY = 1200;
        ScrollTrigger.create({
          trigger: rocketLaunch,
          start: "top 75%",
          end: "bottom -25%",
          scrub: true,
          onUpdate: function onUpdate(self) {
            var progress = self.progress;
            var interpolatedY = startY + (endY - startY) * progress;
            rocketLaunch.style.top = "".concat(interpolatedY, "px");
          }
        });
      }
    }
    function herothree() {
      var heroThree = document.querySelector(".hero-3");
      if (heroThree) {
        // Set initial CSS custom properties for pseudo-elements
        heroThree.style.setProperty("--before-opacity", 0);
        heroThree.style.setProperty("--after-opacity", 0);

        // Animate the custom properties using GSAP
        gsap.to(heroThree, {
          "--before-opacity": 1,
          duration: 1.5,
          delay: 4.5
        });
        gsap.to(heroThree, {
          "--after-opacity": 1,
          duration: 1.5,
          delay: 4
        });
      }
    }
    herothree();
    rocketLaunch();
    imageRevealAnimation();
    fadeInAnimation();
    zoomAnimation();
    document.fonts.ready.then(function () {
      textAnimation();
    })["catch"](function (error) {
      console.error("Font loading failed:", error);
      textAnimation();
    });
  });
});