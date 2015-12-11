Template.tasksList.helpers({
    tasksList: function () {
        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: true,
            columnPerPage: 4,
            multiColumnSort: true,
            fields: [//{label: 'Groupe', fnAdjustColumnSizing:true},
                {key: 'name', label: 'Nom de la tache', fnAdjustColumnSizing:true},

                {key: 'teamId', label: 'Equipe', fnAdjustColumnSizing:true, fn: function(teamId,Task){
                    console.log(teamId,Task,this.arguments);
                    return Teams.findOne(teamId).name;
                }},
                {key: 'timeSlots', label: 'Nombre de créneaux', sortable: false, fn: function (timeSlots, Task) {
                    return timeSlots.length;
                    }, fnAdjustColumnSizing:true},
                {label:'Modifier la tache?', tmpl:Template.taskButtons, fnAdjustColumnSizing:true}

            ]

        };
    }
});

Template.tasksList.events({});
