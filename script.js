const status = document.getElementById("status");

function speak(text) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1.15;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === "hi-IN");

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
        status.innerText = "❌ इस browser में voice recognition उपलब्ध नहीं है।";
        speak("माफ कीजिए, इस browser में voice recognition उपलब्ध नहीं है।");
        return;
    }
reco

    const recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
recognition.onstart = function() {
    status.innerText = "🎧 Mic चालू है, अब बोलिए...";
};

recognition.onspeechstart = function() {
    status.innerText = "🗣️ आवाज़ मिल रही है...";
};
    status.innerText = "🎧 Sweety सुन रही है...";

    recognition.onresult = function(event) {

        const text = event.results[0][0].transcript
            .trim()
            .toLowerCase();

        status.innerText = "आपने कहा: " + text;

        // Sweety को बुलाने पर
        if (
            text.includes("sweety") ||
            text.includes("स्वीटी") ||
            text.includes("sweetie")
        ) {
            speak("जी, मैं Sweety हूँ। बताइए क्या करना है?");
            return;
        }

        // YouTube खोलना
        if (
            text.includes("youtube") ||
            text.includes("यूट्यूब")
        ) {
            speak("जी, YouTube खोल रही हूँ।");

            setTimeout(function() {
                window.location.href = "https://www.youtube.com";
            }, 1200);

            return;
        }

        // Google खोलना
        if (
            text.includes("google") ||
            text.includes("गूगल")
        ) {
            speak("जी, Google खोल रही हूँ।");

            setTimeout(function() {
                window.location.href = "https://www.google.com";
            }, 1200);

            return;
        }

        // WhatsApp खोलना
        if (
            text.includes("whatsapp") ||
            text.includes("व्हाट्सएप")
        ) {
            speak("जी, WhatsApp खोल रही हूँ।");

            setTimeout(function() {
                window.location.href = "https://web.whatsapp.com";
            }, 1200);

            return;
        }

        // Instagram खोलना
        if (
            text.includes("instagram") ||
            text.includes("इंस्टाग्राम")
        ) {
            speak("जी, Instagram खोल रही हूँ।");

            setTimeout(function() {
                window.location.href = "https://www.instagram.com";
            }, 1200);

            return;
        }

        // समय पूछना
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
            status.innerText = "⏰ अभी समय है: " + time;

            return;
        }

        // Greeting
        if (
            text.includes("hello") ||
            text.includes("हेलो") ||
            text.includes("नमस्ते") ||
            text.includes("hi")
        ) {
            speak("नमस्ते ❤️ मैं Sweety हूँ। मैं आपकी मदद के लिए तैयार हूँ।");
            return;
        }

        // Command समझ में न आए
        speak("माफ कीजिए, मैं यह command अभी नहीं समझ पाई।");
        status.innerText = "🤔 Command समझ नहीं आई";
    };

    recognition.onerror = function(event) {
        console.log("Voice error:", event.error);

        status.innerText = "❌ फिर से कोशिश करें ❤️";

        if (event.error === "not-allowed") {
            speak("कृपया microphone की permission दें।");
        }
    };

    recognition.onend = function() {
        console.log("Voice recognition बंद हुआ");
    }

recognition.start();
    
}
