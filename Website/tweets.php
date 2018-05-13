<?php

require_once 'twitter-php/twitter.class.php';

//Twitter OAuth Settings, enter your settings here:
$CONSUMER_KEY = 'nc9Czeit1yGgULC2rHjk78BDq';
$CONSUMER_SECRET = 'by6Lz7aURxEY5zWE1iLeTHAPXry2ShzwQcEkOqB53lMhvb7S3S';
$ACCESS_TOKEN = '2933481965-ynpacVpu9gImzESTrrg8ItqSjKaUrk9bDQGUdTp';
$ACCESS_TOKEN_SECRET = '3M2pG9zGhPi3TMbN61Gf6rvJFztvDBQZds1pYM4OxucsW';

$twitter = new Twitter($CONSUMER_KEY, $CONSUMER_SECRET, $ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);

// retrieve data
$q = $_POST['q'];
$count = $_POST['count'];
$api = $_POST['api'];

// api data
$params = array(
	'screen_name' => $q,
	'q' => $q,
	'count' => 200,
    'includes_rts' => true,
    'exclude_replies' => true,
);
$results = $twitter->request($api, 'GET', $params);
$media_url = $results->entities->media[0]->media_url;
// output as JSON
echo json_encode($results);