var host = "broker.mqttdashboard.com";
var port = 1883;
var topicQuery = "#";

Meteor.startup(function () {
    Messages.remove({});
});

Meteor.publish("mqttMessages", function() {
    return Messages.find({}, {sort: {ts: -1}, limit: 10});
});

var mqtt = Meteor.require("mqtt");
var mqttClient = mqtt.createClient(port, host);
mqttClient
    .on("connect", function() {
        console.log("client connected");
    })
    .on("message", function(topic, message) {
        console.log(topic + ": " + message);
        var msg = {
            message: message,
            topic: topic,
            ts: new Date()
        };
        addMsgToCollection(msg);
    });

var addMsgToCollection = Meteor.bindEnvironment(function(message) {
    Messages.insert(message);
});

Meteor.methods({
    startClient: function() {
        console.log("startClient called");
        mqttClient.subscribe(topicQuery);
    },
    stopClient: function() {
        console.log("stopClient called");
        mqttClient.unsubscribe(topicQuery);
    },
    setTopicQuery: function(newTopicQuery) {
        console.log("set new Topic: " + newTopicQuery);
        mqttClient.unsubscribe(topicQuery).subscribe(newTopicQuery);
        topicQuery = newTopicQuery;
    },
    getTopicQuery: function() {
        return topicQuery;
    }
});
