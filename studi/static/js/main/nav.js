
function openSidebar() {
    document.getElementById("main-sidebar-menu").style.width = "250px";
}

function closeSidebar() {
    document.getElementById("main-sidebar-menu").style.width = "0";
}

function hideInfoWindow() {
    document.getElementById("info-window").style.display = "none";
}

function showInfoWindow(title, subtitle, author, count, desc) {
    document.getElementById("info-window").style.display = "block";

    document.getElementById("title").innerHTML = title;
    document.getElementById("specific").innerHTML = subtitle;
    document.getElementById("author").innerHTML = author;
    document.getElementById("count").innerHTML = count;
    document.getElementById("info").innerHTML = desc;
}