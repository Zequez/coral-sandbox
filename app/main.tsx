import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './style.css';
import { render } from 'preact';
import System from './System';

const container = document.getElementById('root');
if (!(container instanceof HTMLElement)) throw 'No root';
render(<System />, container);
