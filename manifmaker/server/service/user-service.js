ServerUserService =
    class ServerUserService {


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
            if( _.contains(fieldNames,"groupRoles") && modifier.$set.groupRoles){
                //we have to merge roles and roles from groups
                var newGroups = GroupRoles.find({_id:{$in:modifier.$set.groupRoles}}).fetch(); //get all related roles
                var result = []; //reduce to get only the roles array
                newGroups.forEach(group => {
                    result.push(group.roles);
                });
                var allGroupRolesMerged = _.uniq(_.flatten(result)); //obtain a single array
                Roles.setUserRoles(doc.loginUserId,allGroupRolesMerged); //add to Account package
            }

        }
    }