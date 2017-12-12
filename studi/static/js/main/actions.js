
function joinGroup(id) {
    fast_update_remove(id, {can_leave: true, can_join: false})
    $.ajax({
        url: "/api/join_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
        success: do_build_info_popout
    });
}

function leaveGroup(id) {
    fast_update_remove(id, {can_join: true, can_leave: false})
    $.ajax({
        url: "/api/leave_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
        success: do_build_info_popout
    });
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