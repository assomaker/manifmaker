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

    AssignmentTerms.remove({});

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
    console.info("**** Data init success ****");
    console.info("Here are some infos what have been added");
    console.info("Accounts Users collection size is "+Meteor.users.find().fetch().length);
    console.info("Customs Users collection size is "+Users.find().fetch().length);
    console.info("Tasks collection size is "+Tasks.find().fetch().length);
    console.info("Assignments collection size is "+ Assignments.find().fetch().length);
    console.info("Groups collection size is "+Groups.find().fetch().length);
    console.info("Skills collection size is "+Skills.find().fetch().length);
    console.info("Teams collection size is "+Teams.find().fetch().length);
    console.info("Places collection size is "+Places.find().fetch().length);
    console.info("AssignmentTerms collection size is "+AssignmentTerms.find().fetch().length);
    console.info("GroupRoles collection size is "+GroupRoles.find().fetch().length);

    //allow/deny policy
    Tasks.before.insert(ServerTaskService.allowInsert);
    Tasks.before.update(ServerTaskService.allowUpdate);
    Tasks.before.remove(ServerTaskService.allowDelete);


});














