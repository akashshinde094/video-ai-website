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
        version: "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
        input: {
  prompt: prompt,
  fps: 24,
  width: 1024,
  height: 576,
        }
               }
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

