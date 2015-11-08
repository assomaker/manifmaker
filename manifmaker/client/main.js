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

Template.assignment.helpers({
    userName: function () {
        return Users.findOne({_id: this._idUser}).name;
    },
    taskName: function(){
        return Tasks.findOne({_id: this._idTask}).name;
    },
    start: function(){
        return Tasks.findOne({_id: this._idTask}).timeslots;
    }
});


Meteor.startup(function () {
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("assignments");

});



