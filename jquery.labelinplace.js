
;(function ( $, window, document, undefined ) {

    var pluginName = "labelinplace",
        defaults = {
            labelPosition: "up",
            classPlaceholder: "mypaceholder",
            classLabel: "mylabel",
            classIcon: "myicon",
            wrapperClass: "mygroup",
            animSpeed: 200,
            labelArrowDown: null, 
            labelArrowUp: null, 
            labelArrowRight: null, 
            labelIconPosition: "append",
            inputAttr: "name",
			forceAlign: null

        };


    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            var elment = this.element
            var settings = this.options



                 $(elment).each(function () {
                      var inputLabel = $("label[for='" + $(this).attr(settings.inputAttr) + "']");


                      var spaceTop = parseInt($(this).css("border-top-width")) + parseInt($(this).css("padding-top"));
                      var spaceLeft = parseInt($(this).css("border-left-width")) +  parseInt($(this).css("padding-left"));
                      var spaceBottom = parseInt($(this).css("border-bottom-width")) + parseInt($(this).css("padding-bottom"));
                      
                      
                      


                    $(this).attr({
                        "data-height": $(this).outerHeight(),
                        "data-width": $(this).outerWidth(),
                        "data-spaceTop": spaceTop,
                        "data-spaceBottom": spaceBottom
                    });

					 
					 

                    //if there is an icon
                    switch (settings.labelIconPosition) {
                        case "after":
                            if (settings.labelArrowRight) inputLabel.append("<span class=\"" + settings.classIcon + "\">" + settings.labelArrowRight + "</span>") 
                              break;


                          default: //before
                        if (settings.labelArrowRight) inputLabel.prepend("<span class=\"" + settings.classIcon + "\">" + settings.labelArrowRight + "</span>") 
                      }


    
                      $(this).removeAttr("placeholder");
					 
					 // Support for text-align - BLooperZ
					 
					 var align;
					 if ($(this).css('textAlign') == "left" || $(this).css('textAlign') == "right")
					 {
						 align = $(this).css('textAlign');
					 }
					 else 
					 {
						 if ($(this).css('direction') == "rtl")
						 {
							 align = "right";
						 }
						 else 
						 {
							 align = "left";
						 }
					 }
					 
				if (settings.forceAlign) {align = settings.forceAlign;} 


                      inputLabel.css("position", "absolute").css("top", spaceTop + "px").css(align, spaceLeft + "px").addClass(settings.classPlaceholder);
                      if ($(elment).val()) inputLabel.hide();

                      $(this).prev("label").andSelf().wrapAll('<div class="' + settings.wrapperClass + '"/>');


                  });


                  $(elment).focus(function () {

                          var focusLabel = $("label[for='" + $(this).attr(settings.inputAttr) + "']");
                          var inputHeight = parseInt($(this).outerHeight());
                          var labelHeight = parseInt(focusLabel.outerHeight());
                          var paddingTop = parseInt($(this).css("padding-top"));


                          
                          switch (settings.labelPosition) {
                              case "down":
                                   focusLabel.animate({ top: inputHeight }, settings.animSpeed/5, function () {
                                    if ((settings.labelArrowUp) && (settings.labelArrowRight)) focusLabel.find("." + settings.classIcon).html(settings.labelArrowUp); 

                                  });
                                 $(this).animate({ height: inputHeight + labelHeight + paddingTop, "padding-bottom": labelHeight + paddingTop + "px" }, settings.animSpeed, function () {
                                      if (focusLabel.is(":hidden")) focusLabel.show();
                                      focusLabel.removeClass(settings.classPlaceholder).addClass(settings.classLabel);
                                  });

                                  break;


                              default: //up
                                  $(this).animate({ height: inputHeight + labelHeight + paddingTop, "padding-top": labelHeight + paddingTop + "px" }, settings.animSpeed, function () {
                                      if (focusLabel.is(":hidden")) focusLabel.show();
                                      focusLabel.removeClass(settings.classPlaceholder).addClass(settings.classLabel);
                                        if ((settings.labelArrowDown) && (settings.labelArrowRight)) focusLabel.find("." + settings.classIcon).html(settings.labelArrowDown); 


                                  });
                          }



                  });

               //BLooperZ replaced blur order

                 $(elment).blur(function () {

                      var focusLabel = $("label[for='" + $(this).attr(settings.inputAttr) + "']");

                      var inputHeight = $(this).attr("data-height");
                      var paddingTop = parseInt($(this).attr("data-spaceTop"));
                      var paddingBottom = parseInt($(this).attr("data-spaceBottom"));


                      switch (settings.labelPosition) {

                          case "down":

                              if ($(this).val() != "") {
                                  focusLabel.hide();
                              } else {
								  

								  if ((settings.labelArrowUp) && (settings.labelArrowRight)) {
									  focusLabel.find("." + settings.classIcon).html(settings.labelArrowRight); 
								  }

                                  focusLabel.animate({ top: paddingTop }, settings.animSpeed/4).removeClass(settings.classLabel).addClass(settings.classPlaceholder);
                              }
							  $(this).animate({ height: inputHeight, "padding-bottom": paddingBottom + "px" }, settings.animSpeed);
                              break;

                          default: //up
							  

							  if ($(this).val() != "") {
								  focusLabel.hide();
							  } else {
								  focusLabel.removeClass(settings.classLabel).addClass(settings.classPlaceholder);
								  if ((settings.labelArrowDown) && (settings.labelArrowRight)) {
									  focusLabel.find("." + settings.classIcon).html(settings.labelArrowRight); 
								  }
								  
							  }
							  
							  $(this).animate({height: inputHeight, "padding-top": paddingTop + "px" }, settings.animSpeed, function () { });

                      }


                  });


                    // trigger click on label 
//                  $("." + settings.wrapperClass).on( "click", "label." + settings.classPlaceholder, function() {

                  $("." + settings.wrapperClass).on( "click", "label." + settings.classPlaceholder, function() {
					  
                      var inputElement = $("." + settings.wrapperClass + " [" + settings.inputAttr + "=" + $(this).attr("for") + "]")
                      if (inputElement.not(':focus')) {
						  $(this).css('pointer-events', 'none');
                          inputElement.trigger( "focus" );
						  // console.log("[" + settings.inputAttr + "=" + $(this).attr("for") + "]")
                      } else {
					  		$(this).css('pointer-events', 'all')
					  };


                  });


        }

    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );

