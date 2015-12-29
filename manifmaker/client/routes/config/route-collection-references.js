var references = [
    {
        PLURAL_REFERENCE_URL: "places",
        REFERENCE_URL: "place",
        REFERENCE_COLLECTION_NAME: "Places",
        REFERENCE_MONGO_COLLECTION_NAME: "places",
        REFERENCE_LABEL: "Place",
        TEMPLATE_ROW: "placeReferenceListRow"
    },
    {
        PLURAL_REFERENCE_URL: "teams",
        REFERENCE_URL: "team",
        REFERENCE_COLLECTION_NAME: "Teams",
        REFERENCE_MONGO_COLLECTION_NAME: "teams",
        REFERENCE_LABEL: "Team",
        TEMPLATE_ROW: "teamReferenceListRow",
    },
    {
        PLURAL_REFERENCE_URL: "skills",
        REFERENCE_URL: "skill",
        REFERENCE_COLLECTION_NAME: "Skills",
        REFERENCE_MONGO_COLLECTION_NAME: "skills",
        REFERENCE_LABEL: "Skill",
        TEMPLATE_ROW: "skillReferenceListRow"
    },
    {
        PLURAL_REFERENCE_URL: "assignment-terms",
        REFERENCE_URL: "assignment-term",
        REFERENCE_COLLECTION_NAME: "AssignmentTerms",
        REFERENCE_MONGO_COLLECTION_NAME: "assignment-terms",
        REFERENCE_LABEL: "Assignment Term",
        TEMPLATE_ROW: "assignmentTermReferenceListRow"
    }
];


_.each(references, function (referenceOptions) {
    var PLURAL_REFERENCE_URL = referenceOptions.PLURAL_REFERENCE_URL;
    var REFERENCE_URL = referenceOptions.REFERENCE_URL;
    var REFERENCE_COLLECTION_NAME = referenceOptions.REFERENCE_COLLECTION_NAME;
    var TEMPLATE_ROW = referenceOptions.TEMPLATE_ROW;


    //get (list)
    Router.route('/' + PLURAL_REFERENCE_URL, function () {
            this.render('referenceList', {
                data: {
                    document: AllCollections[REFERENCE_COLLECTION_NAME].find({}),
                    PLURAL_REFERENCE_URL: referenceOptions.PLURAL_REFERENCE_URL,
                    REFERENCE_URL: referenceOptions.REFERENCE_URL,
                    REFERENCE_COLLECTION_NAME: referenceOptions.REFERENCE_COLLECTION_NAME,
                    TEMPLATE_ROW: referenceOptions.TEMPLATE_ROW
                },
                to: 'mainContent'
            });
        },
        {name: REFERENCE_URL + '.list'}
    );

//post
    Router.route('/' + REFERENCE_URL, function () {
            this.render(REFERENCE_URL + '-insert', {to: 'mainContent'});
        },
        {name: REFERENCE_URL + '.create'}
    );

//put
    Router.route('/' + REFERENCE_URL + '/:_id', function () {
            var current = this.params._id;
            this.render(REFERENCE_URL + '-update', {
                data: {
                    document: AllCollections[REFERENCE_COLLECTION_NAME].findOne(current),
                    PLURAL_REFERENCE_URL: referenceOptions.PLURAL_REFERENCE_URL,
                    REFERENCE_URL: referenceOptions.REFERENCE_URL,
                    REFERENCE_COLLECTION_NAME: referenceOptions.REFERENCE_COLLECTION_NAME
                },
                to: 'mainContent'
            });
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

