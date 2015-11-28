Meteor.startup(function () {

    Meteor.publish("users", function () {
        return Users.find({});
    });

    Meteor.publish("tasks", function () {
        return Tasks.find({});
    });

    Meteor.publish("assignments", function () {
        return Assignments.find({});
    });

    Meteor.publish("skills", function () {
        return Skills.find({});
    });

    Meteor.publish("teams", function () {
        return Teams.find({});
    });

    //below will be only client only

    Meteor.publish("calendarDays", function () {
        return CalendarDays.find({});
    });

    Meteor.publish("calendarHours", function () {
        return CalendarHours.find({});
    });

    Meteor.publish("calendarQuarter", function () {
        return CalendarQuarter.find({});
    });

    Meteor.publish("calendarAccuracy", function () {
        return CalendarAccuracy.find({});
    });


});
