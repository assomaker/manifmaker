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


Schemas.CalendarDay = new SimpleSchema({
    date: {
        type: Date,
        label: "Calendar date"
    }
});

