Template.referenceList.helpers({
    document: function () {
        return AllCollections[this.REFERENCE_COLLECTION_NAME].find({});
    }
});


