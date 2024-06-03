import { useRef, useEffect, useState, useCallback } from 'preact/hooks';
import cx from 'classnames';

type Square = {
  classNames: string;
};

type Color = {
  h: number;
  s: number;
  l: number;
};

function C(h: number, s: number, l: number): Color {
  return { h, s, l };
}

function hsl(c: Color) {
  return `hsl(${c.h}, ${c.s}%, ${c.l}%)`;
}

const Pinta = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const vehicleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    // const vehicleCanvas = vehicleCanvasRef.current!;
    // const vctx = vehicleCanvas.getContext('2d')!;
    const ctx = canvas.getContext('2d')!;

    const { width, height } = canvasRef.current!.getBoundingClientRect();

    canvas.width = width;
    canvas.height = height;

    // const colors = ['black', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
    const colors = [
      C(0, 0, 0),
      C(0, 100, 50),
      C(30, 100, 50),
      C(60, 100, 50),
      C(90, 100, 50),
      C(120, 100, 50),
      C(150, 100, 50),
      C(180, 100, 50),
      C(210, 100, 50),
      C(240, 100, 50),
      C(270, 100, 50),
      C(300, 100, 50),
      C(330, 100, 50),
    ];
    let color = 0;
    let size = 10;

    const mousePosition = { x: 0, y: 0 };
    type PaintPx = [number, number, number, number];
    const painted: PaintPx[] = [];
    // const lastPoints: PaintPx[] = [];

    function update() {
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineCap = 'round';
      ctx.beginPath();
      if (painted.length) {
        ctx.moveTo(painted[0][0], painted[0][1]);
      }
      for (let i = 1; i < painted.length; i++) {
        const end = painted[i];
        ctx.strokeStyle = hsl(colors[end[2]]);
        ctx.lineWidth = end[3];

        ctx.lineTo(end[0], end[1]);
      }
      ctx.stroke();
    }

    let animationId = 0;
    function animate() {
      // Call update function
      update();

      // Request the next frame
      animationId = requestAnimationFrame(animate);
    }
    animate();

    function handleMouseMove(ev: MouseEvent) {
      mousePosition.x = ev.clientX;
      mousePosition.y = ev.clientY;
      painted.push([mousePosition.x, mousePosition.y, color, size]);
      if (painted.length > 10) {
        painted.shift();
      }
    }

    function handleMouseDown(ev: MouseEvent) {
      ev.stopPropagation();
      ev.preventDefault();
      if (ev.button === 2) {
        color++;
        if (!colors[color]) color = 0;
      } else if (ev.button === 0) {
        color--;
        if (!colors[color]) color = colors.length - 1;
      }
    }

    function handleWheel(ev: WheelEvent) {
      console.log(ev);
      if (ev.deltaY > 0) {
        size++;
      } else if (ev.deltaY < 0 && size >= 3) {
        size--;
      }
    }

    function handleContextMenu(ev: MouseEvent) {
      ev.preventDefault();
    }

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
      {/* <canvas
        class="absolute h-screen w-screen z-30 bg-transparent"
        ref={vehicleCanvasRef}
      ></canvas> */}
      <canvas class="absolute h-screen w-screen z-20 bg-white" ref={canvasRef}></canvas>
      {/* <div i/ */}
    </>
  );
};

export default Pinta;
