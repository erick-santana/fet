import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";

export default function UserDashboard() {
  // context
  const [auth, setAuth] = useAuth();

  return (
    <>
      <Jumbotron title={`Olá, ${auth?.user?.name}`} subTitle="Painel de controle do usuário" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Informações do Usuário</div>

            <ul className="list-group shadow-sm text-center">
              <li className="list-group-item">
                Nome: <span className="fw-bold">{auth?.user?.name}</span>
              </li>
              <li className="list-group-item">
              E-mail: <span className="fw-bold">{auth?.user?.email}</span>
              </li>
              
          </ul>
          </div>
        </div>
      </div>
    </>
  );
}
