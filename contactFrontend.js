function valid(email){
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}


$("button").click(async function() {
    const name = $(".user").val();
    const email = $(".emailEntered").val();
    const issue = $(".issueText").val();
    if (valid(email)){
        alert("Request Sent, Copy has been sent    to the email you entered!");
        const response = await     fetch("https://trotty-inexpressively-rosette  .ngrok-free.dev/send-email", {
            method: "POST",
            headers: { "Content-Type":  "application/json" }, 
            body: JSON.stringify({ name, email,  issue })
        });

        const data = await response.json();
    }
    else{
        alert("Email is not in an approved format");
    }
});
