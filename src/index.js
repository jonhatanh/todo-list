import "./style.scss";

import { taskForm, projectForm } from "./forms";
import { projectsController } from "./projects-controller";
import { pageTitle, tasksList, projectsList, navController, toast, modal } from "./ui-controllers";
import { LocalSaves } from "./local-storage";


const localSaves = new LocalSaves();
pageTitle.init({name: 'Tasks'});
projectsList.init();
projectsController.init();
tasksList.init(projectsController.getCurrentProjectTasks());
taskForm.init();
projectForm.init();

navController.init();
modal.init();
toast.init();




