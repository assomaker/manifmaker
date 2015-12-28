ServerAssingnmentService =
    class ServerAssignmentService {

        static propagateAssignment(assignmentId, assignment, fieldNames) {
            console.log("propagateAssignment for", assignment);
            var assignment = assignment;
            var updateUser = {},
                updateTask = {},
                user = Users.findOne(assignment.userId),
                task = Tasks.findOne(assignment.taskId);

            var timeSlot = TimeSlotService.getTimeSlot(task, assignment.timeSlotId);

            updateUser.assignments = user.assignments;
            updateUser.assignments.push({
                taskName: task.name,
                start: timeSlot.start,
                end: timeSlot.end,
                assignmentId: assignment._id
            });
            Users.update(assignment.userId, {$set: updateUser});

            updateTask.assignments = task.assignments;
            updateTask.assignments.push({
                userName: user.name,
                start: timeSlot.start,
                end: timeSlot.end,
                assignmentId: assignment._id
            });
            Tasks.update(assignment.taskId, {$set: updateTask});
        }


        static removeAssignment(assignmentId, assignment) {
            console.log("removeAssignment for", assignment);
            var assignment = assignment;
            var updateUser = {},
                updateTask = {},
                user = Users.findOne(assignment.userId),//Meteor.users.findOne(review.userId),
                task = Tasks.findOne(assignment.taskId);

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

