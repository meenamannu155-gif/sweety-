const button = document.getElementById("talkButton");
const status = document.getElementById("status");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;
let isSpeaking = false;
let lastText = "";
let lastTime = 0;

if (!SpeechRecognition) {
  status.innerText = "❌ इस browser में voice recognition support नहीं है।";
} else {
  recognition = new SpeechRecognition();

  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = function () {
    isListening = true;
    status.innerText = "🎧 Sweety सुन रही है...";
  };

  recognition.onend = function () {
    isListening = false;
  };

  recognition.onerror = function (event) {
    isListening = false;
    console.log("Speech error:", event.error);
    status.innerText = "❌ Mic में problem हुई, फिर से दबाएँ ❤️";
  };

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript
      .trim()
      .toLowerCase();

    console.log("आपने कहा:", text);

    const now = Date.now();

    // एक ही आवाज को बार-बार process होने से रोकना
    if (text === lastText && now - lastTime < 3000) {
      return;
    }

    lastText = text;
    lastTime = now;

    status.innerText = "आपने कहा: " + text;

    // Sweety नाम सुनने पर जवाब
    if (
      text.includes("sweety") ||
      text.includes("स्वीटी") ||
      text.includes("sweetie")
    ) {
      speak("जी, मैं Sweety हूँ। बताइए क्या करना है?");
    } else {
      speak("जी, मैंने सुना। आप Sweety बोलकर फिर से कहिए।");
    }
  };
}

function speak(text) {
  if (isSpeaking) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    status.innerText = "❌ आपके browser में आवाज़ की सुविधा नहीं है।";
    return;
  }

  isSpeaking = true;

  window.speechSynthesis.cancel();

  const voiceText = new SpeechSynthesisUtterance(text);

  voiceText.lang = "hi-IN";
  voiceText.rate = 0.95;
  voiceText.pitch = 1.15;
  voiceText.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const hindiVoice = voices.find(function (voice) {
    return voice.lang.toLowerCase().startsWith("hi");
  });

  if (hindiVoice) {
    voiceText.voice = hindiVoice;
  }

  voiceText.onend = function () {
    isSpeaking = false;
    status.innerText = "Sweety तैयार है ❤️";
  };

  voiceText.onerror = function () {
    isSpeaking = false;
    status.innerText = "Sweety तैयार है ❤️";
  };

  window.speechSynthesis.speak(voiceText);
}

// Button दबाने पर microphone शुरू
if (button) {
  button.addEventListener("click", function () {
    if (!recognition) {
      status.innerText = "❌ Voice recognition उपलब्ध नहीं है।";
      return;
    }

    if (isListening) {
      recognition.stop();
      return;
    }

    window.speechSynthesis.cancel();
    isSpeaking = false;

    try {
      recognition.start();
    } catch (error) {
      console.log(error);
    }
  });
}

// Browser की voices load होने दें
window.speechSynthesis.onvoiceschanged = function () {
  window.speechSynthesis.getVoices();
};

status.innerText = "Sweety तैयार है ❤️";
