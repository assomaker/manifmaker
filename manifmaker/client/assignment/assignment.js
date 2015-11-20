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
                //SelectedUser.get() == null ? "" : Users.findOne(SelectedUser.get()).name;
                return [];
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
   "click .creneau": function(event){
       //TODO gerer le double click pour la desaffectation


       var currentAssignmentType = CurrentAssignmentType.get();

       switch (currentAssignmentType) {
           case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected availability slot

               //var $availability;
               //if (target.hasClass("timeslot"))
               //    $availability = target;
               //else
               //    $availability = target.parents(".timeslot");
               //
               ////_id is undefined because there is no availability id
               //selectedAvailability = "notnull"; //TODO il faudra voir s'il faut un _id pour user.availabilies
               //
               //
               //$availability.removeData();//in order to force jQuery to retrieve the data we set in the dom with Blaze
               //var start = new Date($availability.data("start"));
               //var end = new Date($availability.data("end"));
               //
               //var newFilter = {
               //    timeSlots: {
               //        $elemMatch: {
               //            start: {$gte: start},
               //            end: {$lte: end}
               //        }
               //    }
               //
               //};
               //
               //TaskFilter.set(newFilter);
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
   }
});




