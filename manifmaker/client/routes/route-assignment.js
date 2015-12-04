Router.route('/assignment', function () {
        this.render('AssignmentHome', {to: 'mainContent'});
    },
    {name: 'assignment.calendar'}
);