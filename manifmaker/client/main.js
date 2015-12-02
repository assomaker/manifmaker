defaultFilter = {};
noneFilter = {none: "none"};
UserFilter = new ReactiveVar(defaultFilter);
SelectedUser = new ReactiveVar(null);
TaskFilter = new ReactiveVar(defaultFilter);
SelectedTask = new ReactiveVar(null);

selectedTimeslotId = null; //TODO mettre ca dans Session ?//TODO pas top
selectedAvailability = null;//TODO pas top

AssignmentFilter = new ReactiveVar(defaultFilter);
CurrentAssignmentType = new ReactiveVar(AssignmentType.ALL);


function preSelecterTaskByTaskName(name) {
    UserFilter.set(noneFilter);
    TaskFilter.set(defaultFilter);
    CurrentAssignmentType.set(AssignmentType.TASKTOUSER);

    var query = Tasks.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedTask.set({_id: _id});
            selectedTimeslotId = null;//TODO pas top
            UserFilter.set(noneFilter);
        }
    });

}


function preSelectedUserByUserName(name) {
    UserFilter.set(defaultFilter);
    TaskFilter.set(noneFilter);
    CurrentAssignmentType.set(AssignmentType.USERTOTASK);

    var query = Users.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedUser.set({_id: _id});
            selectedAvailability = null;//TODO pas top
            TaskFilter.set(noneFilter);
        }
    });

}


Meteor.startup(function () {

    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("respManif");
    Meteor.subscribe("calendarAccuracy");
    Meteor.subscribe("calendarDays");
    Meteor.subscribe("calendarHours");
    Meteor.subscribe("calendarQuarter");


    //preSelecterTaskByTaskName("task2");


    preSelectedUserByUserName("user1");

});

