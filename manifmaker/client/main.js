Template.userList.helpers({
    users: function () {
        return Users.find({});
    }
});

Template.taskList.helpers({
    tasks: function () {
        return Tasks.find({});
    }
});

Template.assignmentList.helpers({
    assignments: function () {
        return Assignments.find({});
    }
});



Meteor.startup(function () {
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("assignments");

});



