import { useRef, useEffect, useState, useCallback } from 'preact/hooks';
import cx from 'classnames';

type Square = {
  classNames: string;
};

const Pinta = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehicleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const vehicleCanvas = vehicleCanvasRef.current!;
    const vctx = vehicleCanvas.getContext('2d')!;
    const ctx = canvas.getContext('2d')!;

    let squaresXCount = 20;
    let width: number = 0;
    let height: number = 0;
    let squaresSize: number = 0;
    let squaresYCount: number = 0;
    let squaresYCountFloor: number = 0;
    let squareHeightAdjust: number = 0;

    function recalculateBoundaries() {
      const box = vehicleCanvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas.width = width;
      canvas.height = height;
      vehicleCanvas.width = width;
      vehicleCanvas.height = height;
      squaresSize = width / squaresXCount;
      squaresYCount = height / squaresSize;
      squaresYCountFloor = Math.floor(squaresYCount);
      squareHeightAdjust = ((squaresYCount - squaresYCountFloor) * squaresSize) / squaresYCount;
    }
    recalculateBoundaries();

    let prevX = width / 2;
    let prevY = height / 2;
    let x = width / 2;
    let y = height / 2;
    let accelerating = false;
    let acceleration = 0.08;
    let speed = 0;
    let direction = 0;
    let friction = 0.9;
    let turnDirection = 0;
    let turningSpeed = 0.1;
    let painting = false;
    let paintColorHue = 0;
    let paintStrokeSize = 10;
    let paintStrokeMinSize = 3;
    let paintStrokeMaxSize = 30;
    let speedLimit = 25;
    let vehicleTrail: [number, number, boolean, number][] = [];

    function drawVehicle(c: CanvasRenderingContext2D) {
      c.beginPath();
      c.fillStyle = `hsl(${paintColorHue}, 70%, 50%, 1)`;
      c.strokeStyle = `hsl(${paintColorHue}, 70%, 50%, 1)`;
      c.arc(x, y, 15, 0, 2 * Math.PI);
      c.closePath();
      c.lineWidth = 2;
      if (painting) c.stroke();
      else c.fill();
      c.beginPath();
      c.fillStyle = `hsl(${paintColorHue}, 70%, 50%, 1)`;
      c.arc(x + Math.cos(direction) * 20, y + Math.sin(direction) * 20, 10, 0, 2 * Math.PI);
      c.closePath();
      c.fill();
    }

    function drawVehicleTrail(c: CanvasRenderingContext2D) {
      c.lineWidth = 10;
      vehicleTrail.forEach(([x, y, wasPainting, speed], i) => {
        c.beginPath();
        const [px, py, PwasPainting] = vehicleTrail[i - 1] || [prevX, prevY];
        if (!wasPainting && !PwasPainting) {
          if (Math.abs(px - x) > (width * 2) / 3 || Math.abs(py - y) > (height * 2) / 3) return;
          const disipation = Math.sqrt(i / vehicleTrail.length);
          c.fillStyle = `hsl(0, 70%, 100%, ${disipation})`;
          c.arc(x, y, 10 * disipation * (3 * (speed / speedLimit)), 0, 2 * Math.PI);
          // c.lineTo(x, y);
          // c.stroke();
          c.fill();
        }
      });
    }

    function update() {
      if (accelerating) {
        speed += acceleration;
      } else {
        speed = speed * friction;
      }
      if (speed > speedLimit) speed = speedLimit;
      direction = direction + turnDirection * turningSpeed;
      x = x + Math.cos(direction) * speed;
      y = y + Math.sin(direction) * speed;

      if (x > width) {
        x = 0;
        prevX = x;
      }
      if (x < 0) {
        x = width;
        prevX = x;
      }
      if (y > height) {
        y = 0;
        prevY = y;
      }
      if (y < 0) {
        y = height;
        prevY = y;
      }

      // Clear the canvas
      vctx.clearRect(0, 0, width, height);

      drawVehicle(vctx);
      drawVehicleTrail(vctx);

      ctx.strokeStyle = `hsl(${paintColorHue}, 70%, 50%, 1)`;
      ctx.lineWidth = paintStrokeSize;
      if (painting) {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      prevX = x;
      prevY = y;
      vehicleTrail.push([x, y, painting, speed]);
      vehicleTrail.forEach((_, j) => {
        vehicleTrail[j][3] = vehicleTrail[j][3] * 0.99;
        if (vehicleTrail[j][3] < 1) {
          vehicleTrail.splice(j, 1);
        }
      });
    }

    function handleKeyDown(ev: KeyboardEvent) {
      if (ev.key === 'ArrowDown') {
      } else if (ev.key === 'ArrowUp') {
        accelerating = true;
      } else if (ev.key === 'ArrowRight') {
        turnDirection = 1;
      } else if (ev.key === 'ArrowLeft') {
        turnDirection = -1;
      } else if (ev.key === ' ') {
        painting = !painting;
      } else if (!isNaN(parseInt(ev.key))) {
        let num = parseInt(ev.key) - 1;
        if (num === -1) num = 10;
        paintColorHue = (360 / 11) * num;
        console.log(paintColorHue);
      } else if (ev.key === '-') {
        paintStrokeSize = Math.max(paintStrokeMinSize, paintStrokeSize - 1);
      } else if (ev.key === '=') {
        paintStrokeSize = Math.min(paintStrokeMaxSize, paintStrokeSize + 1);
      }
    }

    function handleKeyUp(ev: KeyboardEvent) {
      if (ev.key === 'ArrowDown') {
      } else if (ev.key === 'ArrowUp') {
        accelerating = false;
      } else if (ev.key === 'ArrowRight') {
        turnDirection = 0;
      } else if (ev.key === 'ArrowLeft') {
        turnDirection = 0;
      } else if (ev.key === ' ') {
        // painting = false;
      }
    }

    let animationId = 0;
    function animate() {
      // Call update function
      update();

      // Request the next frame
      animationId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', recalculateBoundaries);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', recalculateBoundaries);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
      <canvas
        class="absolute h-screen w-screen z-30 bg-transparent"
        ref={vehicleCanvasRef}
      ></canvas>
      <canvas class="absolute h-screen w-screen z-20 bg-black" ref={canvasRef}></canvas>
      {/* <div i/ */}
    </>
  );
};

export default Pinta;
