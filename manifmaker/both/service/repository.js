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
        return Tasks.findOne(taskId);
    }
}



AssignmentRepository =
class AssignmentRepository {
    static findOne(assignmentId) {
        return Assignments.findOne(assignmentId);
    }
}