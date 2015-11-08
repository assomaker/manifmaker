if (Meteor.isClient) {

}

if (Meteor.isServer) {

}


Users = new Mongo.Collection("users");
Tasks = new Mongo.Collection("tasks");
Assignments = new Mongo.Collection("assignment");


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

        Users.insert(user1);
        Users.insert(user2);
        Users.insert(user3);

        var task1 = new Task("task1", [
            new Timeslot("8h", "10h", [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
            new Timeslot("10h", "12h", [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
        ]);
        var task2 = new Task("task2", []);
        var task3 = new Task("task3", []);

        Tasks.insert(task1);
        Tasks.insert(task2);
        Tasks.insert(task3);

    }
});


