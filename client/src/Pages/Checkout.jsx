import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader2, ShoppingBag, ShoppingCart } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import api from "../Services/api";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    loading: cartLoading,
    subtotal,
    totalCount,
    clearCart
  } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const fullNameTrim = form.fullName.trim();
    if (!fullNameTrim) {
      newErrors.fullName = "Full name is required";
    }

    const phoneTrim = form.phone.trim();
    if (!phoneTrim) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phoneTrim)) {
      newErrors.phone = "Phone must be a valid 10-digit Indian phone number";
    }

    const addressTrim = form.addressLine1.trim();
    if (!addressTrim) {
      newErrors.addressLine1 = "Address is required";
    }

    const cityTrim = form.city.trim();
    if (!cityTrim) {
      newErrors.city = "City is required";
    }

    const stateTrim = form.state.trim();
    if (!stateTrim) {
      newErrors.state = "State is required";
    }

    const pincodeTrim = form.pincode.trim();
    if (!pincodeTrim) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincodeTrim)) {
      newErrors.pincode = "Pincode must contain exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      return;
    }

    if (cartItems.length === 0) {
      setServerError("Your cart is empty. Please add products to checkout.");
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const createRes = await api.post("/orders/create-payment-order", {
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          addressLine1: form.addressLine1.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim()
        }
      });

      const {
        key,
        amount,
        currency,
        razorpayOrderId,
        shopKartOrderId
      } = createRes.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setLoading(false);
        setServerError("Failed to load Razorpay SDK. Please check your connection.");
        return;
      }

      const options = {
        key,
        amount,
        currency: currency || "INR",
        name: "ShopKart",
        description: "Order Checkout Payment",
        order_id: razorpayOrderId,
        prefill: {
          name: form.fullName.trim(),
          contact: form.phone.trim()
        },
        theme: {
          color: "#8B0D1A"
        },
        handler: async function (paymentResponse) {
          try {
            const verifyRes = await api.post("/orders/verify-payment", {
              shopKartOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature
            });

            if (verifyRes.data.success) {
              clearCart();
              navigate(`/order-success/${shopKartOrderId}`, {
                state: { order: verifyRes.data.order }
              });
            } else {
              setServerError("Payment verification failed. Your cart has not been cleared.");
              setLoading(false);
            }
          } catch (verifyError) {
            setLoading(false);
            setServerError(
              verifyError.response?.data?.message ||
              "Payment verification failed. Your cart has not been cleared."
            );
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (failResponse) {
        setLoading(false);
        setServerError(
          failResponse.error?.description ||
          "Payment failed. Your cart has not been cleared."
        );
      });

      razorpayInstance.open();
    } catch (err) {
      setLoading(false);
      setServerError(
        err.response?.data?.message || "Unable to create payment order. Please try again."
      );
    }
  };

  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10 text-[#8B0D1A]">
            <ShoppingCart size={36} />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-[#F5F2ED]">
            Your Cart is Empty
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#b8b3ab]">
            You cannot proceed to checkout with an empty cart. Please add some items to your cart first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-xl border border-[#2c2c2c] bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F5F2ED] transition hover:border-[#8B0D1A] hover:bg-[#8B0D1A]/15"
            >
              <ShoppingCart size={16} />
              Return to Cart
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 rounded-xl bg-[#8B0D1A] px-6 py-3 text-sm font-semibold text-[#F5F2ED] shadow-md shadow-[#8B0D1A]/30 transition hover:bg-[#a81323]"
            >
              <ShoppingBag size={16} />
              Browse Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#b8b3ab] hover:text-[#F5F2ED]"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </button>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B0D1A]">
            Checkout
          </p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
            Complete Your Order
          </h1>
          <p className="mt-2 text-sm text-[#b8b3ab]">
            Enter your shipping details and review your order.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[#8B0D1A]/50 bg-[#8B0D1A]/15 p-4 text-sm text-[#F5F2ED]">
            <span>{serverError}</span>
            <button
              onClick={() => setServerError("")}
              className="ml-4 text-xs font-bold underline hover:text-[#8B0D1A]"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-xl">
              <h2 className="mb-6 text-xl font-bold">Shipping Details</h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name <span className="text-[#8B0D1A]">*</span>
                  </label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] px-4 py-3 text-sm text-[#F5F2ED] outline-none transition focus:border-[#8B0D1A]"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-[#8B0D1A]">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number <span className="text-[#8B0D1A]">*</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] px-4 py-3 text-sm text-[#F5F2ED] outline-none transition focus:border-[#8B0D1A]"
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-[#8B0D1A]">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Pincode <span className="text-[#8B0D1A]">*</span>
                  </label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] px-4 py-3 text-sm text-[#F5F2ED] outline-none transition focus:border-[#8B0D1A]"
                    placeholder="6-digit pincode"
                  />
                  {errors.pincode && (
                    <p className="mt-1.5 text-xs text-[#8B0D1A]">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Address <span className="text-[#8B0D1A]">*</span>
                  </label>
                  <textarea
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] px-4 py-3 text-sm text-[#F5F2ED] outline-none transition focus:border-[#8B0D1A]"
                    placeholder="House / Flat no, Street, Landmark"
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1.5 text-xs text-[#8B0D1A]">
                      {errors.addressLine1}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City <span className="text-[#8B0D1A]">*</span>
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] px-4 py-3 text-sm text-[#F5F2ED] outline-none transition focus:border-[#8B0D1A]"
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-xs text-[#8B0D1A]">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    State <span className="text-[#8B0D1A]">*</span>
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#2c2c2c] bg-[#0B0B0B] px-4 py-3 text-sm text-[#F5F2ED] outline-none transition focus:border-[#8B0D1A]"
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="mt-1.5 text-xs text-[#8B0D1A]">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-[#242424] bg-[#141414] p-6 shadow-xl">
              <h2 className="mb-5 text-lg font-bold">Order Summary</h2>

              <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.product?._id || item._id}
                    className="flex items-center justify-between gap-3 border-b border-[#242424]/60 pb-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product?.name}
                          className="h-12 w-12 shrink-0 rounded-lg border border-[#2c2c2c] object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#F5F2ED]">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-[#7a7670]">
                          ₹{item.product?.price?.toLocaleString("en-IN")} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-[#F5F2ED]">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-[#242424]" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#b8b3ab]">
                  <span>Total Items</span>
                  <span className="font-semibold text-[#F5F2ED]">
                    {totalCount}
                  </span>
                </div>
                <div className="flex justify-between text-[#b8b3ab]">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#8B0D1A]">FREE</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#242424] pt-4">
                <span className="font-bold text-[#F5F2ED]">Total Amount</span>
                <span className="text-2xl font-extrabold text-[#F5F2ED]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B0D1A] py-3.5 text-sm font-bold text-[#F5F2ED] shadow-lg shadow-[#8B0D1A]/30 transition hover:bg-[#a81323] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Place Order & Pay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;