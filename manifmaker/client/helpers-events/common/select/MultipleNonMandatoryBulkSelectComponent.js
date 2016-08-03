import {MultipleNonMandatorySelectComponent} from "./MultipleNonMandatorySelectComponent"

class MultipleNonMandatoryBulkSelectComponent extends MultipleNonMandatorySelectComponent {
    initializeData() {
        super.initializeData();

        /**
         * bulkPeopleNeededIds is used to update multiple peopleNeeded in a batch. There is no docs for this, read the code
         * if needed.
         */
        this.bulkPeopleNeededIds = this.data().bulkPeopleNeededIds;

        //reconstructing pathWithArray with only _id on the LAST path from bulk
        this.pathWithArray = [];
        this.pathWithArray.push(this.bulkPeopleNeededIds[0]);
        this.pathWithArray.push({
            path: this.bulkPeopleNeededIds[1].path,
            _id: this.bulkPeopleNeededIds[1]._ids[0]
        });

    }

    updateOption(newOptions) {
        var supperUpdateOptionMethod = super.updateOption;
        _.each(this.bulkPeopleNeededIds[1]._ids, _.bind(function (peopleNeededId) {
            this.pathWithArray[1] = {
                path: "peopleNeeded",
                _id: peopleNeededId
            };//peopleNeed path
           supperUpdateOptionMethod.call(this,newOptions);
        }, this));
    }

}

MultipleNonMandatoryBulkSelectComponent.register("MultipleNonMandatoryBulkSelectComponent");