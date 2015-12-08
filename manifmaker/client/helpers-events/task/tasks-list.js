Template.tasksList.helpers({
    tasksList: function () {
        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: true,
            multiColumnSort: true,
            fields: [{label: 'Groupe', fnAdjustColumnSizing:true},
                {key: 'name', label: 'Nom de la tache', fnAdjustColumnSizing:true},
                {key: 'team', label: 'Equipe', fnAdjustColumnSizing:true},
                {key: 'timeSlots', label: 'Nombre de créneaux', sortable: false, fn: function (timeSlots, Task) {
                    return timeSlots.length;
                    }, fnAdjustColumnSizing:true}

            ]

        };
    }
});

Template.tasksList.events({});
