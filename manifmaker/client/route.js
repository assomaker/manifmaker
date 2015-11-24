
Router.route('/tasks', function () {
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