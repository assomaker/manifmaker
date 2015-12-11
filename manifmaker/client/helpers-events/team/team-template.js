Template.teamTemplate.helpers({
    tasks: function(){
        return Tasks.find()
    },
    teams:function(){
        return Teams.find()
    }
});