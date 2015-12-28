
Template.tasksList.rendered = function () {
    $(document).ready(function () {
        $('select').material_select();
    });
};

Template.tasksList.created = function () {
    this.filter = new ReactiveTable.Filter('team1', ['team']);
};

Template.tasksList.events({
    "change #team_filter": function (event, template) {
        event.preventDefault();
        var _id = $(event.target).val();
        //TODO constant
        template.filter.set({'team1': input});

    }
});

