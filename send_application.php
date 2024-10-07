<?php

$curl = curl_init();

$name = $_GET['name'];
$phone = $_GET['phone'];

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://uslugipro.pl/services_api.php/send_application?name=$name&phone=$phone",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
