Template.tasksList.helpers({
    settings: function () {
        return {
            collection: Tasks,
            rowsPerPage: 10,
            showFilter: true,
            multiColumnSort:true,
            fields: [{ key: 'name', label: 'Nom de la tache' },
                {  label: 'Groupe' },
                { key: 'team', label: 'Equipe' },
                { key: 'timeSlots', label:'Nombre de créneaux', fn:function(timeSlots,Task){return timeSlots.length;}}]
        };
    },

Template.tasksList.events({});
Template.tasksList.events({