'use strict';

class ConsoleRenderer {
    init() { }
    render(field) {
        const { height, width } = field.size;
        const matrix = field.toMatrix();
        let result = '';
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const value = matrix[y * width + x];
                result += value !== null
                    ? (value < 10 ? `  ${value}` : ` ${value}`)
                    : '   ';
            }
            result += '\r\n';
        }
        console.log(result + '\r\n');
    }
}

class LinearField {
    width;
    height;
    values = [];
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.values = (new Array(width * height)).fill(null);
        for (let i = 0; i < width * height - 1; i++) {
            this.values[i] = i + 1;
        }
    }
    get size() {
        return {
            width: this.width,
            height: this.height,
        };
    }
    toMatrix() {
        return [...this.values];
    }
}

function assertTargetElement(target) {
    if (!target || !(target instanceof HTMLElement) || !target.isConnected) {
        throw new Error('Renderer target element not found');
    }
}
class DomRenderer {
    targetElement;
    rendererEvents = {};
    constructor(targetElement) {
        this.targetElement = targetElement;
    }
    init(rendererEvents) {
        this.rendererEvents = rendererEvents || {};
        assertTargetElement(this.targetElement);
        this.targetElement.addEventListener('click', this.onMainElementClick.bind(this));
    }
    render(field) {
        assertTargetElement(this.targetElement);
        const { height, width } = field.size;
        const matrix = field.toMatrix();
        this.targetElement.innerHTML = '';
        for (let y = 0; y < height; y++) {
            const lineElement = document.createElement('div');
            for (let x = 0; x < width; x++) {
                const value = matrix[y * width + x];
                const block = document.createElement('span');
                block.innerHTML = String(value || '');
                block.classList.add("js-block" /* ACTION_CLASS.BLOCK */);
                block.dataset.x = String(x);
                block.dataset.y = String(y);
                lineElement.append(block);
            }
            this.targetElement.append(lineElement);
        }
    }
    onMainElementClick(e) {
        const target = e.target || e.srcElement;
        if (!target || !(target instanceof HTMLElement)) {
            return;
        }
        if (!target.classList.contains("js-block" /* ACTION_CLASS.BLOCK */)) {
            return;
        }
        if (!target.dataset.x || !target.dataset.y) {
            return;
        }
        this.rendererEvents.moveBlock?.(parseInt(target.dataset.x, 10), parseInt(target.dataset.y, 10));
    }
}

class Game {
    renderers;
    field = new LinearField(4, 4);
    constructor(renderers) {
        this.renderers = renderers;
    }
    init() {
        this.renderers.forEach((renderer) => renderer.init({
            moveBlock: (x, y) => {
                this.moveBlock(x, y);
                this.render();
            },
        }));
        return this;
    }
    start() {
        this.render();
    }
    moveBlock(x, y) {
        console.log(x, y);
    }
    render() {
        this.renderers.forEach((renderer) => renderer.render(this.field));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    (new Game([
        new ConsoleRenderer(),
        new DomRenderer(document.getElementById('field')),
    ])).init().start();
});
