$("button").click(async function() {
    const name = $(".user").val();
    const email = $(".emailEntered").val();
    const issue = $(".issueText").val();

    const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, issue })
    });

    const data = await response.json();
    alert(data.message);
});
