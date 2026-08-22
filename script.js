const button = document.getElementById("talkButton");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = SpeechRecognition ? new SpeechRecognition() : null;
let isSpeaking = false;

if (recognition) {
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
}

function speak(text) {
  if (isSpeaking) return;

  isSpeaking = true;

  // Mic बंद रखो जब Sweety बोल रही हो
  try {
    if (recognition) recognition.stop();
  } catch (e) {}

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

  voice.onend = () => {
    isSpeaking = false;
  };

  speechSynthesis.cancel();
  speechSynthesis.speak(voice);
}

if (button && recognition) {

  button.addEventListener("click", () => {

    // अगर Sweety बोल रही है तो दोबारा mic शुरू मत करो
    if (isSpeaking) return;

    speechSynthesis.cancel();

    try {
      recognition.start();
    } catch (e) {
      console.log("Already listening");
    }
  });

  recognition.onresult = (event) => {

    const text =
      event.results[0][0].transcript
        .toLowerCase()
        .trim();

    console.log("आपने कहा:", text);

    // Sweety नाम सुना
    if (
      text.includes("sweety") ||
      text.includes("स्वीटी") ||
      text.includes("स्विटी")
    ) {

      speak("जी, मैं सुन रही हूँ। बताइए ❤️");

    } else {

      // अब आपकी बात को दोबारा बोलकर loop नहीं बनाएगी
      speak("जी, बताइए। ❤️");
    }
  };

  recognition.onerror = (event) => {

    console.log("Speech error:", event.error);

    // no-speech पर कोई जवाब नहीं
    if (
      event.error === "no-speech" ||
      event.error === "aborted"
    ) {
      return;
    }

    speak("मुझे आपकी आवाज़ साफ़ सुनाई नहीं दी।");
  };
}
