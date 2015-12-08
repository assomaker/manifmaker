Template.tasksList.helpers({
    settings: function () {
        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: true,
<<<<<<< HEAD
            multiColumnSort:true,
            fields: [{ key: 'name', label: 'Nom de la tache' },
                {  label: 'Groupe' },
                { key: 'team', label: 'Equipe' },
                { key: 'timeSlots', label:'Nombre de créneaux', sortable:false, fn:function(timeSlots,Task){return timeSlots.length;}}]
        };
    }

});


Template.tasksList.events({

});
=======
            multiColumnSort: true,
            fields: [{key: 'name', label: 'Nom de la tache'},
                {label: 'Groupe'},
                {key: 'team', label: 'Equipe'},
                {
                    key: 'timeSlots', label: 'Nombre de créneaux', fn: function (timeSlots, Task) {
                    return timeSlots.length;
                }
                }]
        };
    },
});

Template.tasksList.events({});
>>>>>>> 128de42ba85cf849804b1da639c5f2dbef253a97
