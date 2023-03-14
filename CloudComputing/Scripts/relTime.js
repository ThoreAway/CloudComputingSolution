//function to calculate the time since a tweet has been posted using the time created at
//Devlin, Ian 2010 "Adding your Twitter feed to your website with jQuery" PCPRo 13th Sept 2010.
function relTime(time_value) {
  time_value = time_value.replace(/(\+[0-9]{4}\s)/gi, "");
  var parsed_date = Date.parse(time_value);
  var relative_to = arguments.length > 1 ? arguments[1] : new Date();
  var timeago =
    parseInt((relative_to.getTime() - parsed_date) / 1000) - 60 * 60;
  if (timeago < 60) return "less than a minute ago";
  else if (timeago < 120) return "about a minute ago";
  else if (timeago < 45 * 60)
    return parseInt(timeago / 60).toString() + " minutes ago";
  else if (timeago < 90 * 60) return "about an hour ago";
  else if (timeago < 24 * 60 * 60)
    return "about " + parseInt(timeago / 3600).toString() + " hours ago";
  else if (timeago < 48 * 60 * 60) return "1 day ago";
  else return parseInt(timeago / 86400).toString() + " days ago";
}
