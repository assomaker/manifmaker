import {SingleSelectComponent} from "./SingleSelectComponent"

export class SingleNonMandatorySelectComponent extends SingleSelectComponent {

    initializeData() {
        super.initializeData();
        /**
         * default : "Clear"
         * @type {string}
         */
        this.clearMessage = this.data().clearMessage || "Clear";
    }

    template() {
        return 'nonMandatorySelectComponent';
    }

    events() {
        return super.events().concat({
            'click .clear': this.clear
        });
    }

    clear() {
        this.$('.custom-select-label-wrapper[data-popover]').popover("hide");
        this.updateOption(null);
    }
}

SingleNonMandatorySelectComponent.register('SingleNonMandatorySelectComponent');