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
    hoursDate: function (date, time) {
        var date = new moment(date);
        date.hours(time);
        return date;
    },
    quarterDate: function (date, time, minutes) {
        var date = new moment(date);
        date.hours(time);
        date.minutes(minutes);
        return date;
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




