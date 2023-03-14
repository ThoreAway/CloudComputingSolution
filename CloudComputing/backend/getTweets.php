<?php
header('Content-type: application/json');
//get the config variables and the abraham oauth library
require 'config.php';
require 'vendor/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

//validate connection with twitter api using the app consumer_key and secret
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
//execute a twitter search query for the first 100 relevant tweets containing climatechange or net zero within the UK
$tweets = $connection->get('search/tweets', array('q' => '(#climatechange OR #netzero)AND place:6416b8512febefc9', 'include_entities' => 'true', 'count' => '100', 'tweet_mode' => 'extended' ));
//convert the response into json and then display
echo(json_encode($tweets));
?>