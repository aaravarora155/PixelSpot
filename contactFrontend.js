$("button").click(async function() {
    const name = $(".user").val();
    const email = $(".emailEntered").val();
    const issue = $(".issueText").val();
    alert("Request Sent, Copy has been sent to the email you entered!");
    const response = await fetch("https://trotty-inexpressively-rosette.ngrok-free.dev/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, issue })
    });

    const data = await response.json();
    
});
