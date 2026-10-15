import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api";
import {
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

function Register() {
const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Full name  is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!phone) {
      setError("Phone number is required");
      return;
    }

    setError("");

try {
  const response = await api.post("/customers/register", {
    fullName: fullName,
    email,
    password,
    phone,
  });

  console.log(response.data);

  navigate("/login");

} catch (error) {
  setError(
    error.response?.data?.message || "Something went wrong"
  );
}
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0B0B] text-[#F5F2ED]">
      {/* Ambient glows */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#8B0D1A]/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#8B0D1A]/10 blur-3xl" />

      {/* Brand */}
      <div className="absolute left-8 top-7 flex items-center gap-3 sm:left-12 sm:top-9">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B0D1A] shadow-lg shadow-[#8B0D1A]/30">
          <span className="text-xl">🛒</span>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#F5F2ED]">
            Shop<span className="text-[#8B0D1A]">Kart</span>
          </h2>

          <p className="text-[10px] font-medium tracking-wide text-[#7a7670]">
            CLEAN • PREMIUM • TIMELESS
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="relative flex min-h-screen items-center justify-center px-5 py-24">
        {/* Card */}
        <div className="w-full max-w-[540px] rounded-[22px] border border-[#242424] bg-[#141414] px-7 py-9 shadow-2xl shadow-black/80 sm:px-12 sm:py-11">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#8B0D1A]/30 bg-[#8B0D1A]/10">
              <UserPlus
                size={27}
                strokeWidth={2}
                className="text-[#8B0D1A]"
              />
            </div>

            <h1 className="text-[30px] font-extrabold tracking-tight text-[#F5F2ED]">
              Create Account
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#b8b3ab]">
              Join ShopKart and start your shopping journey today.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-[#8B0D1A]/50 bg-[#8B0D1A]/15 px-4 py-3 text-sm font-medium text-[#F5F2ED]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="flex h-[55px] items-center rounded-xl border border-[#282828] bg-[#0B0B0B] px-4 transition-all focus-within:border-[#8B0D1A] focus-within:ring-4 focus-within:ring-[#8B0D1A]/15">
              <User
                size={19}
                className="mr-4 shrink-0 text-[#7a7670]"
              />

              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-full w-full bg-transparent text-sm text-[#F5F2ED] outline-none placeholder:text-[#7a7670]"
              />
            </div>

            {/* Email */}
            <div className="flex h-[55px] items-center rounded-xl border border-[#282828] bg-[#0B0B0B] px-4 transition-all focus-within:border-[#8B0D1A] focus-within:ring-4 focus-within:ring-[#8B0D1A]/15">
              <Mail
                size={19}
                className="mr-4 shrink-0 text-[#7a7670]"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-full w-full bg-transparent text-sm text-[#F5F2ED] outline-none placeholder:text-[#7a7670]"
              />
            </div>

            {/* Password */}
            <div className="flex h-[55px] items-center rounded-xl border border-[#282828] bg-[#0B0B0B] px-4 transition-all focus-within:border-[#8B0D1A] focus-within:ring-4 focus-within:ring-[#8B0D1A]/15">
              <Lock
                size={19}
                className="mr-4 shrink-0 text-[#7a7670]"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-full w-full bg-transparent text-sm text-[#F5F2ED] outline-none placeholder:text-[#7a7670]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#7a7670] transition hover:text-[#F5F2ED]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Phone */}
            <div className="flex h-[55px] items-center rounded-xl border border-[#282828] bg-[#0B0B0B] px-4 transition-all focus-within:border-[#8B0D1A] focus-within:ring-4 focus-within:ring-[#8B0D1A]/15">
              <Phone
                size={19}
                className="mr-4 shrink-0 text-[#7a7670]"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-full w-full bg-transparent text-sm text-[#F5F2ED] outline-none placeholder:text-[#7a7670]"
              />
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-center gap-3 py-2 text-[13px] text-[#b8b3ab]">
              <input
                type="checkbox"
                className="h-[17px] w-[17px] cursor-pointer rounded border-[#2c2c2c] bg-[#0B0B0B] accent-[#8B0D1A]"
              />

              <span>
                I agree to all statements in{" "}
                <a
                  href="#"
                  className="font-semibold text-[#F5F2ED] underline hover:text-[#8B0D1A]"
                >
                  Terms of Service
                </a>
              </span>
            </label>

            {/* Create Account */}
            <button
              type="submit"
              className="group mt-1 flex h-[55px] w-full items-center justify-center gap-3 rounded-xl bg-[#8B0D1A] text-sm font-bold text-[#F5F2ED] shadow-lg shadow-[#8B0D1A]/30 transition-all duration-200 hover:bg-[#a81323] hover:shadow-[#8B0D1A]/40 active:translate-y-0"
            >
              <UserPlus size={19} />
              <span>Create Account</span>
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Login */}
          <div className="mt-8 border-t border-[#242424] pt-6 text-center text-sm text-[#b8b3ab]">
            Have already an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#F5F2ED] underline hover:text-[#8B0D1A]"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;