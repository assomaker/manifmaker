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
        insert: function(userId, doc){
            return true;
        },
        update: function (userId, doc, fieldNames, modifier) {
            throw new Meteor.Error(400, "An 'Assignment' can't be update but only created or deleted");
        },
        remove: function(userId, doc){
            return true;
        }
    });


});


function propagateAssignment(assignmentId, assignment, fieldNames) {
    console.log("propagateAssignment for", assignment);
    var assignment = AssignmentService.read(assignment);
    var updateUser = {assignments: []},
        updateTask = {assignments: []},
        user = UserRepository.findOne(assignment.userId),//Meteor.users.findOne(review.userId),
        task = TaskRepository.findOne(assignment.taskId);

    var timeSlot = TimeSlotService.getTimeSlot(task, assignment.timeSlotId);
    delete timeSlot.peopleNeeded;

    var userAssignment = new UserAssignment(task.name, timeSlot.start, timeSlot.end, assignment._id);
    updateUser.assignments.push(userAssignment); //' + assignment.taskId] = review;
    Users.update(assignment.userId, {$set: updateUser});

    var taskAssignment = new TaskAssignment(user.name, timeSlot.start, timeSlot.end, assignment._id);
    updateTask.assignments.push(taskAssignment);
    Tasks.update(assignment.taskId, {$set: updateTask});
}


function removeAssignment(assignmentId, assignment) {
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








