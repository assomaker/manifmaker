Template.group.helpers({
    tasks: function(){
        return Tasks.find()
    },
    groups: function(){
        return Groups.find();
    },
    teams: function(){
        return Teams.find();
    }
});

Template.group.events({
    "click .button-save": function(event){
        event.preventDefault();
        var groupName = $('input[name=groupName]').val();
        var teamId = $('select[name=team]').val();
        var group = new Group(groupName,[],teamId);

        if(this._id){ //already exist, we update it
            Groups.update({_id: this._id}, group, function(error,results){
                Router.go('group.list');
            });
        } else { //doesn't already exist, we create it
            Groups.insert(group, function(error,results){
                Router.go('group.list');
            });
        }

    }
});