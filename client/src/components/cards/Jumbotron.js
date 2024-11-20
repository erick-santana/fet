export default function Jumbotron({
  title,
  subTitle = "",
}) {
  return (
    <div
      className="jumbotron"
      style={{
        overflow: "hidden",
        marginTop: "-8px",
        height: "550px",
        backgroundImage: "url('/background.png')", 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
      }}
    >
      <div className="row">
        <div className="col text-center p-5">
          <h1 className="fw-bold">{title}</h1>
          <p className="lead">{subTitle}</p>
        </div>
      </div>
    </div>
  );
}
