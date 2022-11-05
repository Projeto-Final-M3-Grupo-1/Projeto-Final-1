import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Providers/AuthContext";
import { ProjectsContext } from "../../../Providers/ProjectsProvider";
import { UserContext } from "../../../Providers/UserProvider";
import api from "../../../Services/api";
import { StyledButtonCadastro, StyledLoginButton } from "../../Button";
import { ButtonCloseModal } from "../../Button/ButtonCloseModal";
import { ModalCreateTech } from "../ModalCreateTech";
import { StyledBoxModal } from "../ModalLogin/style";
import {
    StyledModalBody,
    StyledOngDetails,
    StyledProjectsRequests,
    StyledProjectDetails,
    StyledInfo,
    StyledDescription,
    StyledContent,
    StyledButtons,
} from "../ModalPerfilOng/style";

interface iState {
    length: any;
    map(arg0: (elem: any) => void): import("react").ReactNode;
    projects: any;
    title: string;
    description: string;
    id: number;
    user: number;
    setProjects: any;
}

export const ModalPerfilDev = () => {
    const { handleModal, handleNavigate } = useContext(ProjectsContext);
    const { dataUser } = useContext(AuthContext);
    const { handleCreateTech, createTech } = useContext(UserContext);
    const [projects, setProjetcts] = useState([] as unknown as iState);

    useEffect(() => {
        const getProject = () => {
            api.get(`/projects`)
                .then((res) => {
                    setProjetcts(res.data);
                })
                .catch((error) => console.log(error));
        };
        getProject();
    }, []);

    console.log(dataUser);

    return (
        <>
            <StyledBoxModal>
                <StyledModalBody>
                    <ButtonCloseModal callback={handleModal} />

                    <StyledContent>
                        <StyledOngDetails>
                            <div className="profile">
                                <caption>
                                    <img src={dataUser.fotoDePerfil} alt="" />
                                </caption>
                                <div className="details">
                                    <h3>{dataUser.nome}</h3>
                                    <p>Dev Voluntário</p>
                                </div>
                            </div>
                            <StyledProjectDetails>
                                <StyledInfo>
                                    <p className="label">Nome</p>
                                    <input
                                        className="info"
                                        value={dataUser.nome}
                                    />
                                </StyledInfo>

                                <StyledInfo>
                                    <p className="label">E-mail</p>
                                    <input
                                        className="info"
                                        value={dataUser.email}
                                    />
                                </StyledInfo>

                                <StyledInfo>
                                    <p className="label">GitHub</p>
                                    <input
                                        className="info"
                                        value={dataUser.github}
                                    />
                                </StyledInfo>

                                <StyledInfo>
                                    <p className="label">GitHub</p>
                                    <input
                                        className="info"
                                        value={dataUser.linkedin}
                                    />
                                </StyledInfo>

                                <div>
                                    <h2>Tecnologias que trabalho</h2>
                                    <ul>
                                        {" "}
                                        {createTech && <ModalCreateTech />}
                                    </ul>
                                    <StyledButtonCadastro
                                        onClick={handleCreateTech}
                                    >
                                        Adicionar tecnologias
                                    </StyledButtonCadastro>
                                </div>
                            </StyledProjectDetails>
                        </StyledOngDetails>

                        <StyledProjectsRequests>
                            <h3 className="title">Solicitações do Projeto</h3>

                            <div className="projectInfo">
                                <h3 className="name">{dataUser.razaoSocial}</h3>
                                {projects.length ? (
                                    projects.map((element) => {
                                        if (element.ongId == dataUser.id) {
                                            return (
                                                <>
                                                    <p className="title">
                                                        {element.title}
                                                    </p>
                                                    <p className="description">
                                                        {element.description}
                                                    </p>
                                                </>
                                            );
                                        }
                                    })
                                ) : (
                                    <h1>Não Rolou</h1>
                                )}

                                <StyledButtonCadastro>
                                    Ver mais
                                </StyledButtonCadastro>
                            </div>
                        </StyledProjectsRequests>
                        <StyledButtons>
                            <StyledButtonCadastro>Salvar</StyledButtonCadastro>
                            <StyledButtonCadastro
                                onClick={() => handleNavigate("/home")}
                            >
                                Logout
                            </StyledButtonCadastro>
                        </StyledButtons>
                    </StyledContent>
                </StyledModalBody>
            </StyledBoxModal>
        </>
    );
};
