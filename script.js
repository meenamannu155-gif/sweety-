const button = document.getElementById("talkButton");
const status = document.getElementById("status");

let recognition = null;
let isListening = false;
let isSpeaking = false;

function speak(text) {
  if (!("speechSynthesis" in window)) {
    status.innerText = "❌ इस browser में आवाज उपलब्ध नहीं है।";
    return;
  }

  speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "hi-IN";
  speech.rate = 0.95;
  speech.pitch = 1.15;
  speech.volume = 1;

  const voices = speechSynthesis.getVoices();

  const femaleVoice = voices.find(voice =>
    /female|woman|zira|samantha|google hindi|hindi/i.test(
      voice.name + " " + voice.lang
    )
  );

  if (femaleVoice) {
    speech.voice = femaleVoice;
  }

  speech.onstart = function () {
    isSpeaking = true;
  };

  speech.onend = function () {
    isSpeaking = false;
  };

  speech.onerror = function () {
    isSpeaking = false;
  };

  speechSynthesis.speak(speech);
}

function createRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    status.innerText =
      "❌ इस browser में voice recognition उपलब्ध नहीं है।";

    speak(
      "माफ कीजिए, इस browser में voice recognition उपलब्ध नहीं है।"
    );

    return null;
  }

  const rec = new SpeechRecognition();

  rec.lang = "hi-IN";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  return rec;
}

function startSweety() {
  if (isListening) {
    return;
  }

  if (isSpeaking) {
    speechSynthesis.cancel();
    isSpeaking = false;
  }

  recognition = createRecognition();

  if (!recognition) {
    return;
  }

  isListening = true;

  status.innerText = "🎧 Sweety सुन रही है...";

  try {
    recognition.start();
  } catch (error) {
    isListening = false;
    status.innerText = "❌ फिर से कोशिश करें ❤️";
  }

  recognition.onstart = function () {
    isListening = true;
    status.innerText = "🎧 Sweety सुन रही है...";
  };

  recognition.onresult = function (event) {
    const result =
      event.results[0][0].transcript;

    const text = result
      .toLowerCase()
      .trim();

    status.innerText =
      "आपने कहा: " + result;

    handleCommand(text);
  };

  recognition.onerror = function (event) {
    isListening = false;

    console.log(
      "Voice recognition error:",
      event.error
    );

    if (event.error === "not-allowed") {
      status.innerText =
        "❌ Microphone permission दें।";
      return;
    }

    if (event.error === "no-speech") {
      status.innerText =
        "🎤 आवाज नहीं सुनी गई। फिर से दबाएँ।";
      return;
    }

    status.innerText =
      "❌ फिर से कोशिश करें ❤️";
  };

  recognition.onend = function () {
    isListening = false;
  };
}

function handleCommand(text) {

  if (!text) {
    status.innerText =
      "🎤 कुछ बोलिए...";
    return;
  }

  if (
    text.includes("sweety") ||
    text.includes("स्वीटी")
  ) {
    speak(
      "जी, मैं Sweety हूँ। बताइए क्या करना है?"
    );

    return;
  }

  if (
    text.includes("hello") ||
    text.includes("हेलो") ||
    text.includes("नमस्ते") ||
    text.includes("नमस्कार")
  ) {
    speak(
      "नमस्ते ❤️ मैं Sweety हूँ। आप कैसे हैं?"
    );

    return;
  }

  if (
    text.includes("कैसी हो") ||
    text.includes("कैसे हो") ||
    text.includes("how are you")
  ) {
    speak(
      "मैं बिल्कुल ठीक हूँ ❤️ आप बताइए कैसे हैं?"
    );

    return;
  }

  if (
    text.includes("नाम क्या है") ||
    text.includes("तुम्हारा नाम") ||
    text.includes("your name")
  ) {
    speak(
      "मेरा नाम Sweety है ❤️"
    );

    return;
  }

  if (
    text.includes("धन्यवाद") ||
    text.includes("thank you") ||
    text.includes("thanks")
  ) {
    speak(
      "आपका स्वागत है ❤️"
    );

    return;
  }

  if (
    text.includes("समय") ||
    text.includes("time")
  ) {
    const now = new Date();

    const time = now.toLocaleTimeString(
      "hi-IN",
      {
        hour: "numeric",
        minute: "2-digit"
      }
    );

    speak(
      "अभी समय " + time + " है।"
    );

    return;
  }

  if (
    text.includes("बंद हो जाओ") ||
    text.includes("चुप हो जाओ") ||
    text.includes("stop")
  ) {
    speechSynthesis.cancel();

    status.innerText =
      "Sweety शांत है ❤️";

    return;
  }

  speak(
    "जी, मैंने आपकी बात सुनी। अभी मैं इस command को समझ नहीं पाई।"
  );
}

if (button) {
  button.addEventListener(
    "click",
    startSweety
  );
} else {
  console.error(
    "talkButton नहीं मिला।"
  );
}

if (status) {
  status.innerText =
    "Sweety तैयार है ❤️";
}

if ("speechSynthesis" in window) {
  speechSynthesis.onvoiceschanged =
    function () {
      speechSynthesis.getVoices();
    };
}

window.addEventListener(
  "beforeunload",
  function () {
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.log(error);
      }
    }

    speechSynthesis.cancel();
  }
);
