/**
 * Created by bartosz on 13.08.15.
 *
 * InteliUiViewTest class
 */
import InteliUiView from '../../inteliUi/InteliUiView';
import InteliUi from '../../inteliUi/InteliUi';

class InteliUiViewTest {

    run() {
        var self = this;

        describe('Start InteliUi view elements tests', function () {
            var inteliUiView = new InteliUiView();

            it('should show adding node modal', function () {
                var args = self.mockNodeArgs(false);

                inteliUiView.setDataForModal(args);

                setTimeout(function () {
                    var modalDialog = $('.modal-content');
                    var modalFilterInputId = 'filter-backend-content';

                    modalDialog.on('shown', () => {
                        expect(modalDialog.html()).to.contains(modalFilterInputId);

                        modalDialog.model('hide');
                        self.closeModal();
                    });
                }, 2000);
            });

            it('should show standard editing node modal', function () {
                var args = self.mockNodeArgs(true);

                inteliUiView.setDataForModal(args);

                setTimeout(function () {
                    var modalDialog = $('.modal-content');
                    var outputSocketListClass = 'output-socket-list';

                    modalDialog.on('shown', () => {
                        expect(modalDialog.html()).to.contains(outputSocketListClass);

                        modalDialog.model('hide');
                        self.closeModal();
                    });
                }, 3000);
            });

        });
    }

    closeModal() {
        $('#inteliUi-node-details-modal').remove();
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
    }

    mockNodeArgs(isNotInit) {
        var diagramNode = this.mockDiagramNode(isNotInit);
        var inteliUi = new InteliUi();

        return {
            diagramNode: diagramNode,
            inteliUi: inteliUi
        }
    }

    mockDiagramNode(isNotInit) {
        return {
            get: function (args) {
                return 'view';
            },
            isNotInit: isNotInit
        }
    }

}

export default InteliUiViewTest;
