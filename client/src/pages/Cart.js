import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import Jumbotron from "../components/cards/Jumbotron";
import { useNavigate } from "react-router-dom";
import UserCartSidebar from "../components/cards/UserCartSidebar";
import ProductCardHorizontal from "../components/cards/ProductCardHorizontal";

export default function Cart() {
  const [cart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Jumbotron
        title={`Olá, ${auth?.token && auth?.user?.name}`}
        subTitle={
          cart?.length
            ? `Você tem ${cart.length} itens no carrinho. ${auth?.token ? "" : "Por favor faça login para finalizar a compra"}`
            : "Seu carrinho está vazio"
        }
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="p-3 mt-2 mb-2 h4 bg-light text-center">
              {cart?.length ? (
                <span>Meu carrinho</span>
              ) : (
                <div className="text-center">
                  <button className="btn btn-primary" onClick={() => navigate("/")}>
                    Continuar Comprando
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {cart?.length > 0 && (
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {cart.map((p, index) => (
                  <ProductCardHorizontal key={index} p={p} />
                ))}
              </div>
            </div>
            <UserCartSidebar />
          </div>
        </div>
      )}
    </>
  );
}
