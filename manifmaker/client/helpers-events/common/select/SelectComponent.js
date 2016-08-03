export class SelectComponent extends BlazeComponent {

    /** @ignore */
    checkItemPath() {
        //to implement
    }

    /** @ignore */
    template() {
        //to implement
    }

    /** @ignore */
    collectionSelectedItems() {
        //to implement
    }

    /** @ignore */
    isChecked() {
        //to implement
    }

    /** @ignore */
    quickSelect() {
        //to implement
    }

    /** @ignore */
    onCheckboxOptionsChange(e) {
        //to implement and use updateOption
    }

    //TODO oCaA : optionCollection as array
    /**
     * @constructs SelectComponent
     * @description
     *
     * A demo should be available in development mode at /demo-select. The corresponding code is at /client/templates/demo-select.html
     *
     * This set a component provide a powerful select whose features are :
     * * update directly anything in a collection
     * * let you do whatever you want using a callback
     * * searchable options
     * * sortable options
     * * many more...
     *
     * SelectComponent is not designed to be used as it, you should use one of the following component :
     * - SingleSelectComponent
     * - SingleNonMandatorySelectComponent
     * - MultipleSelectComponent
     * - MultipleNonMandatorySelectComponent
     *
     * NonMandatory offer a button to remove all selected option
     * SingleSelect allow to select ONE option while MultipleSelect allow to select ANY option.
     *
     * Here is the simplest example :
     * ``` html
     *  {{> MultipleSelectComponent selectLabel="Multiple select with mininum params to update an item in a collection"
     *           optionCollection="Teams" optionValueName="name" optionCollectionIndex="TeamsIndex"
     *           updateCollection="Users" updateItemId=user1Id updateItemPath="teams"
     *   }}
     *```
     *
     * There is two main kind of params. The ones telling what will be the options to be selected and the ones explaining what to do once options
     * have been selected.
     *
     * To define the options selectable you need : optionCollection, optionValueName and optionCollectionIndex.
     * To explain what to do after user actions : updateCollection, updateItemId, updateItemPath OR provide only an updateCallback.
     *
     * Refers to following docs to have an explanation of each option.
     *
     * You also have several other options to customize your select :
     * * maxSelectedOptionDisplayed
     * * selectedOptionSortedOnTopOfList
     * * withoutLabel
     * * quickSelectIds/quickSelectId
     * * all label are customizable and offer a default value inferred from other mandatory params
     */
    initializeData() {
        if (this.isDataInitialized)
            return;
        this.isDataInitialized = true;

        /**
         * @summary required. Les options du select
         * @description
         * Mongo Collection in the window scope(findAll will be used) OR array of object.
         *
         * How to user an array of object :
         * Each object should have
         * * a "value" key which will be given in the updateCallback or user to update the item in the updateCollection
         * (if a MongoCollection is provided).
         * * an other key holding the label to be displayed
         *
         * You have to make sure all objects have unique value or you will have trouble knowing which option has been selected.
         *
         * optionValueName can be whatever you want as long as it is the same as the key holding the label
         *
         * Unfortunately, optionCollection as an array can be mixed with optionQuery. You should pre-filter your option array before.
         *
         */
        this.optionCollection;

        /**
         * @summary to pre-filter the options available to select
         * @type {JSON}
         * @description
         * It should be a valid Mongo find query (it will be used as optionCollection.find(optionQuery) if defined)
         */
        this.optionQuery;

        /**
         * @summary required
         * @type {string}
         * @description
         * MongoDb field of the option label to be displayed (in the selectable list in the popover and the list displaying
         * the selected options
         */
        this.optionValueName
        if (!this.data().optionValueName)
            throw new Meteor.Error(this.constructor.name + " : optionValueName should be defined. Given : " + this.data().optionValueName);
        this.optionValueName = this.data().optionValueName;

        if (this.data().optionCollection){
            if(window[this.data().optionCollection]){
                this.optionCollection = window[this.data().optionCollection];
                this.optionQuery = this.data().optionQuery || null;
            } else if(Array.isArray(this.data().optionCollection)){
                    //insert all item of array in temp collection and set an optionQuery and set optionValueName

                this.optionCollection = window["TempCollection"];
                var optionGroup = new Meteor.Collection.ObjectID()._str;
                this.optionQuery = {
                    "optionGroup": optionGroup
                };
                this.data().optionCollection.forEach(option => {
                    this.optionCollection.insert({
                        "optionGroup": optionGroup,
                        "value": option.value,
                        [this.optionValueName]: option[this.optionValueName]
                    });
                });
            } else
                throw new Meteor.Error(this.constructor.name + " : optionCollection should be Collection instance in the window scope or an array of string to be used as options. Given :" + this.data().optionCollection);
        } else
            throw new Meteor.Error(this.constructor.name + " : optionCollection should be Collection instance in the window scope or an array of string to be used as options. Given :" + this.data().optionCollection)


        /**
         * @summary If provided, allow the user to filter by text the option list from the popover
         * @description
         * Should be an EasySearch.Index instance in the window scope
         */
        this.optionCollectionIndex;
        if (this.data().optionCollectionIndex)
            if (window[this.data().optionCollectionIndex])
                this.optionCollectionIndex = window[this.data().optionCollectionIndex];
            else
                throw new Meteor.Error(this.constructor.name + " : optionCollectionIndex should be EasySearch.Index instance in the window scope. Given :" + this.data().optionCollectionIndex);


        /**
         * @description
         * Mongo Collection in the window scope
         *
         * Mongo Collection from which an item will be automacally updated when select changes.
         * If not provided, you should use an updateCallback to handle yourself whatever you want to do with the custom select.
         */
        this.updateCollection;
        /**
         * @summary required if updateCollection is provided
         * @type {mongoId}
         * @description
         * _id of the item to be updated (need to be in updateCollection, of course)
         */
        this.updateItemId;
        /**
         * @summary required if updateCollection is provided and pathWithArray is not
         * @description
         * dot path to nested field to be updated
         */
        this.updateItemPath; //path to an array
        /**
         * @summary required if updateCollection is provided and updateItemPath is not
         * @description
         * key value object
         *
         * JSON object to update a nested field which is itself in an array of object with an unique _id.
         * See optionsToUpdate for more information
         */
        this.pathWithArray;

        /**
         *  @summary required if updateCollection is not provided
         *  @type {function}
         *  @description
         *  important : your callback should return a function. Blaze is made to evaluate everything that is given to him, a callback has
         *  to be have this form :
         *  ``` javascript
         *   myUpdateCallback(error, docModified, newOption) {
         *          return _.bind(function(error, docModified, newOption) {
         *              //do something with newOption which is a MongoId if SingleSelect or an array of MongoId if MultipleSelect
         *          },this);
         *   }
         *  ```
         *
         *  Called with an error object as the first argument and, if no error, the number of affected documents as
         *  the second and an array of the selected options as the third.
         *  Required if updateCollection is not provided but can be used even if updateCollection is provided
         */
        this.updateCallback;

        if (!this.data().updateCollection || !window[this.data().updateCollection]) {
            if (!this.data().updateCallback) {
                throw new Meteor.Error(this.constructor.name + " : updateCollection should be Collection instance in the window scope or you should provide a updateCallback to handle the update by yourself." +
                    "The updateCallback should return a function (read the doc)");
            } else {
                //mode callback only
                this.updateCallback = this.data().updateCallback;

                this.updateCollection = "TempCollection";
                //TODO  nOC : insert an empty array instead of null if this is MultipleSelectComponent
                //TODO nOC : comment faire pour prendre aussi en compte les filles de MultipleSelectComponent
                // => si pas de moyen propre avec Javascript, le array se fera juste ecrasé par le premier update du single select
                this.updateItemId = window[this.updateCollection].insert({"selectedOption": []});
                this.updateItemPath = "selectedOption"; //path to an array
            }
        } else {
            //mode update collection + optional callback
            this.updateCollection = this.data().updateCollection;
            this.updateItemId = this.data().updateItemId;
            this.updateItemPath = this.data().updateItemPath; //path to an array
            this.pathWithArray = this.data().pathWithArray || null;
            this.updateCallback = this.data().updateCallback;
        }

        /**
         * @description
         * If nothing is selected, allow user to quickly select predefined option(s) without opening the popover
         * If defined, either quickSelectId (SingleSelect) or quickSelectIds (MultipleSelect) should be defined.
         * @type {String}
         */
        this.quickSelectLabel;

        /**
         * @summary Required if quickSelectLabel is defined. Works on a SingleSelect only.
         * @type {MongoId}
         */
        this.quickSelectId;

        /**
         * @summary Required if quickSelectLabel is defined. Works on a MultipleSelect only.
         * @type {Array<MongoId>}
         */
        this.quickSelectIds;

        if (this.data().quickSelectLabel && (this.data().quickSelectIds || this.data().quickSelectId)) {
            this.quickSelectId = this.data().quickSelectId || null;
            this.quickSelectIds = this.data().quickSelectIds || null;
            this.quickSelectLabel = this.data().quickSelectLabel;
        }

        /**
         * @sumamry Popover title
         * @default : "Update " + optionCollection
         * @type {string}
         *
         */
        this.title = this.data().title || "Update " + this.data().optionCollection;

        /**
         * @summary Label of the select component (not the popover title)
         * @default : title
         * @type {string}
         */
        this.selectLabel = this.data().selectLabel || this.data().updateCollection + "' " + this.data().optionCollection;

        /**
         * @summary Search input text placeholder
         * @default "Filter by" + optionValueName
         * @type {string}
         */
        this.filterPlaceHolder = this.data().filterPlaceHolder || "Filter by " + this.optionValueName;

        /**
         * @default : Nothing yet selected
         * @type {string}
         */
        this.nothingSelectedLabel = this.data().nothingSelectedLabel || "Nothing yet selected";

        /**
         * @summary compact form where selectLabel is not used
         * @default false
         * @type {boolean}
         */
        this.withoutLabel = this.data().withoutLabel || false;

        /**
         * @default -1
         * @type {number}
         * @description
         * Number of selected options displayed. If -1, all selected options are displayed. If 0, so selected options are displayed. Else, if more than
         * maxSelectedOptionDisplayed options are selected, a count is displayed with maxSelectedOptionDisplayedLabel.
         *
         * Note : Any value greater than 0 are unless if the component is a SingleSelectComponent as no more than one selected options will ever be displayed.
         */
        this.maxSelectedOptionDisplayed;
        var value = parseInt(this.data().maxSelectedOptionDisplayed);
        if (value === 0) //0 is a falsy value
            this.maxSelectedOptionDisplayed = value;
        else
            this.maxSelectedOptionDisplayed = value || -1;

        /**
         * @default optionCollection + " selected"
         * @type {string}
         * @description label to display if maxSelectedOptionDisplayed is reached. Number of selected options will be added
         * ad the beginning of the string.
         */
        this.maxSelectedOptionDisplayedLabel = this.data().maxSelectedOptionDisplayedLabel || " " + this.data().optionCollection + " selected";

        /**
         * @summary If true, selected options are on top of the popover list
         * @default false
         * @type {boolean}
         */
        this.selectedOptionSortedOnTopOfList = this.data().selectedOptionSortedOnTopOfList || false;


        this.checkItemPath();
    }

    /** @ignore */
    constructor() {
        super();
        this.isRenderedBoolean = false;
        this.searchQuery = new ReactiveVar("");
    }

    /** @ignore */
    onRendered() {
        //this.$(".custom-select-label-wrapper[data-popover]").on("show.bs.popover",this.onPopoverShow);
        this.$('.custom-select-label-wrapper[data-popover]').popover({html: true, trigger: 'click', placement: 'bottom', delay: {show: 50, hide: 400}});
        if (this.withoutLabel)
            this.$(".custom-select-icon").click("on", _.bind(function (e) {
                e.stopPropagation();
                this.$('.custom-select-label-wrapper[data-popover]').popover("show");
            }, this));
        this.isRenderedBoolean = true;
    }

    /** @ignore */
    onPopoverShow() {
        this.searchQuery.set("");
    }

    /** @ignore */
    collectionItems() {
        if(this.optionQuery)
            return this.optionCollection.find(this.optionQuery);
        return this.optionCollection.find();
    }

    /**
     * @ignore
     * @summary If selectedOptionSortedOnTopOfList is true, sort selection options on top of the options list while keeping original order
     */
    sortedCollectionItems() {
        if (this.selectedOptionSortedOnTopOfList) {
            //it would have been cool to have mongo aggregation client side
            var selectedOptions = this.collectionSelectedItems().fetch();
            var selectedOptionsIds = _.map(selectedOptions, function (option) {
                return option._id
            });
            var allOptions = this.collectionItems().fetch();
            var result = [], index = 0;

            _.each(allOptions, function (option) {
                if (_.contains(selectedOptionsIds, option._id)) {
                    // result.unshift(option);
                    result.splice(index++, 0, option);
                } else {
                    result.push(option);
                }
            });

            return result;
        } else {
            return this.collectionItems();
        }

    }

    /**
     * @ignore
     * because popover, that's why
     */
    cloneSearchResultInPopover() {
        var searchQuery = this.searchQuery.get();

        if (searchQuery === this.previousSearchQuery) return; //this reactivity context has been fired but no needs to do anything if search query doesn't change
        this.previousSearchQuery = searchQuery;

        var tmpl = Template.instance();
        if (tmpl.view.isRendered) {

            var data;
            if(this.optionCollectionIndex)
                data = this.optionCollectionIndex.search(searchQuery).fetch();
            else
                data = this.collectionItems.fetch();

            //a trick to find the dom of the popover, not very strong
            var parentNode = this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content").find(".custom-select-options");

            if (!this.blazeView) //popover has just been created (just been shown again), we clear the init list
                parentNode.empty()
            else //we remove previous blaze view list
                Blaze.remove(this.blazeView)

            this.blazeView = Blaze.renderWithData(Template.customSelectPopoverOption, {collectionItemsPopover: data}, parentNode[0]);
        }
    }

    /**
     * @ignore
     * either extract from the updateItemPath or form pathWithArray and updateItemPath
     *
     * updateItemPath alone :
     *
     *      User object + pathToUpdate="userId" => extract the value stored in userId
     *      Task object + pathToUpdate="timeSlots.0.peopleNeeded.1.skills" => extract skills array of second peopleNeeded from first timeSlots of the task
     *
     *  pathWithArray and updateItemPath :
     *
     *      Task object + pathWithArray = [
     *            {
         *                path: "timeSlots",
         *                _id: "0f89d7491be7cc4977fe85e9"
         *            },
     *            {
         *                path: "peopleNeeded",
         *                _id:"4c1ed4cdf1c83e946ed9a38b"
         *            }
     *            ];
     *          + pathToUpdate =  "userId"
     *      => extract userId value from people needed identified by its _id from time slot identified by its _id
     *
     *
     * @returns {nested}
     */
    optionsToUpdate() {
        if (this.pathWithArray) {
            var leaf = window[this.updateCollection].findOne(this.updateItemId);
            _.each(this.pathWithArray, function (pathObj) {
                leaf = _.findWhere(Leaf(leaf, pathObj.path), {_id: pathObj._id});
            });
            return leaf[this.updateItemPath];

        } else {
            var leaf = Leaf(window[this.updateCollection].findOne(this.updateItemId), this.updateItemPath);
            return leaf;
        }

    }


    /**
     * @ignore
     * if pathWithArray, generate a query object to update and a update key for $set.
     *
     *     ex : from pathWithArray = [
     *            {
         *                path: "timeSlots",
         *                _id: "0f89d7491be7cc4977fe85e9"
         *            },
     *            {
         *                path: "peopleNeeded",
         *                _id:"4c1ed4cdf1c83e946ed9a38b"
         *            }
     *            ];
     *          + pathToUpdate =  "userId"
     *
     *           generate  ==> "timeSlots.1.peopleNeeded.0.userId
     *
     *
     * @param newOptions
     */
    updateOption(newOptions) {
        var previousOptions = this.optionsToUpdate();
        if (previousOptions === newOptions) {
            console.info("single select, nothing to update");
            return;
        }

        var pathOrPathWithIndex, index, array;

        if (this.pathWithArray) {
            //creation du 'path' avec des index...

            pathOrPathWithIndex = "";
            var leaf = Tasks.findOne(this.updateItemId);
            _.each(this.pathWithArray, function (pathObj) {
                array = leaf;
                leaf = _.findWhere(Leaf(leaf, pathObj.path), {_id: pathObj._id});
                index = _.indexOf(array[pathObj.path], leaf);
                pathOrPathWithIndex += pathObj.path + "." + index + ".";
            });

            pathOrPathWithIndex += this.updateItemPath

        } else
            pathOrPathWithIndex = this.updateItemPath;

        var updateCallbackOptions = [];
        if (Array.isArray(this.data().optionCollection)) {//SelectComponent works with _id while managing options but the callback needs the value specified in optionCollection as an array
            if (this.updateCallback)
                if (this.constructor.name.indexOf("Multiple") !== -1)
                    newOptions.forEach(option => {
                        updateCallbackOptions.push(this.optionCollection.findOne(option).value);
                    });
                else {
                    if (newOptions)
                        updateCallbackOptions = this.optionCollection.findOne(newOptions).value;
                    else
                        updateCallbackOptions = null
                }

            if (this.updateCollection !== "TempCollection") {
                throw new Meteor.Error("Select Component not implemented : use updateCollection as an array while specifying an item to update in an updateCollection is not supported yet. ")
            }
        } else { //directly update an item in a collection from an option collection. updateCallback and updateCollection need the same _id
            updateCallbackOptions = newOptions;
        }


        window[this.updateCollection].update(this.updateItemId, {
                $set: {
                    [pathOrPathWithIndex]: newOptions
                }
            }, _.bind(function (error, numberAffected) {
                if (this.updateCallback)
                    this.updateCallback(error, numberAffected, updateCallbackOptions);
            }, this)
        );
    }

    /** @ignore */
    optionValue() {
        return this.currentData()[this.optionValueName];
    }

    /** @ignore */
    events() {
        //to concat if needed
        var events = [{
            'change .custom-select-options :checkbox': this.onCheckboxOptionsChange,
            'input .search-input': this.performSearch,
            "show.bs.popover .custom-select-label-wrapper[data-popover]": this.onPopoverShow
        }];
        if (this.quickSelectLabel) {
            events.push({
                "click .quick-select": this.quickSelect
            });
        }
        return events;
    }

    /** @ignore */
    performSearch(e) {
        this.searchQuery.set($(e.target).val());
    }

    /** @ignore */
    maxSelectedOptionDisplayedReached() {
        if (this.maxSelectedOptionDisplayed === -1) return false;
        return this.collectionSelectedItems().fetch().length > this.maxSelectedOptionDisplayed;
    }

}

