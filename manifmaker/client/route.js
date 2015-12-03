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

