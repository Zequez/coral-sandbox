import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import { render } from 'preact';
import Coral from './Coral';

const container = document.getElementById('root');
if (!(container instanceof HTMLElement)) throw 'No root';
render(<Coral />, container);
