const appId = "2792687927757015";
const appSecret = "61d5d3d83ccfd2e8fa3fb8d2bf93e0f3";
const token = "EAAnr71PnCNcBSSkq94w9xD9SzAy9MmwNPUmaQVlfu7O8Sp4yDYRiTFdMI08AZBFnMT6EkdzTz5DuDiveDhfywuBSQpxiFjWGLnWJg9zQUz8TadqYJcnTGNG9xJGrTFyDYrWO5QCRyIvdUqp7tPbP0XAxuhxeAhs4119V3YqHm6gkZAtNIq1D9x59sgaQZDZD";

async function debug() {
  const appToken = `${appId}|${appSecret}`;
  console.log("Using App Token:", appId);

  try {
    const url = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appToken}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("--- TOKEN DEBUG RESULT ---");
    console.log(JSON.stringify(data, null, 2));

    // Also check app status
    const appUrl = `https://graph.facebook.com/v20.0/${appId}?access_token=${appToken}&fields=id,name,link,restrictions`;
    const appRes = await fetch(appUrl);
    const appData = await appRes.json();
    console.log("--- APP STATUS ---");
    console.log(JSON.stringify(appData, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

debug();
