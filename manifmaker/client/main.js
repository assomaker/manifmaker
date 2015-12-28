defaultFilter = {};
noSearchFilter = "";
noneFilter = {none: "none"};
UserFilter = new ReactiveVar(defaultFilter);
SelectedUser = new ReactiveVar(null);
TaskFilter = new ReactiveVar(defaultFilter);
TaskIndexFilter = new ReactiveVar(noSearchFilter);
UserIndexFilter = new ReactiveVar(noSearchFilter);
UserTeamFilter = new ReactiveVar(defaultFilter);
TaskTeamFilter = new ReactiveVar(defaultFilter);
UserSkillsFilter = new ReactiveVar(defaultFilter);
SelectedTask = new ReactiveVar(null);
SelectedTimeSlot = new ReactiveVar(null);
SelectedDate = new ReactiveVar(null);

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
    Meteor.subscribe("skills");
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("groups");

    //below will be client only
    Meteor.subscribe("calendarAccuracy");
    Meteor.subscribe("AssignmentCalendarDay");
    Meteor.subscribe("calendarHours");
    Meteor.subscribe("calendarQuarter");


    //preSelecterTaskByTaskName("task1");
    //preSelectedUserByUserName("user1");

    SimpleSchema.debug = true;
    AutoForm.addHooks(null, {
        onError: function (name, error, template) {
            console.log(name + " error:", error);
        }
    });
});

