Template.updateTaskForm.rendered = function () {
    $('.collapsible').collapsible({});
};

Template.updateTaskForm.helpers({

    displayTextArea: function (validationType, state) {
        if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
            (state === "TOBEVALIDATED" || state === "READY"))
            return false;
        return true;
    }
});