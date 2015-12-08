Router.route('/activities', function () {
        this.render('ActivitiesList', {to: 'mainContent'});
    },
    {name: 'activity.list'}
);