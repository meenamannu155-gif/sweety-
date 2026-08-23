const status = document.getElementById("status");

function speak(text) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1.15;

    const voices = window.speechSynthesis.getVoices();

    const hindiVoice =
        voices.find(v => v.lang === "hi-IN") ||
        voices.find(v => v.lang.startsWith("hi"));

    if (hindiVoice) {
        speech.voice = hindiVoice;
    }

    window.speechSynthesis.speak(speech);
}

function startSweety() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        status.innerText =
            "❌ इस browser में voice recognition उपलब्ध नहीं है।";
        speak("माफ कीजिए, इस browser में voice recognition उपलब्ध नहीं है।");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    status.innerText = "🎧 Sweety सुन रही है...";

    recognition.onstart = function () {
        status.innerText = "🎧 Mic चालू है, अब बोलिए...";
    };

    recognition.onspeechstart = function () {
        status.innerText = "🗣️ आवाज़ मिल रही है...";
    };

    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript
            .trim()
            .toLowerCase();

        status.innerText = "आपने कहा: " + text;

        // Sweety
        if (
            text.includes("sweety") ||
            text.includes("स्वीटी") ||
            text.includes("sweetie")
        ) {
            speak("जी ❤️ मैं Sweety हूँ। बताइए क्या करना है?");
            return;
        }

        // YouTube
        if (
            text.includes("youtube") ||
            text.includes("यूट्यूब")
        ) {
            speak("जी, YouTube खोल रही हूँ।");

            setTimeout(function () {
                window.location.href =
                    "https://www.youtube.com";
            }, 1200);

            return;
        }

        // Song
if (
  text.includes("गाना") ||
  text.includes("गाने") ||
  text.includes("song") ||
  text.includes("music")
) {
  let query = text
    .replace("गाना चलाओ", "")
    .replace("गाना चला दो", "")
    .replace("गाना चलाना", "")
    .replace("गाने चलाओ", "")
    .replace("song चलाओ", "")
    .replace("song chalao", "")
    .replace("music चलाओ", "")
    .replace("music chalao", "")
    .replace("गाना", "")
    .replace("song", "")
    .replace("music", "")
    .trim();

  if (!query) {
    query = "music";
  }

  speak("जी, " + query + " का गाना खोज रही हूँ");
   
setTimeout(function () {
    const youtubeUrl =
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(query);

    speak("जी, " + query + " का गाना YouTube पर खोल रही हूँ");

    window.location.href = youtubeUrl;
}, 1200);

return;
}
        // Google Search
if (
  text.includes("google") ||
  text.includes("गूगल") ||
  text.includes("सर्च") ||
  text.includes("search") ||
  text.includes("खोजो") ||
  text.includes("खोज") ||
  text.includes("ढूँढो")
) {
  let query = text
    .replace("google पर", "")
    .replace("google में", "")
    .replace("google", "")
    .replace("गूगल पर", "")
    .replace("गूगल में", "")
    .replace("गूगल", "")
    .replace("search करो", "")
    .replace("search कर", "")
    .replace("सर्च करो", "")
    .replace("सर्च कर", "")
    .replace("खोजो", "")
    .replace("खोज", "")
    .replace("ढूँढो", "")
    .trim();

  if (!query) {
    speak("जी, Google पर क्या search करना है?");
    return;
  }

  speak("जी, Google पर " + query + " search कर रही हूँ");

  setTimeout(function () {
    window.location.href =
      "https://www.google.com/search?q=" +
      encodeURIComponent(query);
  }, 1200);

  return;
}
        // WhatsApp
        if (
            text.includes("whatsapp") ||
            text.includes("व्हाट्सएप")
        ) {
            speak("जी, WhatsApp खोल रही हूँ।");

            setTimeout(function () {
                window.location.href =
                    "https://web.whatsapp.com";
            }, 1200);

            return;
        }

        // Instagram
        if (
            text.includes("instagram") ||
            text.includes("इंस्टाग्राम")
        ) {
            speak("जी, Instagram खोल रही हूँ।");

            setTimeout(function () {
                window.location.href =
                    "https://www.instagram.com";
            }, 1200);

            return;
        }

        // Time
        if (
            text.includes("time") ||
            text.includes("टाइम") ||
            text.includes("समय")
        ) {
            const now = new Date();

            const time = now.toLocaleTimeString(
                "hi-IN",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

            speak("अभी समय है " + time);

            status.innerText =
                "⏰ अभी समय है: " + time;

            return;
        }

        // Greeting
        if (
            text.includes("hello") ||
            text.includes("हेलो") ||
            text.includes("नमस्ते") ||
            text === "hi"
        ) {
            speak(
                "नमस्ते ❤️ मैं Sweety हूँ। मैं आपकी मदद के लिए तैयार हूँ।"
            );
            return;
        }

        speak(
            "माफ कीजिए, मैं यह command अभी नहीं समझ पाई।"
        );

        status.innerText =
            "🤔 Command समझ नहीं आई";
    };

    recognition.onerror = function (event) {

        console.log("Voice error:", event.error);

        status.innerText =
            "❌ Voice error: " + event.error;

        if (event.error === "not-allowed") {
            speak(
                "कृपया microphone की permission दें।"
            );
        }

        if (event.error === "no-speech") {
            status.innerText =
                "🎤 कोई आवाज़ नहीं मिली, फिर से बोलिए।";
        }
    };

    recognition.onend = function () {
        console.log("Voice recognition बंद हुआ");
    };

    try {
        recognition.start();
    } catch (error) {
        console.log(error);
    }
}
