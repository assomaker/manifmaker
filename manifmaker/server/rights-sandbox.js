
//server only

addUsersToRoles = function(user,groupId){
    var group = GroupRoles.findOne(groupId);
    console.info("addUsersToGroups : \nuser =>",user,"\ngroup =>",group)
    Roles.addUsersToRoles(user,group.roles);
    Users.update({name:user.username},{
        $set: {
            roles : Meteor.users.findOne(user._id).roles
        }
    });
};


//TODO il faut wrapper toutes les methodes de Roles !!!

//la modificaiton des roles se fait uniquement coté server avec des appels au meteor methods sever only
