import {ServerAssignmentService} from "../server/service/ServerAssignmentService"
import {ServerReferenceCollectionsService} from "../server/service/ServerReferenceCollectionsService"
import {ServerUserService} from "../server/service/ServerUserService"
import {ServerTaskService} from "../server/service/ServerTaskService"
import {ServerService} from "./service/ServerService";
import {Inject24h43emeDataServerService} from "./service/Inject24h43emeDataServerService";
import {Inject24hDataServerService} from "./service/Inject24hDataServerService";
import {InjectDataHelperServerService} from "./service/InjectDataHelperServerService";

InjectDataInfo = new Mongo.Collection("inject_data_infos");


Meteor.startup(function () {

    var mailGunPassword = process.env.MAILGUN_PASSWORD
    if(mailGunPassword) {
        process.env.MAIL_URL = `smtp://postmaster@mail.manifmaker.com:${mailGunPassword}@smtp.mailgun.org:587`;
        console.log("MAIL_URL has been set to "+process.env.MAIL_URL);
    }else
        console.info("MAILGUN_PASSWORD is not defined, this app will not send mail");



    Meteor.isStartingUp = true;

    // code to run on server at startup

    ServerService.addCollectionHooks();

    var injectDataServerService = new Inject24hDataServerService();
    //var injectDataServerService = new InjectDataServerService();

    Meteor.injectDataServerService = injectDataServerService;

    var IS_PRODUCTION = process.env.IS_PRODUCTION;
    var DATA_INJECTED_ONCE = process.env.DATA_INJECTED_ONCE;
    var DELETE_ALL = process.env.DELETE_ALL;
    var INJECT_MINIMUM_ACCESS_RIGHT = process.env.INJECT_MINIMUM_ACCESS_RIGHT;
    var INJECT_24H_43_DATA = process.env.INJECT_24H_43_DATA;
    var envReport = {
        isProd: process.env.IS_PRODUCTION,
        DATA_INJECTED_ONCE: process.env.DATA_INJECTED_ONCE,
        DELETE_ALL: process.env.DELETE_ALL,
        INJECT_MINIMUM_ACCESS_RIGHT: process.env.INJECT_MINIMUM_ACCESS_RIGHT,
        INJECT_24H_43_DATA: process.env.INJECT_24H_43_DATA
    };
    var password = null;


    if (typeof(IS_PRODUCTION) !== 'undefined' && IS_PRODUCTION == "true") {
        console.info("ManifMaker app has been started with ENV IS_PRODUCTION")
    }

    var dataInjectedOnce = false;
    if (typeof(DATA_INJECTED_ONCE) !== 'undefined' && DATA_INJECTED_ONCE == "true") {
        console.info("Meteor.startup : trigger by ENV DATA_INJECTED_ONCE");
        dataInjectedOnce = true;
    }

    if (typeof(DELETE_ALL) !== 'undefined' && DELETE_ALL == "true") {
        console.info("Meteor.startup : trigger by ENV DELETE_ALL (deleteAll)");
        if (InjectDataInfo.findOne({triggerEnv: "DELETE_ALL"}) && dataInjectedOnce)
            console.info("Meteor.startup : ENV DELETE_ALL skipped because it has already been injected and DATA_INJECTED_ONCE is true.");
        else
            InjectDataHelperServerService.deleteAll();
        InjectDataInfo.insert({triggerEnv: "DELETE_ALL", date: new Date(), envReport: envReport});
    }

    if (typeof(INJECT_MINIMUM_ACCESS_RIGHT) !== 'undefined' && INJECT_MINIMUM_ACCESS_RIGHT == "true") {
        console.info("Meteor.startup : trigger by ENV INJECT_MINIMUM_ACCESS_RIGHT (initAccessRightData)");
        if (InjectDataInfo.findOne({triggerEnv: "INJECT_MINIMUM_ACCESS_RIGHT"}) && dataInjectedOnce)
            console.info("Meteor.startup : ENV INJECT_MINIMUM_ACCESS_RIGHT skipped because it has already been injected and DATA_INJECTED_ONCE is true.");
        else
            password = InjectDataHelperServerService.initAccessRightData();
        InjectDataInfo.insert({triggerEnv: "INJECT_MINIMUM_ACCESS_RIGHT", date: new Date(), envReport: envReport});
    }

    if (typeof(INJECT_24H_43_DATA) !== 'undefined' && INJECT_24H_43_DATA == "true") {
        console.info("Meteor.startup : trigger by ENV INJECT_24H_43_DATA (initAccessRightData, inject24H43Data)");
        if (InjectDataInfo.findOne({triggerEnv: "INJECT_24H_43_DATA"}) && dataInjectedOnce)
            console.info("Meteor.startup : ENV INJECT_24H_43_DATA skipped because it has already been injected and DATA_INJECTED_ONCE is true.");
        else {
            let inject24h43emeDataServerService = new Inject24h43emeDataServerService();
            inject24h43emeDataServerService.injectConfMakerData();
            inject24h43emeDataServerService.populateTestData();
        }
        InjectDataInfo.insert({triggerEnv: "INJECT_24H_43_DATA", date: new Date(), envReport: envReport});
    }


    if (Meteor.isDevelopment) {
    //     specific to the dev needs
        console.info("Meteor.startup : isDevelopment, injecting or not");
        // InjectDataHelperServerService.deleteAll();
        // password = InjectDataHelperServerService.initAccessRightData();
        // Meteor.injectDataServerService.injectAllData();
    }

    if(password){
        InjectDataHelperServerService.printSuperAdmin(password);
    }


    console.info("Meteor.isStarting is complete");
    Meteor.isStartingUp = false;
});












