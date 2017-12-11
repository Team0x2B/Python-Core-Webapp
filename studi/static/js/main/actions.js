
function joinGroup(id) {
    $.ajax({
        url: "/api/join_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
        success: function(result) {
            construct_group_info_popout(id);
        }
    });
    fast_update_remove({can_leave: true})
    construct_group_info_popout(id);
}

function leaveGroup(id) {
    $.ajax({
        url: "/api/leave_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
        success: function(result) {
            construct_group_info_popout(id);
        }
    });
    fast_update_remove({can_join: true})
}

function deleteGroup(id) {
    $.ajax({
        url: "/api/delete_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
    });
    removeGroupMarker(id);
    document.getElementById("group-info-title").innerHTML = "DELETED";
}