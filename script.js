const button = document.getElementById("talkButton");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
}

function speak(text) {
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "hi-IN";
  voice.rate = 0.95;
  voice.pitch = 1.15;

  const voices = speechSynthesis.getVoices();

  const femaleVoice = voices.find(v =>
    /female|woman|zira|heera|google हिन्दी|google hindi/i.test(v.name)
  );

  if (femaleVoice) voice.voice = femaleVoice;

  speechSynthesis.cancel();
  speechSynthesis.speak(voice);
}

async function askSweety(text) {
  try {
    speak("जी, सोच रही हूँ...");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API error");
    }

    speak(data.reply);

  } catch (error) {
    console.error(error);
    speak("माफ़ कीजिए, अभी मेरा AI कनेक्शन काम नहीं कर रहा है।");
  }
}

if (button && recognition) {

  button.addEventListener("click", () => {

    speak("हाँ जी, मैं Sweety हूँ। बोलिए ❤️");

    setTimeout(() => {
      try {
        recognition.start();
      } catch (e) {
        console.log(e);
      }
    }, 1200);

  });

  recognition.onresult = (event) => {

    const text = event.results[0][0].transcript.trim();

    console.log("आपने कहा:", text);

    askSweety(text);
  };

  recognition.onerror = () => {
    speak("मुझे आपकी आवाज़ साफ़ सुनाई नहीं दी। फिर से बोलिए।");
  };

} else {
  console.log("Speech Recognition इस browser में उपलब्ध नहीं है।");
}
