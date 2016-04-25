/**
 * Created by bartosz on 04.09.15.
 *
 * BasicMethodsTests class
 */
import InteliUi from '../../inteliUi/InteliUi';

class InteliUiWorkspaceRegisterTest {

    run() {
        describe('Start InteliUi workspace register tests...', function () {
            var inteliUi = new InteliUi();
            var nodePlaceholder = {id: 'node_11'};
            var nodePlaceholder2 = {id: 'node_22'};

            var connectionPlaceholder = {id: 'connection_11'};
            var connectionPlaceholder2 = {id: 'node_22'};

            it('should initialize the workspace register', function () {
                inteliUi.initWorkspaceRegister();

                expect(inteliUi.workspaceRegister).to.not.be.undefined;
            });

            it('should add nodes to the register', function () {
                inteliUi.addNodeToRegister(nodePlaceholder);
                inteliUi.addNodeToRegister(nodePlaceholder2);

                expect(inteliUi.workspaceRegister.nodes).to.contains(nodePlaceholder);
                expect(inteliUi.workspaceRegister.nodes).to.contains(nodePlaceholder2);
            });

            it('should prevent adding same node twice', function () {
                inteliUi.addNodeToRegister(nodePlaceholder);

                expect(inteliUi.workspaceRegister.nodes.length).to.equal(2);
            });

            it('should add connections to the register', function () {
                inteliUi.addConnectionToRegister(connectionPlaceholder);
                inteliUi.addConnectionToRegister(connectionPlaceholder2);

                expect(inteliUi.workspaceRegister.connections).to.contains(connectionPlaceholder);
                expect(inteliUi.workspaceRegister.connections).to.contains(connectionPlaceholder2);
            });

            it('should prevent adding same connection twice', function () {
                inteliUi.addNodeToRegister(connectionPlaceholder);

                expect(inteliUi.workspaceRegister.connections.length).to.equal(2);
            });

            it('should remove node from register', function () {
                inteliUi.removeNodeFromRegister(nodePlaceholder);

                expect(inteliUi.workspaceRegister).to.not.contains(nodePlaceholder);
            });

            it('should remove connection from register', function () {
                inteliUi.removeNodeFromRegister(connectionPlaceholder);

                expect(inteliUi.workspaceRegister).to.not.contains(connectionPlaceholder);
            });
        });
    }

}

export default InteliUiWorkspaceRegisterTest;
