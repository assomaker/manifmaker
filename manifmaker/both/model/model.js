User = //to export it to other namespace
class User {
    constructor(name, teams = [],availabilities = [], skills = [], assignments = [], _id) {
        this.name = name;
        this.teams = teams; //Array<TeamId>
        this.teams.push(Teams.findOne({name: ASSIGNMENTREADYTEAM})._id); //TODO c'est nul de faire ca ici, le faire dans le Tasks.allow.insert et Tasks.allow.update
        this.availabilities = availabilities; //Array<Availability>
        this.skills = skills; //Array<SkillId>
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
        this.assignments = assignments;
    }

    toString() {
        return '(' + this.name + ', ' + this.availabilities + ')';
    }
}

Team = //to export it to other namespace
class Team {
    constructor(name){
        this.name = name;
        if (typeof _id !== "undefined") this._id = _id; //if undefined, Assignment is not yet stored in DB
    }
}


Availability = //to export it to other namespace
class Availability {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

//************************************************ a son schema *************************************************//
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

//************************************************ a son schema *************************************************//
TimeSlot = //to export it to other namespace
class TimeSlot { //must inherit Availabilty
    constructor(start, end, peopleNeeded,peopleNeededAssigned = [],_id) {
        this.start = start;
        this.end = end;
        this.peopleNeeded = peopleNeeded; //Array<PeopleNeed>
        this.peopleNeededAssigned = peopleNeededAssigned; //Array<PeopleNeed>
        if (typeof _id !== "undefined") this._id = _id
        else this._id = new Meteor.Collection.ObjectID()._str;
    }
}

//************************************************ a son schema *************************************************//
PeopleNeed =
/**
 * By now, userId, teamId and skills can't be combined.
 * In particular we can't ask for a specific team and for specific skills (will be soon)
 */
class PeopleNeed {
    constructor(options){
        this.userId;
        this.teamId;
        this.skills = [];//Array<Skill>


        if(typeof options !== "object"){
            console.error("PeopleNeed constructor only accept a key:value object");
        }
        this.userId = options.userId;

        if(!this.userId) { //we cannot ask for a specific user and anything else
            this.skills = options.skills || []; //Array<Skill>

            if(options.teamId){
                this.teamId = options.teamId;
            } else { //all peopleNeed should have a team, if not, it's the global team
                this.teamId = Teams.findOne({name: ASSIGNMENTREADYTEAM})._id; //TODO c'est nul de faire ca ici, le faire dans le Tasks.allow.insert et Tasks.allow.update
            }

        } else if(options.teamId || this.skills) {
            console.warn("PeoplNeed constructor : we cannot ask for a specific userId and anything else, teamId and skills information are ignored and not set");
        }



        else this._id = new Meteor.Collection.ObjectID()._str;
    }
}

Skill =
class Skill{
    constructor(key, label){
        this.key = key; //unique key   => TODO preInsert pour verifier l'unicité
        this.label = label; //printable label
    }
}


//************************************************ a son schema *************************************************//
Assignment = //to export it to other namespace
class Assignment {
    constructor(userId, taskId, timeSlotId, peopleNeed,_id) {
        this.userId = userId;
        this.taskId = taskId;
        this.timeSlotId = timeSlotId;
        this.peopleNeed = peopleNeed;
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


//************************************************ a son schema *************************************************//
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

