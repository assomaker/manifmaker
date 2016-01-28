//order matters !

Schemas.SkillsId = new SimpleSchema({
    skillsId : {
        type: SimpleSchema.RegEx.Id,
        label: "People Need Skills",
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allSkillsOptions
            }
        }
    }

});

Schemas.TaskAssignment = new SimpleSchema({
    userName: {
        type: String,
        label: "Task assignment User Name"
    },
    start: {
        type: Date,
        label: "Task Assignment Start Date"
    },
    end: {
        type: Date,
        label: "Task Assignment End Date"
    },
    assignmentId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task assignment assignment id",
        custom: function () { //validate data is same as the real assignment
            var assignment = Assignments.findOne(this.value);
            if (!assignment)
                return "unknownId";
            var timeSlot = TimeSlotService.getTimeSlot(assignment.taskId,assignment.timeSlotId);
            if (Users.findOne(assignment.userId).name !== this.field(this.key.replace("assignmentId", "") + "userName").value
                || !new moment(timeSlot.start).isSame(new moment(this.field(this.key.replace("assignmentId", "") + "start").value))
                || !new moment(timeSlot.end).isSame(new moment(this.field(this.key.replace("assignmentId", "") + "end").value)))
                return "taskAssignmentNotMatching"
        }
    }

});

Schemas.PeopleNeed = new SimpleSchema({
    userId: {
        type: String,
        label: "People Need User",
        defaultValue: null,
        optional: true,
        custom: function () {
            if (this.value)
                if (!Users.findOne(this.value))
                    return "unknownId";
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allUsersOptions
            }
        }
    },
    teamId: {
        type: SimpleSchema.RegEx.Id,
        label: "People Need Team",
        optional: true,
        custom: function () {
            if (!this.value) return 1;//autoValue already dit its job
            if (!Teams.findOne(this.value))
                return "unknownId";
        },
        autoValue: function () {
            if (this.field('userId').isSet) { //if userId is set, teamId is not take into account
                return null;
            }
            if (!this.isSet)
                return null;
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allTeamsOptions
            }
        }
    },
    skills: {
        label: "People Need Skills",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        autoValue: function () { //if userId is set, skills is not take into account
            if (this.field('userId').isSet) {
                return [];
            }
            if (!this.isSet)
                return [];
        },
        custom: function () {
            _.each(this.value, function (skill) {
                if (!Skills.findOne(skill._id))
                    return "skillsNotFound"
            });
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allSkillsOptions
            }
        }
    },
    _id: {
        type: SimpleSchema.RegEx.Id,
        label: "People Need _id",
        defaultValue: function(){return new Meteor.Collection.ObjectID()._str},
       // denyUpdate: true
        autoValue: function () {
            if(!this.isSet)
                return new Meteor.Collection.ObjectID()._str;
        },
        autoform: {
            type: "hidden",
        }
    }
});

Schemas.TimeSlot = new SimpleSchema({
    start: {
        type: Date,
        label: "TimeSlot Start Date",
        custom: function () {
            if (new moment(this.value).isAfter(new moment(this.key.replace("start", "") + this.field('end').value))) {
                return "startAfterEnd";
            }
        },
        autoform: {
            type: "datetime-local",
        }
    },
    end: {
        type: Date,
        label: " TimeSlot End Date",
        custom: function () {
            if (new moment(this.value).isBefore(new moment(this.field(this.key.replace("end", "") + 'start').value))) {
                return "endBeforeStart";
            }

            var start = this.field(this.key.replace("end", "") + 'start').value;

            var currentStart = new moment(start);
            var currentEnd = new moment(this.value);
            var currentId = this.field(this.key.replace("end", "") + '_id').value;

            //check if timeSlot don't lap
            var timeSlots = this.field("timeSlots").value;
            var okGod = true;
            console.info("timeSlots", timeSlots, okGod);
            timeSlots.forEach(_.bind(function (timeSlot) {
                if (!okGod || timeSlot._id === currentId)
                    return;
                console.info("timeSlot", timeSlot);


                if (new moment(currentStart).isBetween(timeSlot.start, timeSlot.end) ||
                    new moment(currentEnd).isBetween(timeSlot.start, timeSlot.end))
                    okGod = false;

            }, this));

            if (!okGod)
                return "timeSlotConflictDate";
        },
        autoform: {
            type: "datetime-local",
        }
    },
    peopleNeeded: {
        type: [Schemas.PeopleNeed],
        label: "TimeSlot People needs",
        defaultValue: [],

    },
    peopleNeededAssigned: {
        type: [Schemas.PeopleNeed],
        label: "TimeSlot People needs assigned",
        defaultValue: [],
        optional: true,
        autoform: {
            type: "hidden",
        }
    },
    _id: {
        type: SimpleSchema.RegEx.Id,
        label: "TimeSlot _id",
        autoValue: function () {
            if(!this.isSet)
                return new Meteor.Collection.ObjectID()._str;
        },
        autoform: {
            type: "hidden",
        }
        // denyUpdate: true
    }
});

Schemas.Tasks = new SimpleSchema({
    name: {
        type: String,
        label: "Task Name",
        max: 100
    },
    description: {
        type: String,
        label: "Task Description",
        optional: true
    },
    teamId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task Team",
        custom: function () {
            if (!Teams.findOne(this.value))
                return "unknownId";
            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allTeamsOptions
            }
        }
    },
    placeId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task Place",
        custom: function () {
            if (!Places.findOne(this.value))
                return "unknownId";
            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allPlacesOptions
            }
        }

    },
    liveEventMasterId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task Live event responsible",
        custom: function () {
            if (!Users.findOne(this.value))
                return "unknownId";
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allUsersOptions
            }
        }
    },
    masterId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task responsible",
        custom: function () {
            if (!Users.findOne(this.value))
                return "unknownId";
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allUsersOptions
            }
        }
    },
    timeSlots: {
        type: [Schemas.TimeSlot],
        label: "Task Time slots",
        defaultValue: []
    },
    assignments: {
        type: [Schemas.TaskAssignment],
        label: "Task assignments",
        defaultValue: [],
        autoform: {
            type: "hidden",
        }
    },
    timeSlotValidation: {
        type: Schemas.Validation,
        label: "Task Time slots validation",
        //defaultValue: Schemas.Validation,
        optional: true,//TODO je ne sais pas si c'est une bonne idée de faire ca
        autoform: {
            type: "hidden",
        }
    },
    accessPassValidation: {
        type: Schemas.Validation,
        label: "Task access pass validation",
        //defaultValue: Schemas.Validation,
        optional: true,//TODO je ne sais pas si c'est une bonne idée de faire ca
        autoform: {
            type: "hidden",
        }
    },
    equipmentValidation: {
        type: Schemas.Validation,
        label: "Task equipments validation",
        //defaultValue: Schemas.Validation,
        optional: true,//TODO je ne sais pas si c'est une bonne idée de faire ca
        autoform: {
            type: "hidden",
        }
    }

});

