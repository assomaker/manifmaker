Template.teamsList.helpers({
    teams: function () {
        return Teams.find();
    }
});

Template.teamsList.events({});