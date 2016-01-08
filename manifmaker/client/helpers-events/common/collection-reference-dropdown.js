Template.commonTeamListDropdown.events({
    "change .filter_team": function (event, template) {
        var _id = $(event.target).val();
        var $adviceAll = $(template.find(".filter_team_option_advice_all"));
        if (_id === "") {
            $adviceAll.text($adviceAll.data("chooselabel"));
        } else {
            $adviceAll.text($adviceAll.data("alllabel"));
        }
    }
});



