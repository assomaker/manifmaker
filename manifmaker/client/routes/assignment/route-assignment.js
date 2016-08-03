import {AssignmentServiceClient} from "../../../client/service/AssignmentServiceClient"
import {SecurityServiceClient} from "../../../client/service/SecurityServiceClient"
import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

/**
 * @memberOf Route
 * @namespace Route.Assignment
 */

assignmentCalendarIsRendered = false;

AssignmentController = RouteController.extend({
    onBeforeAction: function () {
        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ASSIGNMENTTASKUSER, "assignment");

        if (!assignmentCalendarIsRendered) {
            this.render('AssignmentHomeWrapper', {to: 'mainContent'});
            this.render("AssignmentNavBarWrapper", {to: "topNavBar"})
            assignmentCalendarIsRendered = true;
        }

        this.next();

    },

    onAfterAction: function () {
        //trick to perform the following on another 'thread' which has access to DOM
        setTimeout(function () {
            AssignmentServiceClient.initAssignmentSkillsFilter();
            AssignmentServiceClient.initAssignmentPopover();

            AssignmentServiceClient.disableDisplayAssignedCheckbox();

        }, 200);
    }
});

/**
 * @memberOf Route.Assignment
 * @summary Display assignment screen (calendar + task list + user list)
 * @locus client
 * @name 'assignment.calendar'  /assignment
 */
Router.route('/assignment', function () {
        console.info("routing", '/assignment');

        AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.ALL);
    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar',
    }
);

/**
 * @memberOf Route.Assignment
 * @summary Redirect to /assignment/userToTask/:userId
 * @locus client
 * @name 'assignment.calendar.user'  /assignment/user/:userId
 */
Router.route('/assignment/user/:userId', function () {
        console.info("routing", '/assignment/user/' + this.params.userId);

        //desactivation de la recherche par URL
        //if (this.params.userId === "search") {
        //    console.info("routing error, misunderstanding 'search' as a userId");
        //    Router.go("/assignment");
        //}

        //ceci est seulement le userToTask => TODO faire le taskToUser

        this.wait(Meteor.subscribe('users', this.params.userId));

        if (this.ready()) {
            Router.go("/assignment/userToTask/" + this.params.userId);
        } else {
            console.log("Route /assignemnt/user/:userId : waiting user data"); //TODO add a spinner
        }

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.user'
    }
);

/**
 * @memberOf Route.Assignment
 * @summary Redirect to /assignment/taskToUser/:taskId
 * @locus client
 * @name 'assignment.calendar.task'  /assignment/task/:taskId
 */
Router.route('/assignment/task/:taskId', function () {
        console.info("routing", '/assignment/task/' + this.params.taskId);

        //desactivation de la recherche par URL
        //if (this.params.taskId === "search") {
        //    console.info("routing error, misunderstanding 'search' as a taskId");
        //    Router.go("/assignment");
        //}

        //ceci est seulement le taskToUser => faire le  userToTask

        this.wait(Meteor.subscribe('tasks', this.params.taskId));

        if (this.ready()) {
            Router.go("/assignment/taskToUser/" + this.params.taskId);
        } else {
            console.log("Route assignment/task/:taskId : waiting task data"); //TODO add a spinner
        }

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.task'
    }
);

//desactivation de la recherche par URL
//Router.route('/assignment/task/search/:searchInput', function () {
//    console.info("routing", '/assignment/task/search/' + this.params.searchInput);
//
//
//    var searchInput = this.params.searchInput;
//
//    if (searchInput === "") {
//        AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.defaultFilter);
//        this.redirect("/assignment");
//    } else {
//
//        $("#search_task_name").val(searchInput);
//
//        this.wait(Meteor.subscribe('tasks', {
//            name: searchInput
//        }));
//
//        if (this.ready()) {
//            console.info("task search for", searchInput);
//
//            AssignmentReactiveVars.TaskIndexFilter.set(searchInput);
//        } else {
//            console.log("waiting task data"); //TODO add a spinner
//        }
//    }
//
//
//}, {
//    controller: "AssignmentController",
//    name: "assignment.calendar.task.search"
//});

//desactivation de la recherche par URL
//Router.route('/assignment/user/search/:searchInput', function () {
//    console.info("routing", '/assignment/user/search/' + this.params.searchInput);
//
//
//    var searchInput = this.params.searchInput;
//
//    if (searchInput === "") {
//        AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.defaultFilter);
//        this.redirect("/assignment");
//    } else {
//
//        $("#search_user_name").val(searchInput);
//        this.wait(Meteor.subscribe('users', {
//            name: searchInput
//        }));
//
//        if (this.ready()) {
//            console.info("user search for", searchInput);
//
//            AssignmentReactiveVars.UserIndexFilter.set(searchInput);
//        } else {
//            console.log("waiting user data"); //TODO add a spinner
//        }
//    }
//
//
//}, {
//    controller: "AssignmentController",
//    name: "assignment.calendar.user.search"
//});