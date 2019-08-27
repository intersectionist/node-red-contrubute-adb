module.exports = function (RED) {
    "use strict";
    var adb = require('adbkit');
    var client = adb.createClient();

    function AdbListDevicesNode(config) {
        RED.nodes.createNode(this, config);


        var node = this;
        var timer;

        var msg = {};

        var _this = this;


        node.on("input", function (msg) {
            _this.status({fill: "yellow", shape: "dot", text: 'ready'});
            client.listDevices()
                .then(function (devices) {
                    msg.payload = devices;
                    _this.status({fill: "green", shape: "dot", text: 'listed'});
                    node.send([msg]);
                })
                .catch(function (err) {
                    msg.payload = {
                        error: err.message
                    };
                    node.error(err.message, msg);
                    node.send([null, msg]);
                });
            timerStatus();
        });

        node.on("close", function (done) {
            done()
        });

        var timerStatus = function () {
            timer = setTimeout(function () {
                clearTimeout(timer);
                _this.status({});
            }, 1000);
        }
    }


    function AdbDeviceFeatutesNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;

        var msg = {};
        var timer;

        var _this = this;

        node.on("input", function (msg) {
            _this.status({fill: "yellow", shape: "dot", text: 'getting'});
            var device_id = msg.device_id || msg.payload.device_id || config.device_id || null;
            if (!device_id)
                return node.warn('device_id required', msg);


            client.getFeatures(device_id).then(function (features) {
                _this.status({fill: "green", shape: "dot", text: 'getted'});
                msg.payload = {
                    features: features
                };
                node.send([msg]);
                timerStatus()

            }).catch(function (err) {
                _this.status({fill: "red", shape: "dot", text: 'getted'});
                msg.payload = {
                    error: err.message
                };
                node.error(err.message, msg);
                node.send([null, msg]);
                timerStatus()
            })
        });

        node.on("close", function (done) {
            done()
        });

        var timerStatus = function () {
            timer = setTimeout(function () {
                clearTimeout(timer);
                _this.status({});
            }, 1000);
        }
    }


    function AdbShellNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;

        var msg = {};
        var timer;

        var _this = this;

        node.on("input", function (msg) {
            _this.status({fill: "yellow", shape: "dot", text: 'getting'});
            var device_id = msg.device_id || msg.payload.device_id || config.device_id || null;
            var command = msg.command || msg.payload.command || config.command || null;

            if (!device_id)
                return node.error('device_id required', msg);

            if (!command)
                return node.error('command required', msg);


            client.shell(device_id, command).then(function (features) {
                _this.status({fill: "green", shape: "dot", text: 'getted'});
                msg.payload = {
                    features: features
                };
                node.send([msg]);
                timerStatus()

            }).catch(function (err) {
                _this.status({fill: "red", shape: "dot", text: 'getted'});
                msg.payload = {
                    error: err.message
                };
                node.error(err.message, msg);
                node.send([null, msg]);
                timerStatus()
            })
        });

        node.on("close", function (done) {
            done()
        });

        var timerStatus = function () {
            timer = setTimeout(function () {
                clearTimeout(timer);
                _this.status({});
            }, 1000);
        }
    }

    RED.nodes.registerType("adb-list-devices", AdbListDevicesNode);
    RED.nodes.registerType("adb-device-features", AdbDeviceFeatutesNode);
    RED.nodes.registerType("adb-shell", AdbShellNode);

};
