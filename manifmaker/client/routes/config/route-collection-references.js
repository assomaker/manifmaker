


//get (list)
Router.route('/conf-maker', function () {
        this.render('confMaker', {
            data: {
                REFERENCE_URL: REFERENCE_URL,
                //new with datatable
                reactiveTableSettings: {
                    collection: AllCollections[REFERENCE_COLLECTION_NAME],
                    rowsPerPage: 5,
                    showFilter: true,
                    showRowCount: true,
                    fields: reactiveTableFields
                }
            },
            to: 'mainContent'
        });
    },
    {name: 'confMaker'}
);

_.each(Schemas.references.options, function (referenceOptions) {
    var PLURAL_REFERENCE_URL = referenceOptions.PLURAL_REFERENCE_URL;
    var REFERENCE_URL = referenceOptions.REFERENCE_URL;
    var REFERENCE_COLLECTION_NAME = referenceOptions.REFERENCE_COLLECTION_NAME;


    //generate fields a partir de schema-references
    var schemaFields = Schemas.references[REFERENCE_COLLECTION_NAME]._schema;
    var reactiveTableFields = [];

    _.each(schemaFields,(field, key) => {
        if (key === "baseUrl" || key === "type") //pas moyen de faire mieux, SchemasCollection n'accepte aucun attribut en trop
            return;
        reactiveTableFields.push(
            {
                key: key,
                label: field.label,
                fnAdjustColumnSizing: true
            }
        );

    });

    //last column buttons
    reactiveTableFields.push({
        label: 'Actions',
        tmpl: Template.collectionReferenceButtons,
        fnAdjustColumnSizing: true
    });

    /**
     * @memberOf Route
     * @summary Display References Collection list (with filter and search soon)
     * @locus client
     * @name  [collRefPluralUrl].list /[collRefPluralUrl]
     */
    //get (list)
    Router.route('/' + PLURAL_REFERENCE_URL, function () {
            this.render('referenceList', {
                data: {
                    REFERENCE_URL: REFERENCE_URL,
                    //new with datatable
                    reactiveTableSettings: {
                        collection: AllCollections[REFERENCE_COLLECTION_NAME],
                        rowsPerPage: 5,
                        showFilter: true,
                        showRowCount: true,
                        fields: reactiveTableFields
                    }
                },
                to: 'mainContent'
            });
        },
        {name: REFERENCE_URL + '.list'}
    );

    /**
     * @memberOf Route
     * @summary Display the create References Collection form
     * @locus client
     * @name  [collRefName].create /[collReflUrl]
     */
//post
    Router.route('/' + REFERENCE_URL, function () {
            this.render(REFERENCE_URL + '-insert', {to: 'mainContent'});
        },
        {name: REFERENCE_URL + '.create'}
    );

    /**
     * @memberOf Route
     * @summary Display the update References Collection form
     * @locus client
     * @name  [collRefName].update /[collReflUrl]/_id
     */
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

});



