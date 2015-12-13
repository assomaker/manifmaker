Users = new Mongo.Collection("users");
Tasks = new Mongo.Collection("tasks");
Assignments = new Mongo.Collection("assignment");
Teams = new Mongo.Collection("teams");
Places = new Mongo.Collection("places");

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

//calendar, TODO client side only
CalendarDays = new Mongo.Collection("days");
CalendarHours = new Mongo.Collection("hours");
CalendarQuarter = new Mongo.Collection("quarters");
CalendarAccuracy = new Mongo.Collection("accuracy");
