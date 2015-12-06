
Template.wrapper.rendered = function(){
    $("#button-collapse-left-menu").sideNav();
    $('.collapsible-left-menu').collapsible();

    $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

};