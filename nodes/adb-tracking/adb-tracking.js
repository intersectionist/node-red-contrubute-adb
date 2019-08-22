module.exports = function (RED) {
    "use strict";
    var adb = require('adbkit');


    function AdbTrackingNode(config) {
        RED.nodes.createNode(this, config);

        var client = adb.createClient();

        var node = this;

        var msg = {};

        var _this = this;
        _this.status({fill: "yellow", shape: "dot", text: 'Staring...'});

        client.trackDevices()
            .then(function (tracker) {

                _this.status({fill: "green", shape: "dot", text: 'Tracker started'});

                tracker.on('add', function (device) {
                    msg.payload = {
                        device: device
                    };
                    node.send([msg]);
                });
                tracker.on('remove', function (device) {
                    msg.payload = {
                        device: device
                    };
                    node.send([null, msg]);
                });
                tracker.on('end', function () {
                    msg.payload = {};
                    node.send([null, null, msg]);
                });
            })
            .catch(function (err) {
                _this.status({fill: "red", shape: "dot", text: 'Tracker stopped'});
                msg.payload = {
                    error: err.message
                };
                node.warn(err.message, msg);
                node.send([null, null, null, msg]);
            });

        node.on("close", function (done) {
            done()
        });
    }

    RED.nodes.registerType("adb-tracking", AdbTrackingNode);

};
