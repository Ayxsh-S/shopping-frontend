import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";

const Checkout = ({ cart, setCart }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiColors = ["#FFD700", "#C0C0C0", "#B87333", "#FFFFFF", "#FFCC00"];
  const navigate = useNavigate();
  const handlePurchase = () => {
    setCart([]);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000)
    setTimeout(() => {
       setShowConfetti(true);
    }, 1200)
    setTimeout(() => {
      setShowConfetti(false);
      navigate("/");
    }, 5500) 
  }

  if (cart.length === 0 && !showSuccess && !showConfetti) {
    return <h2>Cart is empty</h2>
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
      <h1 className="checkout-header">Checkout</h1>
      <ul>
        {cart.map((car, i) => (
          <li key={i}>
            {car.name} - £{car.price.toLocaleString()} <img className="model-img" src={car.image} alt={car.name} />
          </li>
        ))}
      </ul>
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <button className="checkout-purchase-btn" onClick={handlePurchase}>Purchase</button>
      </div>
      {showConfetti && <Confetti numberOfPieces={350} recycle={false} gravity={0.3} colors={confettiColors} />}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="success-box"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="#00ff00"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4 }}
                />
              </svg>
              <h2>Purchase Successful!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Checkout