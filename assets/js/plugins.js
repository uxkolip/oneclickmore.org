"use strict";
function toggleMobileMenu() {
    var menuIcon = jQuery('.main-menu-icon');
    jQuery(menuIcon).toggleClass('menu-opened');
    if(jQuery(menuIcon).hasClass('menu-opened')) {
        jQuery('#mainmenu').show(350);
    } else {
        jQuery('#mainmenu').hide(400);
    }
}

jQuery(document).ready(function() {

    // 2/3/4th level menu  offscreen fix
    var MainWindowWidth = jQuery(window).width();
    jQuery(window).resize(function(){
        MainWindowWidth = jQuery(window).width();
    });        
    jQuery('.sf-menu ul li').mouseover(function(){
        // checks if third level menu exist         
        var subMenuExist = jQuery(this).find('.nav-child').length;            
        if( subMenuExist > 0){
            var subMenuWidth = jQuery(this).find('.nav-child').width();
            var subMenuOffset = jQuery(this).find('.nav-child').parent().offset().left + subMenuWidth;
            // if sub menu is off screen, give new position
            if((subMenuOffset + subMenuWidth) > MainWindowWidth){                  
                var newSubMenuPosition = subMenuWidth + 3;
                $(this).find('.nav-child').first().css({
                    left: -newSubMenuPosition,
                    //top: '10px',
                });
            }
        }
    });

    //mobile menu
    jQuery('.main-menu-icon').on('click', toggleMobileMenu);
    jQuery('#mainmenu a').on('click', toggleMobileMenu);

    //contact form processing
    jQuery('form.contact-form').on('submit', function( e ){
        e.preventDefault();
        var $form = jQuery(this);
        var request = $form.serialize();
        jQuery($form).find('p.contact-form-respond').remove();
        var ajax = jQuery.post( "contact-form.php", request )
            .done(function( data ) {
                jQuery($form).find('[type="submit"]').attr('disabled', false).parent().prepend('<p class="contact-form-respond highlight">'+data+'</p>');
        })
            .fail(function( data ) {
                jQuery($form).find('[type="submit"]').attr('disabled', false).parent().prepend('<p>Mail cannot be sent.</p>');
        })
    });


    //mailchimp subscribe form processing
    jQuery('#signup').on('submit', function( e ) {
        e.preventDefault();
        // update user interface
        jQuery('#response').html('Adding email address...');
        
        // Prepare query string and send AJAX request
        jQuery.ajax({
            url: 'mailchimp/store-address.php',
            data: 'ajax=true&email=' + escape(jQuery('#mailchimp_email').val()),
            success: function(msg) {
                jQuery('#response').html(msg);
            }
        });
    });

});

    //gallery
    (function ($){ 
        $(window).resize(function(){
            var $windowWidth = $(window).width();
        });
       //$(window).load(function(){


        var $container = $('#portfolioContainer');

        $container.imagesLoaded( function(){
            $container.isotope({
                layoutMode : 'fitRows',
                animationEngine: 'best-available',
                animationOptions: {
                  queue: false,
                  duration: 300
                },
                onLayout: function() {
                    jQuery('body').scrollspy('refresh');  
                }
            });
        });

            // filter items when filter link is clicked
            $('#filtrable a').on('click', function(e){
                var selector = $(this).attr('data-filter');
                $container.isotope({ filter: selector, layoutMode : 'fitRows' });
                // return false;
                e.preventDefault();
            });

            var $optionSets = $('#filtrable li'),
                $optionLinks = $optionSets.find('a');

                $optionLinks.on('click', function(e){
                    var $this = $(this);
                    // don't proceed if already selected
                    if ( $this.hasClass('selected') ) {
                      // return false;
                      e.preventDefault();
                    }
                    var $optionSet = $this.parents('#filtrable');
                    $optionSet.find('.selected').removeClass('selected');
                    $this.addClass('selected');
              
                    // make option object dynamically, i.e. { filter: '.my-filter-class' }
                    var options = {},
                        key = $optionSet.attr('data-option-key'),
                        value = $this.attr('data-option-value');
                    // parse 'false' as false boolean
                    value = value === 'false' ? false : value;
                    options[ key ] = value;
                    if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
                      // changes in layout modes need extra logic
                      changeLayoutMode( $this, options )
                    } else {
                      // otherwise, apply new options
                      $container.isotope( options );
                    }
                    
                    // return false;
                    e.preventDefault();
                });
        //});
    })(jQuery);