/**
 * @summary Meteor methods
 * @namespace MeteorMethods
 */
Meteor.methods({

    /**
     * @summary Constructor for a Collection
     * @locus Anywhere
     * @namespace MeteorMethods
     * @name removeAssignUserToTaskTimeSlot
     */
    removeAssignUserToTaskTimeSlot: function (peopleNeedId, userId,  taskId = null, timeSlotId = null) {
        console.info("removeAssignUserToTaskTimeSlot to user", userId, "task", taskId, "timeslotId", timeSlotId, "with people need", peopleNeedId);


        if(!peopleNeedId)
            throw new Meteor.Error(400,'assignUserToTaskTimeSlot peopleNeedId is null');
        if(!userId)
            throw new Meteor.Error(400,'assignUserToTaskTimeSlot userId is null');

        var ret = TimeSlotService.getTaskAndTimeSlotAndAssignedPeopleNeedByAssignedPeopleNeedId(peopleNeedId);
        var timeSlot = ret.timeSlot;
        var task = ret.task;
        var peopleNeed = ret.peopleNeed;

        var user = Users.findOne({_id: userId});


        var assignment = Assignments.findOne({
            userId: userId,
            taskId: task._id,
            timeSlotId: timeSlot._id,
            peopleNeedId: peopleNeed._id
        });
        Assignments.remove(assignment._id);

        AvailabilityService.restoreAvailabilities(user, timeSlot.start, timeSlot.end);
        PeopleNeedService.restorePeopleNeed(task, timeSlot, peopleNeed, userId);

        return assignment;
    },


    assignUserToTaskTimeSlot: function (peopleNeedId, userId , taskId = null, timeSlotId = null) {
        console.info("assignUserToTaskTimeSlot to user", userId, "task", taskId, "timeslot", timeSlotId, "with peopleNeedId", peopleNeedId);

        if(!peopleNeedId)
            throw new Meteor.Error(400,'assignUserToTaskTimeSlot peopleNeedId is null');
        if(!userId)
            throw new Meteor.Error(400,'assignUserToTaskTimeSlot userId is null');

        var ret = TimeSlotService.getTaskAndTimeSlotAndPeopleNeedByPeopleNeedId(peopleNeedId);
        var timeSlot = ret.timeSlot;
        var task = ret.task;
        var peopleNeed = ret.peopleNeed;

        var user = Users.findOne({_id: userId});

        if (!AvailabilityService.checkUserAvailabilty(user, timeSlot.start, timeSlot.end)) {
            throw new Meteor.Error(500, `User ${user.name} is not available from ${timeSlot.start} to ${timeSlot.end}`);
        }

        if (!PeopleNeedService.checkPeopleNeedForUser(task, timeSlot, peopleNeed, user)) {
            var skillsToString = user.skills.toString();
            throw new Meteor.Error(500, `User ${user.name} with skills ${skillsToString} can't be assigned to peopleNeed userId ${peopleNeed.userId} teamId ${peopleNeed.teamId} skills ${peopleNeed.skills.toString()}`);
        }


        var assignmentId = Assignments.insert({
            userId: userId,
            taskId: task._id,
            timeSlotId: timeSlot._id,
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

