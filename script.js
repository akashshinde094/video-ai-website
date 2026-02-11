function generateVideo() {
  const prompt = document.getElementById("prompt").value;
  const status = document.getElementById("status");
  const video = document.getElementById("video");

  if (prompt === "") {
    alert("Prompt enter kara");
    return;
  }

  status.innerText = "⏳ AI video generating...";

  setTimeout(() => {
    status.innerText = "✅ Video ready!";
    video.src = "";
    video.hidden = false;
  }, 3000);
}
