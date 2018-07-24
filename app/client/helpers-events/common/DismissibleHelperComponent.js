/**
 * uniqueId has to be unique and it's not checked by the app
 */
class DismissibleHelperComponent extends BlazeComponent {


  events() {
    return [
      {
        "click .close.dismissible": this.close
      }
    ]
  }

  template() {
    return "dismissibleHelperComponent";
  }

  isDisplayed() {
    return ( Meteor.users.findOne({
      _id: Meteor.userId(),
      $or: [
        {dismissible: this.currentData().uniqueId},
        {hideAllDismissible: true}
      ]
    })) ? false : true;
  }


  close() {
    Meteor.users.update(Meteor.userId(), {
      $push: {
        dismissible: this.currentData().uniqueId
      }
    })
  }

}


DismissibleHelperComponent.register("DismissibleHelperComponent");