var current_group_id = -1;
var current_group_location = [0, 0];
var minimap;
var marker;
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
    $.ajax({
        url: "/api/get_group_by_id/" + group_id,
        xhrFields: {withCredentials: true},
        type: "GET",
        contentType: "application/json",
        success: do_build_info_popout
   });
}

function do_build_info_popout(group) {
    current_group_location = [group.latitude, group.longitude];
    if (!minimap) {
        initMiniMap();
    }
    user_permissions = group.allowed_actions;
    if (current_group_id != group.id) {
        centerMiniMap();
        setText(document.getElementById("group-info-title"), group.topic);
        setText(document.getElementById("group-info-subtitle"), group.dept + ": " + group.course_num);
        setText(document.getElementById("group-info-author"), group.members[0].username);
        setText(document.getElementById("group-info-time"), "Feature Coming Soon");
        setText(document.getElementById("group-info-description"), group.desc);
        current_group_id = group.id;
    }

    create_action_button(group.id, user_permissions);
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

function create_action_button(group_id, user_permissions) {
    detailed_info = document.getElementById("group-info-detailed-group-info")
    var action_button;
    for (var i = 0; i < detailed_info.childNodes.length; i++) {
        if (detailed_info.childNodes[i].className == "action-button") {
            action_button = detailed_info.childNodes[i];
        }
    }
    if (!action_button) {
        console.log("no action button to reuse");
        action_button = document.createElement("a")
        detailed_info.appendChild(action_button);
    }
    action_button.setAttribute("class", "action-button");
    action_button.setAttribute("href", "javascript:void(0)");
    console.log(user_permissions);
    if (user_permissions.can_join) {
        action_button.setAttribute('id', 'join-button');
        action_button.setAttribute("onclick", "joinGroup(" + group_id + ");");
        setText(action_button, "Join Group");
    } else if (user_permissions.can_leave) {
        action_button.setAttribute('id', 'leave-button');
        action_button.setAttribute("onclick", "leaveGroup(" + group_id + ");");
        setText(action_button, "Leave Group");
    } else if (user_permissions.can_delete) {
        action_button.setAttribute('id', 'delete-button');
        action_button.setAttribute("onclick", "deleteGroup(" + group_id + ");");
        setText(action_button, "Delete Group");
    } else if (action_button) {
        detailed_info.removeChild(action_button);
    }
}

function fast_update_remove(group_id, user_permissions) {
    create_action_button(group_id, user_permissions);
}

function initMiniMap() {
    console.log(current_group_location);
    center = new google.maps.LatLng(current_group_location[0], current_group_location[1]);
    minimap = new google.maps.Map(document.getElementById('minimap'),
            {
                center: center,
                zoom: 16,
                clickableIcons: false,
                disableDefaultUI: true,
                gestureHandling: 'none',
                zoomControl: false
            }
    );
    marker = new google.maps.Marker({position: center,map: minimap, style: {fill: '#76c043'} });
    google.maps.event.addListenerOnce(minimap, 'idle', function(){
        document.getElementById('minimap').firstChild.firstChild.childNodes[1].style.position = "relative";
    });

}

function centerMiniMap() {
    google.maps.event.trigger(minimap, 'resize');
    new_center = new google.maps.LatLng(current_group_location[0], current_group_location[1]);
    minimap.setCenter(new_center);
    marker.setPosition(new_center);

}