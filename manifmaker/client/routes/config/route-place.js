Router.route('/places', function () {
        this.render('places', {to: 'mainContent'});
    },
    {name: "place.list"}
);

Router.route('/place/:_id/delete', function () {
        this.render('places', {
            data: function () {
                var currentPlace = this.params._id;
                return Places.remove({_id: currentPlace});

            }
        }, {to: 'mainContent'});
    },
    {name: 'place.delete'}
);
