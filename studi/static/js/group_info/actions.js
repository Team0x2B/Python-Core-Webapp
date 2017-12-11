
function joinGroup(id) {
    $.ajax({
        url: "/api/join_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
    });
    location.reload();
}

function leaveGroup(id) {
    $.ajax({
        url: "/api/leave_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
    });
    location.reload();
}

function deleteGroup(id) {
    $.ajax({
        url: "/api/delete_group/" + id,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
    });
    window.parent.removeGroupMarker(id);
    window.parent.hideInfoWindow();
    document.getElementById("group-title").innerHTML = "DELETED";
}