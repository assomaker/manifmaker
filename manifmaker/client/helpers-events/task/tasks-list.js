Template.tasksList.helpers({
    tasks: function () {
        //todo ce helpers n'est plus utilisé
        var filter = TaskFilter.get();
        var filterIndex = TaskIndexFilter.get();
        var teamFilter = TaskTeamFilter.get();

        var searchResult;
        var filterResult;

        //filterResult = Tasks.find(filter);
        filterResult = Tasks.find({
            $and: [
                filter,
                teamFilter
            ]
        }, {limit: 20}).fetch();

        //console.error("task filter result n'est pas utilisé !!!")
        searchResult = TasksIndex.search(filterIndex).fetch();
        return _.intersectionObjects(searchResult, filterResult);
        //return filterResult;
    },
    tasksList: function () {

       // var teamFilter = TaskTeamFilter.get();


        return {
            collection: Tasks,//.find(teamFilter),
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            columnPerPage: 5,
            multiColumnSort: true,
            filters:['teamFilterId'],
            fields: [
                {
                    key: 'name',
                    label: 'Task name',
                    fnAdjustColumnSizing: true
                },
                {
                    key: 'teamId',
                    label: 'Team',
                    fnAdjustColumnSizing: true,
                    fn: function (teamId, Task) {
                        return Teams.findOne(teamId).name;
                    }
                },
                {
                    key: 'timeSlots',
                    label: 'Time slots count',
                    sortable: false,
                    fn: function (timeSlots, Task) {
                        return timeSlots.length;
                    },
                    fnAdjustColumnSizing: true
                },
                {
                    label: 'Actions',
                    tmpl: Template.taskButtons,
                    fnAdjustColumnSizing: true
                }
            ]
        }
    }
});


Template.tasksList.rendered = function () {
    //TODO voir si c'est la place et la maniere la plus pertinente
    $(document).ready(function () {
        $('select').material_select();
    });
};

Template.tasksList.created = function () {
    //TODO que quoi ?
    this.filter = new ReactiveTable.Filter('teamFilterId', ['teamId']);
};

Template.tasksList.events({
    "change #team_filter": function (event, template) {
        event.preventDefault();
        var _id = $(event.target).val();

        //TODO il doit falloir agir sur le datatable...
        TaskTeamFilter.set({
            teamId : _id
        });

    },
    "click .team-filter-wrapper" : function(){
        //TODO voir si c'est la place et la maniere la plus pertinente
        $('.team-filter-wrapper select').material_select();
    }
});

