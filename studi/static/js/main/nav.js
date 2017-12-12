
var infoWindowGroup = -1;

window.onpopstate = function(event) {
    console.log(event);
    state = event.state;
    if (!state.info) {
        closeMyGroups();  
    }
}

function openSidebar() {
    document.getElementById("main-sidebar-menu").style.width = "250px";
    document.getElementById("opaque").style.display = "block"
}

function closeSidebar() {
    document.getElementById("main-sidebar-menu").style.width = "0";
    document.getElementById("opaque").style.display = "none"
}

function hideInfoWindow() {
    document.getElementById("info-window").style.display = "none";
}

function showInfoWindow(group) {
    infoWindowGroup = group.id;
    document.getElementById("info-window").style.display = "block";

    owner = group.members[0]; //this almost certainly doesn't work all the time

    document.getElementById("title").innerHTML = group.topic;
    document.getElementById("specific").innerHTML = group.dept + ": " + group.course_num;
    document.getElementById("author").innerHTML = owner.username;
    document.getElementById("count").innerHTML = group.members.length;
    document.getElementById("info").innerHTML = group.desc;
//    document.getElementById("more-details").href="/group_info/" + group.id;
}

function openMyGroups(group_id) {
    window.history.pushState({info: true, gid: group_id}, "group_info", "group_info");
    console.log("oy vey");
    openSidebar();
    construct_group_info_popout(group_id);
    $("#groups-sidebar").on("transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd",
         function(e){
            console.log("sidebar done moving");
            centerMiniMap();
            $(this).off(e);
     });
    document.getElementById("groups-sidebar").style.width = "100%";
    console.log("moving sidebar");
}

function closeMyGroups() {
    console.log("oy vey");
    document.getElementById("groups-sidebar").style.width = "0";
    window.history.replaceState({info: false}, "group_info", "/")
    closeSidebar();
}

function getMyGroup(callback) {
    $.ajax({
        url: "/api/get_joined_group",
        xhrFields: {withCredentials: true},
        type: "GET",
        contentType: "application/json",
        success: callback
   });
}

function openMyJoinedGroup() {
    getMyGroup(function(response) {
        console.log(response.group_id)
        if (response.group_id != -1) {
            openMyGroups(response.group_id);
        }
    });
}
