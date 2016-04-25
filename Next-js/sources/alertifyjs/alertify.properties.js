alertify.defaults = {
    // dialogs defaults
    modal: true,
    basic: false,
    frameless: false,
    movable: true,
    resizable: true,
    closable: true,
    closableByDimmer: true,
    maximizable: true,
    startMaximized: false,
    pinnable: true,
    pinned: true,
    padding: true,
    overflow: true,
    maintainFocus: true,
    transition: 'pulse',
    autoReset: true,

    // notifier defaults
    notifier: {
        // auto-dismiss wait time (in seconds)
        delay: 3,
        // default position
        position: 'top-right'
    },

    // language resources
    glossary: {
        // dialogs default title
        title: 'Uwaga !',
        // ok button text
        ok: 'OK',
        // cancel button text
        cancel: 'Anuluj'
    },

    // theme settings
    theme: {
        // class name attached to prompt dialog input textbox.
        input: 'ajs-input',
        // class name attached to ok button
        ok: 'ajs-ok',
        // class name attached to cancel button
        cancel: 'ajs-cancel'
    }
};
