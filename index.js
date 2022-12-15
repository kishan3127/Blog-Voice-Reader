function speak() {
  const text = document.querySelector(".text").innerText;
  console.log(text);
  let utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
window.onload = () => {
  // (A) TTS SUPPORTED
  if ("speechSynthesis" in window) {
    // (B) GET HTML ELEMENTS
    // (C) POPULATE AVAILABLE VOICES
    // (D) SPEAK
    // (X) TTS NOT SUPPORTED
  } else {
    alert("Text-to-speech is not supported on your browser!");
  }
};

$(document).ready(function () {
  // (A) TTS SUPPORTED
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const synth = window.speechSynthesis;
    console.log(synth.getVoices());

    let vmsg = document.getElementById("read-from-here");
    voices = synth.getVoices();

    for (let i = 0; i < voices.length; i++) {
      console.log(voices[i]);
    }
    let msg = new window.SpeechSynthesisUtterance(vmsg.innerText);

    var speak = () => {
      speechSynthesis.speak(msg);
    };

    document.querySelector(".play-button").addEventListener("click", speak);

    document
      .querySelector(".pause-button")
      .addEventListener("click", function () {
        speechSynthesis.pause();
      });

    document
      .querySelector(".resume-button")
      .addEventListener("click", function () {
        window.speechSynthesis.resume();
      });

    document
      .querySelector(".rewind-button")
      .addEventListener("click", function () {
        console.log(window.speechSynthesis, msg);
        // msg.currentTime -= 10;
      });

    document
      .querySelector(".forward-button")
      .addEventListener("click", function () {
        // msg.currentTime += 10;
      });
  }

  // (X) TTS NOT SUPPORTED
  else {
    alert("Text-to-speech is not supported on your browser!");
  }
});
