
Template.tasks.helpers({
    tasks: function () {
        return Tasks.find();
    }
});

Template.tasks.events({

    "click button[name=supressButton]": function(){
        event.preventDefault();
        var taskId = this._id;
        Tasks.remove({_id: taskId});
    }

});