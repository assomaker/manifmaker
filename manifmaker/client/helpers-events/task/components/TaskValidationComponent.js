class TaskValidationComponent extends BlazeComponent{
    template(){
        return "taskValidation"
    }

    onRendered() {
        this.$('.collapse').collapse({toggle: false});

        this.$('.collapse').on('shown.bs.collapse	', _.bind(function () {
            //TODO change this with the new icons
            var glyphicon = this.$("[data-target=#" + $(arguments[0].target).attr("id") + "] span.glyphicon");
            glyphicon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        }, this));

        this.$('.collapse').on('hidden.bs.collapse', _.bind(function () {
            var glyphicon = this.$("[data-target=#" + $(arguments[0].target).attr("id") + "] span.glyphicon");
            glyphicon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        }, this));

    }


    displayTextArea(validationType, state) {
        if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
            (state === "TOBEVALIDATED" || state === "READY"))
            return false;
        return true;
    }
}

TaskValidationComponent.register("TaskValidationComponent");
