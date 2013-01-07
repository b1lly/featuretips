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
    tips : [
      {
        title : 'First Tip',
        body : 'Feature tips give us the ability to create slick engagement tooltips!',
        triggerEventType : null,
        triggerOnElement : null,
        position : {
          my : 'left top',
          at : 'right bottom',
          of : '#top-left'
        }
      },
      {
        title : 'Second Feature',
        body : 'You can create a sequence of features that bind to DOM elements quickly and easily! Just pass the plugin a collection of tips!',
        triggerEventType : null,
        triggerOnElement : null,
        position : {
          my : 'right top',
          at : 'left bottom',
          of : '#top-right',
          collision : 'fit'
        }
      }
    ],

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

    init : function(options) {
      $.extend(settings, options);

      return this.each(function() {
        methods.showOverlay();
        methods.createAllTips();
      });
    },

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

    createTip : function(tip) {
      var $tipContainer = $('<div class="' + settings.namespace + '-container"></div>'),
          $tipTitle = '<h1 class="' + settings.namespace + '-title">' + tip.title + '</h1>',
          $tipBody = '<div class="' + settings.namespace + '-body">' + tip.body + ' </div>';
          $tipDismiss = '<span class="dismiss">Dismiss</span>';
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

    createAllTips : function() {
      var self = this;

      if (settings.sequencedTips) {
        $.each(settings.tips, function() {
          var sanitizedTip = $.extend(true, {}, settings.tipBluePrint, this);
          self.createTip(sanitizedTip);

          self.bindRepositionTip();
        });

        this.bindDismissTips();
        this.showTip($('.' + settings.namespace + '-container').first());
      }
    },

    showTip : function($tipContainer) {
      var tipData = $tipContainer.data('tipData');
      $tipContainer.position(tipData.position).fadeIn();
    },

    hideTip : function($tipContainer) {
      $tipContainer.fadeOut();
      this.unbindRepositionTip();
    },

    bindRepositionTip : function() {
      // Handle browser resizing
    },

    unbindRepositionTip : function() {

    },

    bindDismissTips : function() {
      var self = this;

      $(document).delegate('.' + settings.namespace + '-container .dismiss', 'click', function(e) {
        e.stopPropagation();

        var $containers = $('.' + settings.namespace + '-container'),
            $nextTip = $($containers.get($containers.index($(this).parent())+1));

        self.hideTip($containers);

        if ($nextTip.length == 0) {
          self.unbindDismissTips();
          self.hideOverlay();
        } else {
          self.showTip($nextTip);
        }
      });
    },

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
