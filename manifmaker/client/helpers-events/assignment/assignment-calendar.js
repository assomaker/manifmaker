function getCalendarDateHours(date, timeHours) {
    var date = new moment(date);
    date.hours(timeHours);
    return date;
}
function getCalendarDateTime(date, timeHours, timeMinutes) {
    var dateWithHours = getCalendarDateHours(date, timeHours);
    var date = new moment(dateWithHours);
    date.minutes(timeMinutes);
    return date;
}
Template.assignmentCalendar.helpers({
    assignmentType: function () {
        return CurrentAssignmentType.get();
    },
    days: function () {
        return CalendarDays.find({});
    },
    hours: function () {
        return CalendarHours.find({});
    },
    quarter: function () {
        return CalendarQuarter.find({});
    },
    displayCalendarTitleDate: function (date) {
        return new moment(date).format("dddd DD/MM");
    },
    hoursDate: function (date) {
        return getCalendarDateHours(date, this.date);
    },
    quarterDate: function (date, timeHours) {
        return getCalendarDateTime(date, timeHours, this.quarter);
    },


    timeSlot: function (date, timeHours, idTask) {
        var startCalendarTimeSlot = getCalendarDateTime(date, timeHours);
        var currentAssignmentType = CurrentAssignmentType.get();

        var data = {};

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                var user = SelectedUser.get() == null ? null : Users.findOne(SelectedUser.get());
                if (user === null) return [];


                var availabilityFound = AvailabilityService.getAvailabilityByStart(user.availabilities, startCalendarTimeSlot);
                var assignmentFound = AssignmentService.getAssignmentByStart(user.assignments, startCalendarTimeSlot);

                if (availabilityFound === null && assignmentFound === null) return [];
                if (availabilityFound !== null && assignmentFound !== null) {
                    console.error("Calendar.timeSlot : error while displaying user info, both availability and assignment has been found. \nuser", user, " => availability", availabilityFound, " and assignment", assignmentFound);
                    return [];
                }

                var baseOneHourHeight = 40;
                var accuracy = CalendarAccuracy.findOne().accuracy;

                var data = {}, founded;

                if (availabilityFound !== null) {
                    data.state = "available";
                    data.name = user.name;

                    founded = availabilityFound;
                } else if (assignmentFound !== null) {
                    data.name = assignmentFound.taskName;
                    data.state = "affecte";

                    founded = assignmentFound;
                }

                _.extend(data, founded);
                var end = new moment(founded.end);
                var start = new moment(founded.start);
                var duration = end.diff(start) / (3600 * 1000);

                var height = accuracy * baseOneHourHeight * duration;
                data.height = height + "px";

                break;
            case AssignmentType.TASKTOUSER:
                var task = SelectedTask.get() == null ? null : Tasks.findOne(SelectedTask.get());
                if (task === null) return [];

                var timeSlotFound = TimeSlotService.getTimeSlotByStart(task.timeSlots, startCalendarTimeSlot);
                var assignmentsFound = AssignmentService.getAssignmentByStart(task.assignments, startCalendarTimeSlot, true);

                if (timeSlotFound === null && assignmentsFound.length === 0) return [];


                var baseOneHourHeight = 40;
                var accuracy = CalendarAccuracy.findOne().accuracy;

                var data = {}, founded;

                data.taskId = task._id;
                if (timeSlotFound !== null) {
                    data.state = "available";
                    data.name = task.name;

                    founded = timeSlotFound;
                }
                if (assignmentsFound.length !== 0) { //at least one assignment TODO code couleur d'avancement en fonction des peoples needed
                    data.name = assignmentsFound[0].taskName; //idem, la meme task
                    data.state = "in-progress";

                    founded = assignmentsFound[0]; //normalement ils ont tous les memes date, TODO controler ca
                }

                _.extend(data, founded);
                var end = new moment(founded.end);
                var start = new moment(founded.start);
                var duration = end.diff(start) / (3600 * 1000);

                var height = accuracy * baseOneHourHeight * duration;
                data.height = height + "px";

                break;
            case AssignmentType.ALL:
                return [];
        }


        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    },
    sideHoursHeight: function () {
        switch (CalendarAccuracy.findOne({}).accuracy) {
            case 0.25 :
                return "oneHour";
            case  0.5 :
                return "oneHour";
            case 1:
                return "oneHour";
            case  2:
                return "twoHour"
            case 4:
                return "fourHour"
        }
    },
    quarterHeight: function () {
        switch (CalendarAccuracy.findOne({}).accuracy) {
            case 0.25 :
                return "quarterHour";
            case  0.5 :
                return "halfHour";
            case 1:
                return "oneHour";
            case  2:
                return "twoHour"
            case 4:
                return "fourHour"
        }
    },



    //works for .heure et .quart d'heure
    isSelected: function (date, timeHours) {
        if(getCalendarDateTime(date, timeHours, 0).isSame(SelectedDate.get())){
            return "selected"
        }
        return ""

    }

});


Template.assignmentCalendar.events({
    //taskToUser (we click on a complete task time slot)
    "click .creneau": function (event) {
        //TODO gerer le double click pour la desaffectation

        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                console.error("Template.assignmentCalendar.events.click .creneau", "User can't normally click on this kind of element when in userToTask");
                return;
                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                var selectedTimeSlot = this;
                selectedTimeslotId = selectedTimeSlot._id;

                //var task = Tasks.findOne({_id: selectedTimeSlot.taskId});
                //var timeSlot = TimeSlotService.getTimeSlot(task, selectedTimeSlot._id);

                //var newFilter = {
                //    availabilities: {
                //        $elemMatch: {
                //            start: {$lte: timeSlot.start},
                //            end: {$gte: timeSlot.end}
                //        }
                //    }
                //};
                //
                //UserFilter.set(newFilter);

                console.info("routing", "/assignment/taskToUser/" + selectedTimeSlot.taskId + "/" + selectedTimeSlot._id);
                Router.go("/assignment/taskToUser/" + selectedTimeSlot.taskId + "/" + selectedTimeSlot._id);


                break;
        }
    },

    //userToTask (we click on a creneau, not on the entire availability)
    "click .heure, .quart_heure": function (event) {
        //TODO gerer le double click pour la desaffectation

        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected availability slot

                //what time did we click on ?
                var $target = $(event.target);

                var selectedDate = null;
                if (typeof $target.attr("hours") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("hours")));
                } else if (typeof $target.attr("quarter") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("quarter")));
                }

                var current = Iron.Location.get().path;

                //new moment(parseInt(selectedDate.format('x')))

                //preveng /assignment/userToTask/inzDwHBs2dnYXbHei/-58526748000000/-58526740800000
                var userId = current.split("/")[3];


                console.info("routing", "/assignment/userToTask/" + userId + "/" + selectedDate);
                Router.go("/assignment/userToTask/" + userId + "/" + selectedDate);


                //var selectedDate = params.selectedDate;
                //SelectedDate.set(selectedDate);
                //var userId = SelectedUser.get()._id;
                //var user = Users.findOne({_id: userId});
                //var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);
                //
                //if (typeof availability === "undefined") {
                //    console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
                //    return;
                //}
                //selectedAvailability = availability;
                //
                ///*
                // Task whose have at least one timeSlot (to begin, just one) as
                //
                // user.Dispocorrespante.start <= task.timeslot.start <= selectedDate and
                // selectedDate <=  task.timeslot.end <=  user.Dispocorrespante.end
                //
                // */
                //
                //var newFilter = {
                //    timeSlots: {
                //        $elemMatch: {
                //            start: {$gte: availability.start, $lte: selectedDate.toDate()},
                //            end: {$gt: selectedDate.toDate(), $lte: availability.end}
                //        }
                //    }
                //};
                //
                //TaskFilter.set(newFilter);
                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                //we let the event bubbles to the parent
                return [];
        }
    }
});


//
//Template.assignmentTasksList.rendered = function(){
//    $(document).ready(function() {
//        $('select').material_select();
//    });
//};
//
//Template.assignmentUsersList.rendered = function(){
//    $(document).ready(function() {
//        $('select').material_select();
//    });
//};



