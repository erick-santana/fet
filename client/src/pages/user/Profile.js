import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserProfile() {
  // contexto
  const [auth, setAuth] = useAuth();
  // estado
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth?.user) {
      const { name, email, address } = auth.user;
      setName(name);
      setEmail(email);
      setAddress(address);
    }
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/profile", {
        name,
        password,
        address,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data });
        // atualização do local storage
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Perfil atualizado com sucesso");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron title={`Olá, ${auth?.user?.name}`} subTitle="Painel de controle do usuário" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Perfil</div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control m-2 p-2"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus={true}
              />

              <input
                type="email"
                className="form-control m-2 p-2"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />

              <input
                type="password"
                className="form-control m-2 p-2"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <textarea
                className="form-control m-2 p-2"
                placeholder="Digite seu endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <button className="btn btn-primary m-2 p-2">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
