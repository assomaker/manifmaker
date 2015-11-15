var defaultFilter = {};
var noneFilter = {none: "none"};
UserFilter = new ReactiveVar(defaultFilter);
SelectedUser = new ReactiveVar(null);
TaskFilter = new ReactiveVar(defaultFilter);
SelectedTask = new ReactiveVar(null);

selectedTimeslotId = null; //TODO mettre ca dans Session ?//TODO pas top
selectedAvailability = null;//TODO pas top

AssignmentFilter = new ReactiveVar(defaultFilter);
CurrentAssignmentType = new ReactiveVar(AssignmentType.ALL);


Template.userList.helpers({
    users: function () {
        var filter = UserFilter.get();
        return Users.find(filter);
    }
});

Template.userList.events({
    "click li": function (event) {
        event.stopPropagation();
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
                //TODO que faire sur la liste des taches ?
                break;
        }


    }
});

Template.assignmentList.helpers({
    assignments: function () {
        var filter = AssignmentFilter.get();
        return Assignments.find(filter);
    }
});

Template.buttons.events({
    "click #userToTask": function (event) {
        TaskFilter.set(noneFilter);
        UserFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.USERTOTASK);
    },
    "click #taskToUser": function (event) {
        UserFilter.set(noneFilter);
        TaskFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    },
    "click #all": function (event) {
        TaskFilter.set(defaultFilter);
        UserFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.ALL);
    }
});

Template.buttons.helpers({
    adviceMessage: function () {
        var userFilter = UserFilter.get(),
            taskFilter = TaskFilter.get(),
            currentAssignmentType = CurrentAssignmentType.get(),
            selectedUser = SelectedUser.get(),
            selectedTask = SelectedTask.get()
            message = "";

        if (currentAssignmentType === AssignmentType.USERTOTASK) {
            if (selectedUser === null) {
                message += "Select a user";
            } else if (selectedAvailability === null) {//TODO pas top
                var userName = UserRepository.findOne(selectedUser._id).name;
                message += "Select one of " + userName + " availability";
            } else {
                message += "Select a time slot of one of the available task";
            }

            return message;
        }
        if (currentAssignmentType === AssignmentType.TASKTOUSER) {
            if (selectedTask === null) {
                message += "Select a task";
            } else if (selectedTimeslotId === null) {//TODO pas top
                var taskName = TaskRepository.findOne(selectedTask._id).name;
                message += "Select one of " + taskName + " time slot";
            } else {
                message += "Select an availability of one of the available user";
            }

            return message;
        }

        return "Here are all the data";

    }
});

Template.currentAssignment.helpers({
    name: function () {
        var currentAssignmentType = CurrentAssignmentType.get();
        switch (currentAssignmentType) {
            case AssignmentType.ALL:
                return "";
                break;
            case AssignmentType.USERTOTASK:
                return SelectedUser.get() == null ? "" : Users.findOne(SelectedUser.get()).name;
                break;
            case AssignmentType.TASKTOUSER:
                return SelectedTask.get() == null ? "" : Tasks.findOne(SelectedTask.get()).name;
                break;
        }
    },
    type: function () {
        var currentAssignmentType = CurrentAssignmentType.get();
        switch (currentAssignmentType) {
            case AssignmentType.ALL:
                return "";
                break;
            case AssignmentType.USERTOTASK:
                return "Availabilities";
                break;
            case AssignmentType.TASKTOUSER:
                return "Timeslots";
                break;
        }

    },
    timeSlots: function () {
        var currentAssignmentType = CurrentAssignmentType.get();
        switch (currentAssignmentType) {
            case AssignmentType.ALL:

                break;
            case AssignmentType.USERTOTASK:
                return SelectedUser.get() == null ? [] : Users.findOne(SelectedUser.get()).availabilities;
                break;
            case AssignmentType.TASKTOUSER:
                return SelectedTask.get() == null ? [] : Tasks.findOne(SelectedTask.get()).timeSlots;
                break;
        }
    }

});


Template.currentAssignment.events({
    "click li": function (event) {
        var target = $(event.target);
        var _id;
        if (target.hasClass("timeslot"))
            _id = target.data("_id");
        else
            _id = target.parents(".timeslot").data("_id");

        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                //_id is undefined because there is no availability id
                //TODO n'afficher que les taches qui ont un creneau compris dans la dispo en question
                selectedAvailability = "notnull"; //TODO il faudra voir s'il faut un _id pour user.availabilies
                TaskFilter.set(defaultFilter);
                break;
            case AssignmentType.TASKTOUSER:
                //_id is a timeSlot Id
                selectedTimeslotId = _id;
                //TODO n'afficher que les users qui ont au moins une dispo entourant au moins un des creneau
                UserFilter.set(defaultFilter);
                break;
        }

    }
});


Meteor.startup(function () {
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("assignments");

});



