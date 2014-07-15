// subscribe to the published collection
Meteor.subscribe("mqttMessages");

// we need a dependency later on to refresh the topic query
var topicDep = new Deps.Dependency;

// this is the dependend function to retrieve and set the topic query
Deps.autorun(function(){
    topicDep.depend();
    Meteor.call("getTopicQuery", function(err, obj) {
        Session.set("topicQuery", obj);
    });
});

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

// get the new query from the input field and send it to the server, reset field
// tell the dependency, that it has changed and has to be run again
_sendTopic = function() {
    var el = document.getElementById("topicQuery");
    var topicQuery = el.value;
    Meteor.call("setTopicQuery", topicQuery);
    topicDep.changed();
    el.value = "";
    el.focus();
};