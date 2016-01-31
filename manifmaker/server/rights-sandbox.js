
//server only

_setGroupRolesToUsers = function(userId,groupId){
    var group = GroupRoles.findOne(groupId);
    Users.update(userId,{
        $set: {
            groupRoles : [groupId]
        }
    });
};


//TODO il faut wrapper toutes les methodes de Roles !!!

