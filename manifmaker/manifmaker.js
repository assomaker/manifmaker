if (Meteor.isClient) {

}

if (Meteor.isServer) {

}


Users = new Mongo.Collection("users");
Tasks = new Mongo.Collection("tasks");
Assignments = new Mongo.Collection("assignment");

//calendar
CalendarDays = new Mongo.Collection("days");
CalendarHours = new Mongo.Collection("hours");
CalendarQuarter = new Mongo.Collection("quarters");
CalendarAccuracy = new Mongo.Collection("accuracy");



insertAndFetch = function (Collection, data) {
    var _id = Collection.insert(data);
    return Collection.findOne({_id: _id});
};

getDateFromTime = function (hours, minutes = 0) {
    var now = new Date();
    return new Date(now.getYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
};

getDateFromDate = function (day, month, year) {
    var now = new Date();
    year = year || now.getYear();
    month = month || now.getMonth()
    return new Date(year, month, day, 0, 0, 0);
};

Meteor.methods({
    setCalendarAccuracy: function (accuracy) {
        if(Meteor.isServer){
            CalendarHours.remove({});
            CalendarQuarter.remove({});
        var accuracyDb = CalendarAccuracy.findOne({});
        if(typeof accuracyDb !== "undefined") CalendarAccuracy.remove({_id: accuracyDb._id});
        CalendarAccuracy.insert({accuracy: accuracy});

        var number = ((accuracy <= 1) ? 1 : accuracy);
        for (var i = 0; i < 24; i = i + number)
            CalendarHours.insert({date: i});

        var number2 = ((accuracy < 1) ? 60 * accuracy : 60);
        for (var i = 0; i <= 45; i = i + number2)
            CalendarQuarter.insert({quarter: i});
        }

    },

    populateData: function () {
        //Users.remove({});
        //Tasks.remove({});
        //Assignments.remove({});

        var user1 = new User("user1", [
                new Availability(getDateFromTime(8), getDateFromTime(10)),
                new Availability(getDateFromTime(18), getDateFromTime(22))]
        );
        var user2 = new User("user2", [
            new Availability(getDateFromTime(10), getDateFromTime(20))
        ]);
        var user3 = new User("user3", [
            new Availability(getDateFromTime(10), getDateFromTime(14)),
            new Availability(getDateFromTime(16), getDateFromTime(18)),
            new Availability(getDateFromTime(20), getDateFromTime(22))
        ]);

        user1 = insertAndFetch(Users, user1);
        user2 = insertAndFetch(Users, user2);
        user3 = insertAndFetch(Users, user3);

        var task1 = new Task("task1", [
            new TimeSlot(getDateFromTime(8), getDateFromTime(10), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
            new TimeSlot(getDateFromTime(4), getDateFromTime(6), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
        ]);
        var task2 = new Task("task2", [
            new TimeSlot(getDateFromTime(10), getDateFromTime(12), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
            new TimeSlot(getDateFromTime(10), getDateFromTime(11), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
        ]);
        var task3 = new Task("task3", []);

        task1 = insertAndFetch(Tasks, task1);
        task2 = insertAndFetch(Tasks, task2);
        task3 = insertAndFetch(Tasks, task3);

        //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[0]._id);
        //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[1]._id);


        CalendarDays.insert(new CalendarDay(getDateFromDate(13, 5)));
        CalendarDays.insert(new CalendarDay(getDateFromDate(14, 5)));
        CalendarDays.insert(new CalendarDay(getDateFromDate(15, 5)));

        var accuracy = CalendarAccuracyEnum["1"];
        Meteor.call("setCalendarAccuracy",accuracy);
    },


    assignUserToTaskTimeSlot: function (userId, taskId, timeSlotId) {
        console.info("assignUserToTaskTimeSlot to user", userId, "task", taskId, "timeslot", timeSlotId);
        var assignment = new Assignment(userId, taskId, timeSlotId);

        var assignmentId = Assignments.insert(assignment);

        assignment._id = assignmentId;
        return assignment;

    }
});



