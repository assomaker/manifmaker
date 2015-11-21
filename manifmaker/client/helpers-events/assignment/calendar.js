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


                var availabilityFound = null;
                var currentCalendarTimeSlot =  new moment(new Date(startCalendarTimeSlot));
                user.availabilities.forEach(availability => {
                    //we only take the first matching timeSlot, le css ne sait aps encore gerer deux data timeSlot sur un meme calendar timeSlot
                    if (currentCalendarTimeSlot.isSame(new moment(new Date(availability.start)))) {
                        availabilityFound = availability;
                        return false;
                    }
                });
                if(availabilityFound === null) return [];

                data.name = user.name;
                data.userId = user._id;
                _.extend(data,availabilityFound);

                var baseOneHourHeight = 40;
                var accuracy = CalendarAccuracy.findOne().accuracy

                var end = new moment(availabilityFound.end);
                var start =  new moment(availabilityFound.start);
                var availabilityDuration = end.diff(start)/(3600 *1000);

                var height = accuracy * baseOneHourHeight * availabilityDuration;

                data.height = height + "px";

                break;
            case AssignmentType.TASKTOUSER:
                var task = SelectedTask.get() == null ? null : Tasks.findOne(SelectedTask.get());
                if (task === null) return [];


                var timeSlotFound = null;
                var currentCalendarTimeSlot =  new moment(new Date(startCalendarTimeSlot));
                task.timeSlots.forEach(timeSlot => {
                    //we only take the first matching timeSlot, le css ne sait aps encore gerer deux data timeSlot sur un meme calendar timeSlot
                    if (currentCalendarTimeSlot.isSame(new moment(new Date(timeSlot.start)))) {
                        timeSlotFound = timeSlot;
                        return false;
                    }
                });
                if(timeSlotFound === null) return [];

                data.name = task.name;
                data.taskId = task._id;
                _.extend(data,timeSlotFound);

                var baseOneHourHeight = 40;
                var accuracy = CalendarAccuracy.findOne().accuracy

                var end = new moment(timeSlotFound.end);
                var start =  new moment(timeSlotFound.start);
                var timeSlotDuration = end.diff(start)/(3600 *1000);

                var height = accuracy * baseOneHourHeight * timeSlotDuration;

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
    }

});


Template.assignmentCalendar.events({
    //taskToUser (we click on a complete task time slot)
   "click .creneau": function(event){
       //TODO gerer le double click pour la desaffectation

       var currentAssignmentType = CurrentAssignmentType.get();

       switch (currentAssignmentType) {
           case AssignmentType.USERTOTASK:
               console.error("Template.assignmentCalendar.events.click .creneau","User can't normally click on this kind of element when in userToTask");
               break;
           case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
               var selectedTimeSlot = this;
               selectedTimeslotId = selectedTimeSlot._id;

               var task = Tasks.findOne({_id: selectedTimeSlot.taskId});
               var timeSlot = TimeSlotService.getTimeSlot(task, selectedTimeSlot._id);

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
   },

    //userToTask (we click on a creneau, not on the entire availability)
    "click .heure, .quart_heure": function(event){
        //TODO gerer le double click pour la desaffectation


        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected availability slot

                //what time did we click on ?
                var $target = $(event.target);

                var selectedDate = null;
                //var endSelectedDate = null;
                if(typeof $target.attr("hours") !== "undefined"){
                    selectedDate = new moment(new Date($target.attr("hours")));
                } else
                if(typeof $target.attr("quarter") !== "undefined"){
                    selectedDate = new moment(new Date($target.attr("quarter")));
                }



                var userId = SelectedUser.get()._id;


                var user = Users.findOne({_id: userId});
                var availability = AvailabilityService.getAvailability(user,selectedDate);

                if(typeof availability === "undefined"){
                    console.error("Template.assignmentCalendar.events.click .heure, .quart_heure","User can't normally click on this kind of element when in userToTask");
                    return;
                }

                selectedAvailability = availability;


                /*
                 Task whose have at least one timeSlot (to begin, just one) as

                 user.Dispocorrespante.start <= task.timeslot.start <= selectedDate and
                 selectedDate <=  task.timeslot.end <=  user.Dispocorrespante.end

                 */

                var newFilter = {
                    timeSlots: {
                        $elemMatch: {
                            start: {$gte: availability.start, $lte: selectedDate.toDate()},
                            end: {$gt: selectedDate.toDate(), $lte: availability.end}
                        }
                    }
                };

                TaskFilter.set(newFilter);

                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                console.error("Template.assignmentCalendar.events.click .creneau","User can't normally click on this kind of element when in userToTask");
                return [];
        }
    }
});




