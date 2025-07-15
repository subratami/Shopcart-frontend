import React, { useState } from "react";
import { useCart } from "../component/CartContext";
import { convertDriveLinkToEmbed } from "../utils/imageHelpers";
import "./cart.css"


const Cart: React.FC = () => {
  const {
    cart,
    loading,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    checkout,
  } = useCart();

  const [coupon, setCoupon] = useState<string>("");
  const [checkoutMsg, setCheckoutMsg] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  if (loading) return <div className='carterror'><span>⏳ Loading cart...</span></div>;
  if (!cart.items.length) return <div className="carterror">😕 Your cart is empty. ADD<br/> &nbsp;Refresh or Login Again 😕</div>;

  const handleQuantityChange = (product_id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartItem(product_id, quantity);
  };

  const handleRemove = (product_id: string) => {
    removeFromCart(product_id);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim()) {
      await applyCoupon(coupon.trim());
      setCoupon("");
    }
  };

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      const res = await checkout();
      setCheckoutMsg(res.message);
    } catch {
      setCheckoutMsg("Checkout failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (<>
    
    <div className="cartlist">
      <div className="cartheader"><h2>Your Cart</h2>
      <ul className="cart-ul-reset">
        {cart.items.map((item) => (
          <li key={item.product_id} className="cart-li-reset">
            <div className="product-photo"><img src={convertDriveLinkToEmbed(item.image)} alt="error" /> </div>
            <div className="cart-description">
            <span className="cartitem-name">
              <strong>
                {item.brand || ""} {item.model || ""} {item.color || ""}
              </strong></span>
             <span className="cartitem-name"> {item.memory || ""} {item.storage || ""}<br/>
            ₹{item.price}&nbsp;{" "}</span>
            <div className="cart-qty">
            <div className="cart-qty-controls">
            <button
             onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
      className="cart-qty-btn cart-qty-btn-minus"
            >
              -
            </button>
            <input
              type="text"
              min="1"
              value={item.quantity}
              //onChange={(e) =>
               // handleQuantityChange(item.product_id, parseInt(e.target.value))
             // }
              className="cart-qty-input"
            />
            <button
      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
      className="cart-qty-btn cart-qty-btn-plus"
    >
      +
    </button>
        </div>
            <button
                className="cart-remove-btn"
                onClick={() => handleRemove(item.product_id)}
              >
                Remove
              </button> </div> </div>
            <span className="subtotal"><strong> ₹{item.subtotal} </strong> </span>
            
          </li>
        ))}
      </ul>
      </div>
        <div className="cartbottom">
      <form onSubmit={handleApplyCoupon} className="cart-coupon-form">
        <input
          type="text"
          placeholder="Coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="cart-coupon-input"
        />
        <button type="submit" className="cart-coupon-btn">Apply Coupon</button>
        {cart.coupon && (
          <div className="cart-coupon-applied">
            Applied coupon: <strong>{cart.coupon}</strong>
          </div>
        )}
      </form>

      <hr className="cart-hr-margins" />

      <div className="cart-total-block">
        <div>Discount: ₹{cart.discount_total}</div>
        <div className="cart-final-total">
          <strong>Total: ₹{cart.final_total}</strong>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="cart-checkout-btn"
        disabled={processing}
      >
        {processing ? "Processing..." : "Checkout"}
      </button>

      {checkoutMsg && (
        <div className="cart-checkout-msg">{checkoutMsg}</div>
      )}
      </div>
    </div>
    </>
  );
};

export default Cart;
