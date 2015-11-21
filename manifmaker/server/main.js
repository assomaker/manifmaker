Meteor.startup(function () {
    // code to run on server at startup

    Assignments.remove({});
    Users.remove({});
    Tasks.remove({});
    CalendarDays.remove({});
    CalendarHours.remove({});
    CalendarQuarter.remove({});
    CalendarAccuracy.remove({});


    //  Assignments.before.insert( /*if we need to add user and task data to assignments*/);
    Assignments.after.insert(ServerAssingnmentService.propagateAssignment);
    Assignments.after.remove(ServerAssingnmentService.removeAssignment);

    populateData();

    PublicationService.defaultPublication();


});


ServerAssingnmentService =
class ServerAssignmentService {

    static propagateAssignment(assignmentId, assignment, fieldNames) {
        console.log("propagateAssignment for", assignment);
        var assignment = AssignmentService.read(assignment);
        var updateUser = {},
            updateTask = {},
            user = UserRepository.findOne(assignment.userId),//Meteor.users.findOne(review.userId),
            task = TaskRepository.findOne(assignment.taskId);

        var timeSlot = TimeSlotService.getTimeSlot(task, assignment.timeSlotId);
        delete timeSlot.peopleNeeded;

        var userAssignment = new UserAssignment(task.name, timeSlot.start, timeSlot.end, assignment._id);
        updateUser.assignments = user.assignments;
        updateUser.assignments.push(userAssignment); //' + assignment.taskId] = review;
        Users.update(assignment.userId, {$set: updateUser});

        var taskAssignment = new TaskAssignment(user.name, timeSlot.start, timeSlot.end, assignment._id);
        updateTask.assignments = task.assignments;
        updateTask.assignments.push(taskAssignment);
        Tasks.update(assignment.taskId, {$set: updateTask});
    }


    static removeAssignment(assignmentId, assignment) {
        console.log("removeAssignment for", assignment);
        var assignment = AssignmentService.read(assignment);
        var updateUser = {},
            updateTask = {},
            user = UserRepository.findOne(assignment.userId),//Meteor.users.findOne(review.userId),
            task = TaskRepository.findOne(assignment.taskId);

        updateUser.assignments = user.assignments;
        updateUser.assignments.pop(
            user.assignments.indexOf(
                _.findWhere(
                    user.assignments, {assignmentId: assignment._id}
                )
            )
        );
        Users.update(assignment.userId, {$set: updateUser});

        updateTask.assignments = task.assignments;
        updateTask.assignments.pop(
            task.assignments.indexOf(
                _.findWhere(
                    task.assignments, {assignmentId: assignment._id}
                )
            )
        );
        Tasks.update(assignment.taskId, {$set: updateTask});
    }

}


PublicationService =
class PublicationService {

    static defaultPublication() {

        Meteor.publish("users", function () {
            return Users.find({});
        });

        Meteor.publish("tasks", function () {
            return Tasks.find({});
        });

        Meteor.publish("assignments", function () {
            return Assignments.find({});
        });

        Meteor.publish("calendarDays", function () {
            return CalendarDays.find({});
        });

        Meteor.publish("calendarHours", function () {
            return CalendarHours.find({});
        });

        Meteor.publish("calendarQuarter", function () {
            return CalendarQuarter.find({});
        });

        Meteor.publish("calendarAccuracy", function () {
            return CalendarAccuracy.find({});
        });
    }

}


Assignments.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fieldNames, modifier) {
        throw new Meteor.Error(400, "An 'Assignment' can't be update but only created or deleted");
    },
    remove: function (userId, doc) {
        return true;
    }
});



populateData =  function () {
    //Users.remove({});
    //Tasks.remove({});
    //Assignments.remove({});

    var user1 = new User("user1", [
            new Availability(getDateFromTime(8), getDateFromTime(9)),
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
        new TimeSlot(getDateFromTime(8), getDateFromTime(11), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
        new TimeSlot(getDateFromTime(4), getDateFromTime(6), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
    ]);
    var task2 = new Task("task2", [
        new TimeSlot(getDateFromTime(10), getDateFromTime(12), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
        new TimeSlot(getDateFromTime(14), getDateFromTime(22), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
    ]);
    var task3 = new Task("task3", []);

    task1 = insertAndFetch(Tasks, task1);
    task2 = insertAndFetch(Tasks, task2);
    task3 = insertAndFetch(Tasks, task3);

    //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[0]._id);
    //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[1]._id);


    CalendarDays.insert(new CalendarDay(getDateFromDate(13, 5 - 1)));
    //CalendarDays.insert(new CalendarDay(getDateFromDate(14, 5)));
    //CalendarDays.insert(new CalendarDay(getDateFromDate(15, 5)));

    var accuracy = CalendarAccuracyEnum["1"];
    Meteor.call("setCalendarAccuracy",accuracy);
};

insertAndFetch = function (Collection, data) {
    var _id = Collection.insert(data);
    return Collection.findOne({_id: _id});
};

getDateFromTime = function (hours, minutes = 0) {
    var now = new Date();
    return new Date(now.getYear(), 5 - 1 /*now.getMonth()*/, 13 /*now.getDate()*/, hours, minutes, 0);
};

getDateFromDate = function (day, month, year) {
    var now = new Date();
    year = year || now.getYear();
    month = month || now.getMonth()
    return new Date(year, month, day, 0, 0, 0);
};











