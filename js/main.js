const roleControl = {
    roles: [
        {
            id: "medic",
            name: "Медик",
            lives: 2,
            flashlight: false,
            foresight: false,
            solution: false,
            treasures: []
        },
        {
            id: "magician",
            name: "Фокусник",
            lives: 1,
            flashlight: false,
            foresight: false,
            solution: true,
            treasures: []
        },
        {
            id: "military",
            name: "Военный",
            lives: 1,
            flashlight: true,
            foresight: false,
            solution: false,
            treasures: []
        },
        {
            id: "officer",
            name: "Офицер",
            lives: 1,
            flashlight: false,
            foresight: true,
            solution: false,
            treasures: []
        },
    ],
    activeRole: null,
    buttons: document.querySelectorAll(".role"),
    addListeners() {
        this.buttons.forEach((button) => {
            button.addEventListener("click", this.setActiveRoleHandler.bind(this));
        });
    },
    setActiveRoleHandler(e) {
        this.activeRole = this.roles[+e.currentTarget.dataset.role];
        healthControl.init();
        loggerControl.addMessage(`Вы выбрали персонаж: ${this.activeRole.name}`)
    },
    foundFlashlight () {
        this.activeRole.flashlight = true
    },
    foundTreasure (treasure) {
        this.activeRole.treasures.push(treasure)
    },
    init() {
        this.addListeners();
    },
};

const levelsState = {
    levels: [
        [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [
                null,
                null, 
                null, 
                { 
                    moves: ["down", "right"], 
                    target: false,
                    open: false, 
                }, 
                { 
                    moves: ["left", "right"], 
                    target: false,
                    open: false, 
                }, 
                { 
                    moves: ["down", "left"], 
                    target: false,
                    open: false, 
                }, 
                null
            ],
            [
                null, 
                null, 
                null, 
                { 
                    moves: ["up", "down"], 
                    target: false,
                    open: false, 
                }, 
                null, 
                { 
                    moves: ["up"], 
                    target: false,
                    open: false, 
                    item: {
                        id: "upstairs", 
                        name: "Подняться наверх", 
                        opened: false, 
                        useItem(){
                            this.opened = true
                            
                            itemControl.createItem(this.id)
                            gameProcess.changeLevel(1)
                            loggerControl.addMessage(`Вы вернулись на первый уровень`)
                            gridControl.updateGrid()
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution) {
                                puzzleControl.createPuzzle(this.useItem.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution) {
                                this.useItem()
                            }
                        }
                    }
                }, 
                null
            ],
            [
                null, 
                { 
                    moves: ["down", "right"], 
                    target: false,
                    open: false, 
                }, 
                { 
                    moves: ["left", "right"], 
                    target: false,
                    open: false, 
                }, 
                { 
                    moves: ["up", "left"], 
                    target: false,
                    open: false, 
                }, 
                null, 
                null, 
                null
            ],
            [
                null, 
                { 
                    moves: ["up", "down"], 
                    target: false,
                    open: false, 
                }, 
                null, 
                null, 
                null, 
                null, 
                null
            ],
            [
                null, 
                { 
                    moves: ["up"], 
                    target: false,
                    open: false, 
                    item: {
                        id: "treasure", 
                        name: "Сокровище", 
                        opened: false, 
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            roleControl.foundTreasure({id: this.id, name: this.name})
                            loggerControl.addMessage(`Вы нашли предмет: Сокровище`)
                            gridControl.updateGrid()
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution) {
                                puzzleControl.createPuzzle(this.useItem.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution) {
                                this.useItem()
                                
                            }
                        }
                    }
                }, 
                null, 
                null, 
                null, 
                null, 
                null
            ],
        ],
        [
            [
                null,
                null,
                null,
                null,
                null,
                null,
                { moves: ["down"], target: true, start: true, open: true},
            ],
            [
                { moves: ["down"], target: false, open: false, end: true },
                null,
                null,
                null,
                null,
                null,
                { 
                    moves: ["down", "up"], 
                    target: false,
                    open: false, 
                },
            ],
            [
                { 
                    moves: ["up", "down"], 
                    target: false, 
                    open: false, 
                    item: {
                        id: "briefcase", 
                        name: "Чемоданчик", 
                        opened: false, 
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            roleControl.foundTreasure({id: this.id, name: this.name})
                            loggerControl.addMessage(`Вы нашли предмет: Чемоданчик`)
                            gridControl.updateGrid()
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution) {
                                puzzleControl.createPuzzle(this.useItem.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution) {
                                this.useItem()
                            }
                        }
                    }  
                },
                null,
                null,
                { 
                    moves: ["down", "right"], 
                    target: false, 
                    open: false,
                    item: {
                        id: "flashlight", 
                        name: "Фонарик", 
                        opened: false, 
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            roleControl.foundFlashlight()
                            loggerControl.addMessage(`Вы нашли предмет: Фонарик`)
                            gridControl.updateGrid()
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution) {
                                puzzleControl.createPuzzle(this.useItem.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution) {
                                this.useItem()
                            }
                        }
                    } 
                },
                { moves: ["left", "right"], target: false, open: false },
                { moves: ["left", "right", "down"], target: false, open: false },
                { moves: ["left", "up"], target: false, open: false },
            ],
            [
                { moves: ["up", "down"], target: false, open: false },
                null,
                null,
                { moves: ["up", "down"], target: false, open: false },
                null,
                {
                    moves: ["up"], target: false, open: false,
                    item: {
                        id: "lightOn", 
                        name: "Включить свет", 
                        opened: false, 
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            gameProcess.lightOn()
                            loggerControl.addMessage(`Вы включили свет на текущем уровне`)
                            gridControl.updateGrid()
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution) {
                                puzzleControl.createPuzzle(this.useItem.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution) {
                                this.useItem()
                            }
                        }
                    }
                },
                null,
            ],
            [
                { moves: ["up", "right"], target: false, open: false },
                { 
                    moves: ["left", "right", "bottom"], 
                    target: false, 
                    open: false,
                    item: {
                        id: "lightOff", 
                        name: "Выключить свет", 
                        opened: false, 
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            gameProcess.lightOff()
                            loggerControl.addMessage(`Вы выключили свет на текущем уровне`)
                            gameProcess.changeLevel(0)
                            loggerControl.addMessage(`Вы провалились в подвал. Найдите путь обратно`)
                            gridControl.updateGrid()
                            if (roleControl.activeRole.flashlight) {
                                loggerControl.addMessage(`Вы использовали способность и включили фонарик`)
                                gameProcess.lightOn()
                                gridControl.updateGrid()
                            }
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution) {
                                puzzleControl.createPuzzle(this.useItem.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution) {
                                this.useItem()
                            }
                        }
                    }
                },
                { 
                    moves: ["left", "right"], 
                    target: false, 
                    open: false,
                },
                { moves: ["left", "up"], target: false, open: false },
                null,
                null,
                null,
            ],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ],
    ],
    activeLevel: 1,
    changeActiveLevel (level) {
        this.activeLevel = level
    },
    setState(newLevels) {
        this.levels = newLevels;
    },
};

const gridControl = {
    wrapper: document.querySelector(".labyrinth-wrapper"),
    state: levelsState,
    createGrid() {
        this.state.levels.forEach((levelItem, levelIndex) => {
            const levelHtml = document.createElement("div");
            levelHtml.classList.add("labyrinth");
            levelIndex === this.state.activeLevel && levelHtml.classList.add("active");
            levelItem.forEach((rowItem) => {
                const rowHtml = document.createElement("div");
                rowHtml.classList.add("labyrinth__row");
                rowItem.forEach((colItem) => {
                    const colHtml = document.createElement("div");
                    colHtml.classList.add("labyrinth__col");
                    colItem && colItem.start && colHtml.classList.add("start");
                    colItem && colItem.end && colHtml.classList.add("end");
                    colItem && colItem.open && colHtml.classList.add("open");
                    colItem && colItem.target && colHtml.classList.add("target");
                    rowHtml.append(colHtml);
                });
                levelHtml.append(rowHtml);
            });
            this.wrapper.append(levelHtml);
        });
        loggerControl.addMessage(`Вы начали игру`)
    },
    updateGrid() {
        this.state.levels.forEach((levelItem, levelIndex)=>{
            this.wrapper.children[levelIndex].setAttribute('class', `labyrinth ${levelIndex === this.state.activeLevel ? 'active' : ''}`)
            if (levelIndex === this.state.activeLevel) {
                levelItem.forEach((rowItem, rowIndex) => {
                    rowItem.forEach((colItem, colIndex) => {
                        colItem && colItem.open && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.add("open");
                        colItem && colItem.open && colItem.item && colItem.item.opened && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.add(colItem.item.id);
                        colItem && !colItem.target && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.remove("target");
                        colItem && colItem.target && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.add("target");
                    });
                });
            }
        })
    },
};

const healthControl = {
    role: roleControl,
    description: [
        "Целехонький",
        "Легкий ушиб",
        "Средняя травма",
        "Тяжелая травма",
        "Сотрясение мозга",
        "Разбит",
    ],
    value: 0,
    storage: document.querySelector(".js-health-state"),
    setDescription () {
        console.log(this.role)
        if (this.role.activeRole.id === "medic") {
            this.description = [...this.description, ...this.description,]
        }
    },
    setHealthState() {
        this.storage.innerHTML = this.description[this.value];
        this.storage.parentElement.setAttribute('class', `health__indicator health__indicator--${this.value}`)
        setTimeout(function() {
            this.storage.parentElement.classList.add('animate')
        }.bind(this), 11)
        loggerControl.addMessage(`Ваше здоровья изменилось до: ${this.description[this.value]}`)
    },
    updateHealthState() {
        this.value++;
        this.setHealthState();
        if (this.value === this.description.length - 1) {
            loggerControl.addMessage(`Вы погибли`)
            gameProcess.gameOver()
        }
    },
    init () {
        this.setDescription()
        this.setHealthState()
    }
};

const navigationControl = {
    movesBtn: document.querySelectorAll(".js-move-btn"),
    inspectionBtn: document.querySelector(".js-inspection-btn"),
    
    addListeners() {
        this.movesBtn.forEach((button) => {
            button.addEventListener("click", function (e) {
                let direction = e.target.dataset.move;
                gameProcess.changeTarget(direction);
                gridControl.updateGrid();
            });
        });
        this.inspectionBtn.addEventListener("click", gameProcess.inspectionTarget.bind(gameProcess));
    },
    init() {
        this.addListeners();
    },
};

const gameProcess = {
    state: levelsState,
    inspectionAttempts: 6,
    finish: false,
    gameOver() {
        this.finish = true
        loggerControl.addMessage(`Конец игры`)
    },
    findTarget (levels) {
        if (this.finish) return
        let foundItem = {}
        levels.forEach((levelItem, levelIndex)=>{
                if (levelIndex === this.state.activeLevel) {
                    levelItem.forEach((rowItem, rowIndex)=>{
                        rowItem.forEach((colItem, colIndex)=>{
                            if (colItem && colItem.target) {
                                foundItem = {
                                    levelIndex,
                                    rowIndex,
                                    colIndex,
                                    colItem}
                            }
                        })
                    })
                }
        })
        return foundItem
    },
    changeTarget(direction) {
        if (this.finish) return
        let newState = [...this.state.levels]
        let {levelIndex, rowIndex, colIndex, colItem} = this.findTarget(newState)
        let loggerScheme = {
            up: "вверх",
            down: "вниз",
            left: "влево",
            right: "вправо"
        }

        if (colItem.moves.includes(direction)) {
            colItem.target = false
            if (direction === "up") {
                newState[levelIndex][rowIndex - 1][colIndex].target = true
                newState[levelIndex][rowIndex - 1][colIndex].open = true
                roleControl.activeRole.foresight && newState[levelIndex][rowIndex - 2][colIndex] && (newState[levelIndex][rowIndex - 2][colIndex].open = true)
                loggerControl.addMessage(`Успешное перемещение ${loggerScheme[direction]}`)
                if (newState[levelIndex][rowIndex - 1][colIndex].end) {
                    loggerControl.addMessage(`Вы нашли конец лабиринта`)
                    this.gameOver()
                    
                }
            } else if (direction === "down") {
                newState[levelIndex][rowIndex + 1][colIndex].target = true
                newState[levelIndex][rowIndex + 1][colIndex].open = true
                roleControl.activeRole.foresight && newState[levelIndex][rowIndex + 2][colIndex] && (newState[levelIndex][rowIndex + 2][colIndex].open = true)
                loggerControl.addMessage(`Успешное перемещение ${loggerScheme[direction]}`)
                if (newState[levelIndex][rowIndex + 1][colIndex].end) {
                    loggerControl.addMessage(`Вы нашли конец лабиринта`)
                    this.gameOver()
                }
            } else if (direction === "left") {
                newState[levelIndex][rowIndex][colIndex - 1].target = true
                newState[levelIndex][rowIndex][colIndex - 1].open = true
                roleControl.activeRole.foresight && newState[levelIndex][rowIndex][colIndex - 2] && (newState[levelIndex][rowIndex][colIndex - 2].open = true)
                loggerControl.addMessage(`Успешное перемещение ${loggerScheme[direction]}`)
                if (newState[levelIndex][rowIndex][colIndex - 1].end) {
                    loggerControl.addMessage(`Вы нашли конец лабиринта`)
                    this.gameOver()
                }
            } else if (direction === "right") {
                newState[levelIndex][rowIndex][colIndex + 1].target = true
                newState[levelIndex][rowIndex][colIndex + 1].open = true
                roleControl.activeRole.foresight && newState[levelIndex][rowIndex][colIndex + 2] && (newState[levelIndex][rowIndex][colIndex + 2].open = true)
                loggerControl.addMessage(`Успешное перемещение ${loggerScheme[direction]}`)
                if (newState[levelIndex][rowIndex][colIndex + 1].end) {
                    loggerControl.addMessage(`Вы нашли конец лабиринта`)
                    this.gameOver()
                }
            }
        } else {
            loggerControl.addMessage(`Неудачное перемещение ${loggerScheme[direction]}`)
            healthControl.updateHealthState();
        }
        this.state.setState(newState);
    },
    changeLevel(level) {
        
        let newState = [...this.state.levels]
        let {rowIndex, colIndex, colItem} = this.findTarget(newState)
        colItem.target = false
        this.state.changeActiveLevel(level)
        newState[this.state.activeLevel][rowIndex][colIndex].target = true
        newState[this.state.activeLevel][rowIndex][colIndex].open = true
        this.state.setState(newState);
        gridControl.updateGrid()

    },
    lightOff () {   
        let newState = [...this.state.levels]
        newState.forEach((levelItem, levelIndex)=>{
            if (levelIndex === this.state.activeLevel) {
                levelItem.forEach((rowItem, rowIndex)=>{
                    rowItem.forEach((colItem, colIndex)=>{
                        if (colItem) {
                            colItem.open = false
                        }
                    })
                })
            }
        })
    },
    lightOn () {
        let newState = [...this.state.levels]
        newState.forEach((levelItem, levelIndex)=>{
            if (levelIndex === this.state.activeLevel) {
                levelItem.forEach((rowItem, rowIndex)=>{
                    rowItem.forEach((colItem, colIndex)=>{
                        if (colItem) {
                            colItem.open = true
                        }
                    })
                })
            }
        })
    },
    inspectionTarget () {
        if (this.finish) return
        if (this.inspectionAttempts === 0) {
            loggerControl.addMessage(`У вас не осталось попыток`)
            return
        }
        let newState = [...this.state.levels]
        let {colItem} = this.findTarget(newState)
        if (colItem.item) {
            colItem.item.openItem()
        }
        this.state.setState(newState);
        this.inspectionAttempts = this.inspectionAttempts - 1
        loggerControl.addMessage(`Вы иследовали комнату. Осталось ${this.inspectionAttempts} попыток`)
    }
};

const slideControl = {
    slides: document.querySelectorAll(".slide"),
    activeSlide: document.querySelector(".slide.active"),
    buttons: document.querySelectorAll(".js-next-slide"),

    addListeners() {
        this.buttons.forEach((button) => {
            button.addEventListener("click", this.switchSlideHandler.bind(this));
        });
    },

    switchSlideHandler(e) {
        this.activeSlide.classList.remove("active");
        this.slides[+e.currentTarget.dataset.nextSlide].classList.add("active");
        this.activeSlide = this.slides[+e.currentTarget.dataset.nextSlide];
    },

    init() {
        this.addListeners();
    },
};



const popupControl = {
    popups: document.querySelectorAll('.popup'),
    buttons: document.querySelectorAll('.js-open-popup'),
    activePopup: null,
    addListeners(){
        this.buttons.forEach((button) => {
            button.addEventListener("click", this.openPopupHandler.bind(this));
        });
        this.popups.forEach((popup)=>{
            popup.querySelector('.popup__close').addEventListener('click', this.closePopupHandler.bind(this))
        })
    },
    openPopupHandler(e) {
        this.openPopup(e.currentTarget.dataset.popup)
    },
    openPopup(typePopup) {
        if (this.activePopup) {
            this.activePopup.classList.remove('open')
            this.activePopup = null
            
        }
        this.popups.forEach((popup)=>{
            if (popup.dataset.popup === typePopup) {
                this.activePopup = popup
                this.activePopup.classList.add('open')
            }
        })
    },
    closePopupHandler() {
        this.activePopup.classList.remove('open')
        this.activePopup = null
        
    },

    init() {
        this.addListeners();
    }
}


const itemControl = {
    item: document.querySelector('.item'),
    popup: popupControl,
    createItem (id) {
        this.popup.openPopup('item')
        this.item.setAttribute('class', `item ${id}`)
    }
}

const puzzleControl = {
    operandFirst: document.querySelector('.js-puzzle-operand-first'),
    operandSecond: document.querySelector('.js-puzzle-operand-second'),
    operator: document.querySelector('.js-puzzle-operator'),
    answer: document.querySelector('.js-puzzle-answer'),
    operandFirstValue: null,
    operandSecondValue: null,
    operators: ['*', '+', '-'],
    operatorValue: null,
    answerValue: null,
    successAnswerCallback: null,
    popup: popupControl,
    checkAnswerHandler (e) {
        if (+e.target.value === this.answerValue) {
                this.successAnswerCallback()
                e.target.value = ''

        }
    },
    checkAnswerListener () {
        this.answer.addEventListener('input', this.checkAnswerHandler.bind(this))
    },
    
    setValues () {
        this.operandFirst.innerHTML = this.operandFirstValue
        this.operandSecond.innerHTML = this.operandSecondValue
        this.operator.innerHTML = this.operatorValue
    }, 
    initValues () {
        this.operandFirstValue = Math.floor(Math.random() * 100)
        this.operandSecondValue = Math.floor(Math.random() * 100)
        this.operatorValue = this.operators[Math.round(Math.random() * (this.operators.length - 1))]
        if (this.operatorValue === "*") {
            this.answerValue = this.operandFirstValue * this.operandSecondValue
        } else if (this.operatorValue === "+") {    
            this.answerValue = this.operandFirstValue + this.operandSecondValue
        } else if (this.operatorValue === "-") {    
            this.answerValue = this.operandFirstValue - this.operandSecondValue
        }
    },
    setSuccessAnswerCallback (callback) {
        this.successAnswerCallback = callback
    },
    createPuzzle (successAnswerCallback) {
        this.checkAnswerListener()
        return (() => { 
            this.initValues()
            this.setValues()
            this.setSuccessAnswerCallback(successAnswerCallback)
            this.popup.openPopup('puzzle')
        }) ()

    }

}

const loggerControl = {
    list: document.querySelector('.logger__list'),
    addMessage(message) {
        let messageItem = document.createElement('div')
        messageItem.classList.add('logger__item')
        messageItem.innerHTML = message
        this.list.prepend(messageItem)
    }

}


document.addEventListener("DOMContentLoaded", function () {
    gridControl.createGrid();
    navigationControl.init();
    slideControl.init();
    roleControl.init();
    popupControl.init();
    
});
