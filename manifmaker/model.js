User = //to export it to other namespace
class User {
    constructor(name, availabilities, _id) {
        this.name = name;
        this.availabilities = availabilities; //Array<Availability>
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
        this.assignments = [];

    }

    toString() {
        return '(' + this.name + ', ' + this.availabilities + ')';
    }
}


UserRepository =
class UserRepository {
    static findOne(userId) {
        var user = Users.findOne(userId);
        return new User(user.name, user.availabilities, user._id);
    }
}


Availability = //to export it to other namespace
class Availability {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}


Task = //to export it to other namespace
class Task {
    constructor(name, timeSlots) {
        this.name = name;
        this.timeSlots = timeSlots; //Array<Timeslot>
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
        this.assignments = [];
    }
}

TaskRepository =
class TaskRepository {
    static findOne(taskId) {
        var task = Tasks.findOne(taskId);
        return new Task(task.name, task.timeSlots, task._id);
    }
}

TimeSlot = //to export it to other namespace
class TimeSlot {
    constructor(start, end, peopleNeeded) {
        this.start = start;
        this.end = end;
        this.peopleNeeded = peopleNeeded; //Array<PeopleNeed>
        if (typeof _id !== "undefined") this._id = _id
        else this._id = new Meteor.Collection.ObjectID()._str;
    }
}

TimeSlotService =
class TimeSlotService {
    static read(timeSlot) {
        return new TimeSlot(timeSlot.start, timeSlot.end, timeSlot.peopleNeeded, timeSlot._id);
    }

    static getTimeSlot(task, timeSlotId) {
        console.info("TimeSlotService.getTimeSlot timeSlot", timeSlotId, "for task", task);
        var found;
        task.timeSlots.forEach(timeSlot => {
            if (timeSlot._id === timeSlotId) {
                found =  TimeSlotService.read(timeSlot);
                return false;
            }
        });
        return found;
    }
}

PeopleNeed = {
    JUNKRESP: "junkResp",
    SOFT: "soft",
    SOFTDRIVINGLICENSE: "softDrivingLicense"
};


Assignment = //to export it to other namespace
class Assignment {
    constructor(userId, taskId, timeSlotId, _id) {
        this.userId = userId;
        this.taskId = taskId;
        this.timeSlotId = timeSlotId;
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
    }


}

AssignmentService =
class AssignmentService {
    static read(assigment) {
        return new Assignment(assigment.userId, assigment.taskId, assigment.timeSlotId, assigment._id);
    }

    static getTimeSlot(task, timeSlotId) {
        for (var timeSlot in task.timeSlots) {
            if (timeSlot._id === timeSlotId) {
                return new TimeSlot();
            }
        }
        return null;
    }
}


UserAssignment = //to export it to other namespace
class UserAssignment { //stored along with a user to a direct access
    constructor(taskName, start, end) {
        this.taskName = taskName;
        this.start = start;
        this.end = end;
    }

}

TaskAssignment = //to export it to other namespace
class TaskAssignment { //stored along with a task to a direct access
    constructor(userName, start, end) {
        this.userName = userName;
        this.start = start;
        this.end = end;
    }

}

AssignmentRepository =
class AssignmentRepository {
    static findOne(assignmentId) {
        var assignment = Assignments.findOne(assignmentId);
        return new Assignment(assignment.userId, assignment.taskId, assignment.timeSlotId, assignment._id);
    }
}


