Users = new Mongo.Collection("users");
Tasks = new Mongo.Collection("tasks");
Assignments = new Mongo.Collection("assignment");

Groups = new Mongo.Collection("groups");

AllCollections = {
    Users: Users,
    Tasks: Tasks,
    Assignments: Assignments,
    Skills: Skills,
    Teams: Teams,
    Places: Places,
    Groups: Groups,
    CalendarDay: CalendarDay
};

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
Users.attachSchema(Schemas.Users);



//calendar, TODO client side only
CalendarDays = new Mongo.Collection("days");
CalendarHours = new Mongo.Collection("hours");
CalendarQuarter = new Mongo.Collection("quarters");
CalendarAccuracy = new Mongo.Collection("accuracy");
