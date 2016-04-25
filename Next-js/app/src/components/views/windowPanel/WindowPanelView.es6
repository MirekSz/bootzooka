/**
 * Created by bartek on 2015-11-03.
 */
class WindowPanelView {

    /**
     *
     * @param {WindowPanelComponent} windowPanel
     */
    constructor(windowPanel) {
        this.windowPanel = windowPanel;
    }

    /**
     * Universal method the dispose the panel
     *
     * @param {jQuery} $panel
     */
    disposePanel($panel) {
        var self = this;
        var $panelRow = $panel.closest('.row');
        var panelRowElements = self.getPanelRowElements($panelRow);

        $panel.addClass('beforeAnimation');
        this.executeAnimation($panel, panelRowElements);
    }

    /**
     * Method to execute the close animation on the panel
     *
     * @param {jQuery} $panel
     * @param {jQuery} panelRowElements
     */
    executeAnimation($panel, panelRowElements) {
        const ANIMATION_DELAY = 500;

        setTimeout(() => {
            $panel.parent().addClass('hidden');

            if (panelRowElements.length > 0) {
                let panelClassList = $panel.closest('.animated-panel').attr('class').split(' ');

                for (let i = 0; i < panelClassList.length; i++) {
                    let classElement = panelClassList[i];

                    if (classElement.indexOf('col-lg-') > -1) {
                        $panel.closest('.animated-panel').removeClass(classElement);
                    }
                }
            }
        }, ANIMATION_DELAY);
    }

    disposeContent() {
        var windowPanelContent = this.windowPanel.content;

        if (windowPanelContent.header) {
            windowPanelContent.header.dispose();
        }
        if (windowPanelContent.body) {
            windowPanelContent.body.dispose();
        }
        if (windowPanelContent.footer) {
            windowPanelContent.footer.dispose();
        }
    }

    /**
     * Get the panel row elements
     *
     * @param {jQuery} $panelRow
     * @return {jQuery} panelRowElements
     */
    getPanelRowElements($panelRow) {
        return $panelRow.find('.panel');
    }

    /**
     * Handle the common panels behavior
     */
    handleStandardPanelBehavior($panel) {
        var self = this;
        var $showHideBtn = $panel.find('.showhide');
        var $closeBtn = $panel.find('.closebox');

        $showHideBtn.click(() => {
            self.togglePanel($panel, $showHideBtn);
        });

        $closeBtn.click(() => {
            self.disposePanel($panel);
            self.disposeContent();
        });
    }

    /**
     * Universal method to show/hide panel
     *
     * @param $panel
     */
    togglePanel($panel, $showHideBtn) {
        var icon = $showHideBtn.find('i');

        $panel.find('.collapse-wrapper').collapse('toggle');
        $panel.find('.panel-heading').toggleClass('border-left');

        toggleElementIcon(icon);
    }

    renderContent(panel) {
        panel.content.footerTarget = this.windowPanel.footer;
        panel.content.renderTo(panel.body);
    }

}

export default WindowPanelView;


function toggleElementIcon(icon) {
    if (icon.hasClass('fa-chevron-up')) {
        icon.removeClass('fa-chevron-up');
        icon.addClass('fa-chevron-down');
    } else {
        icon.removeClass('fa-chevron-down');
        icon.addClass('fa-chevron-up');
    }
}
