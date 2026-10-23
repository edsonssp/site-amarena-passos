const token = "EAAnr71PnCNcBSSkq94w9xD9SzAy9MmwNPUmaQVlfu7O8Sp4yDYRiTFdMI08AZBFnMT6EkdzTz5DuDiveDhfywuBSQpxiFjWGLnWJg9zQUz8TadqYJcnTGNG9xJGrTFyDYrWO5QCRyIvdUqp7tPbP0XAxuhxeAhs4119V3YqHm6gkZAtNIq1D9x59sgaQZDZD";
const phoneId = "1244191808785949";

async function send() {
  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "5535998471089", // or test number
        type: "text",
        text: { body: "Teste de envio" }
      })
    });
    const data = await res.json();
    console.log("SEND RESULT:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

send();
