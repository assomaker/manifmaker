import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

class AssignmentUserList extends BlazeComponent {

    constructor(parent){
        super();
        this.userTeamFilter = new ReactiveVar(AssignmentReactiveVars.defaultFilter);
        this.userSkillsFilter = new ReactiveVar(AssignmentReactiveVars.defaultFilter);
    }

    events() {
        return [{
            "click .href-assignment-user": this.onClickUserName,
            "click .user": this.onClickUser,
            "keyup #search_user_name": this.performSearch,
            "change .filter_team": this.performFilterTeam,
            "change #filter_skills_user": this.performFilterSkills,
        }]
    }
    

    onClickUserName(event) {
        event.stopPropagation();
        event.preventDefault();
        //TODO can't event to bubble to the collapsible event

        console.info("routing", "/assignment/user/" + this.currentData()._id);
        Router.go("/assignment/user/" + this.currentData()._id);
    }

    onClickUser(event) {
        event.stopPropagation();

        //Template.parentData() ne fonctionne pas, alors j'utilise un trick de poney pour stocker dans le dom les _id
        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();
        var isUnassignment = AssignmentReactiveVars.IsUnassignment.get();
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
                    Meteor.call("removeAssignUserToTaskTimeSlot", AssignmentReactiveVars.SelectedPeopleNeed.get()._id, _id);
                    AssignmentReactiveVars.IsUnassignment.set(false)
                } else
                    Meteor.call("assignUserToTaskTimeSlot", AssignmentReactiveVars.SelectedPeopleNeed.get()._id, _id);
                AssignmentReactiveVars.SelectedTimeSlot.set(null);
                break;
        }

    }

    performSearch(event) {
        var searchInput = $("#search_user_name").val();

        //desactivation de la recherche par URL
        //console.info("routing", "/assignment/user/search/"+query);
        //Router.go("/assignment/user/search/"+query);

        if (searchInput === "") {
            AssignmentReactiveVars.UserIndexFilter.set(AssignmentReactiveVars.noSearchFilter);
        } else {
            AssignmentReactiveVars.UserIndexFilter.set(searchInput);
        }
    }

    performFilterTeam(event) {
        var _id = $(event.target).val();
        if (_id === "") {
            this.userTeamFilter.set(AssignmentReactiveVars.defaultFilter);
        } else {
            this.userTeamFilter.set({
                teams: _id
            });
        }
    }

    performFilterSkills(event) {
        var _ids = $(event.target).val();
        if (!_ids) {
            this.userSkillsFilter.set(AssignmentReactiveVars.defaultFilter);
        } else {
            this.userSkillsFilter.set({
                skills: {
                    $all: _ids
                }
            });
        }
    }


    users() {
        var filter = AssignmentReactiveVars.UserFilter.get();
        var filterIndex = AssignmentReactiveVars.UserIndexFilter.get();
        var teamFilter = this.userTeamFilter.get();
        var skillsFilter = this.userSkillsFilter.get();

        var searchResult;
        var filterResult;

        filterResult = Users.find({
            $and: [
                filter,
                teamFilter,
                skillsFilter
            ]
        }, {limit: 20}).fetch();
        searchResult = UsersIndex.search(filterIndex, {limit: 20}).fetch();
        return _.intersectionObjects(searchResult, filterResult);
    }

    team() {
        return Teams.findOne({_id: this.currentData().toString()}).name;
    }

    userTeamsWithoutGlobalTeam() {
        var teams = this.currentData().teams;
        var result = [];
        var assignmentReadyTeam = Teams.findOne({name: ASSIGNMENTREADYTEAM});
        teams.forEach(teamId => {
            if (teamId !== assignmentReadyTeam._id)
                result.push(teamId)
        });
        return result;
    }
}


AssignmentUserList.register("AssignmentUserList");