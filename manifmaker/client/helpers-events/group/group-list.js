Template.groupsList.helpers({
    groupsList: function () {
        return {
            collection: Groups,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount:true,
            columnPerPage: 5,
            multiColumnSort: true,
            fields: [
                {key: 'name', label: 'Nom de la tache', fnAdjustColumnSizing:true},

                {key: 'teamId', label: 'Equipe', fnAdjustColumnSizing:true, fn: function(teamId,Group){
                    return Teams.findOne(teamId).name;
                }},
                {key: 'tasksId', label: 'Nombre de taches associées', sortable: false, fn: function (tasksId, Group) {
                    return tasksId.length;
                }, fnAdjustColumnSizing:true}
                /** créer une colonne pour l'animation associée*/

            ]

        };
    }
});

Template.groupsList.events({});
