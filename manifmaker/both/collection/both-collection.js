Users = new Mongo.Collection("users");
Tasks = new Mongo.Collection("tasks");
Assignments = new Mongo.Collection("assignment");
Skills = new Mongo.Collection("skills");
Teams = new Mongo.Collection("teams");
Places = new Mongo.Collection("places");
Groups = new Mongo.Collection("groups");

//to perform search by name
TasksIndex = new EasySearch.Index({
    collection: Tasks,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
UsersIndex = new EasySearch.Index({
    collection: Users,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});


//using schema
Tasks.attachSchema(Schemas.Tasks);
Assignments.attachSchema(Schemas.Assignments);






//calendar, TODO client side only
CalendarDays = new Mongo.Collection("days");
CalendarHours = new Mongo.Collection("hours");
CalendarQuarter = new Mongo.Collection("quarters");
CalendarAccuracy = new Mongo.Collection("accuracy");
