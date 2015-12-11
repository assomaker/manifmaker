Template.task.helpers({
    tasks: function(){
        return Tasks.find()
    },
    places: function(){
        return Places.find();
    },
    teams: function(){
        return Teams.find();
    }
});

Template.task.events({
    "click .button-save": function(event){
        event.preventDefault();
        var taskName = $('input[name=taskName]').val();
        var teamId = $('select[name=team]').val();
        var respManif = $('select[name=respManif]').val();
        var description = $('input[name=description]').val();
        var place = $('select[name=place]').val();
        var task = new Task(taskName,[],[],place, teamId, respManif, description );

        if(this._id){ //already exist, we update it
            Tasks.update({_id: this._id}, task, function(error,results){
                Router.go('task.list');
            });
        } else { //doesn't already exist, we create it
            Tasks.insert(task, function(error,results){
                Router.go('task.list');
            });
        }
        
    }
});