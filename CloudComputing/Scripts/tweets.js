$(document).ready(function () {
  //function to get tweet json data from the setup api
  $.getJSON("http://20.25.59.57/part2/backend/getTweets.php", function (
    tweetdata
  ) {
    //loops through the collected tweets and displays the text, name, and time since tweeted in the tweetlist div on the page
    $.each(tweetdata.statuses, function (key, objTweet) {
      //checks to see if a user name is avaiable first
      if (objTweet.user.name) {
        $("#tweet-list").append(
          "<div id='tweet" +
            key +
            "' class='tweetos'> <p>" +
            objTweet.full_text +
            "</p> <p>by " +
            objTweet.user.name +
            "</p> <p>tweeted " +
            relTime(objTweet.created_at) +
            "</p> </div>"
        );
      } else {
        //else just provides tweet text and time since tweet
        $("#tweet-list").append(
          "<div id='tweet" +
            key +
            "'> <p>" +
            objTweet.text +
            "</p> <p>tweeted " +
            relTime(objTweet.created_at) +
            "</p> </div>"
        );
      }
    });
  });
});

//twitter widget function provided by twitter
//https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
window.twttr = (function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function (f) {
    t._e.push(f);
  };

  return t;
})(document, "script", "twitter-wjs");
