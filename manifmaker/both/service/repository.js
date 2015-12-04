UserRepository =
class UserRepository {
    static findOne(userId) {
        var user = Users.findOne(userId);
        return new User(user.name, user.availabilities, user.assignments, user._id); //TODO trouver un moyen plus NoSQL de faire ca ?
    }
}


TaskRepository =
class TaskRepository {
    static findOne(taskId) {
        var task = Tasks.findOne(taskId);
        return new Task(task.name, task.timeSlots, task.assignments, task.teams, task.respManif, task.places, task.description, task._id); //TODO trouver un moyen plus NoSQL de faire ca ?
    }
}



AssignmentRepository =
class AssignmentRepository {
    static findOne(assignmentId) {
        var assignment = Assignments.findOne(assignmentId);
        return new Assignment(assignment.userId, assignment.taskId, assignment.timeSlotId, assignment._id);
    }
}