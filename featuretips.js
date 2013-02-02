/**
 * Feature Tips jQuery Plugin
 * @author by Billy Bastardi (billy@wabism.com)
 *
 */
;(function($) {

  // Default settings
  var settings = {
    namespace : 'featuretips', // Changing this will remove (featuretip.css) styling
    style : 'default',
    showOnLoad : true,

    overlay : { // Overlay styling
      enabled : true,
      color : '#000',
      opacity : 0.7,
      zIndex : 999
    },

    arrows : {
      direction : 'up'
    },

    // Collection of our Tips
    tips : [],

    // Used for sanitization and incomplete tips
    tipBluePrint : {
      title : '',
      body : '',
      position : {
        my : 'center top',
        at : 'center bottom',
        of : window,
        collision : 'fit'
      },
      highlightElement : true
    }
  };

  var $TIPS_WRAPPER;

  // Declare our Plugin behaviors
  var methods = {

    // Initializer
    init : function(options) {
      $.extend(true, settings, options);

      return this.each(function() {
        $TIPS_WRAPPER = $(this);
        methods.createOverlay();
        methods.createAllTips();
      });
    },

    createOverlay : function() {
      if ($('#' + settings.namespace + '-overlay').length == 0) {
        $(document.body).append('<div id="' + settings.namespace + '-overlay"></div>');
      }
    },

    // Display an overlay over the site but under the Tips
    showOverlay : function() {
      if (settings.overlay.enabled) {
        $('#' + settings.namespace + '-overlay').css({
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor : settings.overlay.color,
          zIndex : settings.overlay.zIndex,
          opacity : settings.overlay.opacity
        });
      }
    },

    hideOverlay : function() {
      $('#' + settings.namespace + '-overlay').fadeOut();
    },

    /**
     * Introduce a Tip to the DOM
     * @param tip {object} tip settings (e.g. title, content, etc)
     * @param lastTip {boolean} true or false (e.g. is the tip the last of a sequence)
     */
    createTip : function(tip, lastTip) {
      var $tipContainer = $('<div class="' + settings.namespace + '-container ' + settings.style + '"></div>');
      var tipDismiss,
          tipTitle = '<h1 class="' + settings.namespace + '-title">' + tip.title + '</h1>',
          tipBody = '<div class="' + settings.namespace + '-body">' + tip.body + ' </div>',
          tipClose = '<span class="dismiss close">X</span>',
          tipArrow = '<span class="arrow arrow-' + settings.arrows.direction + '"></span>';

      if (lastTip) {
        tipDismiss = '<span class="dismiss end">Dismiss</span>';
      } else {
        tipDismiss = '<span class="dismiss next">Next</span>';
      }

      $tipContainer
        .append(tipClose + tipTitle + tipBody + tipDismiss + tipArrow)
        .data('tipData', tip)
        .css({
          zIndex : settings.overlay.zIndex + 1,
          display : 'none',
          position : 'absolute'
        });

      $TIPS_WRAPPER.append($tipContainer);
    },

    // Create all the Tips based on the Collection
    createAllTips : function() {
      $.each(settings.tips, function(index) {
        var sanitizedTip = $.extend(true, {}, settings.tipBluePrint, this),
            lastTip = index == settings.tips.length - 1;

        methods.createTip(sanitizedTip, lastTip);
      });

      methods.bindDismissTips.apply(this);

      if (settings.showOnLoad) {
        methods.showOverlay();
        methods.showTip($TIPS_WRAPPER.children().first());
      }
    },

    /**
     * Show and position the tip based on it's properties
     * @param $tipContainer {jQueryObject} the tips to show
     */
    showTip : function($tipContainer) {
      var tipData = $tipContainer.data('tipData');
      $tipContainer.position(tipData.position).fadeIn();
      $tipContainer.find('.arrow').position({
        my : 'center bottom',
        at : 'center bottom',
        of : tipData.position.of,
        offset : tipData.position.offset,
        collision : 'fit'
      });

      if (settings.highlightElement) {
        $(tipData.position.of).css('z-index', settings.overlay.zIndex + 1)
      }

      // Move the user to the tip
      setTimeout(function() {
        $('html,body').animate({
          scrollTop : $(tipData.position.of).offset().top - $(window).scrollTop()
        }, 'slow');
      }, 300);
    },

    /**
     * Hide the tip and unbind any traces of it
     * @param $tipContainer {jQueryObject} the tip to hide
     */
    hideTip : function($tipContainer) {
      $tipContainer.fadeOut();
    },

    // Handle the user interaction with the Tip
    bindDismissTips : function() {
      $TIPS_WRAPPER.delegate('.' + settings.namespace + '-container .dismiss', 'click', function(e) {
        e.stopPropagation();

        var $containers = $TIPS_WRAPPER.children(),
            $nextTip = $($containers.get($containers.index($(this).parent()) + 1));

        methods.hideTip($containers);

        // Continue through sequence if there are more tips
        if ($nextTip.length == 0) {
          methods.hideOverlay();
        } else {
          methods.showTip($nextTip);
        }
      });
    },

    // Unbind any event listener traces
    unbindDismissTips : function() {
      $(document).undelegate('.' + settings.namespace + '-container .dismiss', 'click');
    }
  };

  // Create our plugin namespace and methods controller
  $.fn.featureTips = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this,arguments);
    } else {
      $.error('Method ' + method + ' does not exist in Feature Tips!');
    }
  };

})(jQuery);
