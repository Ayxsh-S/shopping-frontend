import { useEffect } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

const ModelPage = () => {
    const { modelId } = useParams();
    const [model, setModel ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      setLoading(true);
      setError(null);
      fetch("https://shopping-backend-huhv.onrender.com/models")
        .then((r) => {
          if (!r.ok) throw new Error(`Failed to load models (status ${r.status})`);
          return r.json();
        })
        .then((models) => {
          const idNum = parseInt(modelId, 10);
          const found = models.find((m) => String(m.id) === String(idNum));
          if (!found) {
            setError(`Model with id ${modelId} not found`);
          } else {
            setModel(found);
          }
        })
        .catch((err) => {
          console.error("Model fetch error:", err);
          setModel(null);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }, [modelId]);

    if (error) return <p>{error}</p>
    if (loading) return (
      <div className="loading">
         <p>Loading car...</p>
      </div>
    );
    if (!model) return <p>Model not found.</p>;

  return (
    <div className="model-full-container">
      <img src={model.image} alt={model.name} className="main-image" style={String(model.id) === "1" ? { objectFit: "cover", objectPosition: "center", height:"500px" } : {}} />
      <div className="model-top-container">
        <div>
          <img className="model-logo-img" 
              src={`/data/${model.name}.svg`}
              alt={model.name}
            />
          <p>{model.description}</p>
        </div>
      </div>
      <div className="model-container">
        {model.variants.map((v) => (
          <div key={v.id} className="model-link">
            <Link to={`/cars/${v.id}`}>
              <img className="model-img" src={v.image} alt={v.name} />
              <h3>{v.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ModelPage;