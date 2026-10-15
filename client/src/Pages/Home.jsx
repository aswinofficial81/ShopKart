import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import Navbar from "../components/Navbar";

import {
  User,
  Mail,
  Phone,
} from "lucide-react";

function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/customers/me");

        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.log(error.response?.data);

        setError("Please login to continue");
        navigate("/login");
      }
    };

    getProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B]">
        <p className="text-[#b8b3ab]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2ED]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#8B0D1A]">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#F5F2ED]">
            Welcome, {user.fullName}! 👋
          </h1>

          <p className="mt-2 text-[#b8b3ab]">
            Here are your ShopKart account details.
          </p>
        </div>

        <div className="rounded-2xl border border-[#262626] bg-[#141414] p-8 shadow-2xl">
          <h2 className="mb-6 text-xl font-bold text-[#F5F2ED]">
            Your Profile
          </h2>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-[#242424] bg-[#0B0B0B] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B0D1A]/30 bg-[#8B0D1A]/10">
                <User size={20} className="text-[#8B0D1A]" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a7670]">
                Full Name
              </p>

              <p className="mt-1 font-semibold text-[#F5F2ED]">
                {user.fullName}
              </p>
            </div>

            <div className="rounded-xl border border-[#242424] bg-[#0B0B0B] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B0D1A]/30 bg-[#8B0D1A]/10">
                <Mail size={20} className="text-[#8B0D1A]" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a7670]">
                Email
              </p>

              <p className="mt-1 break-all font-semibold text-[#F5F2ED]">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border border-[#242424] bg-[#0B0B0B] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B0D1A]/30 bg-[#8B0D1A]/10">
                <Phone size={20} className="text-[#8B0D1A]" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a7670]">
                Phone
              </p>

              <p className="mt-1 font-semibold text-[#F5F2ED]">
                {user.phone}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-[#8B0D1A]">
            {error}
          </p>
        )}
      </main>
    </div>
  );
}

export default Home;