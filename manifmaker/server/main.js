Meteor.startup(function () {
    // code to run on server at startup
    Assignments.remove({});
    Users.remove({});
    Tasks.remove({});
    Places.remove({});
    Teams.remove({});
    Groups.remove({});
    Skills.remove({});
    Teams.remove({});

    Meteor.roles.remove({});
    GroupRoles.remove({});
    Meteor.users.remove({});


    //AssignmentCalendarDisplayedDays.remove({});
    //AssignmentCalendarDisplayedHours.remove({});
    //AssignmentCalendarDisplayedQuarter.remove({});
    //AssignmentCalendarDisplayedAccuracy.remove({});


    //  Assignments.before.insert( /*if we need to add user and task data to assignments*/);
    Assignments.after.insert(ServerAssignmentService.propagateAssignment);
    Assignments.after.remove(ServerAssignmentService.removeAssignment);

    initAccessRightData();
    populateData();


});














