Template.assignmentUsersList.helpers({
    users: function () {
        var filter = UserFilter.get();
        return Users.find(filter);
    }
});

Template.assignmentUsersList.events({
    "click li": function (event) {
        event.stopPropagation();

        //Template.parentData() ne fonctionne pas, alors j'utilise un trick de poney pour stocker dans le dom les _id
        var currentAssignmentType = CurrentAssignmentType.get();
        var target = $(event.target);
        var _id;
        if (target.hasClass("user"))
            _id = target.data("_id");
        else
            _id = target.parents(".user").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                SelectedUser.set({_id: _id});
                selectedAvailability = null; //TODO pas top
                TaskFilter.set(noneFilter);
                //TODO reduire la liste à ses amis
                break;
            case AssignmentType.TASKTOUSER:


                Meteor.call("assignUserToTaskTimeSlot", _id, SelectedTask.get()._id, selectedTimeslotId);

                break;
        }

    }
});
