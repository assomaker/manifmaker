initAccessRightData =  function(){
    Meteor.roles.remove({});
    GroupRoles.remove({});
    Meteor.users.remove({});

    //create roles
    var equipmentValidation = "equipmentValidation";
    Roles.createRole(equipmentValidation);
    var assignmentValidation = "assignmentValidation";
    Roles.createRole(assignmentValidation);
    var accessPassValidation = "accessPassValidation";
    Roles.createRole(accessPassValidation);
    var taskRead = "taskRead";
    Roles.createRole(taskRead);
    var taskWrite = "taskWrite";
    Roles.createRole(taskWrite);
    var taskDelete = "taskDelete";
    Roles.createRole(taskDelete);
    var role = "role";
    Roles.createRole(role);


    //create groups and add roles to groups
    var admin = GroupRoles.insert({name: "admin",
        roles : [equipmentValidation,assignmentValidation,accessPassValidation,taskRead,taskWrite,taskDelete,role]
    });
    var bureau = GroupRoles.insert({name: "bureau",
        roles : [taskRead,taskWrite,taskDelete,role]
    });
    var hard = GroupRoles.insert({name: "hard",
        roles : [taskRead,taskWrite]
    });
    var soft = GroupRoles.insert({name: "soft",
        roles : [taskRead]
    });
    var resplog = GroupRoles.insert({name: "admin",
        roles : [equipmentValidation]
    });

    Accounts.createUser({
        username: "admin",
        email: "admin@yopmail.com",
        password: "admin"
    });
    Accounts.createUser({
        username: "hard",
        email: "hard@yopmail.com",
        password: "hardhard"
    });
    Accounts.createUser({
        username: "resplog",
        email: "resplog@yopmail.com",
        password: "resplogresplog"
    });
    Accounts.createUser({
        username: "soft",
        email: "soft@yopmail.com",
        password: "softsoft"
    });


    addUsersToRoles(Meteor.users.findOne({username:"admin"}),admin);
    addUsersToRoles(Meteor.users.findOne({username:"hard"}),hard);
    addUsersToRoles(Meteor.users.findOne({username:"resplog"}),resplog);
    addUsersToRoles(Meteor.users.findOne({username:"soft"}),soft);



};


populateData = function () {
    Assignments.remove({});
    Users.remove({});
    Tasks.remove({});
    Places.remove({});
    Teams.remove({});
    Groups.remove({});
    Skills.remove({});
    Teams.remove({});

    _.each(AllCollections, function (coll) {
        coll.remove({});
    });

    //teams
    var team1Id = Teams.insert({name: "team1"});
    var team2Id = Teams.insert({name: "team2"});
    var team3Id = Teams.insert({name: "team3"});
    var assignmentReadyTeam = Teams.insert({name: ASSIGNMENTREADYTEAM});


    //places
    var place1Id = Places.insert({name: "place1"});
    var place2Id = Places.insert({name: "place2"});
    var place3Id = Places.insert({name: "place3"});

    //skills
    var skill1Id = Skills.insert({
        key: "RESP_TASK_1",
        label: "Responsable tache 1"
    });
    var skill2Id = Skills.insert({
        key: "RESP_TASK_2",
        label: "Responsable tache 2"
    });
    var skill3Id = Skills.insert({
        key: "RESP_TASK_3",
        label: "Responsable tache 3"
    });
    var skill4Id = Skills.insert({
        key: "RESP_TASK_4",
        label: "Responsable tache 4"
    });

    //assignmentCalendarDay
    AssignmentTerms.insert({
        name: "Terms 1",
        start: getDateFromDate(13, 5 - 1),
        end: getDateFromDate(15, 5 - 1)
    });
    AssignmentTerms.insert({
        name: "Terms 2",
        start: getDateFromDate(10, 5 - 1),
        end: getDateFromDate(11, 5 - 1)
    });
    AssignmentTerms.insert({
        name: "Terms 3",
        start: getDateFromDate(15, 5 - 1),
        end: getDateFromDate(27, 5 - 1)
    });

    //users
    Accounts.createUser({
        username: "user1",
        email: "user1@yopmail.com",
        password: "user1"
    });
    var user1Id = Users.insert({
        name: "user1",
        loginUserId: Meteor.users.findOne({username:"user1"})._id,
        teams: [team1Id],
        skills: [skill1Id],
        availabilities: [
            {
                start: getDateFromTime(2),
                end: getDateFromTime(14)
            }
        ]
    });
    Accounts.createUser({
        username: "user2",
        email: "user2@yopmail.com",
        password: "user2"
    });
    var user2Id = Users.insert({
        name: "user2",
        loginUserId: Meteor.users.findOne({username:"user1"})._id,
        teams: [team2Id],
        skills: [skill2Id],
        availabilities: [
            {
                start: getDateFromTime(2),
                end: getDateFromTime(16)
            }
        ]
    });
    Accounts.createUser({
        username: "user3",
        email: "user3@yopmail.com",
        password: "user3"
    });
    var user3Id = Users.insert({
        name: "user3",
        loginUserId: Meteor.users.findOne({username:"user1"})._id,
        //teams: [team3Id],
        skills: [skill2Id,skill3Id],
        availabilities: [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(14)
            },
            {
                start: getDateFromTime(14),
                end: getDateFromTime(18)
            }
        ]
    });
    Accounts.createUser({
        username: "user4",
        email: "user4@yopmail.com",
        password: "user4"
    });
    var user4Id = Users.insert({
        name: "user4",
        loginUserId: Meteor.users.findOne({username:"user1"})._id,
        //teams: [team3Id],
        skills: [skill2Id,skill3Id,skill1Id,skill4Id],
        availabilities: [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(14)
            },
            {
                start: getDateFromTime(14),
                end: getDateFromTime(18)
            }
        ]
    });

    var now = new Date();
    var aDayAgo = new moment().add("days",-1).toDate();
    //tasks
    var task1d = Tasks.insert({
        name: "task 1",
        teamId: team1Id,
        placeId: place1Id,
        liveEventMasterId: user1Id,
        masterId: user1Id,
        timeSlots : [
            {
                start: getDateFromTime(2),
                end: getDateFromTime(4),
                peopleNeeded : [
                    {
                        teamId: team1Id
                    }
                ],
            },
            {
                start: getDateFromTime(10),
                end: getDateFromTime(14),
                peopleNeeded : [
                    {
                        userId: user2Id
                    },
                    {
                        userId: user4Id
                    },
                    {
                        userId: user1Id
                    },
                    {
                        teamId: team1Id,
                        skills: [skill1Id]
                    },
                    {
                        skills: [skill1Id]
                    },
                    {
                        skills: [skill1Id,skill2Id]
                    }
                ],
            }
        ],
        timeSlotValidation: {
            currentState: ValidationState.READY,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "good",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        },
        accessPassValidation: {
            currentState: ValidationState.READY,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "good",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        },
        equipmentValidation: {
            currentState: ValidationState.READY,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "good",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        }
    });
    var task2d = Tasks.insert({
        name: "task 2",
        teamId: team2Id,
        placeId: place2Id,
        liveEventMasterId: user2Id,
        masterId: user2Id,
        timeSlots : [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12),
                peopleNeeded : [
                    {
                        teamId: team2Id,
                        skills: [skill2Id]
                    }
                ]
            }
        ],
        timeSlotValidation: {
            currentState: ValidationState.REFUSED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "Dumbass, do you're fucking grammar",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        },
        accessPassValidation: {
            currentState: ValidationState.REFUSED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "Dumbass, do you're fucking grammar",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        },
        equipmentValidation: {
            currentState: ValidationState.REFUSED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "Dumbass, do you're fucking grammar",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        }
    });
    var task3d = Tasks.insert({
        name: "task 3",
        teamId: team3Id,
        placeId: place2Id,
        liveEventMasterId: user2Id,
        masterId: user2Id,
        timeSlots : [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12),
                peopleNeeded : [
                    {
                        teamId: team1Id,
                        skills: [skill1Id]
                    }
                ]
            }
        ],
        timeSlotValidation: {
            currentState: ValidationState.TOBEVALIDATED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "send in validation",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        },
        accessPassValidation: {
            currentState: ValidationState.TOBEVALIDATED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "send in validation",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        },
        equipmentValidation: {
            currentState: ValidationState.TOBEVALIDATED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "send in validation",
                    creationDate: now,
                    stateBefore: ValidationState.OPEN,
                    stateAfter: ValidationState.OPEN,
                }
            ]
        }
    });
    var task3d = Tasks.insert({
        name: "autre tache",
        teamId: team3Id,
        placeId: place2Id,
        liveEventMasterId: user2Id,
        masterId: user2Id,
        timeSlots : [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12),
                peopleNeeded : [
                    {
                        teamId: team1Id,
                        skills: [skill1Id]
                    }
                ]
            }
        ],
        timeSlotValidation: {
            currentState: ValidationState.OPEN,
            lastUpdateDate:now,
            comments: []
        },
        accessPassValidation: {
            currentState: ValidationState.OPEN,
            lastUpdateDate:now,
            comments: []
        },
        equipmentValidation: {
            currentState: ValidationState.OPEN,
            lastUpdateDate:now,
            comments: []
        }

    });


};

insertAndFetch = function (Collection, data) {
    var _id = Collection.insert(data);
    return Collection.findOne({_id: _id});
};

getDateFromTime = function (hours, minutes = 0) {
    var now = new Date();
    return new Date(now.getYear(), 5 - 1 /*now.getMonth()*/, 13 /*now.getDate()*/, hours, minutes, 0);
};

getDateFromDate = function (day, month, year) {
    var now = new Date();
    year = year || now.getYear();
    month = month || now.getMonth();
    return new Date(year, month, day, 0, 0, 0);
};
