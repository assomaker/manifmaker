Template.task.helpers({
    tasks: function () {
        return Tasks.find();

    },
    places: function(){
        return Places.find();
    }

});

Template.task.events({
    "click .button-save": function(event){
        event.preventDefault();
        var taskName = $('input[name=taskName]').val();
        var team = $('select[name=team]').val();
        var respManif = $('select[name=respManif]').val();
        var description = $('input[name=description]').val();
        var place = $('select[name=place]').val();
        var task = new Task(taskName,[],[],place, team, respManif, description );



        if(this._id){ //already exist, we update it
            Tasks.update({_id: this._id}, task, function(error,results){
                Router.go('tasksList');

            });



        } else { //doesn't already exist, we create it
            Tasks.insert(task, function(error,results){
                Router.go('tasksList');
            });

        }
        
    }
});