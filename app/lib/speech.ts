let loadedVoices: SpeechSynthesisVoice[] = [];
speechSynthesis.addEventListener('voiceschanged', () => {
  const voices = speechSynthesis.getVoices();
  if (voices.length) {
    loadedVoices = voices;
  } else throw 'No voices';
});

export async function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    function loadVoices() {
      if (loadedVoices.length) {
        resolve(loadedVoices);
      } else {
        setTimeout(loadVoices, 100);
      }
    }
    loadVoices();
  });
}

const SPEECH_LANG = 'es-AR';
async function getVoice() {
  const voices = await getVoices();
  if (voices.length === 0) throw 'No voices';

  const voice = voices.find((v) => v.lang === SPEECH_LANG);
  if (!voice) throw `Could not find voice for ${SPEECH_LANG}`;
  return voice;
}

function promisifiedUtrrance(utterance: SpeechSynthesisUtterance) {
  return new Promise<void>((resolve) => {
    utterance.onend = () => {
      resolve();
    };
    utterance.onerror = () => {
      resolve();
    };
  });
}

let timeout: NodeJS.Timeout | null = null;
const synth = window.speechSynthesis;
export async function speak(val: string) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  if (synth.speaking || synth.pending) {
    console.log('Speech pending, cancelling, speaking in 250ms');
    synth.cancel();
    timeout = setTimeout(() => {
      speak(val);
    }, 250);
  } else {
    console.log(`Speaking: ${val}`);
    const voice = await getVoice();
    const utterance = new SpeechSynthesisUtterance(val);
    utterance.voice = voice;
    timeout = setTimeout(() => {
      synth.speak(utterance);
    }, 100);

    return promisifiedUtrrance(utterance);
  }
}
