import Visualizer from '../objects/Visualizer';

export const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvasElement.getContext('2d');
export const TEXT_HEIGHT = ctx.measureText('M').width;

new Visualizer();
