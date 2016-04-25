/**
 * Created by bartosz on 03.09.15.
 *
 * BasicMethodsSet class
 */

class BasicMethodsSet {

    /**
     * Method to add the node to the workspace register
     *
     * @param diagramNode
     */
    addNodeToRegister(diagramNode) {
        if (!this.workspaceRegister) {
            this.initWorkspaceRegister();
        }

        this.removeFromArray(this.workspaceRegister.nodes, diagramNode);

        this.workspaceRegister.nodes.push(diagramNode);
    }

    /**
     * Method to add the connection to the workspace register
     *
     * @param connection
     */
    addConnectionToRegister(connection) {
        if (!this.workspaceRegister) {
            this.initWorkspaceRegister();
        }

        this.workspaceRegister.connections.push(connection);
    }

    /**
     * Method to remove the node from the workspace register
     *
     * @param diagramNode
     */
    removeNodeFromRegister(diagramNode) {
        if (this.workspaceRegister) {
            this.removeFromArray(this.workspaceRegister.nodes, diagramNode);
        } else {
            console.log('there are no workspace register..');
        }
    }

    /**
     * Method to remove the connection from the workspace register
     *
     * @param connection
     */
    removeConnectionFromRegister(connection) {
        if (this.workspaceRegister) {
            this.removeFromArray(this.workspaceRegister.connections, connection);
        } else {
            console.log('there are no workspace register..');
        }
    }

    /**
     * Initialize the workspace register
     */
    initWorkspaceRegister() {
        this.workspaceRegister = {
            nodes: [],
            connections: []
        };
    }

    /**
     * @param array
     * @param element
     */
    removeFromArray(array, element) {
        var index = array.indexOf(element);

        if (index > -1) {
            array.splice(index, 1);
        }
    }

}

export default BasicMethodsSet;
