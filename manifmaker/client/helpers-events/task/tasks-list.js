Template.tasksList.helpers({
    tasks: function () {
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


});


Template.tasksList.rendered = function () {
    $(document).ready(function () {
        $('select').material_select();
    });
};

Template.tasksList.created = function () {
    this.filter = new ReactiveTable.Filter('team1', ['team']);
};

Template.tasksList.events({
    "change #team_filter": function (event, template) {
        event.preventDefault();
        var _id = $(event.target).val();
        //TODO constant
        template.filter.set({'team1': input});

    }
});

