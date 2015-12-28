var PLURAL_REFERENCE_URL = "places";
var REFERENCE_URL = "place";
var REFERENCE_COLLECTION_NAME = "Places";

//get (list)
Router.route('/' + PLURAL_REFERENCE_URL, function () {
        this.render(PLURAL_REFERENCE_URL + 'List', {to: 'mainContent'});
    },
    {name: REFERENCE_URL + '.list'}
);

//post
Router.route('/' + REFERENCE_URL, function () {
        this.render(REFERENCE_URL + 'Insert', {to: 'mainContent'});
    },
    {name: REFERENCE_URL + '.create'}
);

//put
Router.route('/' + REFERENCE_URL + '/:_id', function () {
        var current = this.params._id;
        TeamToUpdate.set(current);
        this.render(REFERENCE_URL + 'Update', {to: 'mainContent'});
    },
    {name: REFERENCE_URL + '.update'}
);

//delete
Router.route('/' + REFERENCE_URL + '/:_id/delete', function () {
        var current = this.params._id;
        AllCollections[REFERENCE_COLLECTION_NAME].remove({_id: current});
        this.redirect("/" + PLURAL_REFERENCE_URL);
    },
    {name: REFERENCE_URL + '.delete'}
);