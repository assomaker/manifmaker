Template.taskList.helpers({
    tasks: function () {
        var filter = TaskFilter.get();
        return Tasks.find(filter);
    }
});

Template.taskList.events({
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
                selectedTimeslotId = null;//TODO pas top
                UserFilter.set(noneFilter);
                //TODO que faire sur la liste des taches ? la vider pour n'afficher que la tache selectionnée ?
                break;
        }


    }
});
