Assignments.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fieldNames, modifier) {
        throw new Meteor.Error(400, "An 'Assignment' can't be update but only created or deleted");
    },
    remove: function (userId, doc) {
        return true;
    }
});
