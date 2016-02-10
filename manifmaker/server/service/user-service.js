ServerUserService =
    class ServerUserService {

        /*
         * @memberOf ServerUserService
         * @summary GroupRoles.after.update hook
         *
         * If group roles' roles are updated user roles are update as well.
         *
         * @locus server
         * @param userId
         * @param doc
         * @param fieldNames
         * @param modifier
         * @param options
         */
        static propagateGroupRoles(userId, doc, fieldNames, modifier, options){
            if( _.contains(fieldNames,"roles")){

                //users having the updated groupRole
                var users = Users.find({groupRoles: doc._id }).fetch();
                users.forEach(user => {
                    //update user roles, Account roles will be update by hooks
                    var modifier = {
                        $set : {groupRoles : user.groupRoles}
                    };
                    //will fire the Users after hook and call propagateRoles
                    Users.update(user._id,modifier);
                });
            }
        }

        /**
         * @memberOf ServerUserService
         * @summary Users.after.update hook.
         *
         * About roles, we only add roles to the custom Users collection, **not** with the Roles library. This hooks is responsible to propagate roles to the
         * Meteor.users linked account.
         * @locus server
         * @param userId
         * @param doc
         * @param fieldNames
         * @param modifier
         * @param options
         */
        static propagateRoles(userId, doc, fieldNames, modifier, options) {
            if( _.contains(fieldNames,"groupRoles")){
                if(modifier.$set.groupRoles) {
                    //we have to merge roles and roles from groups
                    var newGroups = GroupRoles.find({_id: {$in: modifier.$set.groupRoles}}).fetch(); //get all related roles
                    var result = []; //reduce to get only the roles array
                    newGroups.forEach(group => {
                        result.push(group.roles);
                    });
                    var allGroupRolesMerged = _.uniq(_.flatten(result)); //obtain a single array
                } else {
                    //we have to remove all roles
                    var allGroupRolesMerged = [];
                }
                Roles.setUserRoles(doc.loginUserId,allGroupRolesMerged); //add to Account package
            }

        }
    }