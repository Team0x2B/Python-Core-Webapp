var known_group_members = []

function get_group_info(group_id) {
   return $.ajax({
        url: "/api/get_group_by_id/" + group_id,
        xhrFields: {withCredentials: true},
        type: "GET",
        contentType: "application/json",
   });
}

function get_user_permissions(group_id) {
   return $.ajax({
        url: "/api/get_user_permission/" + group_id,
        xhrFields: {withCredentials: true},
        type: "GET",
        contentType: "application/json",
   });
}

function setText(e, text) {
    if (e.firstChild) {
       e.removeChild(e.firstChild);
    }
    e.appendChild(document.createTextNode(text));
}

function construct_group_info_popout(group_id) {
    $.when(get_group_info(group_id), get_user_permissions(group_id)).then(do_build_info_popout)
}

function do_build_info_popout(group_response, user_permissions_response) {
    group = group_response[0];
    user_permissions = user_permissions_response[0];
    setText(document.getElementById("group-info-title"), group.topic);
    setText(document.getElementById("group-info-subtitle"), group.dept + ": " + group.course_num);
    setText(document.getElementById("group-info-author"), group.members[0].username);
    setText(document.getElementById("group-info-time"), "Feature Coming Soon");
    setText(document.getElementById("group-info-description"), group.desc);

    create_action_button(user_permissions);
    create_members_list(group.members);
}

function create_members_list(members) {
    list_el = document.getElementById("members-list");
    container = document.createElement("members-list-container");
    if (list_el.firstChild) {
        list_el.removeChild(list_el.firstChild);
    }
    list_el.appendChild(container);
    members.forEach(function(m) {
        entry = document.createElement("div");
        entry.setAttribute('class', 'list-entry');
        console.log(m.username);
        setText(entry, m.username);
        console.log(entry);
        container.appendChild(entry);
    });
}

function create_action_button(user_permissions) {
    detailed_info = document.getElementById("group-info-detailed-group-info")
    for (var i = 0; i < detailed_info.childNodes.length; i++) {
        if (detailed_info.childNodes[i].className == "action-button") {
            detailed_info.removeChild(detailed_info.childNodes[i]);
            break;
        }
    }
    console.log(user_permissions);
    if (user_permissions.can_join) {
        var join_button = document.createElement("a");
        join_button.setAttribute('id', 'join-button');
        join_button.setAttribute("class", "action-button");
        join_button.setAttribute("href", "javascript:void(0)");
        join_button.setAttribute("onclick", "joinGroup(" + group.id + ");");
        setText(join_button, "Join Group");
        detailed_info.appendChild(join_button);
    } else if (user_permissions.can_leave) {
        var leave_button = document.createElement("a");
        leave_button.setAttribute('id', 'leave-button');
        leave_button.setAttribute("class", "action-button");
        leave_button.setAttribute("href", "javascript:void(0)");
        leave_button.setAttribute("onclick", "leaveGroup(" + group.id + ");");
        setText(leave_button, "Leave Group");
        detailed_info.appendChild(leave_button);
    } else if (user_permissions.can_delete) {
        var delete_button = document.createElement("a");
        delete_button.setAttribute('id', 'delete-button');
        delete_button.setAttribute("class", "action-button");
        delete_button.setAttribute("href", "javascript:void(0)");
        delete_button.setAttribute("onclick", "deleteGroup(" + group.id + ");");
        setText(delete_button, "Delete Group");
        detailed_info.appendChild(delete_button);
    }
}

function fast_update_remove(user_permissions) {
    create_action_button(user_permissions);
}