function draw() {
    var viewId = '#workspace';

    $(viewId).append(" <input id='autocomplete'  />");

    $("#autocomplete").kendoAutoComplete({
        dataSource: {
            data: ["One", "Two"]
        },
        delay: 500,
        highlightFirst: true,
        suggest: true,
        animation: {
            close: {
                effects: "fadeOut zoom:out",
                duration: 300
            },
            open: {
                effects: "fadeIn zoom:in",
                duration: 300
            }
        },
        change: function (e) {
            var value = this.value();
            autocomplete.value(null);
        }
    });
    var autocomplete = $("#datepicker").data("kendoAutoComplete");
    autocomplete.focus();
}
export function show(viewId) {
    draw(viewId);
}

