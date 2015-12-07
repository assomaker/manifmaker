Template.team.helpers({
    teams: function () {
        return Teams.find();
    }
});

Template.team.events({
    "click .button-save": function(event){
        event.preventDefault();
        var teamName = $('input[name=teamName]').val();

        var team = new Task(teamName);

        if(this._id){ //already exist, we update it
            Teams.update({_id: this._id}, team, function(error,results){
                console.info("routing", "/teams");
                Router.go('teams');
            });
        } else { //doesn't already exist, we create it
            Teams.insert(team, function(error,results){
                console.info("routing", "/teams");
                Router.go('teams');
            });
        }

    }
});