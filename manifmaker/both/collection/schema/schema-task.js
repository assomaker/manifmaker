
Schemas.TaskAssignment = new SimpleSchema({
    userName : {
        type: String,
        label: "Task assignment user name"
    },
    start:{
        type: Date,
        label: "Task Assignment Start date"
    },
    end:{
        type: Date,
        label: "Task Assignment End date"
    },
    assignmentId : {
        type: SimpleSchema.RegEx.Id,
        label: "Task assignment assignment id",
        custom : function(){
            var assignment = Assignments.findOne(this.value);
            if(!assignment)
                return "unknownId"
            if (assignment.userName !== this.field(this.key.replace("assignmentId","")+"userName").value
                || !new moment(assignment.start).isSame(new moment(this.field(this.key.replace("assignmentId","")+"start").value))
                || !new moment(assignment.end).isSame(new moment(this.field(this.key.replace("assignmentId","")+"end").value)) )
                return "taskAssignmentNotMatching"
        }
    }

});

Schemas.PeopleNeedSchema = new SimpleSchema({
    userId:{
        type: String,
        label: "People Need User",
        defaultValue: null,
        optional: true
    },
    teamId:{
        type: SimpleSchema.RegEx.Id,
        label: "People Need Team",
        optional: true,
        custom: function(){
            if(!this.value) return 1;//autoValue already dit its job
            if(!Teams.findOne(this.value))
                return "unknownId";
        },
        autoValue: function(){
            if(this.field('userId').isSet){
                return null;
            }
            if(!this.isSet)
                return null;
        }

    },
    skills:{
        label: "People Need Skills",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        autoValue: function(){
            if(this.field('userId').isSet){
                return [];
            }
            if(!this.isSet)
                return [];
        },
        custom: function(){
            _.each(this.value,function(skill){
                if(!Skills.findOne(skill._id))
                    return "skillsNotFound"
            });
        },

    },
    _id: {
        type: SimpleSchema.RegEx.Id,
        label: "_id",
        defaultValue: new Meteor.Collection.ObjectID()._str,
        denyUpdate: true
    }



});


Schemas.TimeSlot = new SimpleSchema({
    start:{
        type: Date,
        label: "Start date",
        custom: function () {
            if (new moment(this.value).isAfter(new moment(this.field('end').value))) {
                return "startAfterEnd";
            }
        }
    },
    end:{
        type: Date,
        label: "End date",
        custom: function () {
            if (new moment(this.value).isBefore(new moment(this.field('start').value))) {
                return "endBeforeStart";
            }
        }
    },
    _id:{
        type: SimpleSchema.RegEx.Id,
        label: "_id",
        defaultValue: new Meteor.Collection.ObjectID()._str,
        denyUpdate: true
    },
    peopleNeeded : {
        type: [Schemas.PeopleNeedSchema],
        label: "People needs",
        defaultValue : []
    },
    peopleNeededAssigned : {
        type: [Schemas.PeopleNeedSchema],
        label: "People needs assigned",
        defaultValue : []
    }
});

Schemas.Tasks = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 100
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    teamId : {
        type: SimpleSchema.RegEx.Id,
        label : "Team",
        custom: function(){
            if(!Teams.findOne(this.value))
                return "unknownId";
            return 1
        }
    },
    placeId : {
        type: SimpleSchema.RegEx.Id,
        label : "Place",
        custom: function(){
            if(!Places.findOne(this.value))
                return "unknownId";
            return 1
        }

    },
    respManif : { //TODO il faut renommer ce champ
        type: SimpleSchema.RegEx.Id,
        label : "Live event responsible",
        custom: function(){
            if(!Users.findOne(this.value))
                return "unknownId";
        }
    },
    timeSlots: {
        type: [Schemas.TimeSlot],
        label: "Time slots",
        defaultValue: []
    },

    assignments : {
        type: [Schemas.TaskAssignment],
        label: "Task assignments",
        defaultValue: []
    }

});

