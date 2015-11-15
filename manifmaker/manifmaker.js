if (Meteor.isClient) {

}

if (Meteor.isServer) {

}


Users = new Mongo.Collection("users");
Tasks = new Mongo.Collection("tasks");
Assignments = new Mongo.Collection("assignment");

insertAndFetch = function (Collection, data) {
    var _id = Collection.insert(data);
    return Collection.findOne({_id:_id});
};


Meteor.methods({
    populateData: function () {
        Users.remove({});
        Tasks.remove({});
        Assignments.remove({});

        var user1 = new User("user1", [
                new Availability("8h", "14h"),
                new Availability("18h", "20"),
                new Availability("22h", "00h")]
        );
        var user2 = new User("user2", [
            new Availability("2h", "14h")
        ]);
        var user3 = new User("user3", [
            new Availability("8h", "14h"),
            new Availability("16h", "18h"),
            new Availability("20h", "00h")
        ]);

        user1 = insertAndFetch(Users, user1);
        user2 = insertAndFetch(Users, user2);
        user3 = insertAndFetch(Users, user3);

        var task1 = new Task("task1", [
            new TimeSlot("8h", "10h", [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
            new TimeSlot("10h", "12h", [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
        ]);
        var task2 = new Task("task2", [
            new TimeSlot("2h", "6h", [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
            new TimeSlot("14", "16h", [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
        ]);
        var task3 = new Task("task3", []);

        task1 = insertAndFetch(Tasks, task1)
        task2 = insertAndFetch(Tasks, task2);
        task3 = insertAndFetch(Tasks, task3);

        Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[0]._id);
        Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[1]._id);


    },

    assignUserToTaskTimeSlot: function (userId, taskId, timeSlotId) {
        console.info("assignUserToTaskTimeSlot to user",userId,"task",taskId,"timeslot",timeSlotId);
        var assignment = new Assignment(userId, taskId, timeSlotId);

        var assignmentId = Assignments.insert(assignment);

        assignment._id = assignmentId;
        return assignment;

    }
});



