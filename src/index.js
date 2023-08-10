import "./style.scss";

import { taskForm, projectForm } from "./forms";
import { ProjectsController } from "./projects-controller";
import { tasksList, projectsList, toast } from "./ui-controllers";
import { LocalSaves } from "./local-storage";


const localSaves = new LocalSaves();
projectsList.init();
const projectsController = new ProjectsController();
tasksList.init(projectsController.getCurrentProjectTasks());
taskForm.init();
projectForm.init();

toast.init();




