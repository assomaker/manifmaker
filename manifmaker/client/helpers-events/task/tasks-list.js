/**
 * Created by constant on 26/11/2015.
 */
Template.tasksList.helpers({
    tasks: function () {
        return Tasks.find();

    }

});

Template.tasksList.events({
    "click button[name=newTaskButton]":function(){
        Router.go('/task');
    },

    "click button[name=supressButton]": function(){
        event.preventDefault();
        var taskId = this._id;

        Tasks.remove({_id: taskId});


    }


});