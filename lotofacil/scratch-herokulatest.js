async function test() {
  const url = "https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest";
  try {
    const response = await fetch(url, { cache: "no-store" });
    console.log("Status Heroku Latest:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("Heroku Latest Data:", JSON.stringify(data));
    }
  } catch (err) {
    console.error(err);
  }
}
test();
