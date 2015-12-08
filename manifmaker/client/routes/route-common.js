Router.configure({
    layoutTemplate: 'wrapper'
});

//hide menu for each new route
Router.onAfterAction(function () {
    $('#button-collapse-left-menu').sideNav('hide');
});


Router.route('/', function () {
        this.render('home', {to: 'mainContent'});
    },
    {name: 'home'}
);