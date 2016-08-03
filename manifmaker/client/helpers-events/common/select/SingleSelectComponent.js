import {SelectComponent} from "./SelectComponent"

export class SingleSelectComponent extends SelectComponent {

        checkItemPath() {
            //in another method to have a context alone for reactivity

            var item = window[this.updateCollection].findOne(this.updateItemId);
            if (!item)
                throw new Meteor.Error(`${this.constructor.name} : could not find ${this.updateItemId} in collection ${this.updateCollection}`);

            //is it a MongoDB id type ?
            //try {
            //    if (Schemas[this.updateCollection].pick([this.updateItemPath])._schema[this.updateItemPath].type !== SimpleSchema.RegEx.Id)
            //        throw new Meteor.Error(`${this.constructor.name}  : path ${this.updateItemPath} should not refers to an object (nor array)`);
            //} catch (Error) {
            //    throw new Meteor.Error(`${this.constructor.name}  : path ${this.updateItemPath} should not refers to an object (nor array)`);
            //}

            //is it an _id  ?
            if (this.quickSelectId) {
                if (this.quickSelectId.match(SimpleSchema.RegEx.Id)[0] !== this.quickSelectId)
                    throw new Meteor.Error(`${this.constructor.name}  : this.quickSelectId should be a MongoDB id (should match ${SimpleSchema.RegEx.Id}). Given : ${this.quickSelectId}`);
            }
        }

        template() {
            return 'selectComponent';
        }

        collectionSelectedItems() {
            return this.optionCollection.find({
                _id: this.optionsToUpdate()
            });
        }

        isChecked() {
            var isChecked = (this.optionsToUpdate() === this.currentData()._id) ? true : false;

            if (this.isRendered()) {
                //checkbox need to be updated by jQuery and not DOM. DOM can only be used to init checkbox state
                //a trick to find the dom of the popover, not very strong
                this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content li input#" + this.currentData()._id).prop('checked', isChecked);
            }
            //still need DOM data for re-creating popover each time it is displayed
            return (isChecked) ? "checked" : "";
        }

        quickSelect() {
            this.updateOption(this.quickSelectId);
        }

        onCheckboxOptionsChange(e) {
            this.$('.custom-select-label-wrapper[data-popover]').popover("hide");
            var cb = $(e.target);
            var _id = cb.attr("id");

            if (cb.is(":checked"))
                this.updateOption(_id);
            else if (this.constructor.name === "SingleNonMandatorySelectComponent") //hum, I miss compiled language...
                this.updateOption(null);
        }
    }

SingleSelectComponent.register('SingleSelectComponent');