Template.tasksList.helpers({
    teams: function () {
        return Teams.find();
    },
    tasksList: function () {
        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            columnPerPage: 5,
            multiColumnSort: true,
            fields: [
                {key: 'name', label: 'Task name', fnAdjustColumnSizing: true},

                {
                    key: 'teamId', label: 'Team', fnAdjustColumnSizing: true, fn: function (teamId, Task) {
                    return Teams.findOne(teamId).name;
                }
                },
                {
                    key: 'timeSlots', label: 'Time slots count', sortable: false, fn: function (timeSlots, Task) {
                    return timeSlots.length;
                }, fnAdjustColumnSizing: true
                },
                {label: 'Actions', tmpl: Template.taskButtons, fnAdjustColumnSizing: true}

            ]

        };
    }
});

Template.tasksList.rendered = function () {
    $(document).ready(function () {
        $('select').material_select();
    });
};

Template.tasksList.created = function () {
    this.filter = new ReactiveTable.Filter('teamFilter', ['team']);
};

Template.tasksList.events({
    "change #team_filter": function (event, template) {
        event.preventDefault();
        var team_id = $(event.target).val();
        //TODO constant
        template.filter.set({'teamFilter': team_id});

    }
});

