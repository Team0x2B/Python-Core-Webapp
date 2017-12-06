var curid;
var curUser;
var curStudy;
var curLocationX;
var curLocationY;
function pageInit()
{
      // current user data
      curid = '{{ session['id'] }}';
      curUser =  '{{ session['username'] }}';
      curStudy = '{{ session['study'] }}';
      curLocationX = '{{ session['locationX'] }}';
      curLocationY = '{{ session['locationY'] }}';
      console.log("ID:" + curid);
      console.log ("Current user: " + curUser);
      //display username on screen
      document.getElementById("curname").innerHTML = curUser;
      console.log ("Current study: " + curStudy);
      studybtn = document.getElementById(curStudy);
      studybtn.checked = true;
}
//arts, humn, engr, math, nats, soci
function setTopic()
{
      if (document.getElementById('arts').checked) {
        topicval = 'arts';
      }
      else if (document.getElementById('humn').checked)
      {
        topicval = 'humn';
      }
      else if (document.getElementById('engr').checked)
      {
        topicval = 'engr';
      }
      else if (document.getElementById('math').checked)
      {
        topicval = 'math';
      }
      else if (document.getElementById('nats').checked)
      {
        topicval = 'nats';
      }
      else if (document.getElementById('soci').checked)
      {
        topicval = 'soci';
      }
      else
      {
          topicval = 'none';
      }
      console.log("topicval" + topicval)
      postdata = '{"study":"'+topicval+'"}';
      console.log("setTopic-ID:" + curid);
      console.log("data:" + postdata);
      myurl="https://localhost:4000/api/saveUser/"+curid;

      $.ajax( {url: myurl, type: "POST", contentType: "application/json", data:postdata });
}