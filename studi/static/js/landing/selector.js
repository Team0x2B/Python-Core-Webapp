var curid;
var curUser;
var curStudy;
var curLocationX;
var curLocationY;

function pageInit() {
      // current user data
//      curid = '{{ session['id'] }}';
//      curUser =  '{{ session['username'] }}';
//      curStudy = '{{ session['study'] }}';
//      curLocationX = '{{ session['locationX'] }}';
//      curLocationY = '{{ session['locationY'] }}';
//      console.log("ID:" + curid);
//      console.log ("Current user: " + curUser);
//      //display username on screen
//      document.getElementById("curname").innerHTML = curUser;
//      console.log ("Current study: " + curStudy);
//      studybtn = document.getElementById(curStudy);
//      studybtn.checked = true;
}
//arts, humn, engr, math, nats, soci
function setTopic() {
      if (document.getElementById('arts').checked) {
        topicval = 'ART';
      }
      else if (document.getElementById('humn').checked)
      {
        topicval = 'HUMANITIES';
      }
      else if (document.getElementById('engr').checked)
      {
        topicval = 'ENGINEERING';
      }
      else if (document.getElementById('math').checked)
      {
        topicval = 'MATH';
      }
      else if (document.getElementById('nats').checked)
      {
        topicval = 'NATURAL SCIENCES';
      }
      else if (document.getElementById('soci').checked)
      {
        topicval = 'SOCIAL SCIENCES';
      }
      else
      {
          topicval = 'NONE';
      }


    dept = document.getElementById("dept").value;
    course_num = document.getElementById("course-id").value;
    description = document.getElementById("description").value;
    var post_data = {
        "topic": topicval,
        "lat": groupMarker.getPosition().lat(),
        "lon": groupMarker.getPosition().lng(),
        "dept": dept,
        "course_num": course_num,
        "description": description
    }

    console.log("topicval" + topicval)
    console.log("data:" + post_data);

    http_url = window.location.origin + '/api/create_study_group';

    $.ajax({
        url: http_url,
        xhrFields: {withCredentials: true},
        type: "POST",
        contentType: "application/json",
        data:JSON.stringify(post_data)
    });
}
