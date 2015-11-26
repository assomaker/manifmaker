/**
 * Created by constant on 26/11/2015.
 */
Template.task.helpers({
    tasks: function () {
        populateData();
        return Tasks.find();
    }
});

Template.task.events({
    "click .button-save":function(event){
        insertAndFetch(Task,this.taskName);
    }
});