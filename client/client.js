"use strict";

// subscribe to the published collection
Meteor.subscribe("mqttMessages");

// we need a dependency later on to refresh the topic query
var topicDep = new Deps.Dependency;

Session.setDefault("configValues", {});

// this is the dependend function to retrieve and set the topic query
Deps.autorun(function(){
    topicDep.depend();
    Meteor.call("getTopicQuery", function(err, obj) {
        Session.set("topicQuery", obj);
    });
});

Meteor.startup(function() {
    Meteor.call("getConfigValues", function(err, values) {
        Session.set("configValues", values);
    });
});

Template.config.host = function() {
    return Session.get("configValues")["mqttHost"];
};

Template.config.port = function() {
    return Session.get("configValues")["mqttPort"];
};

Template.messages.topicQuery = function() {
    return Session.get("topicQuery");
};

Template.messages.lastMessages = function () {
   return Messages.find({}, {sort: {ts: -1}});
};

// just for a better readability in the UI
Template.msg.tsString = function() {
    return this.ts.toLocaleString();
};

// the start/stop button events, call the server-side methods
Template.admin.events({
    'click #startClient': function() {
        Meteor.call("startClient");
    },
    'click #stopClient': function() {
        Meteor.call("stopClient");
    }
});

// the events for changing the topic query (for button click and pressing enter)
Template.topic.events({
    'click #sendTopicQuery': function() {
        _sendTopic();
    },
    'keyup #topicQuery': function(e) {
        if (e.type == "keyup" && e.which == 13) {
            _sendTopic();
        }
    }
});

// the click-event for publishing a message
Template.publish.events({
   'click #publishMessage': function() {
       var elTopic = document.getElementById("topic");
       var elMessage = document.getElementById("message");
       Meteor.call("publishMessage", elTopic.value, elMessage.value, function() {
           elTopic.value = "";
           elMessage.value = "";
           elTopic.focus();
       });
   }
});

// get the new query from the input field and send it to the server, reset field
// tell the dependency, that it has changed and has to be run again
var _sendTopic = function() {
    var el = document.getElementById("topicQuery");
    var topicQuery = el.value;
    Meteor.call("setTopicQuery", topicQuery, function() {
        topicDep.changed();
        el.value = "";
        el.focus();
    });
};