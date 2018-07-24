import {Schemas} from "./model/SchemasHelpers";

Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images")]
});

/**
 * All MongoDB server collections (see {@link Meteor_Publish} to know what is published)
 * @namespace Collection
 */

/**
 * @memberOf Collection
 * @summary Meteor.users collection
 * @locus Anywhere
 * @instancename collection
 */


/**
 * @memberOf Collection
 * @summary Task collection
 * @locus Anywhere
 * @instancename collectiono
 */
Tasks = new Mongo.Collection("tasks");

/**
 * @memberOf Collection
 * @summary Activities collection
 * @locus Anywhere
 * @instancename collectiono
 */
Activities = new Mongo.Collection("activities");

/**
 * @memberOf Collection
 * @summary Assignments collection
 * @locus Anywhere
 * @instancename collection
 */
Assignments = new Mongo.Collection("assignment");

/**
 * @memberOf Collection
 * @summary Groups collection
 * @locus Anywhere
 * @instancename collection
 */
TaskGroups = new Mongo.Collection("task_groups"); //TODO group activity

/**
 * @memberOf Collection
 * @summary Settings collection
 * @locus Anywhere
 * @instancename collection
 */
Settings = new Mongo.Collection("settings");

/**
 * @memberOf Collection
 * @summary ExportStatus collection
 * @locus Anywhere
 * @instancename collection
 */
ExportStatus = new Mongo.Collection("export_status");

//using schema
Tasks.attachSchema(Schemas.Tasks);
TaskGroups.attachSchema(Schemas.TaskGroups);
Activities.attachSchema(Schemas.Activities);
Assignments.attachSchema(Schemas.Assignments);
Meteor.users.attachSchema(Schemas.User);
Settings.attachSchema(Schemas.Settings);

/**
 * @namespace Enum
 */