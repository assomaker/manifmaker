User = //to export it to other namespace
class User {
    constructor(name, availabilities, assignments = [], _id) {
        this.name = name;
        this.availabilities = availabilities; //Array<Availability>
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
        this.assignments = assignments;
    }

    toString() {
        return '(' + this.name + ', ' + this.availabilities + ')';
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
    constructor(name, timeSlots, assignments = [], placeId, teamId, respManifId, description, _id) {
        this.name = name;
        this.timeSlots = timeSlots; //Array<Timeslot>
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
        this.assignments = assignments;
        this.teamId=teamId;
        this.description=description;
        this.place=placeId;
        this.respManif=respManifId;

    }
}

Place=
class Place {
    constructor(name, _id){
        this.name = name;
        if (typeof _id !== "undefined") this._id = _id;
    }
}

Team=
class Team {
    constructor(name, _id) {
        this.name = name;
        if (typeof _id !== "undefined") this._id = _id;
    }
}

Group=
class Group {
    constructor(name, tasksId = [], teamId, _id) {
        this.name = name;
        if (typeof _id !== "undefined") this._id = _id;
        this.tasksId=tasksId;
        this.teamId= teamId;
    }
}

TimeSlot = //to export it to other namespace
class TimeSlot { //must inherit Availabilty
    constructor(start, end, peopleNeeded) {
        this.start = start;
        this.end = end;
        this.peopleNeeded = peopleNeeded; //Array<PeopleNeed>
        if (typeof _id !== "undefined") this._id = _id;
        else this._id = new Meteor.Collection.ObjectID()._str;
    }
}


Assignment = //to export it to other namespace
class Assignment {
    constructor(userId, taskId, timeSlotId, _id) {
        this.userId = userId;
        this.taskId = taskId;
        this.timeSlotId = timeSlotId;
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
    }
}


UserAssignment = //to export it to other namespace
class UserAssignment { //stored along with a user to a direct access
    constructor(taskName, start, end, assignmentId) {
        this.taskName = taskName;
        this.start = start;
        this.end = end;
        this.assignmentId = assignmentId;
    }
}


TaskAssignment = //to export it to other namespace
class TaskAssignment { //stored along with a task to a direct access
    constructor(userName, start, end, assignmentId) {
        this.userName = userName;
        this.start = start;
        this.end = end;
        this.assignmentId = assignmentId;
    }
}


//assignment calendar
CalendarDay =
class CalendarDay {
    constructor(date){
        this.date = date;
    }
}

