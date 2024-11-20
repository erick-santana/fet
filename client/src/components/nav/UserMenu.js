import { NavLink } from "react-router-dom";

export default function UserMenu() {
  return (
    <>
      <div className="p-3 mt-2 mb-2 h4 bg-light">Painel de Gerenciamento</div>

      <ul className="list-group list-unstyled">
        <li>
          <NavLink className="list-group-item" to="/dashboard/user/profile">
            Perfil
          </NavLink>
        </li>

        <li>
          <NavLink className="list-group-item" to="/dashboard/user/orders">
            Pedidos
          </NavLink>
        </li>
      </ul>
    </>
  );
}
