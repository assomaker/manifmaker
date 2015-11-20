function getCalendarHoursDate(date,timeHours) {
    var date = new moment(date);
    date.hours(timeHours);
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
        return getCalendarHoursDate.call(date,this.date);
    },
    quarterDate: function (date, timeHours) {
        var dateWithHours = getCalendarHoursDate.call(date, timeHours);
        var date = new moment(dateWithHours);
        var minutes = this.quarter;
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
    },

    timeSlot: function(quarterDate, date2, date, quarter){
        //console.log("--- ",quarterDate.format()," \n ---- ",date2," \n ---- ",date," \n ----",quarter);
    }

});




