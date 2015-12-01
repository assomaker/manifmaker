Router.route('/tasksList', function () {
    this.render('TasksList');
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

Router.route('/place', function(){
    this.render('place');
});

//Router.route('/task/:_id', function(){
  //  var params = this.params; // { _id: "5" }
    //var id = params._id; // "5"
//});

Router.route('/task/:name', function () {

       this.render('task', {
           data: function () {
               var currentTask = this.params.name;
               return Tasks.findOne({name: currentTask});
           }
       });

});
