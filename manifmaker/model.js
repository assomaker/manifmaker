User =
class User {
    constructor(name, availabilities) {
        this.name = name;
        this.availabilities = availabilities; //Array<Availability>
    }

    toString() {
        return '(' + this.name + ', ' + this.availabilities + ')';
    }
}

Availability =
class Availability {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}


Task =
class Task {
    constructor(name,timeslots) {
        this.name = name;
        this.timeslots = timeslots; //Array<Timeslot>
    }
}

Timeslot =
class Timeslot {
    constructor(start, end, peopleNeeded) {
        this.start = start;
        this.end = end;
        this.peopleNeeded = peopleNeeded; //Array<PeopleNeed]
        this._id = new Meteor.Collection.ObjectID()._str;
    }
}

PeopleNeed = {
    JUNKRESP: "junkResp",
    SOFT: "soft",
    SOFTDRIVINGLICENSE: "softDrivingLicense"
};




Assignment =
class Assignment {
    constructor(idUser, idTask, idTimeSlot){
        this._idUser = idUser;
        this._idTask = idTask;
        this._idTimeSlot = idTimeSlot;
    }
}








