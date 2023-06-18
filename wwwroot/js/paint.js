/*var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var isDrawing = false;

canvas.addEventListener("mousedown", function (e) {
    isDrawing = true;
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener("mousemove", function (e) {
    if (isDrawing) {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", function (e) {
    isDrawing = false;
});*/

/*const canvas = document.querySelector('#paintCanvas');
const context = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
    if (!isDrawing) return;
    context.strokeStyle = '#000000';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);*/

/*var canvas = new fabric.Canvas('canvas');

var line, isDown;

canvas.on('mouse:down', function (options) {
    isDown = true;
    var pointer = canvas.getPointer(options.e);
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];
    line = new fabric.Line(points, {
        strokeWidth: 5,
        stroke: 'black',
        selectable: false
    });
    canvas.add(line);
});

canvas.on('mouse:move', function (options) {
    if (!isDown) return;
    var pointer = canvas.getPointer(options.e);
    line.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
});

canvas.on('mouse:up', function (options) {
    isDown = false;
});

function saveImage() {
    var imageData = canvas.toDataURL();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/Home/SaveImage');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        alert('Image saved successfully!');
    };
    xhr.send('imageData=' + encodeURIComponent(imageData));
}*/

// create a new fabric canvas object
const canvas = this.__canvas = new fabric.Canvas('canvas');

// initialize the canvas size
canvas.setDimensions({
    width: 800,
    height: 600
});

// add event listeners to the resize buttons
var resizePlusButton = document.getElementById('resize-plus');
var resizeMinusButton = document.getElementById('resize-minus');
resizePlusButton.addEventListener('click', function () {
    canvas.setDimensions({
        width: canvas.getWidth() * 1.1,
        height: canvas.getHeight() * 1.1
    });
});
resizeMinusButton.addEventListener('click', function () {
    canvas.setDimensions({
        width: canvas.getWidth() * 0.9,
        height: canvas.getHeight() * 0.9
    });
});

// add event to resize input
var canvasWidth = document.getElementById('canvas-width');
var canvasHeight = document.getElementById('canvas-height');
canvasWidth.addEventListener('input', function () {
    canvas.setDimensions({
        width: canvasWidth.value,
        height: canvasHeight.value
    });
});
canvasHeight.addEventListener('input', function () {
    canvas.setDimensions({
        width: canvasWidth.value,
        height: canvasHeight.value
    });
});

function stopResize(event) {
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
}

// add an event listener to the save button
var saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', function () {
    // get the canvas data URL
    var dataURL = canvas.toDataURL();

    // create a new anchor element to download the image
    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataURL;
    document.body.appendChild(link);

    // trigger a click event on the anchor to download the image
    link.click();

    // remove the anchor element from the DOM
    document.body.removeChild(link);
});

// add an event listener to the new canvas button
var newButton = document.getElementById('new-button');
newButton.addEventListener('click', function () {
    var fillColor = '#FFFFFF';

    // create a new rect object that fills the canvas
    var rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
        fill: fillColor
    });

    // remove all existing objects from the canvas and add the new rect
    canvas.clear();
    canvas.add(rect);
});

// add an event listener to the brush width
var brushWidth = document.getElementById('brush-width');
brushWidth.addEventListener('input', function () {
    // set the brush width to the selected value
    canvas.freeDrawingBrush.width = parseInt(this.value);
});

// add an event listener to each color in the color box
var colors = document.querySelectorAll('.color-box .color');
for (var i = 0; i < colors.length; i++) {
    var color = colors[i];
    color.addEventListener('click', function () {
        // set the current color to the clicked color
        setCurrentColor(this.style.backgroundColor);
    });
}

// add an event listener to the color picker
var colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('input', function () {
    // set the current color to the selected color
    setCurrentColor(this.value);
});

// function to set the current color and brush color
function setCurrentColor(color) {
    // set the current color display
    document.getElementById('current-color').style.backgroundColor = color;
    // set the brush color
    canvas.freeDrawingBrush.color = color;
}

// add an event for eyedropper
document.getElementById("eye-dropper").addEventListener("click", () => {
    const resultElement = document.getElementById("current-color");

    if (!window.EyeDropper) {
        resultElement.textContent =
            "Your browser does not support the EyeDropper API";
        return;
    }

    const eyeDropper = new EyeDropper();

    eyeDropper
        .open()
        .then((result) => {
            resultElement.style.backgroundColor = result.sRGBHex;
            canvas.freeDrawingBrush.color = result.sRGBHex;
            changeAction('draw');
        })
        .catch((e) => {
            resultElement.textContent = e;
        });
});

canvas.on('mouse:down', function (event) {
    // set the brush width to the selected value
    canvas.freeDrawingBrush.width = parseInt(brushWidth.value);

    // set the brush color to the current color
    canvas.freeDrawingBrush.color = document.getElementById('current-color').style.backgroundColor;
});

changeAction('draw');
function changeAction(target) {
    ['select', 'erase', 'eye-dropper', 'draw', 'spray', 'line', 'eclipse', 'rectangle'].forEach(action => {
        const t = document.getElementById(action);
        t.classList.remove('active');
    });
    if (typeof target === 'string') target = document.getElementById(target);
    target.classList.add('active');
    switch (target.id) {
        case "select":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.isDrawingMode = false;
            break;
        case "erase":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = parseInt(brushWidth.value);
            break;
        case "undo":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.inverted = true;
            canvas.freeDrawingBrush.width = parseInt(brushWidth.value);
            break;
        case "draw":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = parseInt(brushWidth.value);
            canvas.freeDrawingBrush.color = document.getElementById('current-color').style.backgroundColor;
            break;
        case "spray":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = parseInt(brushWidth.value);
            canvas.freeDrawingBrush.color = document.getElementById('current-color').style.backgroundColor;
            break;
        case "line":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.isDrawingMode = false;
            var shapeValue = 'line';
            canvas.on('mouse:down', function (event) {
                onCanvasMouseDown(event, shapeValue);
            });
            break;
        case "eclipse":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.isDrawingMode = false;
            var shapeValue = 'eclipse';
            canvas.on('mouse:down', function (event) {
                onCanvasMouseDown(event, shapeValue);
            });
            break;
        case "rectangle":
            canvas.off('mouse:down');
            canvas.off('mouse:up');
            canvas.isDrawingMode = false;
            var shapeValue = 'rectangle';
            canvas.on('mouse:down', function (event) {
                onCanvasMouseDown(event, shapeValue);
            });
            break;
        default:
            break;
    }
}

function onCanvasMouseDown(event, shapeValue) {
    var selectedShape = shapeValue;
    canvas.isDrawingMode = false;
    // get the mouse coordinates relative to the canvas
    var pointer = canvas.getPointer(event.e);
    var startX = pointer.x;
    var startY = pointer.y;
    var color = document.getElementById('current-color').style.backgroundColor;
    var width = parseInt(brushWidth.value);

    // create a new shape with a transparent fill and a stroke color of black
    var shape = createNewShape(selectedShape, color, width, startX, startY);

    // add the shape to the canvas
    canvas.add(shape);

    // track the mouse movement to update the size of the shape being drawn
    canvas.on('mouse:move', function (event) {
        var pointer = canvas.getPointer(event.e);
        var currentX = pointer.x;
        var currentY = pointer.y;

        // update the size of the shape
        updateShapeSize(shape, selectedShape, startX, startY, currentX, currentY);

        // render the canvas to show the updated shape
        canvas.renderAll();
        });

    // stop tracking the mouse movement when the mouse button is released
        canvas.on('mouse:up', function () {
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        });
}

function createNewShape(selectedShape, color, width, startX, startY) {
    switch (selectedShape) {
        case 'line':
            return new fabric.Line([startX, startY, startX, startY], {
                stroke: color,
                strokeWidth: width
            });
            break;
        case 'eclipse':
            return new fabric.Ellipse({
                left: startX,
                top: startY,
                rx: 0,
                ry: 0,
                fill: 'transparent',
                stroke: color,
                strokeWidth: width
            });
            break;
        case 'rectangle':
            return new fabric.Rect({
                left: startX,
                top: startY,
                width: 0,
                height: 0,
                fill: 'transparent',
                stroke: color,
                strokeWidth: width
            });
            break;
        default:
            return null;
    }
}

function updateShapeSize(shape, selectedShape, startX, startY, currentX, currentY) {
    switch (selectedShape) {
        case 'line':
            shape.set({
                x2: currentX,
                y2: currentY
            });
            break;
        case 'eclipse':
            shape.set({
                rx: Math.abs(currentX - startX) / 2,
                ry: Math.abs(currentY - startY) / 2,
                originX: startX < currentX ? 'left' : 'right',
                originY: startY < currentY ? 'top' : 'bottom'
            });
            break;
        case 'rectangle':
            shape.set({
                width: currentX - startX,
                height: currentY - startY
            });
            break;
        default:
            break;
    }
}