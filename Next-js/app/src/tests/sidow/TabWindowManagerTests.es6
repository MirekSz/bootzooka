/**
 * Created by bstanislawski on 2016-04-05.
 */

var expect = chai.expect;
import TabWindowManager from './../../sidow/windowManager/tabWindowManager/TabWindowManager';
import Window from '../../sidow/window/windows/FormWindow';
import AnimatedPanelWrapper from '../../designer/windowPresentationWrappers/animatedPanelWrapper/AnimatedPanelWrapper';

const CUSTOMER_WINDOW = 'CustomerWindow';
const OPERATOR_WINDOW = 'OperatorWindow';

class TabWindowManagerTests {

    run() {
        describe('TabWindowManagerTests Tests...', () => {
            var sandbox;

            beforeEach(function () {
                $(document.body).append("<div id='windows'></div>");
                sandbox = sinon.sandbox.create();
            });

            afterEach(function () {
                sandbox.restore();
                $("#windows").empty();
            });

            it('should dispose current window and activate first one when close action call', function () {
                //given
                let tabWindowManager = new TabWindowManager("#windows");
                tabWindowManager.init();
                let customerWindow = new Window(CUSTOMER_WINDOW);
                let operatorWindow = new Window(OPERATOR_WINDOW);

                //when
                tabWindowManager.show(customerWindow);
                tabWindowManager.show(operatorWindow);

                tabWindowManager.disposeCurrentAndActivateFirst(OPERATOR_WINDOW);

                //then
                setTimeout(() => {
                    expect(operatorWindow.disposed).to.be.equal(true);
                    expect(tabWindowManager.currentWindow()).to.be.equal(customerWindow);
                }, 500);
            });

            it('should remove window from TabWindowManager', function () {
                //given
                let tabWindowManager = new TabWindowManager("#windows");
                tabWindowManager.init();
                let customerWindow = new Window(CUSTOMER_WINDOW);

                //when
                tabWindowManager.show(customerWindow);
                expect(tabWindowManager.windowsInOrder).to.include(customerWindow);

                tabWindowManager.removeWindow(customerWindow);

                //then
                expect(tabWindowManager.windowsInOrder).to.not.include(customerWindow);
            });

            it('should call show on visualWrapper(AnimatedPanelWrapper) method when showing the window', function () {
                //given
                let tabWindowManager = new TabWindowManager("#windows");
                tabWindowManager.init();
                let customerWindow = new Window(CUSTOMER_WINDOW);
                sandbox.stub(tabWindowManager, 'show');

                //when
                tabWindowManager.show(customerWindow);

                //then
                expect(tabWindowManager.show).to.have.been.calledOnce;
            });

            it('should have the AnimatedPanelWrapper as a visual wrapper for rendering', function () {
                //given
                let tabWindowManager = new TabWindowManager("#windows");
                tabWindowManager.init();
                let customerWindow = new Window(CUSTOMER_WINDOW);

                //when
                tabWindowManager.show(customerWindow);

                //then
                expect(tabWindowManager.windows.get(customerWindow.id).visualWrapper).to.be.an.instanceof(AnimatedPanelWrapper);
            });

        });
    }

}

export default TabWindowManagerTests;
