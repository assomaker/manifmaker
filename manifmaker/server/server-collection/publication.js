Meteor.startup(function () {

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Users publication. No query, publish all Users data.
     * @returns {Collection}
     */
    Meteor.publish("users", function () {
        return Users.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Tasks publication. No query, publish all Tasks data.
     * @returns {Collection}
     */
    Meteor.publish("tasks", function () {
        return Tasks.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Assignments publication. No query, publish all Assignments data.
     * @returns {Collection}
     */
    Meteor.publish("assignments", function () {
        return Assignments.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Skills publication. No query, publish all Skills data.
     * @returns {Collection}
     */
    Meteor.publish("skills", function () {
        return Skills.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Teams publication. No query, publish all Teams data.
     * @returns {Collection}
     */
    Meteor.publish("teams", function (){
        return Teams.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Groups publication. No query, publish all Groups data.
     * @returns {Collection}
     */
    Meteor.publish("groups", function (){
        return Groups.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary Places publication. No query, publish all Places data.
     * @returns {Collection}
     */
    Meteor.publish("places", function(){
        return Places.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary AssignmentTerms publication. No query, publish all AssignmentTerms data.
     * @returns {Collection}
     */
    Meteor.publish("assignment-terms", function () {
        return AssignmentTerms.find({});
    });

    /**
     * @memberOf Meteor Publish
     * @locus server
     * @summary GroupRoles publication. No query, publish all AssignmentTerms data.
     * @returns {Collection}
     */
    Meteor.publish("group-roles", function () {
        return GroupRoles.find({});
    });

});
