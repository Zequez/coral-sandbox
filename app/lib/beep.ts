export default async function beep(length: number = 60) {
  return new Promise<void>((resolve) => {
    // Create an AudioContext instance
    const AudioContext = window.AudioContext;
    const audioCtx = new AudioContext();

    // Create a gain node to control the volume
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);

    // Create an oscillator node
    const oscillator = audioCtx.createOscillator();
    oscillator.connect(gainNode);

    // Set the oscillator type to "sine" for a simple beep sound
    oscillator.type = 'sine';

    // Set the frequency (pitch) of the beep
    oscillator.frequency.setValueAtTime(2000, audioCtx.currentTime); // 1000 Hz

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after 0.1 seconds (adjust duration as needed)
    setTimeout(function () {
      oscillator.stop();
      resolve();
    }, length);
  });
}

async function interval(v: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, v);
  });
}

export async function beepbeepbeep() {
  await beep(80);
  await interval(120);
  await beep(80);
  await interval(120);
  await beep(160);
}
