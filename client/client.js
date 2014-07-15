Meteor.subscribe("mqttMessages");
var topicDep = new Deps.Dependency;

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

Template.msg.tsString = function() {
    return this.ts.toLocaleString();
};

Template.admin.events({
    'click #startClient': function() {
        Meteor.call("startClient");
    },
    'click #stopClient': function() {
        Meteor.call("stopClient");
    }
});

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

_sendTopic = function() {
    var el = document.getElementById("topicQuery");
    var topicQuery = el.value;
    Meteor.call("setTopicQuery", topicQuery);
    topicDep.changed();
    el.value = "";
    el.focus();
};