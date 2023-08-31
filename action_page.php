<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	// collect value of input field
	$email = $_REQUEST['email'];
        $password = $_REQUEST['pwd'];

$servername = "localhost:3307";
$username = "root";
$password = "";
$dbname = "live";

// Create connection
$conn = new mysqli($servername,
	$username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
	die("Connection failed: "
		. $conn->connect_error);
}

$sqlquery = "INSERT INTO register(email , password) VALUES ('.$email.', '.$password.')";

if ($conn->query($sqlquery) === TRUE) {
	echo "record inserted successfully";
} else {
	echo "Error: ".$sqlquery."<br>" . $conn->error;
}

}
?>

// Closing the connection.
$conn->close();

?>
