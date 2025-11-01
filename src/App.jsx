import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Gallery from './gallery';
import CarDetails from './cardetails';
import ModelPage from './modelpage';
import Checkout from './checkout';
import { Link } from "react-router-dom"
import { useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import CartBtn from './cart-btn';

function App() {
  const [cart, setCart] = useState([]);
  const addToCart = (car) => setCart([...cart, car]);
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 80, damping: 15 } },
    closed: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
     fetch("https://shopping-backend-huhv.onrender.com/cars")
    .then((r) => r.json())
    .then((data) => setCars(data))
    .catch((err) => console.log("Car fetch error:", err));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }
    const lower = query.toLowerCase();
    const matches = cars.filter((c) => 
    c.name.toLowerCase().includes(lower));
    setFiltered(matches.slice(0, 5));
  }, [query, cars, setFiltered]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };
     window.addEventListener("scroll", handleScroll);
     return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (showSidebar || showSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    };
  }, [showSidebar, showSearch]);

  return (
    <Router>
       <motion.header
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        >
        <motion.button 
        className='header-btn'
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
         onClick={() => setShowSidebar(true)}
        >
          <img className='svg' src='/src/images/menu-svgrepo-com.svg' alt='menu' /><p className='menu'>Menu</p>
        </motion.button>
        <title>Porsche</title>
        <Link className='main-link' to="/"><img src="/src/images/LOGO.png" alt="Porsche Logo" className='logo' /></Link>
        <motion.button 
         className='header-btn'
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.9, rotate: -2 }}
         onClick={() => setShowSearch(true)}
         >
          <img className='svg' src='/src/images/search-right-1507-svgrepo-com.svg' alt='search' />
        </motion.button>
        <AnimatePresence>
              {showSidebar && (
                <>
                 <motion.div 
                 className="sidebar-overlay"
                 initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                 animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
                 exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                 transition={{ duration: 0.3 }}
                 onClick={() => setShowSidebar(false)}
                 />
              
                 <motion.aside
                  className="sidebar"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sidebarVariants}
                  >
                    <h1 className='sidebar-header'>Note</h1>
                    <div className="sidebar-content">
                      <p>I do not own any of the cars or images used. They belong to their respective owners.</p>
                      <p>Bear with the API - it might take time to fetch the data at first. (20s-30s, I know, it's inconvenient)</p>
                      <p>This is unfinished. I have added some 911s but that's about it. If I feel like finishing this off in the future, I will. But
                        for the sake of completing the project assignment, I am done for now.
                      </p>
                    </div>
                    <div className="sign">Ayxsh-S</div>
                 </motion.aside>
                </>
              )}
          </AnimatePresence>
        <AnimatePresence>
        {showSearch && (
            <motion.div 
            className="search-popup" 
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            >
              <input type="text" placeholder='Search cars...' value={query} onChange={(e) => setQuery(e.target.value)} />
        {filtered.length > 0 && (
          <motion.ul 
          className='dropdown'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          >
            {filtered.map((car, i) => (
              <motion.li 
              key={car.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
              >
                <Link to={`/cars/${car.id}`} className="search-item" onClick={() =>{
                  setShowSearch(false);
                  setQuery("");
                  }}>{car.name}<img className="search-img" src={car.image} alt={car.name} /></Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
        </motion.div>
      )}
      </AnimatePresence>
       </motion.header>
      <AnimatePresence>
       {showSearch && (
          <motion.div 
          className="overlay" 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          onClick={() => {
              setShowSearch(false);
              setQuery("");
             }
            }
              ></motion.div>
        )}

        {cart.length > 0 && (
          <CartBtn cart={cart} />
        )}

      </AnimatePresence> 
      <AnimatePresence mode='wait'>
       <Routes>
        <Route path="/" element={  
          <motion.div
          key="gallery"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Gallery />
        </motion.div>
        } 
       />
        <Route path="/models/:modelId" element={ 
          <motion.div
          key="model"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <ModelPage />
        </motion.div>
      } 
     />
        <Route path="/cars/:id" element={ 
          <motion.div
          key="details"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <CarDetails addToCart={addToCart} />
        </motion.div>
       } 
      />
      <Route path="/checkout" element={
        <motion.div
         key="checkout"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.5 }}
         >
          <Checkout cart={cart} setCart={setCart} />
         </motion.div>
      } 
      />
       </Routes>
      </AnimatePresence>  
    </Router>
  )
}

export default App
