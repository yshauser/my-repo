<?php ob_start();

    if (isset($_POST['submit'])){
        // echo "it works";
        $to = "yshauser@gmail.com";
        $subject = $_POST['Subject'];
        $email = $_POST['Email'];
        $txt = $_POST['Message'];
        $headers= "From:  ".$email."\r\n"."Cc: someone@example.com";
        mail ($to, $subject, $messgae, $headers);

        header ("Location: contact.html");
    }
?>