const windowContainer = document.getElementById("windowContainer");
const startMenu = document.getElementById("startMenu");

let mobileLayout = false;
if (window.innerWidth < 500) {
    mobileLayout = true;
}

let processes = {};

let heldElement = null;
let windowIndex = 1;

function getId(element) {
    if (element.id) {
        return element.id;
    }
    else if (element.parentNode) {
        return getId(element.parentNode);
    }
    else {
        return false;
    }
}

function setWindowListeners() {
    let titleBars = document.getElementsByClassName("title-bar");
    for (let i = 0; i < titleBars.length; i++) {
        // Window Dragging
        titleBars[i].addEventListener("mousedown", event => {
            let win = document.getElementById(getId(event.target).split("-")[0] + "-window");
            heldElement = win;
            win.style.zIndex = ++windowIndex;
        });

        // Minimize
        titleBars[i].getElementsByClassName("minimize")[0].addEventListener("click", event => {
            let process = getId(event.target).split("-")[0];
            processes[process].window.minimize();
        });

        // Minimize
        titleBars[i].getElementsByClassName("maximize")[0].addEventListener("click", event => {
            let process = getId(event.target).split("-")[0];
            processes[process].window.maximize();
        });

        // Taskbar App Click
        document.getElementById(titleBars[i].id.split("-")[0] + "-taskbar-element").addEventListener("click", event => {
            let processId = getId(event.target).split("-")[0];
            if (document.getElementById(`${processId}-window`).style.visibility == "hidden") {
                processes[processId].window.show();
            } else {
                processes[processId].window.minimize();
            }
        });

        // Close
        titleBars[i].getElementsByClassName("close")[0].addEventListener("click", event => {
            let process = getId(event.target).split("-")[0];
            processes[process].terminate();
        });
    }
}

class osWindow {
    constructor(id) {
        this.id = id;
        this.title = id;

        this.menuOptions = [];

        windowContainer.innerHTML += `
            <div class="window" id="${id}-window" style="transform: translate(0px, 0px); visibility: unset;">
                <div class="title-bar" id="${id}-title-bar">
                    <div class="title-text" id="${id}-title-text">
                        <img src="../assets/icons/${this.id.toLowerCase().split("_")[0]}.png">
                        <p>${this.title}</p>
                    </div>
                    <nav>
                        <button class="minimize" id="${id}-minimize">
                            <img src="../assets/icons/minimize.png">
                        </button>
                        <button class="maximize" id="${id}-maximize">
                            <img src="../assets/icons/maximize.png">
                        </button>
                        <button class="close" id="${id}-close">
                            <img src="../assets/icons/close.png">
                        </button>
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
                    <p style="margin: 10px 0px 0px 10px;"><span style="font-weight: bold;">TODO:</span> Make Apps :)</p>
                </div>
            </div>
        `;

        this.maximized = true;
        this.maximize();

        setWindowListeners();
    }

    get element() {
        return document.getElementById(`${this.id}-window`);
    }

    minimize() {
        this.element.style.visibility = "hidden";
    }

    show() {
        this.element.style.visibility = "unset";
        this.element.style.zIndex = ++windowIndex;
    }

    maximize() {
        if (!this.maximized) {
            this.element.style.left = "0";
            this.element.style.top = "0";
            this.element.style.transform = "translate(-8px, -8px)";
            this.element.style.width = (window.innerWidth) + "px";
            this.element.style.height = (window.innerHeight - 50) + "px";
            this.maximized = true;
        } else {
            if (mobileLayout) {
                this.element.style.left = "50%";
                this.element.style.top = "50%";
                this.element.style.transform = `translate(-50%, -50%)`;
                this.element.style.width = "90%";
                this.element.style.height = "60%";
            } else {
                this.element.style.left = "25%";
                this.element.style.top = "15%";
                this.element.style.transform = `translate(0, 0)`;
                this.element.style.width = "unset";
                this.element.style.height = "60%";
            }
            this.maximized = false;
        }
    }
}

class taskbarElement {
    constructor(id) {
        if (mobileLayout) {
            document.getElementById("openTasks").innerHTML += `
                <div class="app-task" id="${id}-taskbar-element">
                    <img src="../assets/icons/${id.toLowerCase().split("_")[0]}.png">
                </div>
            `;
        } else {
            document.getElementById("openTasks").innerHTML += `
                <div class="app-task" id="${id}-taskbar-element">
                    <img src="../assets/icons/${id.toLowerCase().split("_")[0]}.png">
                    <p>${id}</p>
                </div>
            `;
        }
    }
}

class process {
    constructor(id) {
        this.id = id;
        this.taskbarElement = new taskbarElement(this.id);
        this.window = new osWindow(this.id);
        processes[this.id] = this;
    }

    terminate() {
        document.getElementById(`${this.id}-window`).remove();
        document.getElementById(`${this.id}-taskbar-element`).remove();
        delete processes[this.id];
    }
}

function startProcess(id) {
    if (!processes[id]) {
        new process(id);
    } else {
        let x = 1;
        while (x <= 256) {
            if (!processes[id + `_${x}`]) {
                new process(id + `_${x}`);
                break;
            }
            x++;
        }
    }
}

function updateIconListeners() {
    let iconElements = document.getElementsByClassName("app-icon");
    for (let i = 0; i < iconElements.length; i++) {
        iconElements[i].addEventListener("click", event => {
            let id = getId(event.target).split("-")[0];
            startProcess(id);
        });
    }
}

class icon {
    constructor(id) {
        this.id = id;

        document.getElementById("desktop").innerHTML += `
            <div class="app-icon" id="${this.id}-icon">
                <img src="../assets/icons/${this.id.toLowerCase()}.png">
                <p>${this.id}</p>
            </div>
        `;

        updateIconListeners();
    }
}

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

class program {
    constructor(id) {
        this.id = id;

        new icon(this.id);

        startMenu.innerHTML += `
            <div class="menu-element" onclick="startProcess('${this.id}'); toggleStartMenu();">
                <img src="../assets/icons/${this.id.toLowerCase()}.png">
                <p>${this.id}</p>
            </div>
        `;
    }
}

const date = new Date();
setInterval(() => {
    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    document.getElementById("timeDisplay").innerHTML = time;
}, 1000);

function toggleStartMenu() {
    if (startMenu.style.visibility == "hidden") {
        startMenu.style.visibility = "unset";
    } else {
        startMenu.style.visibility = "hidden";
    }
}
window.toggleStartMenu = toggleStartMenu;

document.addEventListener("click", event => {
    if (getId(event.target) != "startMenu" && getId(event.target) != "startButton" && startMenu.style.visibility != "hidden")
        toggleStartMenu();
});

new program("Explorer");
new program("Notepad");