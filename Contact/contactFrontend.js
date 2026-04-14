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
        
        alert("Request Sent, Copy has been sent to the email you entered!");
        $(".user").val("");
        $(".emailEntered").val("");
        $(".issueText").val("");
        const response = await fetch("https://trotty-inexpressively-rosette.ngrok-free.dev/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, issue })
        });

        const data = await response.json();
    }
    else{
        alert("Please enter a valid email address and ensure all fields are filled.");
    }
    
    
});
