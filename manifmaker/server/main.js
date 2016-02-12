function deleteAll() {
    Meteor.roles.remove({});
    GroupRoles.remove({});
    Meteor.users.remove({});

    Users.remove({});

    Assignments.remove({});
    Tasks.remove({});
    Places.remove({});
    Teams.remove({});
    Groups.remove({});
    Skills.remove({});
    Teams.remove({});

}
Meteor.startup(function () {

    // code to run on server at startup

    //AssignmentCalendarDisplayedDays.remove({});
    //AssignmentCalendarDisplayedHours.remove({});
    //AssignmentCalendarDisplayedQuarter.remove({});
    //AssignmentCalendarDisplayedAccuracy.remove({});


    //propagate assignment update
    //  Assignments.before.insert( /*if we need to add user and task data to assignments*/);
    Assignments.after.insert(ServerAssignmentService.propagateAssignment);
    Assignments.before.update(ServerAssignmentService.preventUpdate);
    Assignments.after.remove(ServerAssignmentService.removeAssignment);

    //propagate roles update
    Users.after.insert(ServerUserService.propagateRoles);
    Users.after.update(ServerUserService.propagateRoles);
    GroupRoles.after.update(ServerUserService.propagateGroupRoles);


    //init data
    deleteAll();
    initAccessRightData();
    populateData();

    //allow/deny policy
    Tasks.before.insert(ServerTaskService.allowInsert);
    Tasks.before.update(ServerTaskService.allowUpdate);
    Tasks.before.remove(ServerTaskService.allowDelete);


});














