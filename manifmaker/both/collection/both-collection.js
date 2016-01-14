/**
 * @summary Users collection
 * @locus Anywhere
 * @instancename collection
 */
Users = new Mongo.Collection("users");
/**
 * @summary Task collection
 * @locus Anywhere
 * @instancename collectiono
 */
Tasks = new Mongo.Collection("tasks");
/**
 * @summary Assignments collection
 * @locus Anywhere
 * @instancename collection
 */
Assignments = new Mongo.Collection("assignment");

/**
 * @summary Groups collection
 * @locus Anywhere
 * @instancename collection
 */
Groups = new Mongo.Collection("groups");

/**
 * @summary References of all the MongoDB collections
 * @locus Anywhere
 * @instancename object
 */
AllCollections = {
    Users: Users,
    Tasks: Tasks,
    Assignments: Assignments,
    Skills: Skills,
    Teams: Teams,
    Places: Places,
    Groups: Groups,
    AssignmentTerms: AssignmentTerms
};

/**
 * @summary EasySearch settings to perform search by name on Task
 * @locus Anywhere
 * @instancename object
 */
TasksIndex = new EasySearch.Index({
    collection: Tasks,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});
/**
 * @summary EasySearch settings to perform search by name on User
 * @locus Anywhere
 * @instancename object
 */
UsersIndex = new EasySearch.Index({
    collection: Users,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});


//using schema
Tasks.attachSchema(Schemas.Tasks);
Assignments.attachSchema(Schemas.Assignments);
Users.attachSchema(Schemas.Users);
