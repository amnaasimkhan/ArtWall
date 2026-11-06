import axios from "axios";

const CheckoutButton = ({ cartItems, email }) => {
  const handleCheckout = async () => {
    try {
      const res = await axios.post("/api/checkout/stripe", {
        items: cartItems,
        customerEmail: email,
      });

      // redirect to Stripe checkout
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Try again.");
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
};

export default CheckoutButton;