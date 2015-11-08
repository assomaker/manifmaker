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
        Assignments.remove({});;

        var user1 = {name: "user1"};
        var user2 = {name: "user2"};
        var user3 = {name: "user3"};

        Users.insert(user1);
        Users.insert(user2);
        Users.insert(user3);

        var task1 = {name:"task1"};
        var task2 = {name:"task2"};
        var task3 = {name:"task3"};

        Tasks.insert(task1);
        Tasks.insert(task2);
        Tasks.insert(task3);

    }
});