
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
}