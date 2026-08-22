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

if (button && recognition) {
  button.addEventListener("click", () => {
    speak("हाँ, मैं Sweety हूँ। बोलिए ❤️");

    setTimeout(() => {
      recognition.start();
    }, 1200);
  });

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();

    if (text.includes("sweety") || text.includes("स्वीटी")) {
      speak("जी, मैं सुन रही हूँ। बताइए ❤️");
    } else {
      speak("आपने कहा: " + text);
    }
  };

  recognition.onerror = () => {
    speak("मुझे आपकी आवाज़ साफ़ सुनाई नहीं दी। फिर से बोलिए।");
  };
}
