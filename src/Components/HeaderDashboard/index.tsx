import { useContext, useEffect, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";

import * as S from "./style";
import { VscTriangleDown } from "react-icons/vsc";
import { AuthContext } from "../../Providers/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Providers/UserProvider";
import { ProjectsContext } from "../../Providers/ProjectsProvider";
import MobileHeader from "./MobileHeader";

export const HeaderDashboard = () => {
	const { dataUser, loadingUser } = useContext(AuthContext);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const { handlePerfil } = useContext(UserContext);
	const { setRender, handleProjectsToApply } = useContext(ProjectsContext);

	const [userType, setUserType] = useState<string>(dataUser.typeUser);

	const loadUserType = () => {
		setUserType(dataUser.typeUser);
	};

	const windowSize = useWindowSize();
	const width = windowSize.width;
	const navigate = useNavigate();

	const logout = () => {
		localStorage.clear();
		navigate("/");
	};

	useEffect(() => {
		loadingUser();
		handleResize();
	}, [width]);

	useEffect(() => {
		loadUserType();
	}, [dataUser]);

	const handleResize = () => {
		if (width <= 768) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	};

	const proc = () => {
		console.log("proc");
	};

	return (
		<S.Header>
			{isMobile ? (
				<MobileHeader
					callback={handleProjectsToApply}
					logout={logout}
				/>
			) : (
				<S.Nav>
					<h2>Logo</h2>
					<S.Dropdown>
						{userType === "dev" && (
							<>
								<S.Span>
									Projetos
									<VscTriangleDown />
									<S.DropdownList>
										<S.DropdownItem
											onClick={handleProjectsToApply}
										>
											Ver todos projetos
										</S.DropdownItem>
										<S.DropdownItem>
											Meu projeto
										</S.DropdownItem>
									</S.DropdownList>
								</S.Span>
								<S.Span>
									Publicações
									<VscTriangleDown />
									<S.DropdownList>
										<S.DropdownItem
											onClick={handleProjectsToApply}
										>
											Ver todas publicações
										</S.DropdownItem>
										<S.DropdownItem
											onClick={handleProjectsToApply}
										>
											Ver todas publicações
										</S.DropdownItem>
									</S.DropdownList>
								</S.Span>
							</>
						)}
						{userType === "ong" && (
							<>
								<S.Span>
									Projetos
									<VscTriangleDown />
									<S.DropdownList>
										<S.DropdownItem>
											Criar projeto
										</S.DropdownItem>
										<S.DropdownItem>
											Ver todos projetos
										</S.DropdownItem>
										<S.DropdownItem>
											Meu projeto
										</S.DropdownItem>
									</S.DropdownList>
								</S.Span>
								<S.Span>
									Publicações
									<VscTriangleDown />
									<S.DropdownList>
										<S.DropdownItem>
											Ver todas publicações
										</S.DropdownItem>
										<S.DropdownItem>
											Ver todas publicações
										</S.DropdownItem>
									</S.DropdownList>
								</S.Span>
							</>
						)}
						{userType === "admin" && (
							<>
								<S.Span>
									Projetos
									<VscTriangleDown />
									<S.DropdownList>
										<S.DropdownItem>
											Criar projeto
										</S.DropdownItem>
										<S.DropdownItem>
											Ver todos projetos
										</S.DropdownItem>
										<S.DropdownItem>
											Meu projeto
										</S.DropdownItem>
									</S.DropdownList>
								</S.Span>
								<S.Span>
									Publicações
									<VscTriangleDown />
									<S.DropdownList>
										<S.DropdownItem>
											Criar nova publicação
										</S.DropdownItem>
										<S.DropdownItem>
											Ver todas publicações
										</S.DropdownItem>
									</S.DropdownList>
								</S.Span>{" "}
							</>
						)}
					</S.Dropdown>
					<S.User>
						<S.Name>{dataUser.nome || dataUser.razaoSocial}</S.Name>

						<S.Image
							onClick={handlePerfil}
							src={dataUser.fotoDePerfil}
							alt="Foto de perfil"
						/>
					</S.User>
				</S.Nav>
			)}
		</S.Header>
	);
};
