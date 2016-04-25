/**
 * Created by bstanislawski on 2016-04-06.
 */

class SidebarElement {

    /**
     * @param {String} id
     * @param {Function|BaseWindow} handler
     * @param {Object} [extraOptions]
     * @param {String} [extraOptions.text]
     * @param {String} [extraOptions.icon]
     * @param {Map} [composableWindowsMap]
     */
    constructor(id, handler, extraOptions, composableWindowsMap) {
        this.id = id;
        this.handler = handler;

        if (handler instanceof Function) {
            this.handler = handler;
        } else {
            this.window = handler;
        }

        if (extraOptions) {
            this.text = extraOptions.text || id;
            this.icon = extraOptions.icon || 'fa fa-desktop';
            this.noTooltip = extraOptions.noTooltip || false;
        } else {
            this.text = id;
            this.icon = 'fa fa-desktop';
            this.noTooltip = false;
        }

        this.composableWindowsMap = composableWindowsMap;
    }

    dispose() {
        var $sidebar = $(document).find('#sidebar-wrapper').find('.sidebar-elements');
        var $elementToDispose = $sidebar.find(`#${this.id}`);

        $elementToDispose.removeClass('hvr-bubble-float-right');
        $elementToDispose.addClass('animated-fast bounceOutLeft');

        $elementToDispose.onCSSTransitionEnd(() => {
            $elementToDispose.tooltip('destroy');
            $elementToDispose.unbind();
            $elementToDispose.removeClass('bounceOutLeft');
            $elementToDispose.closest('li').remove();
        });
    }

    /**
     * @param {jQuery} $sideBarMenu
     */
    renderSidebarElementTo($sideBarMenu) {
        var $sidebarElement = this.createSidebarElement();
        this.$menu = $sideBarMenu;

        this.$menu.append($sidebarElement);
        this.addTooltip();

        $sidebarElement.removeClass('hidden');
    }

    /**
     * @returns {jQuery}
     */
    createSidebarElement() {
        if (!this.animationClass) {
            this.animationClass = 'hvr-bubble-float-right';
        } else {
            if (this.animationClass === 'none') {
                this.animationClass = 'no-animation';
            }
        }

        let liElement = $('<li>').append(
            $('<a>').attr('id', this.id)
                .attr('class', `menu-element ${this.classes} ${this.animationClass} edited-tooltip`)
                .attr('title', this.text)
                .attr('data-placement', 'right')
                .append(
                    $('<span>').addClass(this.icon),
                    $('<a>').addClass('menu-text').append(this.text)
                )
        );

        let $liElement = $(liElement[0]);
        $liElement.addClass(' animated-fast hidden bounceInRight');

        return $liElement;
    }

    addTooltip() {
        if (!this.noTooltip) {
            this.$menu.find(`#${this.id}`).tooltip({container: 'body', animation: true});
        }
    }

}

export default SidebarElement;
