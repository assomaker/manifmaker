Meteor.methods({
    setCalendarAccuracy: function (accuracy) {
        if(Meteor.isServer){
            CalendarHours.remove({});
            CalendarQuarter.remove({});
        }
        var accuracyDb = CalendarAccuracy.findOne({});
        if(typeof accuracyDb !== "undefined") CalendarAccuracy.remove({_id: accuracyDb._id});
        CalendarAccuracy.insert({accuracy: accuracy});

        var number = ((accuracy <= 1) ? 1 : accuracy);
        for (var i = 0; i < 24; i = i + number)
            CalendarHours.insert({date: i});

        var number2 = ((accuracy < 1) ? 60 * accuracy : 60);
        for (var i = 0; i <= 45; i = i + number2)
            CalendarQuarter.insert({quarter: i});

    },




    assignUserToTaskTimeSlot: function (userId, taskId, timeSlotId, peopleNeed) {
        console.info("assignUserToTaskTimeSlot to user", userId, "task", taskId, "timeslot", timeSlotId,"with people need",peopleNeed);
        var assignment = new Assignment(userId, taskId, timeSlotId, peopleNeed);

        var assignmentId = Assignments.insert(assignment);

        assignment._id = assignmentId;

        var timeSlot = TimeSlotService.getTimeSlot(Tasks.findOne({_id:taskId}),timeSlotId);

        AvailabilityService.removeAvailabilities(Users.findOne({_id:userId}),timeSlot.start,timeSlot.end);

        PeopleNeedService.removePeopleNeed(Tasks.findOne({_id:taskId}), timeSlot,peopleNeed);

        return assignment;

    }
});

