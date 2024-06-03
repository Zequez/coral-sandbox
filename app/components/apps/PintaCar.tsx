import { useRef, useEffect, useState, useCallback } from 'preact/hooks';
import cx from 'classnames';

type Square = {
  classNames: string;
};

const FRICTION = 0.03;
const BREAK_FRICTION = 0.2;
const MASS = 1;
const MAX_POWER = 0.3;
const COLOR_HUES = [...Array(10)].map((_, i) => (360 * i) / 10);

function maxAcceleration(power: number) {
  return power / MASS - FRICTION;
}

function calculateMaxSpeed(power: number) {
  return Math.sqrt(maxAcceleration(power) / FRICTION);
}

const MAX_SPEED = calculateMaxSpeed(MAX_POWER);

const Pinta = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehicleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [uiSpeed, setUiSpeed] = useState(0);
  const [uiPower, setUiPower] = useState(0);

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

    let keys = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    let prevX = width / 2;
    let prevY = height / 2;
    let x = width / 2;
    let y = height / 2;
    let speed = 0;
    let power = 0;
    let throttleStepUp = 0.001;
    let throttleStepDown = 0.003;
    let throttleCurrent = 0;
    let throttleMaxPower = MAX_POWER;
    let mass = MASS;
    let direction = 0;
    let friction = FRICTION;
    let turnDirection = 0;
    let turningSpeed = 0.1;
    let painting = false;
    let paintColorHue = 0;
    let paintStrokeSize = 10;
    let paintStrokeMinSize = 3;
    let paintStrokeMaxSize = 30;
    let vehicleTrail: [number, number, number, number][] = [];

    function updateUi() {
      setUiSpeed(speed);
      setUiPower(power);
    }

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
        const [px, py, pColorHue] = vehicleTrail[i - 1] || [prevX, prevY, paintColorHue];
        // if (!wasPainting && !PwasPainting) {
        if (Math.abs(px - x) > (width * 2) / 3 || Math.abs(py - y) > (height * 2) / 3) return;
        const disipation = Math.sqrt(i / vehicleTrail.length);
        c.fillStyle = `hsl(${pColorHue}, 70%, 50%, ${disipation * 0.5})`;
        c.arc(x, y, disipation * speed * 1.2, 0, 2 * Math.PI);
        // c.lineTo(x, y);
        // c.stroke();
        c.fill();
        // }
      });
    }

    let tick = 0;
    function update() {
      let breakFriction = 0;
      if (keys.up) {
        throttleCurrent = Math.min(throttleCurrent + throttleStepUp, throttleMaxPower);
      } else if (keys.down) {
        throttleCurrent = Math.max(throttleCurrent - throttleStepDown, 0);
        if (throttleCurrent === 0) {
          breakFriction = BREAK_FRICTION;
        }
      }
      power = throttleCurrent;

      speed += power / mass;
      if (speed > 0) {
        speed -= (friction / mass) * speed + (breakFriction / mass) * speed;
        if (speed < 0) speed = 0;
      }

      // if (speed > speedLimit) speed = speedLimit;

      direction = direction + turnDirection * turningSpeed;
      x = x + Math.cos(direction) * speed;
      y = y + Math.sin(direction) * speed;

      if (x > width) {
        x = 0 + (x - width);
        prevX = x;
      }
      if (x < 0) {
        x = width + x;
        prevX = x;
      }
      if (y > height) {
        y = 0 + (y - height);
        prevY = y;
      }
      if (y < 0) {
        y = height + y;
        prevY = y;
      }

      // Clear the canvas
      vctx.clearRect(0, 0, width, height);

      drawVehicleTrail(vctx);
      drawVehicle(vctx);

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
      vehicleTrail.push([x, y, paintColorHue, speed]);
      vehicleTrail.forEach((_, j) => {
        vehicleTrail[j][3] = vehicleTrail[j][3] * 0.99;
        if (vehicleTrail[j][3] < 1) {
          vehicleTrail.splice(j, 1);
        }
      });

      tick++;
      if (tick % 10 === 0) {
        updateUi();
      }
    }

    function handleKeyDown(ev: KeyboardEvent) {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        let newHueIndex = COLOR_HUES.indexOf(paintColorHue) + 1;
        if (newHueIndex > COLOR_HUES.length - 1) newHueIndex = 0;
        paintColorHue = COLOR_HUES[newHueIndex];
      } else if (ev.code === 'ShiftRight') {
        throttleCurrent = 0;
      } else if (ev.key === 'Backspace') {
      } else if (ev.key === 'ArrowDown') {
        keys.down = true;
      } else if (ev.key === 'ArrowUp') {
        keys.up = true;
      } else if (ev.key === 'ArrowRight') {
        turnDirection = 1;
        keys.right = true;
      } else if (ev.key === 'ArrowLeft') {
        turnDirection = -1;
        keys.left = true;
      } else if (ev.key === ' ') {
        painting = !painting;
      } else if (!isNaN(parseInt(ev.key))) {
        let num = parseInt(ev.key) - 1;
        if (num === -1) num = 9;
        paintColorHue = COLOR_HUES[num];
      } else if (ev.key === '-') {
        paintStrokeSize = Math.max(paintStrokeMinSize, paintStrokeSize - 1);
      } else if (ev.key === '=') {
        paintStrokeSize = Math.min(paintStrokeMaxSize, paintStrokeSize + 1);
      }
    }

    function handleKeyUp(ev: KeyboardEvent) {
      if (ev.key === 'ArrowDown') {
        keys.down = false;
      } else if (ev.key === 'ArrowUp') {
        keys.up = false;
      } else if (ev.key === 'ArrowRight') {
        turnDirection = 0;
        keys.right = false;
      } else if (ev.key === 'ArrowLeft') {
        turnDirection = 0;
        keys.left = false;
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

  const speedPct = uiSpeed / MAX_SPEED;

  return (
    <div class="relative h-screen w-screen">
      <canvas class="absolute w-full h-full z-30 bg-transparent" ref={vehicleCanvasRef}></canvas>
      <canvas class="absolute w-full h-full z-20 bg-black" ref={canvasRef}></canvas>
      <div class="absolute inset-x-0 bottom-0 w-full h-40 z-40">
        {/* <div>Potencia: {uiPower}</div> */}
        <div className="absolute right-4 bottom-4 w-10 h-34 b-2 b-white/50 b-rounded bg-gradient-to-b from-red-500/80 to-white/80">
          <div
            className="absolute bottom-0 right-0 w-full bg-green"
            style={{ height: `${speedPct * 100}%` }}
          ></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Pinta;
