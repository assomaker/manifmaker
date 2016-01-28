

addUsersToRoles = function(user,groupId){
    var group = GroupRoles.findOne(groupId);
    console.info("addUsersToGroups : \nuser =>",user,"\ngroup =>",group)
    Roles.addUsersToRoles(user,group.roles);
};


