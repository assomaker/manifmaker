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

    Meteor.publish("teams", function (){
        return Teams.find({});
    });

    Meteor.publish("places", function(){
        return Places.find({});
    });

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
