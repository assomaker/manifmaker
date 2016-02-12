Template.tasksList.helpers({
    tasksList: function () {
        var fields = [
            {
                key: 'name',
                label: 'Task name',
                fnAdjustColumnSizing: true
            },
            {
                key: 'teamId',
                label: 'Team',
                fnAdjustColumnSizing: true,
                searchable: false, //TODO doesn't work (try with a teamId)
                fn: function (teamId, Task) {
                    return Teams.findOne(teamId).name;
                }
            },
            {
                key: 'timeSlots',
                label: 'Time slots count',
                searchable: false, //TODO doesn't work (try with a teamId)
                sortable: false,
                fn: function (timeSlots, Task) {
                    return timeSlots.length;
                },
                fnAdjustColumnSizing: true
            },
            {
                label: 'Actions',
                searchable: false, //TODO doesn't work (try with a teamId)
                tmpl: Template.taskButtons,
                fnAdjustColumnSizing: true
            }
        ];

        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TASKWRITE))
            fields.push({
                label: 'Validation',
                searchable: false, //TODO doesn't work (try with a teamId)
                tmpl: Template.validationStateForList,
            });

        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            filters:['task-list-team-filter'],
            fields: fields
        }
    }
});

Template.validationStateForList.helpers({
    lastComment: function (attribute, type) {
        console.log("!!"+type);
        var lastComment;
        this[type].comments.forEach(comment => {
            if (!lastComment)
                lastComment = comment;
            if (new moment(comment.creationDate).isAfter(new moment(lastComment.creationDate))) {
                lastComment = comment
            }
        });
        return lastComment[attribute];
    }
});


Template.tasksList.created = function () {
    this.taskListTeamFilter = new ReactiveTable.Filter("task-list-team-filter", ["teamId"]);
};

Template.tasksList.events({
    "change #task-list-team-selector": function (event, template) {
        event.preventDefault();
        var _id = $(event.target).val();
        template.taskListTeamFilter.set(_id);
    }
});

