Meteor.methods({
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


        var assignmentId = Assignments.insert({
            userId: userId,
            taskId: taskId,
            timeSlotId: timeSlotId,
            peopleNeedId: peopleNeed._id
        });


        AvailabilityService.removeAvailabilities(user, timeSlot.start, timeSlot.end);
        PeopleNeedService.removePeopleNeed(task, timeSlot, peopleNeed, userId);


        return assignmentId;

    },


    populate: function () {
        if (Meteor.isServer) {
            populateData();
        }
    }
});

