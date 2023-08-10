import "./style.scss";

import { taskForm, projectForm } from "./forms";
import { ProjectsController } from "./projects-controller";
import { tasksList, projectsList, toast } from "./ui-controllers";
import { LocalSaves } from "./local-storage";


const localSaves = new LocalSaves();
const projectsController = new ProjectsController();
tasksList.init(projectsController.getCurrentProjectTasks());
projectsList.init();
taskForm.init();
projectForm.init();

toast.init();




