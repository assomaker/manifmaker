import {InjectDataHelperServerService} from "../service/InjectDataHelperServerService";
import {SecurityServiceServer} from "../service/SecurityServiceServer";
import {ServerUserService} from "../service/ServerUserService";
import {JwtService} from "../service/JwtService";
import {InjectGuidedTourDataServerService} from "../service/InjectGuidedTourDataServerService";


Meteor.methods({
  injectData: function () {
    SecurityServiceServer.isItProd("inject data from front");
    Meteor.isStartingUp = true;
    InjectDataHelperServerService.deleteAll();
    InjectDataHelperServerService.initAccessRightData();
    Meteor.injectDataServerService.injectAllData();
    Meteor.isStartingUp = false;
  },
  injectGuidedTourData: function () {
    var lastTour = InjectDataInfo.findOne({triggerEnv: "GUIDED_TOUR"});
    let date = new moment(`${lastTour.options.year}/${lastTour.options.month}/${lastTour.options.date}`, "YYYY/MM/DD");
    date = date.add("d", 2);
    let options = {
      year: date.format("YYYY"),
      month: date.format("MM"),
      date: date.format("D"),
      suffix: new moment().format("Dhhmmss")
    };
    InjectDataInfo.update(lastTour._id, {$set: {options: options}});

    Meteor.isStartingUp = true;
    console.log("injectGuidedTourData with options", options);
    let inject = new InjectGuidedTourDataServerService(options, false);
    inject.injectAllData();
    Meteor.isStartingUp = false;
    return options;
  },

  updateUserName: function (userId, newUsername) {
    ServerUserService.updateUserName(userId, newUsername)
  },
  updateUserEmail: function (userId, newUserEmail) {
    ServerUserService.updateUserEmail(userId, newUserEmail)
  },
  sendVerificationEmail: function (userId) {
    ServerUserService.sendVerificationEmail(userId)
  },
  getVersion: function () {
    var pjson = require('/package.json');
    console.log(pjson.version); // This will print the version
    return pjson.version;
  },
  sendEmail: function (to, subject, text) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    Email.send({
      to: to,
      from: "no-reply@manifmaker.com",
      subject: subject,
      text: text
    });
  },
  signExportUrl: function (target) {
    //TODO check that user has EXPORTASSIGNMENT role
    return JwtService.sign({"target": target, type: "url"})
  },
  verifyExportUrl: function (jwtString) {
    var payload = JwtService.verify(jwtString);
    var userId = payload.target.match("user/(.*)/export")[1];
    var token = ServerUserService.generateNewLoginToken(userId)
    return {
      payload: payload,
      token: token
    }
  },
  /**
   *
   * @param options JSON [{url, filename}]
   */
  generatePdf: function (options) {
    console.info("generatePdf", options);

    //get JWT url
    var items = [];
    options.forEach(option => {
      var fileName = option.fileName.trim().replace(" ", ""); //NGINX cannot handle encoded URL by default
      fileName = new moment().format("YYYYMMDD:HHmm") + "_" + fileName;
      var item = {};
      item.url = Meteor.manifmakerEndpoint + "/jwt/" + JwtService.sign({
          "target": Meteor.manifmakerEndpoint + option.url,
          type: "url"
        });
      item.fileName = fileName;
      items.push(item);
      var downloadUrl = Meteor.nginxEndpoint + item.fileName;
      var fileStatus = ExportStatus.findOne({fileName: item.fileName});
      if (fileStatus) {
        ExportStatus.update({fileName: item.fileName}, {$set: {status: "In progress", downloadUrl: downloadUrl}});
      } else {
        ExportStatus.insert({fileName: item.fileName, status: "In progress", downloadUrl: downloadUrl});
      }
    });
    console.info("Calling export pdf endpoint", Meteor.exportPdfEndpoint, "with", items);

    HTTP.call('POST', Meteor.exportPdfEndpoint, {
      data: {items: items}
    }, function (error, result) {
      if (error) {
        console.error("generatePdf", error)
      } else {
        console.info("generatePdf calling", Meteor.exportPdfEndpoint, "with result", result.content)
      }
    });
  }
});

