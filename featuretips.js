/*
 * Feature Tips
 * Written by Billy Bastardi
 */
;(function($) {

  // Default settings
  var settings = {
    namespace : 'featuretips', // Changing this will remove (featuretip.css) styling
    sequencedTips : true, // Display the tooltips in a sequence
                          // Note: (invoked by dismissale of a previous tip)

    overlay : { // Overlay styling
      enabled : true,
      color : '#000',
      opacity : 0.7,
      zIndex : 999
    },

    arrows : {
      enabled : false,
      position : null
    },

    // Collection of our "feature tips"
    tips : [],

    // Used for sanitization and incomplete tips
    tipBluePrint : {
      title : '',
      body : '',
      triggerEventType : null,
      triggerOnElement : null,
      position : {
        my : 'center',
        at : 'center',
        of : window,
        collision : 'fit'
      }
    }
  };

  // Declare our plugin behaviors
  var methods = {

    // Initializer
    init : function(options) {
      $.extend(settings, options);

      return this.each(function() {
        methods.showOverlay();
        methods.createAllTips();
      });
    },

    // Display an overlay over the site but under the Tips
    showOverlay : function() {
      if (settings.overlay.enabled) {
        $(document.body).append('<div id="' + settings.namespace + '-overlay"></div>');

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

    /*
     * Introduce a Tip to the DOM
     * @param tip {object} tip settings (e.g. title, content, etc)
     * @param lastTip {boolean} true or false (e.g. is the tip the last of a sequence)
     */
    createTip : function(tip, lastTip) {
      var $tipContainer = $('<div class="' + settings.namespace + '-container"></div>'),
          $tipTitle = '<h1 class="' + settings.namespace + '-title">' + tip.title + '</h1>',
          $tipBody = '<div class="' + settings.namespace + '-body">' + tip.body + ' </div>';
          if (lastTip) {
            $tipDismiss = '<span class="dismiss end">Dismiss</span>';
          } else {
            $tipDismiss = '<span class="dismiss next">Next</span>';
          }
          $tipClose = '<span class="dismiss close">X</span>';

      $tipContainer
        .append($tipClose + $tipTitle + $tipBody + $tipDismiss)
        .data('tipData', tip)
        .css({
          zIndex : settings.overlay.zIndex + 1,
          display : 'none',
          position : 'absolute'
        });

      $(document.body).append($tipContainer);
    },

    // Create all the Tips based on the Collection
    createAllTips : function() {
      var self = this;

      if (settings.sequencedTips) {
        $.each(settings.tips, function(index) {
          var sanitizedTip = $.extend(true, {}, settings.tipBluePrint, this),
              lastTip = index == settings.tips.length - 1;
              
          self.createTip(sanitizedTip, lastTip);
        });

        this.bindDismissTips();
        this.showTip($('.' + settings.namespace + '-container').first());
      }
    },

    /*
     * Show and position the tip
     * @param $tipContainer {jQueryObject} the tips to show
     */
    showTip : function($tipContainer) {
      var tipData = $tipContainer.data('tipData');
      $tipContainer.position(tipData.position).fadeIn();
    },

    /*
     * Hide the tip and unbind any traces of it
     * @param $tipContainer {jQueryObject} the tip to hide
     */
    hideTip : function($tipContainer) {
      $tipContainer.fadeOut();
      this.unbindRepositionTip();
    },

    bindRepositionTip : function() {
      // Handle browser resizing
    },

    unbindRepositionTip : function() {

    },

    // Handle the user interaction with the Tip
    bindDismissTips : function() {
      var self = this;

      $(document).delegate('.' + settings.namespace + '-container .dismiss', 'click', function(e) {
        e.stopPropagation();

        var $containers = $('.' + settings.namespace + '-container'),
            $nextTip = $($containers.get($containers.index($(this).parent())+1));

        self.hideTip($containers);

        // Continue through sequence if there are more tips
        if ($nextTip.length == 0) {
          self.unbindDismissTips();
          self.hideOverlay();
        } else {
          self.showTip($nextTip);
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
