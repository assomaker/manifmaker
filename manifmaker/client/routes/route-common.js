Router.configure({
    layoutTemplate: 'wrapper'
});

//hide menu for each new route
Router.onAfterAction(function () {
    $('#button-collapse-left-menu').sideNav('hide');
});


//hide topNavBar to each expect assignment
Router.onAfterAction(function () {
        this.render("", {to: "topNavBar"})
    },
    {except: ['assignment.calendar']}
);



Router.route('/', function () {
        this.render('home', {to: 'mainContent'});
    },
    {name: 'home'}
);