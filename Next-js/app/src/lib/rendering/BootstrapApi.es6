/**
 * Created by bartosz on 06.07.15.
 *
 * BootstrapApi factory
 */

const BootstrapApi = {

    showModal(options) {
        var model = options.model || {body: ''};
        var id = options.id || 'default-modal';
        var $body = $(document).find('body');

        var dialog = new BootstrapDialog({
            id: id,
            title: options.title || id,
            message: $(model.body),
            closable: options.closable,
            draggable: options.draggable,
            closeByBackdrop: options.closeByBackdrop,
            closeByKeyboard: options.closeByKeyboard,
            removeButton: options.removeButton,
            onshow: function (dialog) {
                if (model.width === 'xl') {
                    dialog.$modal.find('.modal-dialog').css('width', '76%');
                }

                if (model.smallTopBar === true) {
                    dialog.$modal.find('.modal-header').addClass('small-top-bar');
                }

                if (model.generatedWindow === true) {
                    dialog.$modal.find('.modal-body').css('padding', '0');
                }

                if (options.onshownCallback) {
                    options.onshownCallback(dialog, options);
                }
            },
            onshown: function (dialog) {
                var tier = $('.bootstrap-dialog').length - 1;

                $body.addClass('no-overflow');

                dialog.$modal.prev('.modal-backdrop')
                    .css('z-index', 1030 + tier * 30);
                dialog.$modal
                    .css('z-index', 1040 + tier * 30);

                $('#' + id).find('.modal-content').addClass(model.size);

                if (model.size === 'xl') {
                    dialog.$modal.find('.modal-content').css('height', $(window).height() * 0.8);
                    //dialog.$modal.find('.modal-content').css('width', $(window).width() * 0.9);
                    //dialog.$modal.find('.modal-content').css('left', '-50%');
                }

                if (model.modalBodyHeight) {
                    dialog.$modal.find('.modal-body').css('height', model.modalBodyHeight);
                }

                if (options.noCloseCross) {
                    dialog.getModalHeader().find('.close').hide();
                }

                if (options.callback) {
                    var inteliUiArgs = {inteliUi: options.inteliUi};
                    if (options.inteliUi) {
                        options.callback(inteliUiArgs);
                    }
                }

                if (options.afterRenderCallback) {
                    options.afterRenderCallback(dialog, options);
                }
            },
            onhide: function (dialog) {
                $body.removeClass('no-overflow');
                $body.css('overflow-x', 'hidden');

                if (options.onhideCallback) {
                    options.onhideCallback(dialog);
                }
            },
            buttons: [
                {
                    label: 'OK',
                    cssClass: function () {
                        if (!options.btnPrimaryColor) {
                            options.btnPrimaryColor = 'primary';
                        }

                        var color = 'btn-' + options.btnPrimaryColor;

                        if (options.defaultDisabledButton) {
                            return color + ' disabled';
                        } else {
                            return color;
                        }
                    },
                    id: 'btnSave',
                    action: function (dialog) {
                        var cantClose = false;

                        if (!dialog.$modalFooter.find('#btnSave').hasClass('disabled')) {
                            if (options.primaryButtonAction) {
                                if (options.inteliUi) {
                                    cantClose = options.primaryButtonAction(options.inteliUi, dialog);
                                } else {
                                    cantClose = options.primaryButtonAction(dialog);
                                }
                            }

                            if (!cantClose) {
                                dialog.close();
                            }
                        }
                    }
                },
                {
                    label: 'Zamknij',
                    cssClass: function () {
                        if (!options.btnCloseColor) {
                            options.btnCloseColor = 'default';
                        }

                        var color = 'btn-' + options.btnCloseColor;

                        if (options.closable === undefined || options.closable) {
                            return color;
                        } else {
                            return color + ' disabled';
                        }
                    },
                    id: 'btnClose',
                    action: function (dialog, e) {
                        if (!dialog.$modalFooter.find('#btnClose').hasClass('disabled')) {
                            if (options.closeButtonAction) {
                                options.closeButtonAction(dialog, e, options);
                            } else {
                                dialog.close();
                            }
                        }
                    }
                }
            ]
        }).open();
    },

    showFilePicker(options) {
        var template = options.template || require('./templates/file_picker.hbs');
        var model = {command: options.command, title: options.title};
        var injectNode = options.injectNode;
        var htmlElement = template(model);
        var callback = options.callback;
        var inteliUi = options.inteliUi;

        $(injectNode).html(htmlElement).promise().done(function () {
            var inputField = $('.filepicker-output');

            $('.filepicker-button').click(function () {
                $('input[type=file]').click();
            });

            $('input[type=file]').change(function () {
                inputField.val(this.files[0].name);

                inteliUi.uploadedFile = this.files[0];
            });

        });
    }
};

export default BootstrapApi;