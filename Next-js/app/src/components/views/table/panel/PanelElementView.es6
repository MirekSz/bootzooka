/**
 * Created by bartek on 2015-11-03.
 */
import PanelElementFactory from './PanelElementFactory';

class PanelElementView {

    /**
     * Universal method the dispose the panel
     *
     * @param $panel
     */
    disposePanel($panel) {
        var self = this;
        var $panelRow = $panel.closest('.row');
        var panelRowElements = self.getPanelRowElements($panelRow);

        $panel.addClass('beforeAnimation');

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
        }, 500);
    }

    /**
     * Get the panel row elements
     *
     * @param $panelRow
     * @return array panelRowElements
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

        $showHideBtn.click(e => {
            self.showHidePanel($panel, $showHideBtn);
        });

        $closeBtn.click(() => {
            self.disposePanel($panel);
        });
    }

    /**
     * Universal method to show/hide panel
     *
     * @param $panel
     */
    showHidePanel($panel, $showHideBtn) {
        var icon = $showHideBtn.find('i');
        $panel.find('.collapse-wrapper').collapse('toggle');
        $panel.find('.panel-heading').toggleClass('border-left');

        if (icon.hasClass('fa-chevron-up')) {
            icon.removeClass('fa-chevron-up');
            icon.addClass('fa-chevron-down');
        } else {
            icon.removeClass('fa-chevron-down');
            icon.addClass('fa-chevron-up');
        }
    }

    renderContent(panel) {
        panel.content = PanelElementFactory.buildContent(panel.def);
        panel.content.renderTo(panel.body);
    }

}

export default PanelElementView;
