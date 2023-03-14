$(document).ready(function () {
  //some variables for the map, boundaries and markers array list
  var map;
  var bounds = new google.maps.LatLngBounds();
  var markers = [];

  //define the locations of the icon images
  const climate = "icons/global-warming.png";
  const net = "icons/carbon-neutral.png";
  const both = "icons/save-the-planet.png";

  //function for calculating wich image to use
  //accepts a tweetInfo paramter to search thhorugh the text of the tweet before assisgning the appropriate icon
  function getMarkerIcon(tweetInfo) {
    tweetInfo = tweetInfo.text.toLowerCase();
    if (
      tweetInfo.includes("#climatechange") &&
      tweetInfo.includes("#netzero")
    ) {
      return both;
    } else if (tweetInfo.includes("#climatechange")) {
      return climate;
    } else if (tweetInfo.includes("#netzero")) {
      return net;
    }
  }

  //function to set the infoPannel details for each of the markers using data collected from the tweets
  function setInfoPannelContent(tweetInfo) {
    const windowContent =
      '<div id="content">' +
      "<p>" +
      tweetInfo.text +
      "</p>" +
      "<p>by " +
      tweetInfo.name +
      "</p>" +
      "<p>From " +
      tweetInfo.location +
      "</div>";
    return windowContent;
  }

  //main function for initalising the map, adding markers, infowindows and then listeners for the marker events
  async function initMap() {
    //variables for map options and centering stuff
    var myLatLng = new google.maps.LatLng(
      53.13672646374531,
      -1.7674331729855035
    );
    var mapOptions = {
      center: myLatLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: true,
      overviewMapControl: false,
      rotateControl: false,
      scaleControl: false,
      panControl: false,
    };

    //set map using map api
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //main function for pulling the tweets and adding them to the markers array to be displayed as markers on the map
    //gets attributes from the json data provided and assigns them into the array
    await $.getJSON("http://20.25.59.57/part2/backend/getTweets.php", function (
      tweetdata
    ) {
      $.each(tweetdata.statuses, (key, objTweet) => {
        markers.push({
          id: key,
          text: objTweet.full_text,
          name: objTweet.user.name,
          location: objTweet.place.full_name,
          userLocation: objTweet.user.location,
          lat: boundBoxLatAvg(objTweet),
          lng: boundBoxLngAvg(objTweet),
        });
      });
    });

    //loops through the markers array and creates markers for the map using the items in the array
    $.each(markers, (i, tweet) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(tweet.lat, tweet.lng),
        map,
        icon: getMarkerIcon(tweet),
        id: tweet.id,
      });

      //makes sure the map initalises with all the markers visible
      bounds.extend(marker.position);
      map.fitBounds(bounds);

      //creates the infowindows using setInfoPannelContent
      const infowindow = new google.maps.InfoWindow({
        content: setInfoPannelContent(tweet),
      });

      //listener for each of the markers to detect when its mouseovered and then displays the infowindow
      marker.addListener("mouseover", () => {
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });

      //listener for each of the markers to detect when its no longer mouseovered and then close the infowindow
      marker.addListener("mouseout", () => {
        infowindow.close();
      });

      //click listener for each of the markers which calls 4 different functions
      //firstly to remove all displayed direction data
      //then display distance data before doint directions between the selected marker and the HQ
      //finally it updates the weather section to show weather info from the closest weather station to the marker selected
      marker.addListener("click", () => {
        removeDirections();
        getDistance(tweet);
        getDirections(tweet);
        addWeather(tweet);
      });
    });
  }

  //function to calculate the centre of the bounding box and return the lattitude coordinate
  //accepts tweetinfo as a parameter
  function boundBoxLatAvg(tweetInfo) {
    const result =
      (tweetInfo.place.bounding_box.coordinates[0][0][1] +
        tweetInfo.place.bounding_box.coordinates[0][1][1] +
        tweetInfo.place.bounding_box.coordinates[0][2][1] +
        tweetInfo.place.bounding_box.coordinates[0][3][1]) /
      4;
    return result;
  }

  //function to calculate the centre of the bounding box and return the longitude coordinate
  //accepts tweetinfo as a parameter
  function boundBoxLngAvg(tweetInfo) {
    const result =
      (tweetInfo.place.bounding_box.coordinates[0][0][0] +
        tweetInfo.place.bounding_box.coordinates[0][1][0] +
        tweetInfo.place.bounding_box.coordinates[0][2][0] +
        tweetInfo.place.bounding_box.coordinates[0][3][0]) /
      4;
    return result;
  }

  //function to call the googlemaps distance api to calculate the distance between a passed tweetlocation and the Sustainable East HQ
  function getDistance(tweetInfo) {
    new google.maps.DistanceMatrixService().getDistanceMatrix(
      {
        origins: ["NE1 8ST"],
        destinations: [tweetInfo.location],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false,
      },
      callback
    );
  }

  //calculates the distance and duration of the journey before then appending it to the distancebox div on the webpage
  function callback(response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;

      $.each(origins, function (originIndex) {
        var results = response.rows[originIndex].elements;
        $.each(results, function (resultIndex) {
          var element = results[resultIndex];
          var distance = element.distance.text;
          var duration = element.duration.text;
          var from = origins[originIndex];

          var to = destinations[resultIndex];

          $("#distanceBox").empty();
          $("#distanceBox").prepend(
            "<p>Distance: " +
              distance +
              " | Duration: " +
              duration +
              "<br/> From: " +
              from +
              " | To: " +
              to +
              "</p> "
          );
        });
      });
    }
  }

  //deprecated function get coordinates using the geocode api but has a maximum query limit of 20 so wasnt suitable
  /*var geocoder = new google.maps.Geocoder();
  function getGeocodeData(tweetInfo) {
    geocoder.geocode({ address: tweetInfo.place }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        return results[0].geometry.location;
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }*/

  //set google direction apis to variables
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();

  //function to generate directions from passed tweetlocation data to the Sustainable East HQ
  //before adding the directions to the directionpannel div and then displaying the route on the map
  function getDirections(tweetInfo) {
    var markerLatLng = tweetInfo.lat + ", " + tweetInfo.lng;

    var request = {
      origin: markerLatLng,
      destination: "NE1 8ST",
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directionsPanel"));
        directionsDisplay.setDirections(response);
        displayingRoute = true;
      }
    });
  }

  //removes directions from the div and the routes from the map
  function removeDirections() {
    $("#directionsPanel").empty();
    directionsDisplay.setMap(null);
  }

  //call map function
  initMap();
});
