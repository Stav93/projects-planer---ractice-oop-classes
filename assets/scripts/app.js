class Tooltip { }

class ProjectItem {
  constructor(id) {
    this.id = id;
    this.moreInfobtn();
    this.switchBtn();
  }

  switchBtn() {

  }

  moreInfobtn() {
    
  }

}

class ProjectList { 
  projects = [];

  constructor(type) {
    const prjItems = document.querySelectorAll(`#${type}-projects li`)
    for (const project of prjItems) {
      this.projects.push(new ProjectItem(project.id))
    }
    console.log(this.projects)
  }
}

class App {
  // create 2 project lists
  static init() {
    const activeProjectsList = new ProjectList("active");
    const finishedProjectsList = new ProjectList("finished");
  }
}

App.init();