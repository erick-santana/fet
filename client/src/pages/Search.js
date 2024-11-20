import { useSearch } from "../context/search";
import ProductCard from "../components/cards/ProductCard";
import Jumbotron from "../components/cards/Jumbotron";

export default function Search() {
  const [values, setValues] = useSearch();

  return (
    <>
      <Jumbotron
        title="Resultados da pesquisa"
        subTitle={
          values?.results?.length < 1
            ? "Não foram encontrados produtos"
            : `Encontrado  ${values?.results?.length} produtos`
        }
      />

      <div className="container mt-3">
        <div className="row">
          {}
          {values?.results?.map((p) => (
            <div key={p._id} className="col-md-4">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
