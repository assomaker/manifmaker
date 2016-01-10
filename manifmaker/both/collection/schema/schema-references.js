
Schemas.references = {};

Schemas.references.Teams = new SimpleSchema({
    name: {
        type: String,
        label: "Team Name",
        max: 100
    }
});
Teams = new Mongo.Collection("teams");
Teams.attachSchema(Schemas.references.Teams);

Schemas.references.Places = new SimpleSchema({
    name: {
        type: String,
        label: "Place Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Places type",
        defaultValue: "Places",
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Places base URL",
        defaultValue: "place",
    }
});
Places = new Mongo.Collection("places");
Places.attachSchema(Schemas.references.Places);

Schemas.references.Skills = new SimpleSchema({
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
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Skills type",
        defaultValue: "Skills"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Skills base URL",
        defaultValue: "skill"
    }
});
Skills = new Mongo.Collection("skills");
Skills.attachSchema(Schemas.references.Skills);

//TODO les assignments terms ne peuvent pas se chevaucher
Schemas.references.AssignmentTerms = new SimpleSchema({
    name: {
        type: String,
        label: "Assignment terms Name",
        max: 100
    },
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
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Assignment terms type",
        defaultValue: "AssignmentTerms"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Assignment terms base URL",
        defaultValue: "assignment-term"
    }
});
AssignmentTerms = new Mongo.Collection("assignment-terms");
AssignmentTerms.attachSchema(Schemas.references.AssignmentTerms);

