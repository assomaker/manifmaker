//order matters !

Schemas.UserAvailabilities = new SimpleSchema({
    start: {
        type: Date,
        label: "User Availabilities Start Date",
        custom: function () {
            if (new moment(this.value).isAfter(new moment(this.field(this.key.replace("start", "") + "end").value)))
                return "startAfterEnd";
        },
        autoform: {
            type: "datetime-local",
        }
    },
    end: {
        type: Date,
        label: "User Availabilities End Date",
        custom: function () {
            if (new moment(this.value).isSame(new moment(this.field(this.key.replace("end", "") + "start").value)))
                return "endBeforeStart"
        },
        autoform: {
            type: "datetime-local",
        }
    }
});

Schemas.UserAssignment = new SimpleSchema({
    taskName: {
        type: String,
        label: "User assignment User Name"
    },
    start: {
        type: Date,
        label: "User Assignment Start Date"
    },
    end: {
        type: Date,
        label: "User Assignment End Date"
    },
    assignmentId: {
        type: SimpleSchema.RegEx.Id,
        label: "User assignment assignment id",
        custom: function () { //validate data is same as the real assignment
            var assignment = Assignments.findOne(this.value);
            if (!assignment)
                return "unknownId"
            var timeSlot = TimeSlotService.getTimeSlot(assignment.taskId,assignment.timeSlotId);
            if (Tasks.findOne(assignment.taskId).name !== this.field(this.key.replace("assignmentId", "") + "taskName").value
                || !new moment(timeSlot.start).isSame(new moment(this.field(this.key.replace("assignmentId", "") + "start").value))
                || !new moment(timeSlot.end).isSame(new moment(this.field(this.key.replace("assignmentId", "") + "end").value)))
                return "userAssignmentNotMatching"
        }
    }
});

Schemas.Users = new SimpleSchema({
    name: {
        type: String,
        label: "Users Name",
        max: 100
    },
    loginUserId: {
        label: "User login link to collection managed by Account package",
        type: SimpleSchema.RegEx.Id,
        optional: true
    },
    roles: {
        label: "User login roles by Account package, copied from Meteor.users each time updated",
        type: [String],
        optional: true
    },
    teams: {
        label: "User teams",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        custom: function () {
            _.each(this.value, function (teamId) {
                if (!Teams.findOne(teamId))
                    return "unknownId"
            });
        },
        autoValue: function () {
            if (this.isInsert) {
                //trick pour les filtres, tous les users appartiennement au moins à l'équipe ASSIGNMENTREADYTEAM
                var assignmentReadyTeam = Teams.findOne({name: ASSIGNMENTREADYTEAM});
                if(!this.value) this.value = [];
                this.value.push(assignmentReadyTeam._id);
                return this.value;
            }
        }
    },
    skills: {
        label: "User Skills",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        custom: function () {
            _.each(this.value, function (skill) {
                if (!Skills.findOne(skill._id))
                    return "unknownId"
            });
        }
    },
    availabilities: {
        type: [Schemas.UserAvailabilities],
        label: "User availabilities",
        defaultValue: []
    },
    assignments: {
        type: [Schemas.UserAssignment],
        label: "User assignments",
        defaultValue: [],
        autoform: {
            type: "hidden",
        }
    }
});