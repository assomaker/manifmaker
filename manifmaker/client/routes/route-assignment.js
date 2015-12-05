Router.route('/assignment', function () {
        this.render('AssignmentHome', {to: 'mainContent'});
        this.render("assignmentMenu", {to: "topNavBar"})

    },
    {name: 'assignment.calendar'}
);