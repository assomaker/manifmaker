Template.taskButtons.helpers({
    tasks:function(){
        return Tasks.find();
    }

});

Template.taskButtons.events({
    "click modifButton": function(event){
        event.preventDefault();
        Router.go('/task/:_id');
    },

    "click suppressButton": function(event){
        event.preventDefault();
        Router.go('/task/:_id/delete');
    }

});

