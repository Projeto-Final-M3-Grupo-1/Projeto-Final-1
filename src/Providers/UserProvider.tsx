import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { ProjectsContext } from "./ProjectsProvider";

interface IUserContext {
	onSubmitLogin: any;
	onSubmitRegister: any;
	onSubmitOng: any;
	renderPublications: () => void;
	user: any;
	setUser: any;
	publications: [];
	onSubmitTech: any;
	handleCreateTech: any;
	createTech: boolean;
	requestTechs: any;
	techs: any;
	requestDeleteTech: any;
	onSubmitEditPerfil: any;
	openPerfil: boolean;
	handlePerfil: any;
	setOpenPerfil: any;
	newNotice: any;
}
interface IUserChildren {
	children: ReactNode;
}

interface iNotice {
	title: string;
	description: string;
	site?: string;
	img?: string;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserProvider = ({ children }: IUserChildren) => {

    const { setDataUser } = useContext(AuthContext);
    const [createTech, setCreateTech] = useState<any>(false);
    const [techs, setTechs] = useState([]);
    const [user, setUser] = useState<any>({});
    const [token, setToken] = useState<any>({});
    const [email, setEmail] = useState<any>({});
    const [openPerfil, setOpenPerfil] = useState(false);
    const [publications, setPublications] = useState<any>({});
    const { setShowModal } = useContext(ProjectsContext);

    const navigate = useNavigate();
    const handleCreateTech = () => {
        return !createTech ? setCreateTech(true) : setCreateTech(false);
    };
    const handlePerfil = () => {
        return !openPerfil ? setOpenPerfil(true) : setOpenPerfil(false);
    };
    
    const newNotice = (notice: iNotice) => {
		  const userId = localStorage.userId;

		const newNotice = {
			...notice,
			userId,
		};

		const headers = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.token}`,
			},
		};
		try {
			api.post("/notices", newNotice, headers);
			toast.success("Noticia criada com sucesso!");

			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch (error) {
			console.log(error);
		}
	};

    const onSubmitLogin = async (data: any) => {
        await api
            .post("/login", data)
            .then((res) => {
                navigate("/dashboard");
                toast.success("Login realizado com sucesso");
                setUser(res.data.user);
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("userId", res.data.user.id);
            })
            .catch(() => toast.error("Email ou senha invalidos"));
    };
    const onSubmitTech = async (data: any) => {
        data.userId = Number(localStorage.userId);
        requestCreateTech(data);
    };
    const onSubmitRegister = (data: any) => {
        data.typeUser = "dev";
        api.post("/registerdev", data)
            .then(() => {
                navigate("/home");
                toast.success("Cadastro realizado com sucesso!");
            })
            .catch(() => toast.error("Cadastro não realizado"));
    };

    const onSubmitOng = (data: any) => {
        data.typeUser = "ong";
        api.post("/registerong", data)

            .then(() => {
                navigate("/home");
                toast.success("Cadastro realizado com sucesso!");
            })
            .catch(() => toast.error("Cadastro não realizado"));
    };

    const onSubmitEditPerfil = (data: any) => {
        requestEditeTech(data);
    };

    const requestTechs = () => {
        api.get("/techs", {
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        })
            .then((res) => setTechs(res.data))
            .catch((res) => console.log(res));
    };
    const requestCreateTech = (data: any) => {
        api.post("/techs", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.token}`,
            },
        })
            .then(() => {
                setCreateTech(false);
                requestTechs();
            })
            .catch((err) => console.log(err));
    };
    const requestDeleteTech = (id: any) => {
        api.delete(`/techs/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then(() => requestTechs());
    };
    const requestEditeTech = (data: any) => {
        api.patch(`/users/${localStorage.userId}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.token}`,
            },
        })
            .then((res) => {
                console.log(res.data);
                setDataUser(res);
            })
            .catch((err) => console.log(err));
    };

    const renderPublications = () => {
        api.get("/notices").then((resp) => setPublications(resp.data));
    };

    return (
        <UserContext.Provider
            value={{
                onSubmitLogin,
                onSubmitRegister,
                onSubmitOng,
                user,
                setUser,
                publications,
                renderPublications,
                onSubmitTech,
                handleCreateTech,
                createTech,
                requestTechs,
                techs,
                requestDeleteTech,
                onSubmitEditPerfil,
                openPerfil,
                handlePerfil,
                setOpenPerfil,
                newNotice,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
