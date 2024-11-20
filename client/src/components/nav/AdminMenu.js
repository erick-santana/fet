import { NavLink } from "react-router-dom";

export default function AdminMenu() {
  return (
    <>
      <div className="p-3 mt-2 mb-2 h4 bg-light">Painel de Gerenciament</div>

      <ul className="list-group list-unstyled">
        <li>
          <NavLink className="list-group-item" to="/dashboard/admin/category">
            Criar categoria
          </NavLink>
        </li>

        <li>
          <NavLink className="list-group-item" to="/dashboard/admin/product">
            Criar produto
          </NavLink>
        </li>

        <li>
          <NavLink className="list-group-item" to="/dashboard/admin/products">
            Produtos
          </NavLink>
        </li>

        <li>
          <NavLink className="list-group-item" to="/dashboard/admin/orders">
            Gerenciar pedidos
          </NavLink>
        </li>
      </ul>
    </>
  );
}
