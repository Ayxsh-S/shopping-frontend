import { useEffect } from "react";
import { useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion";

const Gallery = () => {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const API =  "https://shopping-backend-huhv.onrender.com/models";
    

    useEffect(() => {
        fetch(API)
        .then((res) => res.json())
        .then((data) => setModels(data))
        .catch((err) => console.log("Models fetch error:", err))
        .finally(() => setLoading(false));
    },[]);

   if (loading) return (
      <div className="loading">
         <p>Loading car...</p>
      </div>
    );
    if (!models.length) return <p>No models found</p>

    return (
        <div 
        className="car-contain"
        >
            <AnimatePresence>
            {models.map((m) => (
                <Link key={m.id} to={`/models/${m.id}`}>
                    <motion.div>
                        {!m.image && (<p>Loading Image</p>)}
                        <img src={m.image} alt={m.name} className="main-image" style={String(m.id) === "1" ? { objectFit: "cover", objectPosition: "center", height:"500px" } : {}} />
                        <div className="main-info-container">
                          <h2 className="all-models">All {m.name} Models</h2>
                          <p className="desc">{m.description}</p>
                        </div>
                    </motion.div>
                </Link>
            ))}
            </AnimatePresence>
        </div>
    );
}

export default Gallery