import {ValidationService} from "../../../../both/service/ValidationService"

class TaskEquipmentsComponent extends BlazeComponent{
    template() {
        return "taskEquipments";
    }

    constructor(isReadOnly){
        super();
        this.isReadOnly = isReadOnly;
    }

    taskData(){
        return this.data();
    }

    isEquipmentsUpdateAllowed() {
        return ValidationService.isUpdateAllowed(this.data().equipmentValidation.currentState);
    }

    isEquipmentsReadOnly() {
        return this.isReadOnly || !this.isEquipmentsUpdateAllowed();
    }

    displayItem(item){
        if(this.data()[item] === null && this.isEquipmentsReadOnly())
            return false;
        return true;
    }


    equipmentsCategories() {
        var categories = EquipmentCategories.find().fetch();

        if(this.isEquipmentsReadOnly()){
            //remove categories which have nothing to display for this target + that don't have any quantity
            var equipmentIdsWithAQuantity = this.equipmentIdsWithAQuantity();

            var result = [];
            _.each(categories, function (category) {
                var equipmentsForACategory = Equipments.find({EquipmentCategories_Id: category._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}})
                    .fetch();

                equipmentsForACategory = _.filter(equipmentsForACategory,function(equipment){
                    return _.contains(equipmentIdsWithAQuantity,equipment._id)
                });

                if (equipmentsForACategory.length !== 0) {
                    result.push(category);
                }
            });
            return result;
        } else {
            //remove categories which have nothing to display for this target
            var result = [];
            _.each(categories, function (category) {
                if (Equipments.find({EquipmentCategories_Id: category._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}})
                        .fetch().length !== 0) {
                    result.push(category);
                }
            });
            return result;
        }
    }

    equipmentWithAQuantity() {
        return _.reject(this.taskData().equipments, function (equipment) {
            return equipment.quantity === 0
        });
    }

    equipmentIdsWithAQuantity() {
        return _.map(this.equipmentWithAQuantity(), function (equipment) {
            return equipment.equipmentId
        });
    }

    equipments(category) {
        var equipmentCategory = Equipments.find({EquipmentCategories_Id: category._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}});
        if(this.isEquipmentsReadOnly()){
            var result;
            var equipmentIdWithQuantity = this.equipmentIdsWithAQuantity();
            result = _.filter(equipmentCategory.fetch(), function (equipment) {
                return _.contains(equipmentIdWithQuantity, equipment._id);
            });
            return result;
        } else {
            return equipmentCategory;
        }

    }

    autoformNameForQuantity() {
        var equipments = this.taskData().equipments;
        var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this.currentData()._id}));
        return "equipments." + index + ".quantity";
    }

    autoformNameForEquipmentId() {
        var equipments = this.taskData().equipments;
        var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this.currentData()._id}));
        return "equipments." + index + ".equipmentId";
    }
}


TaskEquipmentsComponent.register("TaskEquipmentsComponent");