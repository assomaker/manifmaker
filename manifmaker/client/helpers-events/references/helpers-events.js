Template.teamUpdate.helpers({
    document: function () {
        return Teams.findOne(TeamToUpdate.get());
    }
});
