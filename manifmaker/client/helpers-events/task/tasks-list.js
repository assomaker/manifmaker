/**
 * Created by constant on 26/11/2015.
 */
Template.tasksList.helpers({
    tasks: function () {
        return Tasks.find();

    }

});

Template.tasksList.events({
    "click a": function (event) {
        event.stopPropagation();
    }
});