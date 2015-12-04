Router.route('/tasks', function () {
    this.render('tasksList');
});

Router.route('/activities', function () {
    this.render('ActivitiesList');
});

Router.route('/assignment', function () {
    this.render('AssignmentHome');
});

Router.route('/', function () {
    this.render('home');
});

Router.route('/task', function(){
    this.render('task');
});

Router.route('/places', function(){
    this.render('places');
});

Router.route('/place/:_id/delete', function() {
    this.render('places',{
        data: function() {
            var currentPlace = this.params._id;
            return Places.remove({_id: currentPlace});

        }
    });
});


Router.route('/task/:_id', function () {

       this.render('task', {
           data: function () {
               var currentTask = this.params._id;
               return Tasks.findOne({_id: currentTask});
           }
       });
});


Router.route('/task/:_id/delete', function() {
        this.render('tasksList',{
            data: function() {
                var currentTask = this.params._id;
                return Tasks.remove({_id: currentTask});
            }
    });
});

Router.route('/teams', function(){
    this.render('teamsList');
});

Router.route('/team', function(){
    this.render('team');
});

Router.route('/team/:_id', function () {

    this.render('team', {
        data: function () {
            var currentTeam = this.params._id;
            return Teams.findOne({_id: currentTeam});
        }
    });
});


Router.route('/team/:_id/delete', function() {
    this.render('teamsList',{
        data: function() {
            var currentTeam = this.params._id;
            return Teams.remove({_id: currentTeam});
        }
    });
});