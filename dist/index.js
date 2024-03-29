'use strict';

function isPointsEqual(a, b) {
    return a.x === b.x && a.y === b.y;
}
function assertTargetElement(target) {
    if (!target || !(target instanceof HTMLElement) || !target.isConnected) {
        throw new Error('Renderer target element not found');
    }
}
function nextAnimationFrame() {
    return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
        });
    });
}

class AbstractRenderer {
    rendererEvents = {};
    field;
    blocks = [];
    init(field, rendererEvents) {
        this.field = field;
        this.rendererEvents = rendererEvents || {};
    }
    setFieldDisplayState(state) {
        return Promise.resolve();
    }
    setCompletedInfoDisplayState(state) {
        return Promise.resolve();
    }
    findBlockByPoint(point) {
        return this.blocks.find((block) => isPointsEqual(point, block.position));
    }
    findBlockByValue(value) {
        return this.blocks.find((block) => value === block.value);
    }
}

const directionLabelMap = {
    [1 /* MOVE_DIRECTION.UP */]: ' up',
    [3 /* MOVE_DIRECTION.DOWN */]: 'down',
    [4 /* MOVE_DIRECTION.LEFT */]: 'left',
    [2 /* MOVE_DIRECTION.RIGHT */]: 'right',
};
class ConsoleRendererBlock {
    position;
    value;
    constructor(position, value) {
        this.position = position;
        this.value = value;
    }
    getLabel() {
        return this.value !== null
            ? (this.value < 10 ? `  ${this.value}` : ` ${this.value}`)
            : '   ';
    }
    showMoved(direction) {
        const label = directionLabelMap[direction] || 'unknown direction';
        console.log(`Move "${this.value || 'empty'}" block ${label}`);
        return Promise.resolve();
    }
    showBlocked() {
        console.log(`Can't move "${this.value || 'empty'}" block`);
        return Promise.resolve();
    }
}

class ConsoleRenderer extends AbstractRenderer {
    render() {
        const field = this.field;
        if (!field) {
            throw new Error('Field not found');
        }
        const { height, width } = field.size;
        const matrix = field.toMatrix();
        let result = '';
        this.blocks = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const value = matrix[y * width + x];
                const block = new ConsoleRendererBlock({ x, y }, value);
                this.blocks.push(block);
                result += block.getLabel();
            }
            result += '\r\n';
        }
        console.log(result + '\r\n');
        return Promise.resolve();
    }
    async moveBlock(value, direction) {
        const block = this.findBlockByValue(value);
        await block?.showMoved(direction);
    }
    async cantMoveBlock(value) {
        const block = this.findBlockByValue(value);
        if (!block) {
            console.log(`Block "${value}" not found`);
            return;
        }
        await block.showBlocked();
    }
    setFieldDisplayState(state) {
        if (state) {
            console.log(`***************************************
         Game commands:
         
   Start new Game for N-sized field: 
       game.restartGame(N);
       
     Move N number block: 
       game.moveNumber(N);
       
***************************************
`);
        }
        return Promise.resolve();
    }
    setCompletedInfoDisplayState(state) {
        if (state) {
            console.log('Completed!');
        }
        return Promise.resolve();
    }
}

const directionClassMap = {
    [1 /* MOVE_DIRECTION.UP */]: 'move-up',
    [3 /* MOVE_DIRECTION.DOWN */]: 'move-down',
    [4 /* MOVE_DIRECTION.LEFT */]: 'move-left',
    [2 /* MOVE_DIRECTION.RIGHT */]: 'move-right',
};
class DomRendererBlock {
    position;
    value;
    element;
    constructor(position, value) {
        this.position = position;
        this.value = value;
        this.element = document.createElement('span');
        this.element.innerHTML = String(value || '');
        this.element.classList.add("js-block" /* ACTION_CLASS.BLOCK */);
        if (value === null) {
            this.element.classList.add('empty');
        }
        this.element.dataset.x = String(position.x);
        this.element.dataset.y = String(position.y);
    }
    isElement(targetElement) {
        return this.element === targetElement;
    }
    appendTo(targetElement) {
        assertTargetElement(targetElement);
        targetElement.append(this.element);
    }
    showMoved(direction) {
        return new Promise((resolve) => {
            const moveAnimationClass = directionClassMap[direction];
            this.element.classList.add('active');
            if (moveAnimationClass) {
                this.element.classList.add(moveAnimationClass);
            }
            window.setTimeout(() => {
                this.element.classList.remove('active');
                if (moveAnimationClass) {
                    this.element.classList.remove(moveAnimationClass);
                }
                resolve();
            }, 300);
        });
    }
    showBlocked() {
        return new Promise((resolve) => {
            this.element.classList.add('blocked');
            window.setTimeout(() => {
                this.element.classList.remove('blocked');
                resolve();
            }, 300);
        });
    }
}

class DomRenderer extends AbstractRenderer {
    fieldElement;
    completedElement = null;
    constructor(targetElement) {
        super();
        assertTargetElement(targetElement);
        targetElement.innerHTML = '';
        this.fieldElement = document.createElement('div');
        targetElement.append(this.fieldElement);
        this.fieldElement.classList.add('field');
        this.fieldElement.addEventListener('click', this.onMainElementClick.bind(this));
        this.completedElement = document.createElement('div');
        targetElement.append(this.completedElement);
        this.completedElement.innerText = 'Completed!';
        this.completedElement.classList.add('completed');
    }
    async setFieldDisplayState(state) {
        if (state) {
            this.fieldElement.classList.add('shown');
        }
        else {
            this.fieldElement.classList.remove('shown');
        }
        await nextAnimationFrame();
    }
    async setCompletedInfoDisplayState(state) {
        if (state) {
            this.completedElement.classList.add('shown');
        }
        else {
            this.completedElement.classList.remove('shown');
        }
        await nextAnimationFrame();
    }
    async render() {
        const field = this.field;
        if (!field) {
            throw new Error('Field not found');
        }
        assertTargetElement(this.fieldElement);
        const { height, width } = field.size;
        const matrix = field.toMatrix();
        this.fieldElement.innerHTML = '';
        this.blocks = [];
        for (let y = 0; y < height; y++) {
            const lineElement = document.createElement('div');
            this.fieldElement.append(lineElement);
            for (let x = 0; x < width; x++) {
                const value = matrix[y * width + x];
                const block = new DomRendererBlock({ x, y }, value);
                this.blocks.push(block);
                block.appendTo(lineElement);
            }
        }
        await nextAnimationFrame();
    }
    async moveBlock(value, direction) {
        const block = this.findBlockByValue(value);
        await block?.showMoved(direction);
    }
    async cantMoveBlock(value) {
        const block = this.findBlockByValue(value);
        await block?.showBlocked();
    }
    onMainElementClick(e) {
        const target = e.target || e.srcElement;
        if (!target || !(target instanceof HTMLElement)) {
            return;
        }
        if (!target.classList.contains("js-block" /* ACTION_CLASS.BLOCK */)) {
            return;
        }
        const block = this.blocks.find((block) => block.isElement(target));
        if (!block) {
            return;
        }
        this.rendererEvents.requestMoveValue?.(block.value);
    }
}

class Menu {
    targetElement;
    triggerElement;
    isOpened = true;
    constructor(targetElement) {
        this.targetElement = targetElement;
        assertTargetElement(targetElement);
        this.triggerElement = targetElement.querySelector('.js-trigger');
        assertTargetElement(this.triggerElement);
        this.triggerElement.addEventListener('click', this.toggle.bind(this));
    }
    toggle() {
        if (this.isOpened) {
            this.collapse();
        }
        else {
            this.open();
        }
    }
    open() {
        this.targetElement.classList.remove('collapsed');
        this.isOpened = true;
    }
    collapse() {
        this.targetElement.classList.add('collapsed');
        this.isOpened = false;
    }
}

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function swapCells(array, from, to) {
    const result = [...array];
    result[from] = array[to];
    result[to] = array[from];
    return result;
}
function getSwapsCount(matrix) {
    let result = 0;
    for (let i = 0; i < matrix.length - 1; i++) {
        for (let j = i + 1; j < matrix.length; j++) {
            if (matrix[j] !== null
                && matrix[i] !== null
                && matrix[i] > matrix[j]) {
                result++;
            }
        }
    }
    return result;
}
function findEmptyCellRowIndex(matrix) {
    const sideSize = Math.sqrt(matrix.length);
    if (sideSize - Math.trunc(sideSize) > 0) {
        throw new Error('Non square matrix');
    }
    const cellIndex = matrix.findIndex((cell) => cell === null);
    if (cellIndex === -1) {
        return -1;
    }
    return Math.trunc(cellIndex / sideSize);
}
/**
 * - If N is odd, then puzzle instance is solvable if number of inversions is even in the input state.
 *
 * - If N is even, puzzle instance is solvable
 *     a) if the blank is on an even row counting from the bottom (second-last, fourth-last, etc.)
 *   and number of inversions is odd.
 *     b) the blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.)
 *   and number of inversions is even.
 *
 * - For all other cases, the puzzle instance is not solvable.
 */
function checkSolvability(matrix) {
    const swapsCount = getSwapsCount(matrix);
    const sideSize = Math.sqrt(matrix.length);
    // odd
    if (sideSize % 2) {
        return !(swapsCount % 2);
    }
    const emptyCellRowNumber = findEmptyCellRowIndex(matrix);
    if (emptyCellRowNumber < 0) {
        return false;
    }
    if (emptyCellRowNumber % 2) {
        return !(swapsCount % 2);
    }
    return !!(swapsCount % 2);
}
function fixSolvability(matrix) {
    console.log(checkSolvability(matrix));
    if (checkSolvability(matrix)) {
        return matrix;
    }
    // just swap two first nonnull elements to make even inversions number
    let from = undefined;
    let to = undefined;
    for (const [index, cell] of matrix.entries()) {
        if (cell === null) {
            continue;
        }
        if (from === undefined) {
            from = index;
            continue;
        }
        to = index;
        break;
    }
    if (from === undefined || to === undefined) {
        throw new Error('Unsolvable field');
    }
    return swapCells(matrix, from, to);
}
function generateBlendedArray(size) {
    const linearArray = (new Array(size - 1)).fill(null).map((_, index) => index + 1);
    const result = [];
    while (linearArray.length > 0) {
        const value = linearArray.splice(getRandomBetween(0, linearArray.length - 1), 1);
        if (!value.length) {
            break;
        }
        result.push(...value);
    }
    // keep null last one
    result.push(null);
    return result;
}
function isFieldCompleted(matrix) {
    // null is not last
    if (matrix[matrix.length - 1] !== null) {
        return false;
    }
    return matrix.findIndex((cell, index) => {
        // do not check last null element
        if (index + 1 >= matrix.length - 1) {
            return false;
        }
        const next = matrix[index + 1];
        // cell greater than next
        return cell >= next;
    }) === -1;
}

class LinearField {
    width;
    height;
    values = [];
    constructor(width, height) {
        this.width = width;
        this.height = height;
        if (width !== height) {
            throw new Error('Nonsquare fields is not implemented');
        }
        this.values = fixSolvability(generateBlendedArray(width * height));
    }
    get size() {
        return {
            width: this.width,
            height: this.height,
        };
    }
    get isCompleted() {
        return isFieldCompleted(this.toMatrix());
    }
    toMatrix() {
        return [...this.values];
    }
    moveValue(targetValue) {
        let direction = null;
        if (targetValue === null) {
            return direction;
        }
        const valueIndex = this.values.findIndex((value) => value === targetValue);
        const nullIndex = this.values.findIndex((value) => value === null);
        if (valueIndex === -1 || nullIndex === -1) {
            return direction;
        }
        if (nullIndex - valueIndex === -1 && (valueIndex % this.width > 0)) {
            direction = 4 /* MOVE_DIRECTION.LEFT */;
        }
        else if (nullIndex - valueIndex === 1 && (nullIndex % this.width > 0)) {
            direction = 2 /* MOVE_DIRECTION.RIGHT */;
        }
        else if (nullIndex - valueIndex === -this.width) {
            direction = 1 /* MOVE_DIRECTION.UP */;
        }
        else if (nullIndex - valueIndex === this.width) {
            direction = 3 /* MOVE_DIRECTION.DOWN */;
        }
        if (direction !== null) {
            this.values[nullIndex] = targetValue;
            this.values[valueIndex] = null;
            return direction;
        }
        return null;
    }
}

class Game {
    renderers;
    hooks;
    field = null;
    constructor(renderers, hooks) {
        this.renderers = renderers;
        this.hooks = hooks;
    }
    init(size) {
        if (size < 2 || size > 5) {
            throw new Error('Allowed only 2, 3, 4 and 5 sized fields');
        }
        this.field = new LinearField(size, size);
        this.renderers.forEach((renderer) => renderer.init(this.field, {
            requestMoveValue: (value) => this.requestMoveBlock(value),
        }));
        return this;
    }
    start() {
        this.hooks?.beforeStart?.();
        this.renderers.forEach((renderer) => {
            renderer.setCompletedInfoDisplayState(false);
            renderer.setFieldDisplayState(true);
        });
        this.render();
    }
    async requestMoveBlock(value) {
        if (!this.field) {
            throw new Error('Game is not inited');
        }
        if (typeof value !== 'number') {
            throw new Error('Input type must be Number');
        }
        const direction = this.field.moveValue(value);
        if (direction === null) {
            await Promise.allSettled(this.renderers.map((renderer) => renderer.cantMoveBlock(value)));
            return;
        }
        await Promise.allSettled(this.renderers.map((renderer) => renderer.moveBlock(value, direction)));
        await this.render();
        if (this.field.isCompleted) {
            this.displayCompleted();
        }
    }
    async render() {
        await Promise.allSettled(this.renderers.map((renderer) => renderer.render()));
    }
    displayCompleted() {
        this.renderers.forEach((renderer) => {
            renderer.setCompletedInfoDisplayState(true);
            renderer.setFieldDisplayState(false);
        });
        this.hooks?.afterComplete?.();
    }
}

(() => {
    const menu = new Menu(document.getElementById('menu'));
    const game = (new Game([
        new ConsoleRenderer(),
        new DomRenderer(document.getElementById('content')),
    ], {
        beforeStart() {
            menu.collapse();
        },
        afterComplete() {
            menu.open();
        },
    }));
    window.game = {
        restartGame(size = 4) {
            game.init(size).start();
        },
        moveNumber(value) {
            game.requestMoveBlock(value);
        },
    };
})();
