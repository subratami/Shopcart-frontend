import { motion } from "framer-motion";
import banner from "./pexels-fauxels-3183132.jpg";
import Advertisment from "./w69uo7lk.png";
import './homepage.css';
import electronics from "./electronics.png";
import homeKitchen from "./home Appliances.png";
import computerPeripherials from "./computer parts.png";
import clothing from "./cloths.png";
import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="homepage">
      <motion.img
        className="banner-img"
        src={banner}
        alt="Banner Text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      />

      <motion.img
        className="banner-Adv"
        src={Advertisment}
        alt="Banner Add"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <div className="categories">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <strong>Shop by Categories</strong>
        </motion.span>
        <hr />

        <ul className="categories-list">
          <motion.li
            className="electronics"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={"/search"}>
              <motion.img
                src={electronics}
                alt="Electronics"
                title="Consumer Electronics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </motion.li>

          <motion.li
            className="home-kitchen"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img
              src={homeKitchen}
              alt="home & kitchen"
              title="Home Appliances"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.li>

          <motion.li
            className="computer-peripherials"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img
              src={computerPeripherials}
              alt="computer & peripherials"
              title="Computer Peripherials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </motion.li>

          <motion.li
            className="clothing"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img
              src={clothing}
              alt="Clothing"
              title="Clothing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            />
          </motion.li>
        </ul>
      </div>
    </div>
  );
}

export default Homepage;

{/*import banner from "./pexels-fauxels-3183132.jpg";
import Advertisment from "./w69uo7lk.png";
import './homepage.css';
import electronics from "./electronics.png";
import homeKitchen from "./home Appliances.png";
import computerPeripherials from "./computer parts.png";
import clothing from "./cloths.png"
import { Link } from "react-router-dom";
//import ShopByCatgories from '../component/ShopByCategories';
function homepage() {
  return (
  <>
  <div className="homepage">
  <img className="banner-img" src={banner} alt="Banner Text"/> 
  <img className="banner-Adv" src={Advertisment} alt="banner Add"/>
  <div className="categories">
  <span><strong>Shop by Categories</strong></span><hr/>
    <ul className="categories-list">
    <li className="electronics"><Link to={"/search"}> <img src={electronics} alt="Electronics" title="Consumer Electronics"/></Link></li>
    <li className="home-kitchen"><img src={homeKitchen} alt="home & kitchen" title="Home Appliances"/></li>
    <li className="computer-peripherials"><img src={computerPeripherials} alt="computer & peripherials" title="Computer Peripherials"/></li>
    <li className="clothing"><img src={clothing} alt="Clothing" title="Clothing"/></li>
    </ul>
    </div>
</div>

  </>
  );
  
}
export default homepage; */}