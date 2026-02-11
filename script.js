async function generateVideo() {
  const prompt = document.getElementById("prompt").value;
  const status = document.getElementById("status");
  const video = document.getElementById("video");

  if (!prompt) {
    alert("Prompt enter kara");
    return;
  }

  status.innerText = "⏳ AI video generating...";
  video.hidden = true;

  try {
    const response = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.video) {
      video.src = data.video;
      video.hidden = false;
      video.load();
      video.play();
      status.innerText = "✅ Video ready!";
    } else {
      status.innerText = "❌ Video generation failed";
    }

  } catch (error) {
    console.error(error);
    status.innerText = "❌ Error generating video";
  }
}
