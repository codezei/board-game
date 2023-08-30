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
        this.activeRole = {...this.roles[+e.currentTarget.dataset.role], treasures: []};
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
                    trap: {
                        id: "upstairs", 
                        name: "Подняться наверх", 
                        opened: false, 
                        useTrap () {
                            if (!this.opened) {
                                gameProcess.changeLevel(1)
                                loggerControl.addMessage(`Ваш персонаж выбрался на базовый этаж, где есть свет. Приключения продолжаются.`)
                                // gameProcess.lightOn()

                            }
                            this.opened = true
                        },
                        
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
                        checked: false,
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            roleControl.foundTreasure({id: this.id, name: this.name})
                            loggerControl.addMessage(`Вы что-то нашли: Сокровище`)
                            gridControl.updateGrid()
                            
                        },
                        getChecked() {
                            this.checked = true
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution && !this.checked) {
                                puzzleControl.createPuzzle(this.useItem.bind(this), this.getChecked.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution && !this.checked) {
                                loggerControl.addMessage(`Фокусник использовал свою магию и открыл комнату без головоломки.`)
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
                        checked: false,
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            roleControl.foundTreasure({id: this.id, name: this.name})
                            loggerControl.addMessage(`Вы нашли предмет: Чемоданчик`)
                            gridControl.updateGrid()
                            
                        },
                        getChecked() {
                            this.checked = true
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution && !this.checked) {
                                puzzleControl.createPuzzle(this.useItem.bind(this), this.getChecked.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution && !this.checked) {
                                loggerControl.addMessage(`Фокусник использовал свою магию и открыл комнату без головоломки.`)
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
                        checked: false,
                        useItem(){
                            this.opened = true
                            itemControl.createItem(this.id)
                            roleControl.foundFlashlight()
                            loggerControl.addMessage(`Вы нашли предмет: Фонарик`)
                            gridControl.updateGrid()
                            
                        },
                        getChecked() {
                            this.checked = true
                        },
                        openItem(){
                            if (!this.opened && !roleControl.activeRole.solution && !this.checked) {
                                puzzleControl.createPuzzle(this.useItem.bind(this), this.getChecked.bind(this))
                            } else if (!this.opened && roleControl.activeRole.solution && !this.checked) {
                                loggerControl.addMessage(`Фокусник использовал свою магию и открыл комнату без головоломки.`)
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
                },
                null,
            ],
            [
                { moves: ["up", "right"], target: false, open: false },
                { 
                    moves: ["left", "right", "bottom"], 
                    target: false, 
                    open: false,
                    trap: {
                        id: "lightOff", 
                        name: "Выключить свет", 
                        opened: false, 
                        useTrap () {
                            if (!this.opened) {
                                gameProcess.changeLevel(0)
                                loggerControl.addMessage(`О нет! Вы провалились сквозь гнилые доски в очередной тоннель. Здесь кромешная тьма!`)
                                if (roleControl.activeRole.flashlight) {
                                    if (roleControl.activeRole.id === 'military') {
                                        loggerControl.addMessage(`Ваш персонаж не нашел фонарик и воспользовался ПНВ.`)
                                    } else {
                                        loggerControl.addMessage(`Ваш персонаж испугался, и достал фонарик.`)
                                    }
                                    gameProcess.lightOn()
                                } else {
                                    loggerControl.addMessage(`Налетели летучие мыши и съели персонажа.`)
                                    gameControl.gameOver()
                                }
                            }
                            this.opened = true

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
        
    },
    updateGrid() {
        this.state.levels.forEach((levelItem, levelIndex)=>{
            this.wrapper.children[levelIndex].setAttribute('class', `labyrinth ${levelIndex === this.state.activeLevel ? 'active' : ''}`)
            if (levelIndex === this.state.activeLevel) {
                levelItem.forEach((rowItem, rowIndex) => {
                    rowItem.forEach((colItem, colIndex) => {
                        colItem && colItem.open && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.add("open");
                        colItem && !colItem.open && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.remove("open");
                        colItem && colItem.open && colItem.item && colItem.item.opened && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.add(colItem.item.id);
                        colItem && colItem.open && colItem.item && !colItem.item.opened && this.wrapper.children[this.state.activeLevel].children[rowIndex].children[colIndex].classList.remove(colItem.item.id);
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
        if (this.role.activeRole.id === "medic") {
            this.description = [...this.description, ...this.description,]
        } else {
            this.description = [...this.description]
        }
    },
    setHealthState() {
        this.storage.innerHTML = this.description[this.value];
        this.storage.parentElement.setAttribute('class', `health__indicator health__indicator--${this.value}`)
        setTimeout(function() {
            this.storage.parentElement.classList.add('animate')
        }.bind(this), 1)
        loggerControl.addMessage(`Ваше здоровья установленно до: ${this.description[this.value]}`)

    },
    updateHealthState() {
        this.value++;
        this.setHealthState();
        if (this.value === this.description.length - 1) {
            loggerControl.addMessage(`Вы погибли`)
            gameControl.gameOver()
        } else if (this.value === 5) {
            loggerControl.addMessage(`Медик использовал свою способность и использовал дополнительную жизнь`)
        }
    },
    init () {
        this.value = 0
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
            });
        });
        this.inspectionBtn.addEventListener("click", gameProcess.inspectionTarget.bind(gameProcess));
    },
    init() {
        this.addListeners();
    },
};

const gameControl = {
    btnRestart: document.querySelector('.js-game-restart'),
    finish: false,
    gameStart () {
        gameProcess.init()
        loggerControl.addMessage(`Игра началась!`)
    },
    gameRestart () {
        this.finish = false
        popupControl.closePopupHandler()
        slideControl.setActiveSlide(1)
        this.gameStart()
    },
    gameOver() {
        this.finish = true
        loggerControl.addMessage(`Игра окончена`)
        resultControl.showResult()
        popupControl.openPopup('result')
        
    },
    init() {
        this.btnRestart.addEventListener('click', this.gameRestart.bind(this))
        this.gameStart()
    }
}

const gameProcess = {
    state: levelsState,
    inspectionAttempts: 6,
    finish: gameControl.finish,
    scheme: {
        up: {
            row: -1,
            col: 0,
            logger: "вверх"
        },
        down: {
            row: 1,
            col: 0,
            logger: "вниз"
        },
        left: {
            row: 0,
            col: -1,
            logger: "влево"
        },
        right: {
            row: 0,
            col: 1,
            logger: "вправо"
        }
    },
    findTarget (levels) {
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
    changeOpen () {
        let newState = [...this.state.levels]
        let {levelIndex, rowIndex, colIndex, colItem} = this.findTarget(newState)
        let visibilityRooms = (roleControl.activeRole?.foresight && 2) || 1
        for (let i = 1; i <= visibilityRooms; i++) {
            for (let key in this.scheme) {
                if (newState[levelIndex] && newState[levelIndex][rowIndex + this.scheme[key].row * i] && newState[levelIndex][rowIndex + this.scheme[key].row * i][colIndex + this.scheme[key].col * i]) {
                    newState[levelIndex][rowIndex + this.scheme[key].row * i][colIndex + this.scheme[key].col * i].open = true
                }
            }
        }
        this.state.setState(newState);
        gridControl.updateGrid()
    },
    changeTarget(direction) {
        if (gameControl.finish) return
        let newState = [...this.state.levels]
        let {levelIndex, rowIndex, colIndex, colItem} = this.findTarget(newState)
        if (colItem.moves.includes(direction)) {
            colItem.target = false
            let currentCol = newState[levelIndex][rowIndex + this.scheme[direction].row][colIndex + this.scheme[direction].col]
            if (currentCol) {
                currentCol.target = true
                loggerControl.addMessage(`Успешное перемещение ${this.scheme[direction].logger}`)
                if (currentCol.trap) {
                    currentCol.trap.useTrap()
                }
                if (currentCol.end) {
                    loggerControl.addMessage(`Вы нашли конец лабиринта`)
                    gameControl.gameOver()
                }
            } else {
                loggerControl.addMessage(`Неудачное перемещение ${this.scheme[direction].logger}`)
                healthControl.updateHealthState();
            }
        } else {
            loggerControl.addMessage(`Неверное направление, удар головой о стену!`)
            healthControl.updateHealthState();
        }
        this.state.setState(newState);
        this.changeOpen()

  
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
        this.state.setState(newState);
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
        this.state.setState(newState);
    },
    inspectionTarget () {
        if (gameControl.finish) return
        if (this.inspectionAttempts === 0) {
            loggerControl.addMessage(`У вас не осталось попыток`)
            return
        }
        let newState = [...this.state.levels]
        let {colItem} = this.findTarget(newState)

        if (colItem.item) {
            colItem.item.openItem()
            if (!colItem.item?.checked && !colItem.item.opened) {
                loggerControl.addMessage(`Проводится обыск комнаты`)
            } else if (colItem.item?.checked) {
                loggerControl.addMessage(`Увы. Здесь вы смогли найти только песок и камни`)
            }
        } else {
            loggerControl.addMessage(`Увы. Но здесь ничего нету`)
            
        }
        this.state.setState(newState);
        this.inspectionAttempts = this.inspectionAttempts - 1
        
        // loggerControl.addMessage(`Вы иследовали комнату. Осталось ${this.inspectionAttempts} попыток`)
    },
    init () {
        this.state.changeActiveLevel(1)
        this.inspectionAttempts = 6;
        let newState = [...this.state.levels];
        newState.forEach((levelItem, levelIndex)=>{
            levelItem.forEach((rowItem, rowIndex)=>{
                rowItem.forEach((colItem, colIndex)=>{
                    if (colItem) {
                        colItem.open = false
                        colItem.target = false
                        if (colItem.item) {
                            colItem.item.opened = false
                        }
                        if (colItem.trap) {
                            colItem.trap.opened = false
                        }
                        if (colItem.start) {
                            colItem.target = true
                            colItem.open = true
                        }
                    }

                })
            })
        })
        this.state.setState(newState)
        this.changeOpen()
        
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
    setActiveSlide (activeSlide) {
        this.activeSlide.classList.remove("active");
        this.slides[activeSlide].classList.add("active");
        this.activeSlide = this.slides[activeSlide];
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

const resultControl = {
    list: document.querySelector('.treasures'),
    showResult () {
        
        if (roleControl.activeRole.treasures.length) {
            let container = document.createElement('div')
            container.classList.add('treasures')
            container.innerHTML = "Вы нашли:"
            roleControl.activeRole.treasures.forEach((treasure)=>{
                let treasureItem = document.createElement('div')
                treasureItem.classList.add(treasure.id)
                treasureItem.classList.add('treasure__item')
                treasureItem.innerHTML = treasure.name
                container.append(treasureItem)
            })
            this.list.replaceWith(container)
            this.list = container
        } else {
            this.list.innerHTML = "Вы ничего не нашли"
        }
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
    errorAnswerCallback: null,
    popup: popupControl,
    attempts: null,
    checkAnswerHandler (e) {

        
        if (e.key && e.key === "Enter") {
            if (+e.target.value === this.answerValue) {
                this.successAnswerCallback()
                e.target.value = ''
            } else {
                this.attempts = this.attempts - 1
                loggerControl.addMessage(`Неверній ответ. Осталось попыток: ${this.attempts}`)
            }
        }

        if (+e.target.value === this.answerValue) {
                this.successAnswerCallback()
                e.target.value = ''
        }

        if (this.attempts === 0) {
            this.errorAnswerCallback()
            this.popup.closePopupHandler()
            loggerControl.addMessage(`У вас не осталось попыток на обыск комнаты`)
        }
    },
    checkAnswerListener () {
        this.answer.addEventListener('input', this.checkAnswerHandler.bind(this))
        this.answer.addEventListener('keyup', this.checkAnswerHandler.bind(this))
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
    setErrorAnswerCallback (callback) {
        this.errorAnswerCallback = callback
    },
    createPuzzle (successAnswerCallback, errorAnswerCallback) {

            if (this.attempts === 0) {
                return
            } else {
                this.attempts = 3
            }
            this.initValues()
            this.setValues()
            this.setSuccessAnswerCallback(successAnswerCallback)
            this.setErrorAnswerCallback(errorAnswerCallback)
            this.popup.openPopup('puzzle')
     

    },
    init () {
        this.checkAnswerListener ()
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
    gameControl.init();
    puzzleControl.init()
});
