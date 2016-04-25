/**
 * Created by bartosz on 17.09.15.
 *
 * BasicView class
 */

class BasicView {

    /**
     * Show the loading indicator
     */
    static showIndicator() {
        try {
            if (window) {
                const body = $('body');
                var isNormalFlow = body.find('#mocha').length === 0;

                if (isNormalFlow) {
                    var indicator = body.data('loadingIndicator');
                    var windowHeight = $(document).height();
                    $('.loading-indicator-wrapper').css('height', windowHeight);

                    if (indicator) {
                        indicator.show();
                    } else {
                        body.loadingIndicator();
                    }
                }
            }
        } catch (e) {
        }
    }

    /**
     * Hide the loading indicator
     */
    static removeIndicator() {
        try {
            if (window) {
                var body = $('body');
                var isNormalFlow = body.find('#mocha').length === 0;

                if (isNormalFlow) {
                    var indicator = body.data('loadingIndicator');

                    indicator.hide();
                }
            }
        } catch (e) {
        }
    }

}

export default BasicView;