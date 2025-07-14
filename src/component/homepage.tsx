import banner from "./pexels-fauxels-3183132.jpg";
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
export default homepage;