import { FunctionalComponent, createRef } from 'preact';
import { useEffect } from 'preact/hooks';

const MicrophoneFeed: FunctionalComponent = () => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const audioContextRef = createRef<AudioContext | null>();
  const analyserRef = createRef<AnalyserNode | null>();
  const dataArrayRef = createRef<Uint8Array | null>();
  const requestRef = createRef<number | null>();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    const binsCount = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(binsCount);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    // Define the frequency range you're interested in
    const minFrequency = 20; // Minimum frequency in Hz
    const maxFrequency = 5000; // Maximum frequency in Hz

    // Calculate the corresponding frequency bin indices
    const minBinIndex = Math.floor(minFrequency / (audioContext.sampleRate / analyser.fftSize));
    const maxBinIndex = Math.floor(maxFrequency / (audioContext.sampleRate / analyser.fftSize));

    // Calculate the number of bins in the specified frequency range
    const binsInRange = maxBinIndex - minBinIndex + 1;

    const dataArrayInRange = new Uint8Array(binsInRange);

    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // let translated = 0;
    const draw = () => {
      const { current: analyser } = analyserRef;
      const { current: dataArray } = dataArrayRef;

      requestRef.current = requestAnimationFrame(draw);

      if (!analyser || !dataArray) return;

      analyser.getByteFrequencyData(dataArray);
      dataArrayInRange.set(dataArray.subarray(minBinIndex, maxBinIndex + 1));

      // ctx.fillStyle = 'rgba(0, 0, 0, 1)';

      const dotWidth = canvas.width / binsInRange;
      const dotHeight = 1;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let dotX = 0;
      for (let i = 0; i < binsInRange; i++) {
        const dotOpacity = dataArrayInRange[i] / 255;
        if (dotOpacity > 0.05) {
          // const r = barHeight + 25 * (i / bufferLength);
          // const g = 250 * (i / bufferLength);
          // const b = 50;

          ctx.fillStyle = `rgba(255, 255, 255, ${dotOpacity})`;
          ctx.fillRect(dotX, 0, dotWidth, dotHeight);
        }

        dotX += dotWidth;
      }
      ctx.putImageData(imageData, 0, dotHeight);

      // translated += 1;
      // ctx.translate(0, -1);
    };

    draw();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
      });

    return () => {
      cancelAnimationFrame(requestRef.current!);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={800} class="rounded-md bg-black"></canvas>;
};

export default MicrophoneFeed;
