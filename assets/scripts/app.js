class Tooltip { }

class ProjectItem {
  constructor(id, updateProjectListFunc) {
    this.id = id;
    this.updateProjectListFunc = updateProjectListFunc;
    this.moreInfobtnFunc();
    this.switchBtnFunc();
  }

  moreInfobtnFunc() {

  }
  
  switchBtnFunc() {
    const projectItemEl = document.getElementById(this.id);
    const switchBtn = projectItemEl.querySelector("button:last-of-type");
    switchBtn.addEventListener("click", this.updateProjectListFunc);
  }

}

class ProjectList { 
  projects = [];

  constructor(type) {
    this.type = type;

    const prjItems = document.querySelectorAll(`#${type}-projects li`)
    for (const project of prjItems) {
      this.projects.push(new ProjectItem(project.id, this.switchProject.bind(this)))
    }
    console.log(this.projects)
  }

  // we have to call it after the construter created the projects objects
  setSwitchHaandlerFunc(switchHaandlerFunc) {
    this.switchHaandlerFunc = switchHaandlerFunc;
  }

  addProjectToSection() {
    console.log(this)
  }

  switchProject(projectId) {
    // const projectIndex = this.projects.findIndex(p => p.id === projectId)
    // this.projects.splice(projectIndex, 1)
    this.switchHaandlerFunc(this.projects.find(p => p.id === projectId))
    this.projects = this.projects.filter(p => p.id !== projectId)
  }
}

class App {
  // create 2 project lists
  static init() {
    const activeProjectsList = new ProjectList("active");
    const finishedProjectsList = new ProjectList("finished");

    // changing the instance - the "this"
    activeProjectsList.setSwitchHaandlerFunc(finishedProjectsList.addProjectToSection.bind(finishedProjectsList))
    finishedProjectsList.setSwitchHaandlerFunc(activeProjectsList.addProjectToSection.bind(activeProjectsList))
  }
}

App.init();