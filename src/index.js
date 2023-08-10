import "./style.scss";

import { taskForm, projectForm } from "./forms";
import { ProjectsController } from "./projects-controller";
import { pageTitle, tasksList, projectsList, navController, toast } from "./ui-controllers";
import { LocalSaves } from "./local-storage";


const localSaves = new LocalSaves();
pageTitle.init();
projectsList.init();
const projectsController = new ProjectsController();
tasksList.init(projectsController.getCurrentProjectTasks());
taskForm.init();
projectForm.init();

navController.init();
toast.init();




