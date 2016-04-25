/**
 * Created by bstanislawski on 2016-04-05.
 */
import historyElementTemplate from './history_element.hbs';
import historySeparatorElementTemplate from './historySeparatorElement.hbs';

class HistoryViewController {

    /**
     * @param {WindowManager} windowManager
     */
    constructor(windowManager) {
        this.windowManager = windowManager;
    }

    buildHistory(window) {
        var $history = this.windowManager.$history;
        var historyContent = $history.html().trim();
        var historyElementToAdd = historyElementTemplate(window);
        var separator = historySeparatorElementTemplate(window);

        if (historyContent === '') {
            separator = '';
        }

        let newHistoryContent = historyContent + separator + historyElementToAdd;

        $history.html(newHistoryContent);
    }

    removeFromHistory(window) {
        var $history = this.windowManager.$history;
        var $historyElementToRemove = $history.find(`#history-element-${window.id}`);
        var $separatorToRemove = $history.find(`#history-separator-${window.id}`);

        $historyElementToRemove.remove();
        $separatorToRemove.remove();
    }

    showPanelFromHistory(id, isCloseBtnAvailable) {
        let $panelToShowFromHistory = this.windowManager.$panelsHistory.find(`#window_wrapper_${id}`);

        $panelToShowFromHistory.addClass('beforeAnimation');
        $panelToShowFromHistory.detach().appendTo(this.windowManager.$panel);
        $panelToShowFromHistory.addClass('fadeIn');
        $panelToShowFromHistory.removeClass('beforeAnimation');

        if (!isCloseBtnAvailable) {
            hideCloseBtn($panelToShowFromHistory);
        }
    }

    hidePanel() {
        let $panelToHide = this.windowManager.$panel.children();

        $panelToHide.removeClass('fadeIn');
        $panelToHide.addClass('fadeOut');

        $panelToHide.onCSSTransitionEnd(() => {
            if ($panelToHide.hasClass('fadeOut')) {
                $panelToHide.detach().appendTo(this.windowManager.$panelsHistory);

                $panelToHide.removeClass('fadeOut');
            }
        });
    }

}

export default HistoryViewController;

function hideCloseBtn($panel) {
    $panel.closest('.panel').find('.panel-tools').addClass('hidden');
}
