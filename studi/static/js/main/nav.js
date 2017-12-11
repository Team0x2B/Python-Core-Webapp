
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
    document.getElementById("info-window").style.display = "block";

    document.getElementById("title").innerHTML = group.topic;
    document.getElementById("specific").innerHTML = group.dept + ": " + group.course_num;
    document.getElementById("author").innerHTML = "Student";
    document.getElementById("count").innerHTML = group.members.length;
    document.getElementById("info").innerHTML = group.desc;
    document.getElementById("more-details").href="/group_info/" + group.id;
}

function openMyGroups(url_target) {
    console.log("oy vey");
    openSidebar();
    var frame = document.getElementById("group_info_section");
    frame.style.display = "block";
    if (url_target) {
        frame.url_target = url_target;
    }
    document.getElementById("groups-sidebar").style.width = "100%";
}

function closeMyGroups() {
    console.log("oy vey");
    document.getElementById("groups-sidebar").style.width = "0";
    document.getElementById("group_info_section").style.display = "none";
    closeSidebar();
}