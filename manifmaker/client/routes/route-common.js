/**
 * @namespace Route
 */

Router.configure({
    layoutTemplate: 'wrapper'
});


//hide topNavBar to each expect assignment
Router.onAfterAction(function () {
        this.render("", {to: "topNavBar"});
        assignmentCalendarIsRendered = false;
    },
    {
        except: [
            'assignment.calendar',
            'assignment.calendar.user',
            'assignment.calendar.userToTask',
            'assignment.calendar.userToTask.user',
            'assignment.calendar.userToTask.user.date',

            'assignment.calendar.taskToUser',
            'assignment.calendar.taskToUser.task',
            'assignment.calendar.taskToUser.task.timeSlot',

            'assignment.calendar.task.search'

        ]
    }
);

/**
 * @memberOf Route
 * @namespace Route.common
 */

/**
 * @memberOf Route.common
 * @summary Home
 * @locus client
 * @name 'home'  /
 */
Router.route('/', function () {

            this.render('home', {to: 'mainContent'})


    },
    {name: 'home'}
);

/**
 * @memberOf Route.common
 * @summary Demo du custom select
 * @locus client
 * @name 'demo-select'  /demo-select
 */
Router.route('/demo-select', function () {
        this.wait(Meteor.subscribe('users'));
        this.wait(Meteor.subscribe('tasks'));
        this.wait(Meteor.subscribe('teams'));
        this.wait(Meteor.subscribe('skills'));
        this.wait(Meteor.subscribe('power-supplies'));

        if (this.ready()) {
            this.render('demoSelect', {to: 'mainContent',
            data:{
                user1Id : Users.findOne({name:"user1"})._id,
                user2Id : Users.findOne({name:"user2"})._id,
                task2Id : Tasks.findOne({name:"task 2"})._id,
                team1Id : Teams.findOne({name:"team1"})._id,
                team1Idteam2Id: [Teams.findOne({name:"team1"})._id, Teams.findOne({name:"team2"})._id],
                skill1Idskill2Id: [Skills.findOne({"label" : "Responsable tache 1"})._id, Skills.findOne({"label" : "Responsable tache 2"})._id],
                powersupply1 : PowerSupplies.findOne({name:"powerSupply1"})._id,
                updateCallbackDisplayArgs: function(){
                    return function(){
                        console.log("updateCallbackDisplayArgs",arguments[0],arguments[1],arguments[2]);
                    }
                },
                optionQueryteamsWithoutAlreadyAssigned: {
                    name: {
                        $not: ASSIGNMENTREADYTEAM
                    }
                },
                optionCollectionAsArray: [
                    {
                        label: "First option",
                        value: "ONE"
                    },
                    {
                        label: "Second cat",
                        value: "TWO"
                    },
                    {
                        label: "Cypress",
                        value: "THREE"
                    }
                ]
            }});
        } else {
            console.log("Route / : waiting users_custom data"); //TODO add a spinner
        }


    },
    {name: 'demo-select'}
);

/**
 * @memberOf Route.common
 * @summary Inject Dada (remove all before)
 * @locus client
 * @name 'inject-data'  /inject-data
 */
Router.route('/inject-data', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while injecting data, you are now logged out");
            Meteor.call("injectData",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("inject happened without error, please log in");
                }
            })
        } else {
            console.error("/inject-data is a dev only route")
        }
    },
    {name: 'inject-data'}
)

/**
 * @memberOf Route.common
 * @summary Delete all DB data
 * @locus client
 * @name 'home'  /delete-all
 */
Router.route('/delete-all', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while deleting data, you are now logged out");
            Meteor.call("deleteAll",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("deleteAll happened without error, you should use /init-access-right-data to be able to log in");
                }
            })
        } else {
            console.error("/delete-all is a dev only route")
        }
    },
    {name: 'delete-all'}
)


/**
 * @memberOf Route.common
 * @summary Inject some authent profil (admin/admin and others)
 * @locus client
 * @name 'init-access-right-data'  /init-access-right-data
 */
Router.route('/init-access-right-data', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while injecting data, you are now logged out");
            Meteor.call("initAccessRightData",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("initAccessRightData happened without error, please log in");
                }
            })
        } else {
            console.error("/init-access-right-dat is a dev only route")
        }
    },
    {name: 'init-access-right-data'}
)

/**
 * @memberOf Route.common
 * @summary Add some data test (some conf, 3 tasks)
 * @locus client
 * @name 'populate-data'  /populate-data
 */
Router.route('/populate-data', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while injecting data, you are now logged out");
            Meteor.call("populateData",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("populateData happened without error, please log in");
                }
            })
        } else {
            console.error("/populate-data is a dev only route")
        }
    },
    {name: 'populate-data'}
)


