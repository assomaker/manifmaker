ServerAssingnmentService =
class ServerAssignmentService {

    static propagateAssignment(assignmentId, assignment, fieldNames) {
        console.log("propagateAssignment for", assignment);
        var assignment = AssignmentService.read(assignment);
        var updateUser = {},
            updateTask = {},
            user = Users.findOne(assignment.userId),//Meteor.users.findOne(review.userId),
            task = Tasks.findOne(assignment.taskId);

        var timeSlot = TimeSlotService.getTimeSlot(task, assignment.timeSlotId);
        delete timeSlot.peopleNeeded;//.......

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

