const button = document.getElementById("talkButton");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition
  ? new SpeechRecognition()
  : null;

if (recognition) {
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
}

function speak(text, callback) {
  const voice = new SpeechSynthesisUtterance(text);

  voice.lang = "hi-IN";
  voice.rate = 0.95;
  voice.pitch = 1.15;

  const voices = speechSynthesis.getVoices();

  const femaleVoice = voices.find(v =>
    /female|woman|zira|heera|google हिन्दी|google hindi/i.test(v.name)
  );

  if (femaleVoice) {
    voice.voice = femaleVoice;
  }

  speechSynthesis.cancel();

  // Sweety की आवाज खत्म होने के बाद ही mic चालू होगा
  voice.onend = () => {
    if (callback) callback();
  };

  speechSynthesis.speak(voice);
}

if (button && recognition) {

  button.addEventListener("click", () => {

    // पहले Sweety बोलेगी
    speak("हाँ, मैं Sweety हूँ। बोलिए ❤️", () => {

      // आवाज पूरी खत्म होने के बाद ही सुनना शुरू
      setTimeout(() => {
        try {
          recognition.start();
        } catch (e) {
          console.log("Recognition already started");
        }
      }, 300);

    });

  });

  recognition.onresult = (event) => {

    const text =
      event.results[0][0].transcript.toLowerCase().trim();

    console.log("आपने कहा:", text);

    // अगर user ने Sweety कहा
    if (
      text.includes("sweety") ||
      text.includes("स्वीटी") ||
      text.includes("स्वीटी")
    ) {

      speak("जी, मैं सुन रही हूँ। बताइए ❤️");

    } else {

      // सिर्फ एक बार जवाब
      speak("आपने कहा: " + text);

    }
  };

  recognition.onerror = (event) => {

    console.log("Speech error:", event.error);

    // no-speech पर कोई आवाज नहीं ताकि loop न बने
    if (event.error !== "no-speech") {
      speak("मुझे आपकी आवाज़ साफ़ सुनाई नहीं दी।");
    }
  };

}
