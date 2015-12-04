Template.places.helpers({
    places: function(){
        return Places.find();
    }
});

Template.places.events({
    "click .save" : function(event){
        event.preventDefault();
        var placeName = $('input[name=placeName]').val();
        var place = new Place(placeName);

        if(this._id){ //already exist, we update it
            Places.update({_id: this._id}, place);
        } else { //doesn't already exist, we create it
            Places.insert(place);
        }
    }
});