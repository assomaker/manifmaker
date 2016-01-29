Template.usersList.helpers({
    usersList: function () {
        return {
            collection: Users,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            filters:['user-list-team-filter'],
            fields: [
                {
                    key: 'name',
                    label: 'Task name',
                    fnAdjustColumnSizing: true
                },
                {
                    key: 'teams',
                    label: 'Teams',
                    fnAdjustColumnSizing: true,
                    searchable: false, //TODO doesn't work (try with a teamId)
                    fn: function (teams, user) {
                        return _.reduce(Teams.find({_id:{$in:teams}}).fetch(), function(memo,team){
                            if(team.name === ASSIGNMENTREADYTEAM) return memo;
                            if(memo === "") return team.name;
                            return memo +", "+team.name;
                        },"");
                    }
                },
                { //TODO ne pas mettre cette collone si pas le role 'role'
                    label: 'Roles',
                    fnAdjustColumnSizing: true,
                    searchable: false,
                    fn: function (nothing, user) {
                        if(!user.loginUserId) return "User don't have a associated login account";
                        return user.roles;
                    }
                },
                {
                    label: 'Actions',
                    tmpl: Template.userButtons,
                    fnAdjustColumnSizing: true
                }
            ]
        }
    }
});



Template.usersList.created = function () {
    this.userListTeamFilter = new ReactiveTable.Filter("user-list-team-filter", ["teams"]);
};

Template.usersList.events({
    "change #user-list-team-selector": function (event, template) {
        event.preventDefault();
        var _id = $(event.target).val();
        template.userListTeamFilter.set(_id);
    }
});

