Router.configure({
    layoutTemplate: 'wrapper'
});

//hide menu for each new route
Router.onAfterAction(function () {
    $('#button-collapse-left-menu').sideNav('hide');
});


Router.route('/tasks', function () {
        this.render('TasksList');
    },
    {name: 'task.list'}
);

Router.route('/activities', function () {
        this.render('ActivitiesList');
    },
    {name: 'activity.list'}
);

Router.route('/assignment', function () {
        this.render('AssignmentHome', {to: 'mainContent'});
    },
    {name: 'assignment.calendar'}
);


Router.route('/', function () {
        this.render('home', {to: 'mainContent'});
    },
    {name: 'home'}
);


