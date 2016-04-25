$(document).ready(function () {

    //extend jQuery library
    (function ($, window, document, undefined) {
        var pageWrapper = document.body || document.documentElement;
        var pageStyles = pageWrapper.style;
        var prefixAnimation = '';
        var prefixTransition = '';

        if (pageStyles.WebkitAnimation == '') {
            prefixAnimation = '-webkit-';
        }
        if (pageStyles.MozAnimation == '') {
            prefixAnimation = '-moz-';
        }
        if (pageStyles.OAnimation == '') {
            prefixAnimation = '-o-';
        }

        if (pageStyles.WebkitTransition == '') {
            prefixTransition = '-webkit-';
        }
        if (pageStyles.MozTransition == '') {
            prefixTransition = '-moz-';
        }
        if (pageStyles.OTransition == '') {
            prefixTransition = '-o-';
        }

        $.fn.extend(
            {
                onCSSAnimationEnd: function (callback) {
                    var $this = $(this).eq(0);

                    $this.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', callback);

                    if ((prefixAnimation == '' && !('animation' in pageStyles)) || $this.css(`${prefixAnimation}animation-duration`) == '0s') {
                        return callback();
                    }
                    return this;
                },
                onCSSTransitionEnd: function (callback) {
                    var $this = $(this).eq(0);

                    $this.one('webkitTransitionEnd mozTransitionEnd oTransitionEnd otransitionend transitionend', callback);

                    if ((prefixTransition == '' && !('transition' in pageStyles)) || $this.css(`${prefixAnimation}transition-duration`) == '0s') {
                        return callback();
                    }
                    return this;
                }
            });
    })(jQuery, window, document);

});

