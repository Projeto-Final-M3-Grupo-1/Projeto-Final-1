import { createContext, useState } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import { toast } from "react-toastify";
import api from "../Services/api";

interface IProjectsContext {
    projects: any;
    setProjects: any;
    requestProjects: () => void;
    menu: boolean;
    setMenu: any;
    showModal: boolean;
    setShowModal: any;
    modalHome: boolean;
    setModalHome: React.Dispatch<React.SetStateAction<boolean>>;
    handleMenu: () => void;
    handleModal: () => void;
    handleProjectsToApply: any;
    scrollToTop: () => void;
    render: string;
    setRender: any;
    youRight: boolean;
    handleYouRight: any;
    applyOnProject: any;
    showProject: any;
    setShowProjects: any;
    createProjects: any;
    HandleModalProject: () => void;
    handleNavigate: any;
    requestMyProject: any;
    myProject: any;
    requestOngMyProject: any;
    dataOngMyProject: any;
    requestAddDevOnTask: any;
    requestCompleteTask: any;
    handleManageProject: any;
    deleteTask: any;
    handleCreateTask: any;
    createTask: boolean;
    pendingProject: any;
    setPendingProjects: any;
}

export const ProjectsContext = createContext<IProjectsContext>(
    {} as IProjectsContext
);

interface IProjectChildren {
    children: ReactNode;
}

export const ProjectsProvider = ({ children }: IProjectChildren) => {
    const [projects, setProjects] = useState([] as any);
    const [menu, setMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalHome, setModalHome] = useState(false);
    const [render, setRender] = useState("publications");
    const [youRight, setYouRight] = useState(false);
    const [showProject, setShowProjects] = useState(false);
    const [myProject, setMyProject] = useState([] as any);
    const [dataOngMyProject, setDataOngMyProject] = useState([] as any);
    const [createTask, setCreateTask] = useState(false);
    const [pendingProject, setPendingProjects] = useState([] as any)

    const navigate = useNavigate();

    const handleCreateTask = () => {
        return !createTask ? setCreateTask(true) : setCreateTask(false);
    };

    const handleYouRight = (projectId: any) => {
        localStorage.setItem("projectId", projectId);
        return !youRight ? setYouRight(true) : setYouRight(false);
    };
    const handleProjectsToApply = (destination: any) => {
        return setRender(destination);
    };
    const handleNavigate = (route: string) => {
        return navigate(route);
    };

    const handleMenu = () => {
        return !menu ? setMenu(true) : setMenu(false);
    };
    const handleModal = () => {
        return !showModal ? setShowModal(true) : setShowModal(false);
    };
    

    const HandleModalProject = () => {
        return !showProject ? setShowProjects(true) : setShowProjects(false);
    };
    const applyOnProject = () => {
        const body = {
            projectId: +localStorage.projectId,
        };
        requestApplyOnProject(body);
    };

    const createProjects = (data: any) => {
        data.userId = localStorage.userId;
        data.ongId = localStorage.userId;

        api.post("/projects", data, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then((res) => {
            setShowProjects(false);
            toast.success("Projeto cadastrado com sucesso!");
            setPendingProjects(res.data)
            requestProjects();
        });
    };

    const requestApplyOnProject = (body: any) => {
        api.patch(`/users/${localStorage.userId}`, body, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then((res) => {
            setYouRight(false);
            toast.success(
                "Cadastrado com sucesso no projeto, acesse Meu Projeto para ver os detalhes"
            );
        });
    };

    const requestProjects = () => {
        api.get("/projects").then((res) => {
            return(
                setProjects(res.data),
                setPendingProjects(res.data)
            )
    });
    };

    const requestMyProject = () => {
        api.get(`/projects/${localStorage.projectId}?_embed=tasks`).then(
            (res) => {
                localStorage.setItem("ongId", res.data.ongId);
                setMyProject(res.data);
            }
        );
    };
    const requestOngMyProject = () => {
        api.get(`/users/${localStorage.ongId}`).then((res) =>
            setDataOngMyProject(res.data)
        );
    };
    const requestAddDevOnTask = (id: any) => {
        const body = {
            userId: +localStorage.userId,
        };
        api.patch(`/tasks/${id}`, body, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then((res) => {
            requestMyProject();
            requestOngMyProject();
        });
    };
    const requestCompleteTask = (id: any) => {
        const body = {
            completed: true,
        };
        api.patch(`/tasks/${id}`, body, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then((res) => {
            requestMyProject();
            requestOngMyProject();
            toast.success("Tarefa concluída com sucesso!");
        });
    };

    const handleManageProject = (projectId: any, ongId: any) => {
        localStorage.setItem("projectId", projectId);
        localStorage.setItem("ongId", ongId);

        navigate("/dashboard/manageproject");
    };
    const deleteTask = (id: any) => {
        api.delete(`/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then(() => requestMyProject());
    };

    const scrollToTop = () => {
        scroll.scrollToTop();
    };

    return (
        <ProjectsContext.Provider
            value={{
                scrollToTop,
                requestProjects,
                projects,
                setProjects,
                menu,
                setMenu,
                showModal,
                setShowModal,
                handleMenu,
                handleModal,
                handleNavigate,
                modalHome,
                setModalHome,
                render,
                setRender,
                handleProjectsToApply,
                handleYouRight,
                youRight,
                applyOnProject,
                HandleModalProject,
                createProjects,
                showProject,
                setShowProjects,
                requestMyProject,
                myProject,
                requestOngMyProject,
                dataOngMyProject,
                requestAddDevOnTask,
                requestCompleteTask,
                handleManageProject,
                deleteTask,
                handleCreateTask,
                createTask,
                pendingProject, 
                setPendingProjects,
            }}
        >
            {children}
        </ProjectsContext.Provider>
    );
};
