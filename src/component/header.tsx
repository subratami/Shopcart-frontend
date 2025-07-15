import facebookLogo from "./facebook logo.png";
import instagramLogo from "./instagram logo.png";
import twitterXLogo from "./twitterX logo.png";
import navLogo from "./nav logo3.png";
import person from "./person.png";
import wishlist from "./wishlist.png";
import { useCart } from "../component/CartContext";
import shoppingBag from "./shopping-bag.png";
import Electronics from "./pexels-fauxels-3183132.jpg";
import {Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import menubar from "./menu-bar.png";
import close from "./close.png"
import { logoutUser } from "../utils/logout.ts";

//import Homepage from './homepage';
//import Login from "./login";
import './header.css';

interface HeaderProps {
    onSearch: (query: string) => void;
}
const debouncedSearch = debounce((query: string, onSearch: (query: string) => void) => {
    onSearch(query);
}, 300); // 300ms delay

function Header({ onSearch }: HeaderProps) {

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name);
  }, []);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { cart } = useCart(); // Access cart from CartContext

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value, onSearch); // Pass search query to parent
    };
      const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            navigate("/search"); // Navigate to search results page
        }
    };
    /*  collaspible side menu */
     const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

    const toogleMenu = () => setIsOpen(!isOpen);
    const toogleSubmenu = (menu: string) => {
      setActiveMenu(activeMenu === menu ? null : menu);
      setActiveSubMenu(null); // Reset sub-menu when main menu is toggled
    };
    const toogleInnerSubmenu = (submenu: string) => {
      setActiveSubMenu(activeSubMenu === submenu ? null : submenu);
    };
    // Hide dropdown-component on any click (inside or outside) on small screens
    const handleLinkClick = () => {
      setIsOpen(false); // close side menu
      setActiveMenu(null); // close submenu
      setActiveSubMenu(null); // close inner submenu
    };

    // Hide dropdown-component when clicking outside or any link/button inside (on small screens)
   /* useEffect(() => {
      if (window.innerWidth > 900) return;
      const handleAnyClick = () => {
        // Only run on small screens
        setIsOpen(false);
        setActiveMenu(null);
        setActiveSubMenu(null);
      };
      document.addEventListener("click", handleAnyClick);
      return () => document.removeEventListener("click", handleAnyClick);
    }, []);*/
    return (
        <>
        <header>
       <span className="topleft">*Free Shipping Across India</span>
       <ul className="topright">
        <li>Follow us:</li>
         <li><img className="facebook" src={facebookLogo} alt="not support"/></li> 
             <li><img className="instagram" src={instagramLogo}alt="not support"/></li>
             <li><img className="twitterX" src={twitterXLogo} alt="not support"/></li>
             <li>Email: Shopcart@gmail.com &nbsp; &nbsp;</li>
             <li>Call: +91 1234567890 &nbsp; &nbsp;</li>
             <li>Location: India</li>
         
       </ul>
    </header>
  <nav>
    <Link to='/'><img className="logo" src={navLogo} alt="Shopcart Logo"/></Link>
    <input  type="text" className="searchbar" placeholder="Search for products, brands and more" value={search} onChange={handleSearchChange} onKeyDown={handleKeyPress} // Handle Enter key press
                />
    <ul className="list"> 
<li className="person"><div className="dropdown">
   <div className="dropbtn"> <a href="#"><img src={person} alt="not_load"/>Account<div className="Account-blank"><div className="Acblack-blank"></div></div></a>
   </div>
<div className="dropdown-content">
{/*
<p className="para1"><small>Signup/Login for best experience</small></p>
*/}
<span className="header-welcome">Welcome, {userName || "User"}!</span>
{localStorage.getItem("isLoggedIn") === "true" ? (
  <div className="button">
    <button
      className="btnlink header-logout-btn"
      onClick={async () => {
      logoutUser();
      }}
    >
      LOGOUT
    </button>
  </div>
) : (
  <div className="dropdtn">
    <div className="button">
      <div className="btnlink">
        <Link to="/signup" onClick={handleLinkClick} >SIGNUP </Link>
      </div>
    </div>
    <span>Or</span>
    <div className="button">
      <div className="btnlink">
        <Link to="./login" onClick={handleLinkClick}>&nbsp;LOGIN</Link>
      </div>
    </div>
  </div>
)}
<div className="droplink">
  <Link className="hlink" to="/cart">Cart &nbsp;<span className="cart-count header-cart-count">{cart.items?.length ?? 0}</span></Link>
  <a className="hlink" href="#">Wishlist</a>
  <a className="hlink" href="#">eGift Cards</a>
  <a className="hlink" href="#">Find A Store</a>
  <a className="hlink" href="#">Help & Contact</a>
  <a className="hlink" href="#">FAQ</a>
</div>
</div>
  </div></li>
<li className="Wishlist"> <a href="#"><img src={wishlist} alt="not_load"/> Wishlist </a> </li>
<li className="Shoppingbag"> <Link to="/cart"> <img src={shoppingBag} alt="not_load"/>Cart<span className="cart-count">{cart.items?.length ?? 0}</span></Link> </li>
</ul>
</nav>
<div className="second">
 <button className="toogle-btn" onClick={toogleMenu}>
 <img src={menubar} className="menubar" alt="not load"/>
 </button>
 <div className={`side-menu ${isOpen ? "open" : ""}`}>
  <button className="closebtn header-closebtn" onClick={handleLinkClick}> <img src={close} alt="close icon" className="header-closeimg"/> </button>
<ul className="menu-list">
 {/* side Menu */}
 <li className="User header-user-li" style={{ padding:"1rem", textAlignLast: "end"}}>
  {localStorage.getItem("isLoggedIn") === "true" ? (
  <button
      className="btnlink header-logout-btn-side"
      onClick={async () => {
      logoutUser();
      handleLinkClick();
      }}
    >
      LOGOUT
    </button>
): (<button
      className="btnlink header-logout-btn-hide"
      onClick={async () => {
      logoutUser();
      }}
    >
      LOGOUT
    </button>)}
  <Link to="/login" onClick={handleLinkClick} className="header-account-link"> Your Account <img src={person} alt="not support" className="header-account-img"/></Link></li>
  <li>
   <button className="menu-item" onClick={() => toogleSubmenu("electronics")}>
    Consumer Electronics {activeMenu === "electronics" ? "▲" : "▼"}
    </button>
    {activeMenu === "electronics" && (
  <ul className="submenu">
  <li>
    <button onClick={() => toogleInnerSubmenu("smartphones")}>
     Smartphones {activeSubMenu === "smartphones" ? "▲" : "▼"}
    </button>
    {activeSubMenu === "smartphones" && (
   <ul className="inner-submenu">
        <li><a href="#"> Apple</a></li>
        <li> <a href="#">Samsung</a></li>
        <li> <a href="#">Xiaomi</a></li>
        <li> <a href="#">Oppo</a></li>
        <li> <a href="#">Vivo</a></li>
        <li> <a href="#">Oppo</a></li>
        <li> <a href="#">Realme</a></li>
        <li> <a href="#">Oneplus</a></li>
        <li> <a href="#">Honor</a></li>
        <li> <a href="#">Iqoo</a></li>
    </ul>
    )}
    </li>
    <li>
    <button onClick={() => toogleInnerSubmenu("tablets")}>
    Tablets {activeSubMenu === "tablets" ? "▲" : "▼"}
    </button>
    {activeSubMenu === "tablets" && (
    <ul className="inner-submenu">
    <li><a href="#"> Apple Ipad Tablet</a></li>
          <li> <a href="#">Samsung Tablet</a></li>
          <li> <a href="#">Xiaomi Tablet</a></li>
          <li> <a href="#">Oppo Tablet</a></li>
          <li> <a href="#">Realme Tablet</a></li>
          <li> <a href="#">Oneplus Tablet</a></li>
          <li> <a href="#">Honor Tablet</a></li>
    </ul>
   )}
  </li>
   <li>
    <button onClick={() => toogleInnerSubmenu("Headphone")}>
    Headphone & Earbuds {activeSubMenu === "Headphone" ? "▲" : "▼"}
    </button>
    {activeSubMenu === "Headphone" && (
    <ul className="inner-submenu">
    <li><a href="#"> Bose</a></li>
          <li> <a href="#">Sony</a></li>
          <li> <a href="#">Apple</a></li>
          <li> <a href="#">Sennheiser</a></li>
          <li> <a href="#">JBL</a></li>
          <li> <a href="#">Beat</a></li>
          <li> <a href="#">Realme</a></li>
          <li> <a href="#">Oneplus</a></li>
          <li> <a href="#">Mi</a></li>
    </ul>
   )}
  </li>
  <li>
    <button onClick={() => toogleInnerSubmenu("smartwatches")}>
    Smartwatches {activeSubMenu === "smartwatches" ? "▲" : "▼"}
    </button>
    {activeSubMenu === "smartwatches" && (
    <ul className="inner-submenu">
    <li><a href="#">Samsung Galaxy watch</a></li>
          <li> <a href="#">Apple Watch</a></li>
          <li> <a href="#">Huawei Smartwatch</a></li>
          <li> <a href="#">Amazfit Smartwatch</a></li>
          <li> <a href="#">Oneplus watch</a></li>
          <li> <a href="#">Xiaomi watch</a></li>
          <li> <a href="#">Noise Smartwatch</a></li>
          <li> <a href="#">FireBoltt Smartwatch</a></li>
          <li> <a href="#">Boat Smartwatch</a></li>
          <li> <a href="#">FireBoltt Smartwatch</a></li>
          <li> <a href="#">Hammer Smartwatch</a></li>
    </ul>
   )}
  </li>
  <li>
    <button onClick={() => toogleInnerSubmenu("portable speakers")}>
    Portable Speakers {activeSubMenu === "portable speakers" ? "▲" : "▼"}
    </button>
    {activeSubMenu === "portable speakers" && (
    <ul className="inner-submenu">
    <li><a href="#">Tribit Speaker</a></li>
          <li> <a href="#">Marshall Speaker</a></li>
          <li> <a href="#">Anker Soundcore Speaker</a></li>
          <li> <a href="#">JBL Speaker</a></li>
          <li> <a href="#">Harman Kardon Speaker</a></li>
          <li> <a href="#">Bose Speaker</a></li>
          <li> <a href="#">Noise Speaker</a></li>
          <li> <a href="#">Boat Speaker</a></li>
          <li> <a href="#">Boult Speaker</a></li>
          <li> <a href="#">Mivi Speaker</a></li>
          <li> <a href="#">pTron Speaker</a></li>
    </ul>
   )}
  </li>
  <li>
    <button onClick={() => toogleInnerSubmenu("digital camera")}>
   Digital Camera {activeSubMenu === "digital camera" ? "▲" : "▼"}
    </button>
    {activeSubMenu === "digital camera" && (
    <ul className="inner-submenu">
      <li><a href="#">Canon</a></li>
        <li> <a href="#">Nikion</a></li>
        <li> <a href="#">Sony</a></li>
        <li> <a href="#">Fujifilm</a></li>
        <li> <a href="#">Panasonic Lumix</a></li>
        <li> <a href="#">Olympus</a></li>
        <li> <a href="#">GoPro</a></li>
        <li> <a href="#">DJI</a></li>
        <li> <a href="#">Insta360</a></li>
        <li> <a href="#">Kodak</a></li>
        <li> <a href="#">Leica</a></li>
    </ul>
   )}
  </li>
  </ul>
)}
  </li>

  <li>
   <button className="menu-item" onClick={() => toogleSubmenu("computers")}>
   Computers & Peripherals {activeMenu === "computers" ? "▲" : "▼"}
  </button>
  {activeMenu === "computers" && (
  <ul className="submenu">
  <li>Laptops</li>
  <li>Monitors</li>
  <li>Keyboards</li>
  <li>Mouse</li>
  <li>Graphic Card</li>
  <li>RAM</li>
  <li>Storage Drive</li>
  </ul>
  )}
 </li>
 <li>
   <button className="menu-item" onClick={() => toogleSubmenu("smarthome")}>
   Smart Home Devices {activeMenu === "smarthome" ? "▲" : "▼"}
  </button>
  {activeMenu === "smarthome" && (
  <ul className="submenu">
  <li>Laptops</li>
  <li>Monitors</li>
  <li>Keyboards</li>
  </ul>
  )}
 </li>
 <li>
   <button className="menu-item" onClick={() => toogleSubmenu("DIY")}>
   DIY Components {activeMenu === "DIY" ? "▲" : "▼"}
  </button>
  {activeMenu === "DIY" && (
  <ul className="submenu">
    <li>Laptops</li>
    <li>Monitors</li>
    <li>Keyboards</li>
  </ul>
  )}
 </li>
 <li>
   <button className="menu-item" onClick={() => toogleSubmenu("home appliance")}>
   Home Appliance {activeMenu === "home appliance" ? "▲" : "▼"}
  </button>
  {activeMenu === "home appliance" && (
  <ul className="submenu">
    <li>Refrigerator</li>
    <li>AC</li>
    <li>Oven</li>
    <li>Kitechen Chimeny</li>
  </ul>
  )}
 </li>
  </ul>
  </div>
  {/*main menu*/}
<ul className="second-list"> 
<li><div className="hyperlist"> <a className="hyperlink" href="#"> Consumer Electronics </a><div className="CONSUMER-ELECTRONICS-blank"><div className="black-blank"></div></div>
<div className="electronicslink">
<div className="electronicshlink">
    <div className="Smartphone"> <a href="#">Smartphones<span className="smartphone"><b>&gt;</b></span></a>
      <div className="smartphonelist"><p> Smartphones Brands</p>
        <ul>
          <li><Link to={`/search?brand=Apple`} onClick={handleLinkClick}> Apple</Link></li>
          <li><Link to={`/search?brand=Samsung`} onClick={handleLinkClick}> Samsung</Link></li>
          <li><Link to={`/search?brand=Xiaomi`} onClick={handleLinkClick}> Xiaomi</Link></li>
          <li><Link to={`/search?brand=Oppo`} onClick={handleLinkClick}> Oppo</Link></li>
          <li><Link to={`/search?brand=Vivo`} onClick={handleLinkClick}> Vivo</Link></li>
          <li><Link to={`/search?brand=Realme`} onClick={handleLinkClick}> Realme</Link></li>
          <li><Link to={`/search?brand=Oneplus`} onClick={handleLinkClick}> Oneplus</Link></li>
          <li><Link to={`/search?brand=Honor`} onClick={handleLinkClick}> Honor</Link></li>
          <li><Link to={`/search?brand=Iqoo`} onClick={handleLinkClick}> Iqoo</Link></li>
        </ul></div></div>
    <div className="Tablets"> <a href="#"> Tablets <span className="tablets"><b>&gt;</b></span></a>
      <div className="tabletlist"><p>Tablets</p>
        <ul>
          <li><a href="#"> Apple Tablet</a></li>
          <li> <a href="#">Samsung Tablet</a></li>
          <li> <a href="#">Xiaomi Tablet</a></li>
          <li> <a href="#">Oppo Tablet</a></li>
          <li> <a href="#">Realme Tablet</a></li>
          <li> <a href="#">Oneplus Tablet</a></li>
          <li> <a href="#">Honor Tablet</a></li>
        </ul></div></div>
    <div className="Headphone"> <a href="#">Headphone & Earbuds <span className="headphone"><b>&gt;</b></span></a>
      <div className="headphonelist"><p> Headphone & Earbuds</p>
        <ul>
          <li><a href="#"> Bose</a></li>
          <li> <a href="#">Sony</a></li>
          <li> <a href="#">Apple</a></li>
          <li> <a href="#">Sennheiser</a></li>
          <li> <a href="#">JBL</a></li>
          <li> <a href="#">Beat</a></li>
          <li> <a href="#">Realme</a></li>
          <li> <a href="#">Oneplus</a></li>
          <li> <a href="#">Mi</a></li>
        </ul></div></div>
    <div className="Smartwatch"> <a href="#">Smartwatches <span className="smartwatch"><b>&gt;</b></span></a>
      <div className="Smartwatchlist"><p>Smartwatches Brand</p>
        <ul>
          <li><a href="#">Samsung Galaxy watch</a></li>
          <li> <a href="#">Apple Watch</a></li>
          <li> <a href="#">Huawei Smartwatch</a></li>
          <li> <a href="#">Amazfit Smartwatch</a></li>
          <li> <a href="#">Oneplus watch</a></li>
          <li> <a href="#">Xiaomi watch</a></li>
          <li> <a href="#">Noise Smartwatch</a></li>
          <li> <a href="#">FireBoltt Smartwatch</a></li>
          <li> <a href="#">Boat Smartwatch</a></li>
          <li> <a href="#">FireBoltt Smartwatch</a></li>
          <li> <a href="#">Hammer Smartwatch</a></li>
        </ul></div></div>
    <div className="Portablespeaker"> <a href="#">Portable Speakers <span className="portablespeaker"><b>&gt;</b></span></a>
      <div className="Portablespeakerlist"><p>Portable Speakers</p>
        <ul>
          <li><a href="#">Tribit Speaker</a></li>
          <li> <a href="#">Marshall Speaker</a></li>
          <li> <a href="#">Anker Soundcore Speaker</a></li>
          <li> <a href="#">JBL Speaker</a></li>
          <li> <a href="#">Harman Kardon Speaker</a></li>
          <li> <a href="#">Bose Speaker</a></li>
          <li> <a href="#">Noise Speaker</a></li>
          <li> <a href="#">Boat Speaker</a></li>
          <li> <a href="#">Boult Speaker</a></li>
          <li> <a href="#">Mivi Speaker</a></li>
          <li> <a href="#">pTron Speaker</a></li>
        </ul></div></div>
    <div className="Camera"> <a href="#">Digital Camera <span className="camera"><b>&gt;</b></span></a>
      <div className="Cameralist"><p>Digital Camera </p>
        <ul>
          <li><a href="#">Canon</a></li>
          <li> <a href="#">Nikion</a></li>
          <li> <a href="#">Sony</a></li>
          <li> <a href="#">Fujifilm</a></li>
          <li> <a href="#">Panasonic Lumix</a></li>
          <li> <a href="#">Olympus</a></li>
          <li> <a href="#">GoPro</a></li>
          <li> <a href="#">DJI</a></li>
          <li> <a href="#">Insta360</a></li>
          <li> <a href="#">Kodak</a></li>
          <li> <a href="#">Leica</a></li>
        </ul>
        <div className="movelist-blank"></div></div></div>
  

</div>
 <a href="#"><img src={Electronics} alt="not_load"/></a> 
</div>
</div></li>
<li className="Nlist"><div className="hyperlist"> <a className="hyperlink" href="#"> Computers & Peripherals</a><div className="computerlist-blank"><div className="black-blank1"></div></div></div></li>
<li className="Nlist"> <div className="hyperlist"> <a className="hyperlink" href="#"> Smart Home Devices </a><div className="smarthomelist-blank"><div className="black-blank2"></div></div></div></li>
<li className="Nlist"><div className="hyperlist"> <a className="hyperlink" href="#"> DIY Components </a><div className="DIYcomponentlist-blank"><div className="black-blank3"></div></div></div></li>
<li className="Nlist"> <div className="hyperlist"> <a className="hyperlink" href="#"> Home Appliances </a><div className="homeappliancelist-blank"><div className="black-blank4"></div></div></div></li>
</ul>
</div>
</>
    );
};
export default Header;