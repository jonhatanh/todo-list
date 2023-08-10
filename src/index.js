import "./style.scss";

import { taskForm, projectForm } from "./forms";
import { ProjectsController } from "./projects-controller";
import { tasksList, toast } from "./ui-controllers";
import { LocalSaves } from "./local-storage";


const localSaves = new LocalSaves();
const projectsController = new ProjectsController();
tasksList.init(projectsController.getCurrentProjectTasks());
taskForm.init();
projectForm.init();

toast.init();




