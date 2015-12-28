Template.teamUpdate.helpers({
    document: function () {
        return Teams.findOne(TeamToUpdate.get());
    }
});

Template.placeUpdate.helpers({
    document: function () {
        return Places.findOne(PlaceToUpdate.get());
    }
});

