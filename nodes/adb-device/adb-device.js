module.exports = function (RED) {
    "use strict";
    var adb = require('adbkit');
    var client = adb.createClient();

    function AdbListDevicesNode(config) {
        RED.nodes.createNode(this, config);


        var node = this;
        var timer;
        node.on("input", function (msg) {
            node.status({fill: "yellow", shape: "dot", text: 'ready'});
            client.listDevices()
                .then(function (devices) {
                    msg.payload = devices;
                    node.status({fill: "green", shape: "dot", text: 'listed'});
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
                node.status({});
            }, 1000);
        }
    }


    function AdbDeviceFeatutesNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        var timer;

        node.on("input", function (msg) {
            node.status({fill: "yellow", shape: "dot", text: 'getting'});
            var device_id = msg.device_id || msg.payload.device_id || config.device_id || null;
            if (!device_id)
                return node.warn('device_id required', msg);


            client.getFeatures(device_id).then(function (features) {
                node.status({fill: "green", shape: "dot", text: 'getted'});
                msg.payload = {
                    features: features
                };
                node.send([msg]);
                timerStatus()

            }).catch(function (err) {
                node.status({fill: "red", shape: "dot", text: 'getted'});
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
                node.status({});
            }, 1000);
        }
    }


    function AdbShellNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        var timer;

        node.on("input", function (msg) {
            node.status({fill: "yellow", shape: "dot", text: 'getting'});
            var device_id = msg.device_id || msg.payload.device_id || config.device_id || null;
            var command = msg.command || msg.payload.command || config.command || null;

            if (!device_id)
                return node.error('device_id required', msg);

            if (!command)
                return node.error('command required', msg);


            client.shell(device_id, command).then(function (features) {
                node.status({fill: "green", shape: "dot", text: 'getted'});
                msg.payload = features;
                node.send([msg]);
                timerStatus()

            }).catch(function (err) {
                node.status({fill: "red", shape: "dot", text: 'getted'});
                msg.payload = {
                    error: err
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
                node.status({});
            }, 1000);
        }
    }

    function AdbScreenshotNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        var timer;

        node.on("input", function (msg) {
            node.status({fill: "yellow", shape: "dot", text: 'getting'});
            var device_id = msg.device_id || msg.payload.device_id || config.device_id || null;
            var dir = msg.screenshot_path || msg.payload.screenshot_path || config.screenshot_path || '/sdcard';
            var image_name = msg.image_name ? msg.image_name + '.png' : 'SCREEN_' + Date.now() + '.png'; // screencap -p /sdcard/$name

            var path = dir + '/' + image_name;

            var command = 'screencap -p ' + path;

            if (!device_id)
                return node.error('device_id required', msg);


            client.shell(device_id, command).then(function (features) {
                node.status({fill: "green", shape: "dot", text: 'getted'});
                msg.payload = features;

                node.send([msg]);
                timerStatus()

            }).catch(function (err) {
                node.status({fill: "red", shape: "dot", text: 'getted'});
                msg.payload = {
                    error: err
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
                node.status({});
            }, 1000);
        }
    }

    RED.nodes.registerType("adb-list-devices", AdbListDevicesNode);
    RED.nodes.registerType("adb-device-features", AdbDeviceFeatutesNode);
    RED.nodes.registerType("adb-shell", AdbShellNode);
    RED.nodes.registerType("adb-screenshot", AdbScreenshotNode);

};
