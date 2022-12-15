window.onload = () => {
  // (A) TTS SUPPORTED
  if ("speechSynthesis" in window) {
    // (B) GET HTML ELEMENTS
    let demo = document.getElementById("demo"),
      vlist = document.getElementById("demo-voice"),
      vvol = document.getElementById("demo-vol"),
      vpitch = document.getElementById("demo-pitch"),
      vrate = document.getElementById("demo-rate"),
      vmsg = document.getElementById("read-from-here"),
      vgo = document.getElementById("demo-go");

    // (C) POPULATE AVAILABLE VOICES
    var voices = () => {
      window.speechSynthesis.getVoices().forEach((v, i) => {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = v.name;
        vlist.appendChild(opt);
      });
    };

    voices();

    // window.speechSynthesis.onvoiceschanged = voices;
    window.speechSynthesis.cancel();
    // (D) SPEAK
    var speak = () => {
      let msg = new window.SpeechSynthesisUtterance();
      var voice = window.speechSynthesis.getVoices().find((v, i) => {
        if (v.name == "English United Kingdom") {
          alert(v?.name);
        }
      });

      // msg.voice = window.speechSynthesis.getVoices()[88];
      // msg.voice = voice;
      msg.text = vmsg.innerText;
      window.speechSynthesis.speak(msg);
      const node = document.createElement("li");

      // Create a text node:
      const textnode = document.createTextNode(msg.voice.voiceURI);

      // Append the text node to the "li" node:
      node.appendChild(textnode);

      document.querySelector(".list-of-voices").appendChild(node);

      return false;
    };

    // (E) ENABLE FORM
    demo.onsubmit = speak;
    vlist.disabled = false;
    vvol.disabled = false;
    vpitch.disabled = false;
    vrate.disabled = false;
    vmsg.disabled = false;
    vgo.disabled = false;

    document
      .querySelector(".play-button")
      .addEventListener("click", function () {
        alert();
        speak();
      });
    document
      .querySelector(".pause-button")
      .addEventListener("click", function () {
        window.speechSynthesis.pause();
      });
    document
      .querySelector(".resume-button")
      .addEventListener("click", function () {
        window.speechSynthesis.resume();
      });
    document
      .querySelector(".rewind-button")
      .addEventListener("click", function () {
        msg.currentTime -= 10;
      });
    document
      .querySelector(".forward-button")
      .addEventListener("click", function () {
        msg.currentTime += 10;
      });
  }

  // (X) TTS NOT SUPPORTED
  else {
    alert("Text-to-speech is not supported on your browser!");
  }
};
