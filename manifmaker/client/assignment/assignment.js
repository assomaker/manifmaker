Template.assignmentCalendar.helpers({
    days: function () {
        return CalendarDays.find({});
    },
    hours: function () {
        return CalendarHours.find({});
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
    }

});




