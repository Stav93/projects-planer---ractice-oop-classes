class DOMHelper {
  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
    // jumps to that element
    // element.scrollIntoView();
    // controlling the scrolling
    // the default is "auto"
    // safari doesnt support that feture
    element.scrollIntoView({behavior: "smooth"});
  }

  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
}

class BaseClass {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  show() {
    this.hostElement.insertAdjacentElement(this.insertBefore ? "afterebegin" : "beforeend", this.element)
    // document.body.append(this.element);
  }
  remove() {
    if (this.element) {
       this.element.remove();
    }
  }
}

class Tooltip extends BaseClass{
  // usuing an arrow function means the function is created every time when new instance is created, but the "this" always reffers to the current class so there is no need to add bind with "this" in the "show" method.

  constructor(closeNotifierFunc, tooltipText, hostElementId) {
    // the defaults argument are actually "null", it's good for this situation
    super(hostElementId);
    this.closeNotifier = closeNotifierFunc;
    this.text = tooltipText;
    this.create();
  }

  create() {
    const tooltipEl = document.createElement("div");
    tooltipEl.className = "card";
    tooltipEl.textContent = this.text;
    // console.log(this.hostElement.getBoundingClientRect())

    const hostElementPosLeft = this.hostElement.offsetLeft;
    const hostElementPosTop = this.hostElement.offsetTop;
    const hostElHeight = this.hostElement.clientHeight;
    // offsetHeight will include the borders
    const parentElementScrolling = this.hostElement.parentElement.scrollTop

    const x = hostElementPosLeft + 16;
    const y = hostElementPosTop + hostElHeight -parentElementScrolling -10;
    
    tooltipEl.style.position = "absolute";
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";


    tooltipEl.addEventListener("click", this.closeTooltip);
    this.element = tooltipEl;
  }

  closeTooltip = () => {
    this.remove();
    // this.removeTooltipHandler();
    this.closeNotifier();
  };

   /* 
  show() {
    const tooltipEl = document.createElement("div");
    tooltipEl.className = "card";
    tooltipEl.textContent = "test";
    tooltipEl.addEventListener("click", this.closeTooltip);
    this.element = tooltipEl;
    document.body.append(tooltipEl);
  }
  removeTooltipHandler() {
    this.element.remove();
    //this.element.parentElement.removeChild(this.element); 
  }
  */
}

class ProjectItem {
  hasActiveTooptip = false;

  constructor(id, updateProjectListFunc) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListFunc;
    this.moreInfobtnFunc();
    this.switchBtnFunc();
  }

  showMoreInfoHandler() {
    if (this.hasActiveTooptip) {
      return;
    }
    const projectElement = document.getElementById(this.id)
    const tooltipText = projectElement.dataset.extraInfo;
    const tooltip = new Tooltip(() => this.hasActiveTooptip = false, tooltipText, this.id);
    tooltip.show();
    this.hasActiveTooptip = true;
  }
 

  moreInfobtnFunc() {
    const projectItemEl = document.getElementById(this.id);
    const moreInfoBtnEl = projectItemEl.querySelector("button:first-of-type");
    moreInfoBtnEl.addEventListener("click", this.showMoreInfoHandler.bind(this));
  }

  switchBtnFunc(type) {
    const projectItemEl = document.getElementById(this.id);
    let switchBtn = projectItemEl.querySelector("button:last-of-type");
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    switchBtn.textContent = type === "active" ? "Finish" : "Activate";
    switchBtn.addEventListener(
      "click",
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }

  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.switchBtnFunc(type);
  }
}

class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;

    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const project of prjItems) {
      this.projects.push(
        new ProjectItem(project.id, this.switchProject.bind(this))
      );
    }
    console.log(this.projects);
  }

  // we have to call it after the construter created the projects objects
  setSwitchHaandlerFunc(switchHaandlerFunc) {
    this.switchHaandler = switchHaandlerFunc;
  }

  addProjectToSection(project) {
    console.log(project);
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    // const projectIndex = this.projects.findIndex(p => p.id === projectId)
    // this.projects.splice(projectIndex, 1)
    this.switchHaandler(this.projects.find((p) => p.id === projectId));
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }
}

class App {
  // create 2 project lists
  static init() {
    const activeProjectsList = new ProjectList("active");
    const finishedProjectsList = new ProjectList("finished");

    // changing the instance - the "this"
    activeProjectsList.setSwitchHaandlerFunc(
      finishedProjectsList.addProjectToSection.bind(finishedProjectsList)
    );
    finishedProjectsList.setSwitchHaandlerFunc(
      activeProjectsList.addProjectToSection.bind(activeProjectsList)
    );
  }
}

App.init();
