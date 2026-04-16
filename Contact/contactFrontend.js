function valid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
function checkLength(name){
    if (name.length===0){
        return false;
    }
    else{
        return true;
    }
}
$("button").click(async function() {
    const name = $(".user").val();
    const email = $(".emailEntered").val();
    const issue = $(".issueText").val();

    if (valid(email)===true && checkLength(name)===true && checkLength(issue)===true){
        $(".user").val("");
        $(".emailEntered").val("");
        $(".issueText").val("");
        const response = await fetch("/contact/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, issue })
        });

        const data = await response.json();
        if (data.success) {
            alert("Email sent successfully!");
        } else {
            alert("Error: " + data.message);
        }
    }
    else{
        alert("Please enter a valid email address and ensure all fields are filled.");
    }
    
    
});
