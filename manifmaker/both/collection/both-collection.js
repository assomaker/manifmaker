/**
 * @memberOf Models
 * @summary Users collection
 * @locus Anywhere
 * @instancename collection
 */
Users = new Mongo.Collection("users_custom"); //TODO utiliser la meme collection que le package accounts ?

/**
 * @memberOf Models
 * @summary GroupsRoles collection
 * @locus Anywhere
 * @instancename collection
 */
GroupRoles = new Mongo.Collection("group_roles");


/**
 * @memberOf Models
 * @summary Task collection
 * @locus Anywhere
 * @instancename collectiono
 */
Tasks = new Mongo.Collection("tasks");
/**
 * @memberOf Models
 * @summary Assignments collection
 * @locus Anywhere
 * @instancename collection
 */
Assignments = new Mongo.Collection("assignment");

/**
 * @memberOf Models
 * @summary Groups collection
 * @locus Anywhere
 * @instancename collection
 */
Groups = new Mongo.Collection("groups");

/**
 * @memberOf Models
 * @summary References of all the MongoDB collections
 * @locus Anywhere
 * @instancename object
 */
AllCollections = {
    Users: Meteor.users,
    Tasks: Tasks,
    Assignments: Assignments,
    Skills: Skills,
    Teams: Teams,
    Places: Places,
    Groups: Groups,
    AssignmentTerms: AssignmentTerms
};

/**
 * @memberOf Models
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
 * @memberOf Models
 * @summary EasySearch settings to perform search by name on User
 * @locus Anywhere
 * @instancename object
 */
UsersIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['name'],
    engine: new EasySearch.Minimongo()
});


//using schema
Tasks.attachSchema(Schemas.Tasks);
Assignments.attachSchema(Schemas.Assignments);
//Meteor.users.attachSchema(Schemas.Users);
