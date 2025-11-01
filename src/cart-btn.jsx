import { useNavigate, useLocation } from "react-router"
import { ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const CartBtn = ({ cart }) => {
  const naviagte = useNavigate();
  const location = useLocation();
  const [prevCount, setPrevCount] = useState(cart.length);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (cart.length > prevCount) {
      setPop(true);
      setTimeout(() => setPop(false), 300);
    }
    setPrevCount(cart.length);
  }, [cart.length, prevCount]);
  if (location.pathname === "/checkout") return null;
  return (
    <button className="cart-btn" onClick={() => naviagte("/checkout")}>
      <ShoppingCart />
      <AnimatePresence>
        <motion.span
          key={cart.length}
          className="cart-count"
          initial={{ scale: 1 }}
          animate={{ scale: pop ? 1.35 : 1 }} 
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          {cart.length}
        </motion.span>
      </AnimatePresence>
    </button>
    
  )
}

export default CartBtn