// (A) TTS SUPPORTED
if ("speechSynthesis" in window) {
  let synth = window.speechSynthesis;
  synth.cancel();

  var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var newUtt;
    var txt =
      settings && settings.offset !== undefined
        ? utt.text.substring(settings.offset)
        : utt.text;
    if (utt.voice && utt.voice.voiceURI === "native") {
      // Not part of the spec
      newUtt = utt;
      newUtt.text = txt;
      newUtt.addEventListener("end", function () {
        if (speechUtteranceChunker.cancel) {
          speechUtteranceChunker.cancel = false;
        }
        if (callback !== undefined) {
          callback();
        }
      });
    } else {
      var chunkLength = (settings && settings.chunkLength) || 160;
      var pattRegex = new RegExp(
        "^[\\s\\S]{" +
          Math.floor(chunkLength / 2) +
          "," +
          chunkLength +
          "}[.!?,]{1}|^[\\s\\S]{1," +
          chunkLength +
          "}$|^[\\s\\S]{1," +
          chunkLength +
          "} "
      );
      var chunkArr = txt.match(pattRegex);

      if (
        chunkArr == null ||
        chunkArr[0] === undefined ||
        chunkArr[0].length <= 2
      ) {
        //call once all text has been spoken...
        if (callback !== undefined) {
          callback();
        }
        return;
      }
      var chunk = chunkArr[0];
      newUtt = new SpeechSynthesisUtterance(chunk);
      var x;
      for (x in utt) {
        if (utt.hasOwnProperty(x) && x !== "text") {
          newUtt[x] = utt[x];
        }
      }
      newUtt.addEventListener("end", function () {
        if (speechUtteranceChunker.cancel) {
          speechUtteranceChunker.cancel = false;
          return;
        }
        settings.offset = settings.offset || 0;
        settings.offset += chunk.length;
        speechUtteranceChunker(utt, settings, callback);
      });
    }

    if (settings.modifier) {
      settings.modifier(newUtt);
    }
    console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
    //placing the speak invocation inside a callback fixes ordering and onend issues.
    setTimeout(function () {
      speechSynthesis.speak(newUtt);
    }, 0);
  };

  // Changes done by Kishan - 19-12-2022

  window.onload = function () {
    var utterance = new SpeechSynthesisUtterance();

    document.querySelector("#play").addEventListener("click", function () {
      document.querySelector(".audioControls").classList.add("played");
      const containerToRead = document.querySelector(".the_blog_to_read");
      const clonedText = containerToRead.cloneNode(true);

      // remove unwantedDivs before converting it to text
      if (clonedText.querySelector(".addtoany_content_top")) {
        clonedText.removeChild(
          clonedText.querySelector(".addtoany_content_top")
        );
      }
      if (clonedText.querySelector(".addtoany_content_bottom")) {
        clonedText.removeChild(
          clonedText.querySelector(".addtoany_content_bottom")
        );
      }

      var myLongText = clonedText.innerText;

      utterance.text = myLongText;
      var voiceArr = speechSynthesis.getVoices();

      utterance.voice = voiceArr[0];
      speechUtteranceChunker(
        utterance,
        {
          chunkLength: 150,
        },
        function () {
          //some code to execute when done
          console.log("done");
        }
      );
    });

    utterance.onerror = (event) => {
      console.error(
        `An error has occurred with the speech synthesis: ${event.error}`
      );
    };

    document.querySelector("#pause").addEventListener("click", function () {
      document.querySelector(".audioControls").classList.remove("resumed");
      document.querySelector(".audioControls").classList.add("paused");
      synth.pause();
    });

    document.querySelector("#resume").addEventListener("click", function () {
      document.querySelector(".audioControls").classList.remove("paused");
      document.querySelector(".audioControls").classList.add("resumed");

      synth.resume();
    });

    document.querySelector("#stop").addEventListener("click", function () {
      document.querySelector(".audioControls").classList.remove("played");
      document.querySelector(".audioControls").classList.remove("paused");

      speechUtteranceChunker.cancel = true;
      synth.cancel();
    });
  };
}

// (X) TTS NOT SUPPORTED
else {
  alert("Text-to-speech is not supported on your browser!");
}
