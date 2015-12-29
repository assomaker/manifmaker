Schemas.Teams = new SimpleSchema({
    name: {
        type: String,
        label: "Team Name",
        max: 100
    },
});
Teams = new Mongo.Collection("teams");
Teams.attachSchema(Schemas.Teams);

Schemas.Places = new SimpleSchema({
    name: {
        type: String,
        label: "Place Name",
        max: 100
    }
});
Places = new Mongo.Collection("places");
Places.attachSchema(Schemas.Places);

Schemas.Skills = new SimpleSchema({
    key: {
        type: String,
        label: "Skill key",
        max: 38,
        unique: true

    },
    label: {
        type: String,
        label: "Skill Name",
        max: 100
    }
});
Skills = new Mongo.Collection("skills");
Skills.attachSchema(Schemas.Skills);


Schemas.AssignmentTerms = new SimpleSchema({
    start: {
        type: Date,
        label: "Assignment terms Start",
        custom: function () {
            if (new moment(this.value).isAfter(new moment(this.key.replace("start", "") + this.field('end').value))) {
                return "startAfterEnd";
            }
        },
        autoform: {
            type: "datetime-local"
        }
    },
    end: {
        type: Date,
        label: "Assignment terms  End (not include)",
        autoform: {
            type: "datetime-local"
        },
        custom: function () {
            if (new moment(this.value).isBefore(new moment(this.field(this.key.replace("end", "") + 'start').value))) {
                return "endBeforeStart";
            }
        }
    }
});
AssignmentTerms = new Mongo.Collection("assignment-terms");
AssignmentTerms.attachSchema(Schemas.AssignmentTerms);

