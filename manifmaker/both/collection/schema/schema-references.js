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


Schemas.AssignmentCalendarDay = new SimpleSchema({
    date: {
        type: String,
        label: "Date"
    }
});
AssignmentCalendarDay = new Mongo.Collection("assignmentCalendarDay");
AssignmentCalendarDay.attachSchema(Schemas.AssignmentCalendarDay);

