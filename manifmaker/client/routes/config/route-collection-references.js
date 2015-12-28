var references = [
    {
        PLURAL_REFERENCE_URL: "places",
        REFERENCE_URL: "place",
        REFERENCE_COLLECTION_NAME: "Places",
        REFERENCE_LABEL: "Place"
    },
    {
        PLURAL_REFERENCE_URL: "teams",
        REFERENCE_URL: "team",
        REFERENCE_COLLECTION_NAME: "Teams",
        REFERENCE_LABEL: "Team"
    }
];


_.each(references, function (referenceOptions) {
    var PLURAL_REFERENCE_URL = referenceOptions.PLURAL_REFERENCE_URL;
    var REFERENCE_URL = referenceOptions.REFERENCE_URL;
    var REFERENCE_COLLECTION_NAME = referenceOptions.REFERENCE_COLLECTION_NAME;

    //get (list)
    Router.route('/' + PLURAL_REFERENCE_URL, function () {
            this.render('referenceList', {
                data: {
                    document: AllCollections[REFERENCE_COLLECTION_NAME].find({}),
                    PLURAL_REFERENCE_URL: referenceOptions.PLURAL_REFERENCE_URL,
                    REFERENCE_URL: referenceOptions.REFERENCE_URL,
                    REFERENCE_COLLECTION_NAME: referenceOptions.REFERENCE_COLLECTION_NAME
                },
                to: 'mainContent'
            });
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

});

