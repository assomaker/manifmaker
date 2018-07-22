import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"
import {UserServiceClient} from "../../../client/service/UserServiceClient"
import {AssignmentServiceClient} from "../../../client/service/AssignmentServiceClient"

export class BaseCalendarComponent extends BlazeComponent {

  constructor() {
    super();
  }

  enableAction() {
    //to implement
    return true;
  }

  quartHeureOnClick(event) {
    //to implement
  }

  quartHeureNoActionOnClick(event) {
    sAlert.info("There is no action at this date, please select another one")
  }

  onAccuracyChange(event) {
    AssignmentServiceClient.setCalendarTerms(null, parseFloat($(event.target).attr('id')));
  }

  timeSlot(date, timeHours, idTask) {
    //to implement
  }

  template() {
    return "baseCalendarComponent";
  }

  events() {
    return [
      {
        "click  .quart_heure:not(.no-action)": this.quartHeureOnClick,
        "click  .quart_heure.no-action": this.quartHeureNoActionOnClick,
        "change .accuracy-selector [name='accuracySelector']": this.onAccuracyChange,
      }
    ]
  }

  assignmentType() {
    return AssignmentReactiveVars.CurrentAssignmentType.get();
  }

  days() {
    return AssignmentCalendarDisplayedDays.find({});
  }

  sideHours() {
    return AssignmentCalendarDisplayedDays.findOne({}).hours; //so far, all displayed days have the same hours
  }

  displayCalendarTitleDate(date) {
    return new moment(date).format("dddd DD/MM");
  }

  hoursDate(date) {
    return this.getCalendarDateHours(date, this.currentData().date);
  }

  quarterDate(date, timeHours) {
    return this.getCalendarDateTime(date, timeHours, this.currentData().quarter);
  }

  timeHourData(date, timeHours) {
    return this.quarterDate(date, timeHours)
  }

  getCharisma(date, timeHours) {
    var dateTime = this.getCalendarDateTime(date, timeHours, this.currentData().quarter);
    var charisma = UserServiceClient.getCharismaFromDateTime(dateTime);
    if (charisma !== 0)
      return charisma;
  }


  sideHoursHeight() {
    switch (AssignmentCalendarDisplayedAccuracy.findOne({}).accuracy) {
      case 0.25 :
        return "oneHour";
      case  0.5 :
        return "oneHour";
      case 1:
        return "oneHour";
      case  2:
        return "twoHour"
      case 4:
        return "fourHour"
    }
  }

  quarterHeight() {
    switch (AssignmentCalendarDisplayedAccuracy.findOne({}).accuracy) {
      case 0.25 :
        return "quarterHour";
      case  0.5 :
        return "halfHour";
      case 1:
        return "oneHour";
      case  2:
        return "twoHour"
      case 4:
        return "fourHour"
    }
  }

  //works for .heure et .quart d'heure
  isSelected(date, timeHours) {
    return ""
  }

  isAccuracySelected(value, extra) {
    return (AssignmentCalendarDisplayedAccuracy.findOne().accuracy == value) ? extra : "";
  }


  getCalendarDateHours(date, timeHours) {
    var date = new moment(date);
    date.hours(timeHours);
    return date;
  }

  getCalendarDateTime(date, timeHours, timeMinutes) {
    var dateWithHours = this.getCalendarDateHours(date, timeHours);
    var date = new moment(dateWithHours);
    date.add(timeMinutes, "minute");
    return date;
  }

}

BaseCalendarComponent.register("BaseCalendarComponent");