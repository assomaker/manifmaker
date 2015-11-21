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
Meteor.startup(function () {
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("assignments");
    Meteor.subscribe("calendarAccuracy");
    Meteor.subscribe("calendarDays");
    Meteor.subscribe("calendarHours");
    Meteor.subscribe("calendarQuarter");


    //pre select task1
    preSelecterTaskByTaskName("task2");
});


