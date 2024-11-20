import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import Search from "../forms/Search";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

export default function Menu() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  // hooks
  const categories = useCategory();
  const navigate = useNavigate();

  const logout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      
      <div className="bg-dark py-4"></div>

      <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm sticky-top">
        <div className="container-fluid">
          
          <NavLink className="navbar-brand" to="/">
            <img src="/logo.png" alt="E-Commerce Logo" style={{ height: "100px", marginLeft: "50px" }} />
          </NavLink>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  INICIAL
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/shop">
                  COMPRAR
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="categoryDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  CATEGORIAS
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="categoryDropdown"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <li>
                    <NavLink className="dropdown-item" to="/categories">
                      Todas as categorias
                    </NavLink>
                  </li>
                  {categories?.map((c) => (
                    <li key={c._id}>
                      <NavLink className="dropdown-item" to={`/category/${c.slug}`}>
                        {c.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <Search />

            <li className="nav-item me-3">
              <Badge
                count={cart?.length >= 1 ? cart.length : 0}
                offset={[-5, 11]}
                showZero={true}
              >
                <NavLink className="nav-link" to="/cart">
                  <ShoppingCartOutlined style={{ fontSize: "24px" }} />
                </NavLink>
              </Badge>
            </li>

            {!auth?.user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="authDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <UserOutlined style={{ fontSize: "24px" }} />
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
                  <li>
                    <NavLink className="dropdown-item text-center" to="/login">
                      ENTRAR
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item text-center" to="/register">
                      REGISTAR
                    </NavLink>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth?.user?.name?.toUpperCase()}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                    >
                      Painel de Controle
                    </NavLink>
                  </li>
                  <li>
                    <a onClick={logout} className="dropdown-item">
                      Deslogar
                    </a>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="bg-dark py-3"></div>
    </>
  );
}
