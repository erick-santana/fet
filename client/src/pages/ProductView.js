import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Badge } from "antd";
import {
  FaMoneyBillAlt,
  FaProjectDiagram,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaWarehouse,
  FaRocket,
} from "react-icons/fa";
import ProductCard from "../components/cards/ProductCard";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

export default function ProductView() {
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const params = useParams();

  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

  const loadProduct = async (req, res) => {
    try {
      const { data } = await axios.get(`/product/${params.slug}`);
      setProduct(data);
      loadRelated(data._id, data.category._id);
    } catch (err) {
      console.log(err);
    }
  };

  const loadRelated = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/related-products/${productId}/${categoryId}`
      );
      setRelated(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <div className="card mb-3">
            <Badge.Ribbon text={`${product?.sold} vendidos`} color="red">
              <Badge.Ribbon
                text={`${
                  product?.quantity >= 1
                    ? `${product?.quantity - product?.sold} em estoque`
                    : "Fora de estoque"
                }`}
                placement="start"
                color="green"
              >
                <img
                  className="card-img-top"
                  src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                  alt={product.name}
                  style={{ height: "500px", width: "100%", objectFit: "cover" }}
                />
              </Badge.Ribbon>
            </Badge.Ribbon>

            <div className="card-body">
              <h1 className="fw-bold">{product?.name}</h1>
              <p className="card-text lead">{product?.description}</p>
            </div>

            <div className="d-flex justify-content-between lead p-5 bg-light fw-bold">
              <div>
                <p>
                  <FaMoneyBillAlt /> Preço:{" "}
                  {product?.price?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                <p>
                  <FaProjectDiagram /> Categoria: {product?.category?.name}
                </p>

                <p>
                  <FaRegClock /> Adicionado: {moment(product.createdAt).fromNow()}
                </p>

                <p>
                  {product?.quantity > 0 ? <FaCheck /> : <FaTimes />}{" "}
                  {product?.quantity > 0 ? "Em Estoque" : "Fora de Estoque"}
                </p>

                <p>
                  <FaWarehouse /> Disponível {product?.quantity - product?.sold}
                </p>

                <p>
                  <FaRocket /> Vendido {product.sold}
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline-primary col card-button"
              style={{
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px",
              }}
              onClick={() => {
                setCart([...cart, product]);
                toast.success("Adicionado ao carrinho");
              }}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <h2>Produtos Relacionados</h2>
          <hr />
          {related?.length < 1 && <p>Nada encontrado</p>}
          {related?.map((p) => (
            <ProductCard p={p} key={p._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
