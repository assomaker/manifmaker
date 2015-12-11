Template.assignmentUsersList.helpers({
    users: function () {
        var filter = UserFilter.get();
        var filterIndex = UserIndexFilter.get();

        if (filter != UserFilterBefore) {
            UserFilterBefore = filter;
            return Users.find(filter);
        }
        if (filterIndex != UserIndexFilterBefore) {
            UserIndexFilterBefore = filterIndex;
            return UsersIndex.search(filterIndex, {limit: 20}).fetch();
        }

    }
});

UserFilterBefore = null;
UserIndexFilterBefore = null;

Template.assignmentUsersList.events({
    "click .href-assignment-user": function(event){
        event.stopPropagation();
        event.preventDefault();
        //TODO can't event to bubble to the collapsible event

        console.info("routing", "/assignment/user/"+this._id);
        Router.go("/assignment/user/"+this._id);
    },

    "click li": function (event) {
        event.stopPropagation();

        //Template.parentData() ne fonctionne pas, alors j'utilise un trick de poney pour stocker dans le dom les _id
        var currentAssignmentType = CurrentAssignmentType.get();
        var target = $(event.target);
        var _id;
        if (target.hasClass("user"))
            _id = target.data("_id");
        else
            _id = target.parents(".user").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                //SelectedUser.set({_id: _id});
                //selectedAvailability = null; //TODO pas top
                //TaskFilter.set(noneFilter);
                ////TODO reduire la liste à ses amis
                break;
            case AssignmentType.TASKTOUSER:


                Meteor.call("assignUserToTaskTimeSlot", _id, SelectedTask.get()._id, selectedTimeslotId);

                break;
        }

    },

    "keyup #search_user_name": function (event) {
        var query = $("#search_user_name").val();

        console.info("routing", "/assignment/user/search/"+query);
        Router.go("/assignment/user/search/"+query);
    }


});
