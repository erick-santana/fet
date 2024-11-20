import { Badge } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";

export default function ProductCard({ p }) {
  // contexto
  const [cart, setCart] = useCart();
  // hooks
  const navigate = useNavigate();

  return (
    <div className="col mb-4"> 
      <div className="card h-100 d-flex flex-column"> 
        <Badge.Ribbon text={`${p?.sold} vendidos`} color="green">
          <img
            src={`${process.env.REACT_APP_API}product/photo/${p._id}`}
            className="card-img-top"
            alt={p.name}
            style={{     width: "250px", 
              height: "300px", 
              objectFit: "cover", 
              display: "block", 
              margin: "auto", 
              padding: "5px" 
             }} 
          />
        </Badge.Ribbon>
        <div className="card-body d-flex flex-grow-1 flex-column"> 
          <h5 className="card-title">{p?.name}</h5>
          <h4 className="fw-bold">
            {p?.price?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h4>
          <p className="card-text">{p?.description?.substring(0, 60)}...</p>
          <div className="mt-auto"> 
            <button
              className="btn"
              style={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "50px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                width: "100%", 
                marginBottom: "10px" 
              }}
              onClick={() => navigate(`/product/${p.slug}`)}
            >
              Ver Produto
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "transparent",
                color: "#4CAF50",
                border: "2px solid #4CAF50",
                padding: "10px 20px",
                borderRadius: "50px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                width: "100%", 
              }}
              onClick={() => {
                setCart([...cart, p]);
                localStorage.setItem("cart", JSON.stringify([...cart, p]));
                toast.success("Adicionado ao carrinho");
              }}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
