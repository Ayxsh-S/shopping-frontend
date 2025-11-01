import { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarDetails = ( {addToCart} ) => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
      setCurrent(0);
      setDirection(0);
      setLoading(true);
      setError(null);
      fetch("https://shopping-backend-huhv.onrender.com/cars")
      .then((r) => {
        if (!r.ok) throw new Error(`Car not found (status ${r.status})`);
        return r.json();
      })
      .then((cars) => {
        const idNum = parseInt(id, 10);
        const found = cars.find((c) => String(c.id) === String(idNum));
        if (!found) {
          setError(`Car with id ${id} not found`);
        } else {
          setCar(found);
        }
      })
      .catch((err) => {
        setError(err.message);
        console.error("Cars fetch error:", err);
      })
      .finally(() => setLoading(false));
    }, [id]);

    if (error) return <p>{error}</p>;
    if (loading) return (
      <div className="loading">
         <p>Loading car...</p>
      </div>
    );
    if (!car) return <p>Car not found</p>

    const images = car.images && car.images.length ? car.images : [car.image];
    const nextImage = () => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % images.length)
    };
    const prevImage = () => {
      setDirection(-1);
      setCurrent((prev) => (prev - 1 + images.length) % images.length)
    };
    const moreImages = car?.moreImages?.length ? car.moreImages : car ? [car.image] : [];

    const variants = {
      enter: (dir) => ({
        x: dir > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.95
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] 
      }
     },
     exit: (dir) => ({
       zIndex: 0,
       x: dir < 0 ? 300 : -300,
       opacity: 0,
       scale: 0.95,
       transition: {
       duration: 0.4,
       ease: [0.55, 0.06, 0.68, 0.19] 
     }
    })
   };

    return (
      <div className="carDetail-container">
      <AnimatePresence mode="wait">
        {moreImages.length > 1 && (
          <div className="car-more-images-container">
            <img className="logo-img" 
              src={`/src/data/${car.modelName}.svg`}
              alt={car.name}
            />
            <motion.img
             key={moreImages[0]}
             src={moreImages[0]}
             alt={car.name}
             className="car-more-images"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.5 }}
            />
          </div>
        )}
        <h1 className="car-detail-h1">{car.name}</h1>
      <motion.div 
      className="car-container"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
       <div className="slideshow-container">
       <div className="slideshow-img-wrapper">
        <AnimatePresence mode="wait" custom={direction}>
        <motion.img 
        key={images[current]}
        src={images[current]} 
        alt={car.name}
        className="slideshow-img"
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        />
        </AnimatePresence>
       
        {images.length > 1 && (
          <div>
            <button onClick={prevImage} className="slideshow-btn left-btn">
            <ChevronLeft className="icon" />
            </button>
            <button onClick={nextImage} className="slideshow-btn right-btn">
            <ChevronRight className="icon" />
            </button>
          </div>
        )}
        </div> 
        </div>
        <div className="car-text">
          <div className="p-container">
          <img className="secondary-img" 
              src={`/src/data/${car.modelName}.svg`}
              alt={car.name}
            />
            
        <p className="car-desc">{car.description}</p>
  
        </div>
        <BackToModelButton car={car} />
        </div>
      </motion.div>
      </AnimatePresence>
      <div className="extra-details">
        <div className="extra-text">
          <div className="extra-text-container">
       <div className="extra-text-wrapper">
        <div className="extra-text-main">{car.acceleration}</div> <h3>secs</h3>
        </div>  
        <p>Acceleration</p>
         </div>
          <div className="extra-text-container">
            <div className="extra-text-wrapper">
         <div className="extra-text-main">{car.horsepower}</div> <h3>HP</h3>
         </div>
          <p>Horsepower</p>
         </div>
          <div className="extra-text-container">
             <div className="extra-text-wrapper">
         <div className="extra-text-main">{car.topSpeed}</div> <h3>mph</h3>
         </div>
         <p>Top Speed</p>
         </div>
         <div className="fuel-container"> <p>{car.fuel}</p> </div>
          <h2>From £{car.price.toLocaleString()}</h2>
          <button className="add-to-cart-btn" onClick={() => addToCart(car)}>Add to Cart</button>
        </div>
        <div className="car-more-images-extra">
        <img
             key={moreImages[1]}
             src={moreImages[1]}
             alt={car.name}
             className="car-more-images-extra-img"
            />
            </div>
      </div>
      <div className="consumption">
            <h3>Consumption and Emission</h3>
            <p>{car.consumption}</p>
          </div>
      </div>
    )
};

const BackToModelButton = ({ car }) => {
  const navigate = useNavigate();
  const goToModel = () => {
    const modelId = car?.modelId;
    if (modelId) {
      navigate(`/models/${modelId}`);
    } else {
      console.warn("No modelID found")
    }
  };
  return <button className="back-btn" onClick={goToModel}>←</button>
};


export default CarDetails;