import {Schemas} from '../../../both/collection/model/SchemasHelpers'
import {SecurityServiceClient} from "../../../client/service/SecurityServiceClient"
/**
 * This namespace describes the auto-generated routes for all Collection references described belove
 * @memberOf Route
 * @namespace Route.collectionReference
 */

AllCollections = {
    Skills: Skills,
    Teams: Teams,
    Places: Places,
    AssignmentTerms: AssignmentTerms,
    GroupRoles: GroupRoles,
    EquipmentCategories: EquipmentCategories,
    Equipments: Equipments,
    WaterSupplies: WaterSupplies,
    WaterDisposals: WaterDisposals,
    PowerSupplies: PowerSupplies,
    EquipmentStorages: EquipmentStorages
};

var confMakerReactiveTables = [];

_.each(Schemas.references.options, function (referenceOptions) {
    var PLURAL_REFERENCE_URL = referenceOptions.PLURAL_REFERENCE_URL;
    var REFERENCE_URL = referenceOptions.REFERENCE_URL;
    var REFERENCE_COLLECTION_NAME = referenceOptions.REFERENCE_COLLECTION_NAME;
    var REFERENCE_LABEL = referenceOptions.REFERENCE_LABEL;


    //generate fields a partir de schema-references
    var schemaFields = Schemas.references[REFERENCE_COLLECTION_NAME]._schema;
    var reactiveTableFields = [];

    _.each(schemaFields,(field, key) => {
        if (key === "baseUrl" || key === "type") //pas moyen de faire mieux, SchemasCollection n'accepte aucun attribut en trop
            return;
        if(key.indexOf("Id") !== -1){ //it's a reference to another collection !
            reactiveTableFields.push(
                {
                    key: key,
                    label: field.label,
                    fnAdjustColumnSizing: true,
                    fn: function (teamId, Task) {
                        return AllCollections[key.split("_")[0]].findOne(teamId).name;
                    }
                }
            );
        } else {
            reactiveTableFields.push(
                {
                    key: key,
                    label: field.label,
                    fnAdjustColumnSizing: true
                }
            );
        }

    });

    //last column buttons
    reactiveTableFields.push({
        label: 'Actions',
        tmpl: Template.collectionReferenceButtons,
        fnAdjustColumnSizing: true
    });

    var item = {
        REFERENCE_URL: REFERENCE_URL,
        REFERENCE_LABEL: REFERENCE_LABEL,
        reactiveTableSettings: {
            collection: AllCollections[REFERENCE_COLLECTION_NAME],
            rowsPerPage: 5,
            showFilter: true,
            showRowCount: true,
            fields: reactiveTableFields
        }
    };
    confMakerReactiveTables.push(item);

    /**
     * @memberOf Route.collectionReference
     * @summary Display References Collection list (with filter and search soon)
     * @locus client
     * @name  '[REFERENCE_URL].list' /[PLURAL_REFERENCE_URL]
     */
    //get (list)
    Router.route('/' + PLURAL_REFERENCE_URL, function () {
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.CONFMAKER);
            this.render('referenceList', {
                data: item,
                to: 'mainContent'
            });
        },
        {name: REFERENCE_URL + '.list'}
    );

    /**
     * @memberOf Route.collectionReference
     * @summary Display the create References Collection form
     * @locus client
     * @name  '[REFERENCE_URL].create' /[REFERENCE_URL]
     */
//post
    Router.route('/' + REFERENCE_URL, function () {
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.CONFMAKER);
            this.render(REFERENCE_URL + '-insert', {
                data: {
                  options: referenceOptions
                },
                to: 'mainContent'
            });
        },
        {name: REFERENCE_URL + '.create'}
    );

    /**
     * @memberOf Route.collectionReference
     * @summary Display the update References Collection form
     * @locus client
     * @name  '[REFERENCE_URL].update' /[REFERENCE_URL]/_id
     */
//put
    Router.route('/' + REFERENCE_URL + '/:_id', function () {
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.CONFMAKER);
            var current = this.params._id;
            this.render(REFERENCE_URL + '-update', {
                data: {
                    collection: AllCollections[REFERENCE_COLLECTION_NAME],
                    document: AllCollections[REFERENCE_COLLECTION_NAME].findOne(current),
                },
                to: 'mainContent'
            });
        },
        {name: REFERENCE_URL + '.update'}
    );

});

/**
 * @memberOf Route.collectionReference
 * @summary Display the conf homepage
 * @locus client
 * @name  'confMaker' /confMaker
 */
//get (list)
Router.route('/conf-maker', function () {
        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.CONFMAKER);
        this.render('confMaker', {
            data: {
                confMakerReactiveTables : confMakerReactiveTables
            },
            to: 'mainContent'
        });
    },
    {name: 'conf-maker'}
);


