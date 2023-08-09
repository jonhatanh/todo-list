import "./style.scss";

import { taskForm } from "./task-form";
import { ProjectsController } from "./projects-controller";
import { tasksList } from "./ui-controllers";
import { LocalSaves } from "./local-storage";


const localSaves = new LocalSaves();
const projectsController = new ProjectsController();
tasksList.init(projectsController.getCurrentProjectTasks());
taskForm.init();




