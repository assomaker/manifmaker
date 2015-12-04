Router.route('/activities', function () {
        this.render('ActivitiesList');
    },
    {name: 'activity.list'}
);