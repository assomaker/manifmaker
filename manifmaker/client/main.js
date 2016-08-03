import {AssignmentServiceClient} from "../client/service/AssignmentServiceClient"

AccountsTemplates.removeField('email');
AccountsTemplates.removeField('password');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "username",
        required: true,
        minLength: 5,
    }
]);
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    required: true,
    minLength: 6,
    re: /(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
    errStr: 'At least 1 digit, 1 lower-case and 1 upper-case',
});

Meteor.startup(function () {

    Meteor.subscribe("skills");
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("groups");
    Meteor.subscribe("group-roles");
    Meteor.subscribe("roles");
    Meteor.subscribe("equipment-categories");
    Meteor.subscribe("equipment-storages");
    Meteor.subscribe("equipments");
    Meteor.subscribe("water-supplies");
    Meteor.subscribe("water-disposals");
    Meteor.subscribe("power-supplies");
    Meteor.subscribe("assignment-terms", function () {
        AssignmentServiceClient.setCalendarTerms();
    });

    TempCollection = new Meteor.Collection(null)


    SimpleSchema.debug = true;
    AutoForm.addHooks(null, {
        onError: function (name, error, template) {
            console.log("AutoForm.addHooks : "+name + " error:", error);
        }
    });

    var accuracy = CalendarAccuracyEnum["1"];
    AssignmentServiceClient.setCalendarAccuracy(accuracy);


    //hide custom select popover when click outside popover
    $('body').on('click', function (e) {
        $('.custom-select-label-wrapper[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
});

