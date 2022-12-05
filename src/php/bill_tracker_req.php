<?php
	$file = fopen('../data/bill_tracker.txt', 'r');
	$state = fgets($file);
	fclose($file);

	$out_json = json_encode(array($state));

	echo $out_json;
?>