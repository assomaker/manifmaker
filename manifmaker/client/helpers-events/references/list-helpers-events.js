Template.teamsList.helpers({
    teams: function () {
        return Teams.find();
    }
});

Template.placesList.helpers({
    places: function () {
        return Places.find();
    }
});

