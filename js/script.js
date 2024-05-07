const windowContainer = document.getElementById("windowContainer");

let heldElement = null;
let windowIndex = 1;

function getId(element) {
    if (element.id) {
        return element.id;
    }
    else {
        return getId(element.parentNode);
    }
}

function setWindowListeners() {
    let titleBars = document.getElementsByClassName("title-bar");
    for (let i = 0; i < titleBars.length; i++) {
        titleBars[i].addEventListener("mousedown", function (event) {
            let win = document.getElementById(getId(event.target).split("-")[0] + "-window");
            heldElement = win;
            win.style.zIndex = ++windowIndex;
        });
    }
}

class osWindow {
    constructor(id) {
        this.id = id;
        this.title = id;

        this.menuOptions = [];

        windowContainer.innerHTML += `
            <div class="window" id="${id}-window" style="transform: translate(50px, 50px);">
                <div class="title-bar" id="${id}-title-bar">
                    <div class="title-text" id="${id}-title-text">
                        <img>
                        <p>${this.title}</p>
                    </div>
                    <nav>
                        <button class="minimize" id="${id}-minimize">_</button>
                        <button class="maximize" id="${id}-maximize">[ ]</button>
                        <button class="close" id="${id}-close">X</button>
                    </nav>
                </div>
                <div class="ribbon">
                    <nav>
                        <button class="ribbon-button">File</button>
                        <button class="ribbon-button">Edit</button>
                        <button class="ribbon-button">Window</button>
                    </nav>
                </div>
                <hr class="body-divider">
                <div class="window-body">
                    <p style="margin: 10px 0px 0px 10px;">Hello, world!</p>
                </div>
            </div>
        `;

        setWindowListeners();
    }
}

class taskbarElement {
    constructor(id) {
        document.getElementById("openTasks").innerHTML += `
            <div class="app-task" id="${id}-taskbar-element">
                <p>${id}</p>
            </div>
        `;
    }
}

class process {
    constructor(id) {
        this.id = id;
        this.window = new osWindow(this.id);
        this.taskbarElement = new taskbarElement(this.id);
    }
}

let notepad = new process("Notepad");
let explorer = new process("Explorer");
document.getElementById("Notepad-window").style.transform = "translate(150px, 150px)";

document.addEventListener("mouseup", () => {
    heldElement = null;
});

document.addEventListener("mousemove", function (event) {
    if (heldElement) {
        let transformValue = heldElement.style.transform || "translate(0px, 0px)";
        let match = transformValue.match(/translate\((-?\d+)px,\s*(-?\d+)px\)/);

        let values = {
            x: match ? parseInt(match[1]) : 0,
            y: match ? parseInt(match[2]) : 0
        };

        values.x += event.movementX;
        values.y += event.movementY;

        heldElement.style.transform = `translate(${values.x}px, ${values.y}px)`;
    }
});
