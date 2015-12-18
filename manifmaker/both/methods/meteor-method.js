
Meteor.methods({
    setCalendarAccuracy: function (accuracy) {
        if (Meteor.isServer) {
            CalendarHours.remove({});
            CalendarQuarter.remove({});
        }
        var accuracyDb = CalendarAccuracy.findOne({});
        if (typeof accuracyDb !== "undefined") CalendarAccuracy.remove({_id: accuracyDb._id});
        CalendarAccuracy.insert({accuracy: accuracy});

        var number = ((accuracy <= 1) ? 1 : accuracy);
        for (var i = 0; i < 24; i = i + number)
            CalendarHours.insert({date: i});

        var number2 = ((accuracy < 1) ? 60 * accuracy : 60);
        for (var i = 0; i <= 45; i = i + number2)
            CalendarQuarter.insert({quarter: i});

    },


    removeAssignUserToTaskTimeSlot: function (userId, taskId, timeSlotId, peopleNeed) {
        console.info("removeAssignUserToTaskTimeSlot to user", userId, "task", taskId, "timeslot", timeSlotId, "with people need", peopleNeed);

        var user = Users.findOne({_id: userId});
        var task = Tasks.findOne({_id: taskId});
        var timeSlot = TimeSlotService.getTimeSlot(task, timeSlotId);


        var assignment = Assignments.findOne({
            userId: userId,
            taskId: taskId,
            timeSlotId: timeSlotId,
            'peopleNeed._id': peopleNeed._id
        });
        Assignments.remove(assignment._id);

        AvailabilityService.restoreAvailabilities(user, timeSlot.start, timeSlot.end);
        //PeopleNeedService.restorePeopleNeed(task, timeSlot, peopleNeed);
        //TODO don't forget to remove assignedUserId when restoring people need from the available one
        console.error("!!!!  TODO PeopleNeedService.restorePeopleNeed(task, timeSlot, peopleNeed);");


        return assignment;

    },


    assignUserToTaskTimeSlot: function (userId, taskId, timeSlotId, peopleNeed) {
        console.info("assignUserToTaskTimeSlot to user", userId, "task", taskId, "timeslot", timeSlotId, "with people need", peopleNeed);

        var user = Users.findOne({_id: userId});
        var task = Tasks.findOne({_id: taskId});
        var timeSlot = TimeSlotService.getTimeSlot(task, timeSlotId);


        if (!AvailabilityService.checkUserAvailabilty(user, timeSlot.start, timeSlot.end)) {
            throw new Meteor.Error(500, `User ${user.name} is not available from ${timeSlot.start} to ${timeSlot.end}`);
        }

        if (!PeopleNeedService.checkPeopleNeedForUser(task, timeSlot, peopleNeed, user)) {
            var skillsToString = user.skills.toString();
            throw new Meteor.Error(500, `User ${user.name} with skills ${skillsToString} can't be assigned to peopleNeed userId ${peopleNeed.userId} teamId ${peopleNeed.teamId} skills ${peopleNeed.skills.toString()}`);
        }


        var assignment = new Assignment(userId, taskId, timeSlotId, peopleNeed);
        Assignments.insert(assignment);

        AvailabilityService.removeAvailabilities(user, timeSlot.start, timeSlot.end);
        PeopleNeedService.removePeopleNeed(task, timeSlot, peopleNeed, userId);


        return assignment;

    },


    populate: function(){
        if(Meteor.isServer){
            populateData();
        }
    }
});

