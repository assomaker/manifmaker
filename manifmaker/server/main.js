

Meteor.startup(function () {
    // code to run on server at startup

    Users.remove();
    Tasks.remove();
    Assignments.remove();

    //  Assignments.before.insert( /*if we need to add user and task data to assignments*/);
    Assignments.after.insert(propagateAssignment);
    Assignments.after.remove(removeAssignment);

    Meteor.call("populateData");

    Meteor.publish("users", function () {
        return Users.find({});
    });

    Meteor.publish("tasks", function () {
        return Tasks.find({});
    });

    Meteor.publish("assignments", function () {
        return Assignments.find({});
    });

    Assignments.allow({
        update: function (userId, doc, fieldNames, modifier) {
            throw new Meteor.Error(400, "An 'Assignment' can't be update but only created or deleted");
        }

    });


});


function propagateAssignment(assignmentId, assignment, fieldNames) {
    console.log("propagateAssignment for",assignment);
    var assignment = AssignmentService.read(assignment);
    var updateUser = {assignments: []},
        updateTask = {assignments: []},
        user = UserRepository.findOne(assignment.userId),//Meteor.users.findOne(review.userId),
        task = TaskRepository.findOne(assignment.taskId);
    console.log(user,task);

    var timeSlot = TimeSlotService.getTimeSlot(task,assignment.timeSlotId);
    console.log(timeSlot);
    delete timeSlot.peopleNeeded;

    var userAssignment = new UserAssignment(task.name, timeSlot.start, timeSlot.end);
    updateUser.assignments.push(userAssignment); //' + assignment.taskId] = review;
    Users.update(assignment.userId, {$set: updateUser});

    var taskAssignment = new TaskAssignment(user.name, timeSlot.start, timeSlot.end);
    updateTask.assignments.push(taskAssignment);
    Tasks.update(assignment.taskId, {$set: updateTask});
}


function removeAssignment(assignmentId, assignment) {
    //TODO
}






