/**
 * Created by travis on 11/27/15.
 * This File handles the main chat window
 */

function module($) {
    $("#insert_coach").click({postClass: "coach_message"}, postMessage);
    $("#send").click({postClass: "client_message"}, postMessage);

    function postMessage(mapToPost) {
        //probably want to add some data checking to make sure that mapToPost.data.postClass contains a string
        var textToPost = $("#comment").val();
        $("#insertable").append("<div class=\"message " + mapToPost.data.postClass + "\">" + textToPost + "</div>");
    }
    return {
        postMessage: postMessage(mapToPost)
    }
}

define(["jquery"], module);