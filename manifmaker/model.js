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
    }
}

PeopleNeed = {
    JUNKRESP: "junkResp",
    SOFT: "soft",
    SOFTDRIVINGLICENSE: "softDrivingLicense"
};
