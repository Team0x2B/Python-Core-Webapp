
function joinGroup(id) {
    $.ajax({
        url: "/api/join_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
        success: do_build_info_popout
    });
    fast_update_remove(id, {can_leave: true})
    construct_group_info_popout(id);
}

function leaveGroup(id) {
    console.log(id);
    $.ajax({
        url: "/api/leave_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
        success: do_build_info_popout
    });
    fast_update_remove(id, {can_join: true})
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