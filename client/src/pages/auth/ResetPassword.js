import { useState } from "react";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RecoveryPassword() {
  // state
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`http://localhost:3000/user/recovery`, {
        email
      });
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Senha enviada para o e-mail informado");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error("Falha no envio. Tente novamente.");
    }
  };

  return (
    <div>
      <Jumbotron title="Recuperar Senha" />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="btn btn-primary" type="submit">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
