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
DisplayAssignedTask = new ReactiveVar(false);
TaskNeededTeamFilter = new ReactiveVar(null);
TaskSkillsFilter = new ReactiveVar(null);
UserSkillsFilter = new ReactiveVar(defaultFilter);
SelectedTask = new ReactiveVar(null);
SelectedTaskBreadCrumb = new ReactiveVar(null); //TODO voir si on peut la merger avec SelectedTask
SelectedTimeSlot = new ReactiveVar(null);
SelectedDate = new ReactiveVar(null);

SelectedAvailability = new ReactiveVar(null);
SelectedPeopleNeed = new ReactiveVar(null);

AssignmentFilter = new ReactiveVar(defaultFilter);
CurrentAssignmentType = new ReactiveVar(AssignmentType.ALL);
IsUnassignment = new ReactiveVar(false);

TaskListTeamFilter = new ReactiveVar(defaultFilter);


function preSelecterTaskByTaskName(name) {
    UserFilter.set(noneFilter);
    TaskFilter.set(defaultFilter);
    CurrentAssignmentType.set(AssignmentType.TASKTOUSER);

    var query = Tasks.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedTask.set({_id: _id});
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
            SelectedAvailability.set(null);
            TaskFilter.set(noneFilter);
        }
    });

}


Meteor.startup(function () {
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.subscribe("skills");
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("groups");
    Meteor.subscribe("group-roles");
    Meteor.subscribe("roles");
    Meteor.subscribe("assignment-terms", function () {
        AssignmentServiceClient.setCalendarTerms();
    });


    //preSelecterTaskByTaskName("task1");
    //preSelectedUserByUserName("user1");

    SimpleSchema.debug = true;
    AutoForm.addHooks(null, {
        onError: function (name, error, template) {
            console.log("AutoForm.addHooks : "+name + " error:", error);
        }
    });

    var accuracy = CalendarAccuracyEnum["1"];
    AssignmentServiceClient.setCalendarAccuracy(accuracy);
});

