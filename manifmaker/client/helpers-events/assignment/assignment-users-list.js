Template.assignmentUsersList.helpers({
    users: function () {
        var filter = UserFilter.get();
        var filterIndex = UserIndexFilter.get();
        var teamFilter = UserTeamFilter.get();
        var skillsFilter = UserSkillsFilter.get();

        var searchResult;
        var filterResult;

        filterResult = Users.find({
            $and: [
                filter,
                teamFilter,
                skillsFilter
            ]
        }, {limit: 20}).fetch();
        //console.error("user filter result n'est pas utilisé !!!")
        searchResult = UsersIndex.search(filterIndex, {limit: 20}).fetch();
        return _.intersectionObjects(searchResult, filterResult);
        //return filterResult;
    },

    team: function () {
        return Teams.findOne({_id: this.toString()}).name;
    },
    userTeamsWithoutGlobalTeam: function () {
        var teams = this.teams;
        var result = [];
        var assignmentReadyTeam = Teams.findOne({name: ASSIGNMENTREADYTEAM});
        teams.forEach(teamId => {
            if (teamId !== assignmentReadyTeam._id)
                result.push(teamId)
        });
        return result;
    }

});


Template.assignmentUsersList.events({
    "click .href-assignment-user": function (event) {
        event.stopPropagation();
        event.preventDefault();
        //TODO can't event to bubble to the collapsible event

        console.info("routing", "/assignment/user/" + this._id);
        Router.go("/assignment/user/" + this._id);
    },

    "click li": function (event) {
        event.stopPropagation();

        //Template.parentData() ne fonctionne pas, alors j'utilise un trick de poney pour stocker dans le dom les _id
        var currentAssignmentType = CurrentAssignmentType.get();
        var isUnassignment = IsUnassignment.get();
        var target = $(event.target);
        var _id;
        if (target.hasClass("user"))
            _id = target.data("_id");
        else
            _id = target.parents(".user").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                break;
            case AssignmentType.TASKTOUSER:
                if (isUnassignment) {
                    Meteor.call("removeAssignUserToTaskTimeSlot", selectedPeopleNeed._id, _id);//, SelectedTask.get()._id, selectedTimeslotId, selectedPeopleNeed);
                    IsUnassignment.set(false)
                } else
                    Meteor.call("assignUserToTaskTimeSlot", selectedPeopleNeed._id, _id);//., SelectedTask.get()._id, selectedTimeslotId, selectedPeopleNeed);
                break;
        }

    },

    "keyup #search_user_name": function (event) {
        var searchInput = $("#search_user_name").val();

        //desactivation de la recherche par URL
        //console.info("routing", "/assignment/user/search/"+query);
        //Router.go("/assignment/user/search/"+query);

        if (searchInput === "") {
            UserIndexFilter.set(noSearchFilter);
        } else {
            UserIndexFilter.set(searchInput);
        }
    },

    "change #filter_team_user": function (event) {
        var _id = $(event.target).val();
        if (_id === "") {
            UserTeamFilter.set(defaultFilter);
            $("#filter_team_user_option_advice_all").text("Choose a team"); //TODO label
        } else {
            UserTeamFilter.set({
                teams: _id
            });
            $("#filter_team_user_option_advice_all").text("All teams"); //TODO label
        }
    },

    "change #filter_skills_user": function (event) {
        var _ids = $(event.target).val();
        if (!_ids) {
            UserSkillsFilter.set(defaultFilter);
        } else {
            UserSkillsFilter.set({
                skills: {
                    $all: _ids
                }
            });
        }
    }
});




