Meteor.subscribe("mqttMessages");
var topicDep = new Deps.Dependency;

Deps.autorun(function(){
    topicDep.depend();
    Meteor.call("getTopic", function(err, obj) {
        Session.set("topic", obj);
    });
});

Template.messages.topic = function() {
    return Session.get("topic");
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
    'click #sendTopic': function() {
        _sendTopic();
    },
    'keyup #topic': function(e) {
        if (e.type == "keyup" && e.which == 13) {
            _sendTopic();
        }
    }
});

_sendTopic = function() {
    var el = document.getElementById("topic");
    var tp = el.value;
    Meteor.call("setTopic", tp);
    topicDep.changed();
    el.value = "";
    el.focus();
};