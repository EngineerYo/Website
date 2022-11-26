<?php
	$file = fopen('../data/bill_tracker.txt', 'w');
	$new_state = 1-$_POST['value'];
	fwrite($file, $new_state);
	fclose($file);

	$out_json = json_encode(array($new_state, $_POST['stamp']));

	echo $out_json;
?>