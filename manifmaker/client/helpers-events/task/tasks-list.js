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
        //var confirm = window.confirm("Delete this task?");
        //if(confirm) {
            Tasks.remove({_id: taskId});
        //}
    }

    //"click a" : function(){
      //  Router.go('/task/:_id');

    //}
});