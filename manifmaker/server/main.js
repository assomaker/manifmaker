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


    _.each(AllCollections, function (coll) {
        coll.remove({});
    });
}
Meteor.startup(function () {

    // code to run on server at startup

    //AssignmentCalendarDisplayedDays.remove({});
    //AssignmentCalendarDisplayedHours.remove({});
    //AssignmentCalendarDisplayedQuarter.remove({});
    //AssignmentCalendarDisplayedAccuracy.remove({});


    //  Assignments.before.insert( /*if we need to add user and task data to assignments*/);
    Assignments.after.insert(ServerAssignmentService.propagateAssignment);
    Assignments.before.update(ServerAssignmentService.preventUpdate);
    Assignments.after.remove(ServerAssignmentService.removeAssignment);

    Users.after.insert(ServerUserService.propagateRoles);
    Users.after.update(ServerUserService.propagateRoles);

    deleteAll();
    initAccessRightData();
    populateData();


});














