//get default weather station data from the weather station closest to Sustainable East HQ using the geonames api and then display the relevant info on the page
$.getJSON(
  "http://api.geonames.org/findNearByWeatherJSON?lat=54.97690465452058&lng=-1.607590060829576&username=w18003237",
  function (result) {
    var myObj = result.weatherObservation;
    $("#location").text(myObj.stationName);
    $("#temp").text(myObj.temperature);
    $("#clouds").text(myObj.clouds);
    $("#humidity").text(myObj.humidity);
    $("#windspeed").text(myObj.windSpeed);
  }
);

//function to pull weather station data from the weather station closest to the coordinates of a passed tweet using the geonames api and then display it on the page
function addWeather(tweetInfo) {
  $.getJSON(
    "http://api.geonames.org/findNearByWeatherJSON?lat=" +
      tweetInfo.lat +
      "&lng=" +
      tweetInfo.lng +
      "&username=w18003237",
    function (result) {
      var myObj = result.weatherObservation;
      $("#location").text(myObj.stationName);
      $("#temp").text(myObj.temperature);
      $("#clouds").text(myObj.clouds);
      $("#humidity").text(myObj.humidity);
      $("#windspeed").text(myObj.windSpeed);
    }
  );
}
