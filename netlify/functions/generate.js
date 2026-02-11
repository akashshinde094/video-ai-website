export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    const createPrediction = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "YOUR_MODEL_VERSION_ID",
        input: { prompt }
      })
    });

    let prediction = await createPrediction.json();

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const checkPrediction = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
          }
        }
      );

      prediction = await checkPrediction.json();
    }

    if (prediction.status === "succeeded") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          video: prediction.output[0]
        })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Video generation failed" })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

