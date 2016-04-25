var expect = chai.expect;
import WindowManager from './../../sidow/windowManager/WindowManager';
import Window from '../../sidow/window/windows/FormWindow';
import WindowArea from '../../sidow/window/windowArea/WindowArea';
import WindowContentBaseView from '../../sidow/window/WindowContentBaseView';
import AnimationEvents from '../../lib/AnimationEvents';

function createWindowManager(sandbox) {
    let windowManager = new WindowManager("#windows");
    windowManager.init();
    sandbox.stub(windowManager.historyController, 'buildHistory');
    sandbox.stub(windowManager.historyController, 'removeFromHistory');
    return windowManager;
}
class WindowManagerTest {

    run() {
        describe('WindowManager Tests...', () => {
            var sandbox;

            beforeEach(function () {
                $(document.body).append('<div id="windows"></div>');
                sandbox = sinon.sandbox.create();
            });

            afterEach(function () {
                sandbox.restore();
                $('#windows').empty();
            });

            it('should call render on window when TabWindowManager show it', function () {
                //given
                var windowManager = createWindowManager(sandbox);
                let customerWindow = new Window('CustomerWindow');
                sandbox.stub(customerWindow, 'renderTo');

                //when
                windowManager.show(customerWindow);

                //then
                expect(customerWindow.renderTo).to.have.been.calledOnce;
            });

            it('should hide current window when show next', function () {
                //given
                let windowManager = createWindowManager(sandbox);
                let customerWindow = new Window('CustomerWindow');
                let operatorWindow = new Window('OperatorWindow');

                //when
                windowManager.show(customerWindow);
                expect(customerWindow.visible).to.be.true;
                windowManager.show(operatorWindow);

                //then
                expect(customerWindow.visible).to.be.false;
            });

            it('should restore last window when close current', function () {
                //given
                let windowManager = createWindowManager(sandbox);
                let customerWindow = new Window('CustomerWindow');
                let operatorWindow = new Window('OperatorWindow');

                windowManager.show(customerWindow);
                windowManager.show(operatorWindow);

                //when
                windowManager.disposeCurrentAndShowPrev();

                //then
                expect(customerWindow.visible).to.be.true;
            });

            it('should dispose all windows when dispose manager', function () {
                //given
                let windowManager = createWindowManager(sandbox);
                let customerWindow = new Window('CustomerWindow');
                let operatorWindow = new Window('OperatorWindow');

                let bodyArea = new WindowArea('body');
                const windowContentBaseView = new WindowContentBaseView('someId', {});
                bodyArea.addComponent(windowContentBaseView);

                operatorWindow.addBody(bodyArea);

                windowManager.show(customerWindow);
                windowManager.show(operatorWindow);

                //when
                windowManager.dispose();

                //then
                expect(customerWindow.disposed).to.be.true;
                expect(operatorWindow.disposed).to.be.true;
                expect(windowContentBaseView.disposed).to.be.true;
            });


        });
    }

}

export default WindowManagerTest;
