Router.configure({
    layoutTemplate: 'wrapper'
});

//hide menu for each new route
Router.onAfterAction(function () {
    $('#button-collapse-left-menu').sideNav('hide');
});


//hide topNavBar to each expect assignment
Router.onAfterAction(function () {
        this.render("", {to: "topNavBar"});

        assignmentCalendarIsRendered = false;
    },
    {
        except: [
            'assignment.calendar',
            'assignment.calendar.user',
            'assignment.calendar.userToTask',
            'assignment.calendar.userToTask.user',
            'assignment.calendar.userToTask.user.date',

            'assignment.calendar.taskToUser',
            'assignment.calendar.taskToUser.task',
            'assignment.calendar.taskToUser.task.timeSlot'

        ]
    }
);


Router.route('/', function () {
        this.render('home', {to: 'mainContent'});
    },
    {name: 'home'}
);