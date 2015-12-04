Template.assignmentTasksList.helpers({
    tasks: function () {
        var filter = TaskFilter.get();
        return Tasks.find(filter);
    },
    team: function () {
        return Teams.findOne({_id:this.teamId}).name;
    },
    user: function () {
        return Users.findOne({_id:this.userId}).name;
    }
});

Template.assignmentTasksList.events({
    "click li": function (event) {
        event.stopPropagation();
        var currentAssignmentType = CurrentAssignmentType.get();
        var target = $(event.target);
        var _idTask, _idTimeSlot;
        if (target.hasClass("task"))
            _idTask = target.data("_id");
        else
            _idTask = target.parents(".task").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:

                if (target.hasClass("time-slot"))
                    _idTimeSlot = target.data("_id");
                else
                    _idTimeSlot = target.parents(".time-slot").data("_id");

                Meteor.call("assignUserToTaskTimeSlot", SelectedUser.get()._id, _idTask, _idTimeSlot);

                break;
            case AssignmentType.TASKTOUSER:
                SelectedTask.set({_id: _idTask});
                //selectedTimeslotId = null;//TODO pas top
                UserFilter.set(noneFilter);
                //TODO aouter du CSS pour signifier quelle tache est la current
                break;
        }


    }
});
