/**
 * Created by bartosz on 14.07.15.
 *
 * InteliUiEntity class
 */
import componentDefinitionRegistry from '../../componentsDefinitions/ComponentDefinitionRegistry';

class InteliUiEntity {

    /**
     * Get the file via ajax
     *
     * @param url
     * @returns {string}
     */
    getObject(url) {
        return this.getFile(url);
    }

    /**
     * Universal method to get data from backend
     *
     * @param options
     */
    getDataFromBackend(options) {
        var args = options.args;

        if (options.type === 'action') {
            var actions = componentDefinitionRegistry.getActions(options.text);

            actions.then(function (data) {
                if (args.details) {
                    args.details.type = 'actions';
                    args.details.nodes = data;
                }

                //pin the model
                args.inteliUi.setNodesModel(data);

                options.callback(args, data);
            });
        } else if (options.type === 'view') {
            var views = componentDefinitionRegistry.getViews(options.text);

            views.then(function (data) {
                if (args.details) {
                    args.details.type = 'views';
                    args.details.nodes = data;
                }

                //pin the model
                args.inteliUi.setNodesModel(data);

                options.callback(args, data);
            });
        }
    }

    /**
     * @private
     *
     * @param {string} fileDir
     * @returns {string} file
     */
    getFile(fileDir) {
        var request = $.ajax({
            url: fileDir,
            type: 'get',
            async: false,
            success: function (data) {
                return data;
            },
            error: function (err) {
                return err;
            }
        });

        return request.responseText;
    }

}

export default InteliUiEntity;