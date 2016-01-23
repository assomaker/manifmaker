
Schemas.references = {};
Schemas.references.options = {};

Schemas.references.options.Teams = {
    PLURAL_REFERENCE_URL: "teams",
    REFERENCE_URL: "team",
    REFERENCE_COLLECTION_NAME: "Teams",
    REFERENCE_MONGO_COLLECTION_NAME: "teams",
    REFERENCE_LABEL: "Team",
};
Schemas.references.Teams = new SimpleSchema({
    name: {
        type: String,
        label: "Team Name",
        max: 100
    }
});
/**
 * @memberOf Models
 * @summary Teams collection
 * @locus Anywhere
 * @instancename collection
 */
Teams = new Mongo.Collection("teams");
Teams.attachSchema(Schemas.references.Teams);

Schemas.references.options.Places = {
    PLURAL_REFERENCE_URL: "places",
    REFERENCE_URL: "place",
    REFERENCE_COLLECTION_NAME: "Places",
    REFERENCE_MONGO_COLLECTION_NAME: "places",
    REFERENCE_LABEL: "Place",
};
Schemas.references.Places = new SimpleSchema({
    name: {
        type: String,
        label: "Place Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Places type",
        defaultValue: "Places",
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Places base URL",
        defaultValue: "place",
    }
});
/**
 * @memberOf Models
 * @summary Places collection
 * @locus Anywhere
 * @instancename collection
 */
Places = new Mongo.Collection("places");
Places.attachSchema(Schemas.references.Places);

Schemas.references.options.Skills = {
    PLURAL_REFERENCE_URL: "skills",
    REFERENCE_URL: "skill",
    REFERENCE_COLLECTION_NAME: "Skills",
    REFERENCE_MONGO_COLLECTION_NAME: "skills",
    REFERENCE_LABEL: "Skill",
};
Schemas.references.Skills = new SimpleSchema({
    key: {
        type: String,
        label: "Skill key",
        max: 38,
        unique: true

    },
    label: {
        type: String,
        label: "Skill Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Skills type",
        defaultValue: "Skills"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Skills base URL",
        defaultValue: "skill"
    }
});
/**
 * @memberOf Models
 * @summary Skills collection
 * @locus Anywhere
 * @instancename collection
 */
Skills = new Mongo.Collection("skills");
Skills.attachSchema(Schemas.references.Skills);

//TODO les assignments terms ne peuvent pas se chevaucher
Schemas.references.options.AssignmentTerms = {
    PLURAL_REFERENCE_URL: "assignment-terms",
    REFERENCE_URL: "assignment-term",
    REFERENCE_COLLECTION_NAME: "AssignmentTerms",
    REFERENCE_MONGO_COLLECTION_NAME: "assignment-terms",
    REFERENCE_LABEL: "Assignment Term",
};
Schemas.references.AssignmentTerms = new SimpleSchema({
    name: {
        type: String,
        label: "Assignment terms Name",
        max: 100
    },
    start: {
        type: Date,
        label: "Assignment terms Start",
        custom: function () {
            if (new moment(this.value).isAfter(new moment(this.key.replace("start", "") + this.field('end').value))) {
                return "startAfterEnd";
            }
        },
        autoform: {
            type: "datetime-local"
        }
    },
    end: {
        type: Date,
        label: "Assignment terms  End (not include)",
        autoform: {
            type: "datetime-local"
        },
        custom: function () {
            if (new moment(this.value).isBefore(new moment(this.field(this.key.replace("end", "") + 'start').value))) {
                return "endBeforeStart";
            }
        }
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Assignment terms type",
        defaultValue: "AssignmentTerms"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Assignment terms base URL",
        defaultValue: "assignment-term"
    }
});
/**
 * @memberOf Models
 * @summary AssignmentTerms collection
 * @locus Anywhere
 * @instancename collection
 */
AssignmentTerms = new Mongo.Collection("assignment-terms");
AssignmentTerms.attachSchema(Schemas.references.AssignmentTerms);

