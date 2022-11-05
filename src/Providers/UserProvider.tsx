import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import { toast } from "react-toastify";
import { ProjectsContext } from "./ProjectsProvider";

interface IUserContext {
    onSubmitLogin: any;
    onSubmitRegister: any;
    onSubmitOng: any;
    onSubmitTech: any;
    user: any;
    setUser: any;
    handleCreateTech: any;
    createTech: boolean;
}
interface IUserChildren {
    children: ReactNode;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserProvider = ({ children }: IUserChildren) => {
    const [user, setUser] = useState<any>({});
    const [createTech, setCreateTech] = useState<any>(false);

    const navigate = useNavigate();
    const handleCreateTech = () => {
        return !createTech ? setCreateTech(true) : setCreateTech(false);
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
        console.log(data);
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
    return (
        <UserContext.Provider
            value={{
                onSubmitLogin,
                onSubmitRegister,
                onSubmitOng,
                user,
                setUser,
                onSubmitTech,
                handleCreateTech,
                createTech,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
