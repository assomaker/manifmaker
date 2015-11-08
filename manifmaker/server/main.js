Meteor.startup(function () {
    // code to run on server at startup

    Users.remove();
    Tasks.remove();
    Assignments.remove();


    Meteor.call("populateData");


    Meteor.publish("users", function () {
        return Users.find({});
    });

    Meteor.publish("tasks", function () {
        return Tasks.find({});
    });

    Meteor.publish("assignment", function () {
        return Assignment.find({});
    });



});