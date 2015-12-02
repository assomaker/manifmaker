Template.place.helpers({
    places: function(){
        return Places.find();
    }
});

Template.place.events({
    "click button[name=newPlaceButton]" : function(event){
        event.preventDefault();
        var placeName = $('input[name=placeName]').val();

        var place = new Place(placeName);


        if(this._id){ //already exist, we update it
            Places.update({_id: this._id}, place, function(error,results){
                Router.go('tasksList');
            });


        } else { //doesn't already exist, we create it
            Places.insert(place, function(error,results){
                Router.go('tasksList');
            });

        }
    }


});