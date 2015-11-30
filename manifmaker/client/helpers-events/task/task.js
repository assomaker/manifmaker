/**
 * Created by constant on 27/11/2015.
 */
Template.task.helpers({
    tasks: function () {
        return Tasks.find();

    }

});

Template.task.events({
    "click .button-save": function(event){
        event.preventDefault();
        var TaskName = $('input[name=taskName]').val();
        var Team = $('select[name=team]').val();
        var RespManif = $('select[name=respManif]').val();
        var Description = $('input[name=description]').val();
        var Place = $('input[name=place]').val();
        //console.log(TaskName, Team, RespManif, Description, Place);
        task4 = new Task(TaskName,[],[],Place, Team, RespManif, Description );
            Tasks.insert(task4, function(error,results){
                Router.go('tasksList',{name:results});
            });



        //console.log(task4);



        //Router.go('/tasksList');
    }
});