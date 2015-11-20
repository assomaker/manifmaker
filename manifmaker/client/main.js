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

Template.registerHelper(
    "displayHours", function (date) {
        return new moment(date).format("H[h]");
    }
);

Meteor.startup(function () {
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("assignments");
    Meteor.subscribe("calendarAccuracy");
    Meteor.subscribe("calendarDays");
    Meteor.subscribe("calendarHours");
    Meteor.subscribe("calendarQuarter");
});





/*********************
 *
 *
 *  La maniere ont on recupere les start/end date est affreuse mais dépendra de la maniere dont est implémentée le
 *  calendrier, on verra ca donc plus tard
 *
 *
 ********************/


Template.assignmentList.helpers({
    assignments: function () {
        var filter = AssignmentFilter.get();
        return Assignments.find(filter);
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
    },
    _idReference: function () {
        var currentAssignmentType = CurrentAssignmentType.get();
        switch (currentAssignmentType) {
            case AssignmentType.ALL:

                break;
            case AssignmentType.USERTOTASK:
                return SelectedUser.get() == null ? [] : Users.findOne(SelectedUser.get())._id;
                break;
            case AssignmentType.TASKTOUSER:
                return SelectedTask.get() == null ? [] : Tasks.findOne(SelectedTask.get())._id;
                break;
        }
    }

});




Template.currentAssignment.events({
    "click li": function (event) {
        var target = $(event.target);


        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected availability slot

                var $availability;
                if (target.hasClass("timeslot"))
                    $availability = target;
                else
                    $availability = target.parents(".timeslot");

                //_id is undefined because there is no availability id
                selectedAvailability = "notnull"; //TODO il faudra voir s'il faut un _id pour user.availabilies


                $availability.removeData();//in order to force jQuery to retrieve the data we set in the dom with Blaze
                var start = new Date($availability.data("start"));
                var end = new Date($availability.data("end"));

                var newFilter = {
                    timeSlots: {
                        $elemMatch: {
                            start: {$gte: start},
                            end: {$lte: end}
                        }
                    }

                };

                TaskFilter.set(newFilter);
                break;
            case AssignmentType.TASKTOUSER: //only display user that have at least one availability matching the selected time slot
                var _id;
                if (target.hasClass("timeslot"))
                    _id = target.data("_id");
                else
                    _id = target.parents(".timeslot").data("_id");

                //_id is a timeSlot Id
                selectedTimeslotId = _id;


                $("#assignment-reference").removeData();//in order to force jQuery to retrieve the data we set in the dom with Blaze
                var idTask = $("#assignment-reference").data("_idreference");

                var task = Tasks.findOne({_id: idTask});
                var timeSlot = TimeSlotService.getTimeSlot(task, selectedTimeslotId);

                var newFilter = {
                    availabilities: {
                        $elemMatch: {
                            start: {$lte: timeSlot.start},
                            end: {$gte: timeSlot.end}
                        }
                    }

                };

                UserFilter.set(newFilter);
                break;
        }

    }
});





