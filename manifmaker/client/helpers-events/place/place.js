Template.places.helpers({
    places: function(){
        return Places.find();
    }
});

Template.places.events({
    "click button[name=newPlaceButton]" : function(event){
        event.preventDefault();
        var placeName = $('input[name=placeName]').val();
        var place = new Place(placeName);
        if(this._id){ //already exist, we update it
            Places.update({_id: this._id}, place, function(error,results){
                Router.update('place');
            });


        } else { //doesn't already exist, we create it
            Places.insert(place, function(error,results){
                Router.update('place');
            });
        }
    },

    "click button[name=supressPlaceButton]": function(){
        event.preventDefault();
        var placeId = this._id;
        Places.remove({_id: placeId});
    }

});