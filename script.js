const button = document.getElementById("talkButton");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = SpeechRecognition
  ? new SpeechRecognition()
  : null;

let isSpeaking = false;
let isListening = false;
let lastText = "";
let lastTime = 0;

if (recognition) {
  recognition.lang = "hi-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
  };

  recognition.onend = () => {
    isListening = false;
  };

  recognition.onerror = (event) => {
    isListening = false;
    console.log("Speech recognition error:", event.error);
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript
      .trim()
      .toLowerCase();

    console.log("आपने कहा:", text);

    // एक ही आवाज़/लाइन को तुरंत दोबारा process नहीं करेगा
    const now = Date.now();

    if (text === lastText && now - lastTime < 3000) {
      return;
    }

    lastText = text;
    lastTime = now;

    handleCommand(text);
  };
}


// ===============================
// SWEETY की आवाज़
// ===============================

function speak(text) {

  // अगर Sweety पहले से बोल रही है तो नई speech शुरू नहीं होगी
  if (isSpeaking) {
    return;
  }

  // पहले से चल रही speech पूरी तरह बंद
  window.speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(text);

  voice.lang = "hi-IN";
  voice.rate = 0.95;
  voice.pitch = 1.05;
  voice.volume = 1;

  isSpeaking = true;

  voice.onend = () => {
    isSpeaking = false;
  };

  voice.onerror = () => {
    isSpeaking = false;
  };

  window.speechSynthesis.speak(voice);
}


// ===============================
// USER COMMAND
// ===============================

function handleCommand(text) {

  // Sweety नाम बोलने पर
  if (
    text.includes("sweety") ||
    text.includes("स्वीटी")
  ) {
    speak("जी, मैं स्वीटी हूँ। बताइए, मैं आपकी क्या मदद करूँ?");
    return;
  }


  // अगर user पूछे "आप कौन हो"
  if (
    text.includes("तुम कौन हो") ||
    text.includes("आप कौन हो") ||
    text.includes("कौन हो")
  ) {
    speak("मैं स्वीटी हूँ। आप मुझसे बात कर सकते हैं।");
    return;
  }


  // अगर user बोले "हैलो"
  if (
    text.includes("हैलो") ||
    text.includes("hello") ||
    text.includes("hi")
  ) {
    speak("हैलो जी ❤️ मैं स्वीटी हूँ।");
    return;
  }


  // अगर user बोले "कैसी हो"
  if (
    text.includes("कैसी हो") ||
    text.includes("कैसे हो")
  ) {
    speak("मैं बिल्कुल ठीक हूँ। आप बताइए?");
    return;
  }


  // अगर command समझ नहीं आई
  speak("जी, मैंने आपकी बात सुनी।");
}


// ===============================
// BUTTON
// ===============================

if (button) {

  button.addEventListener("click", () => {

    // Sweety बोल रही हो तो पहले उसे बंद करें
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      return;
    }

    // अगर recognition उपलब्ध नहीं है
    if (!recognition) {
      speak("माफ कीजिए, आपके browser में speech recognition उपलब्ध नहीं है।");
      return;
    }

    // पहले से listening है तो दोबारा start नहीं करें
    if (isListening) {
      return;
    }

    // पुरानी speech को cancel करें
    window.speechSynthesis.cancel();

    try {
      recognition.start();
    } catch (error) {
      console.log("Recognition start error:", error);
    }
  });

}


// ===============================
// PAGE LOAD
// ===============================

window.addEventListener("load", () => {

  // Browser की पुरानी speech बंद
  window.speechSynthesis.cancel();

  isSpeaking = false;
  isListening = false;
  lastText = "";
  lastTime = 0;

});
