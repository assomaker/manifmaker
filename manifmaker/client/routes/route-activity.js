Router.route('/activities', function () {
        console.info("routing", "/activities");
        this.render('ActivitiesList', {to: 'mainContent'});
    },
    {name: 'activity.list'}
);