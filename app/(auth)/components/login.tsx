"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { AiOutlineSwapLeft, AiOutlineSwapRight } from "react-icons/ai";
import { loginUser } from "../actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const defaultCarouselImages = [
  {
    url: "https://img.freepik.com/premium-photo/falling-coffee-beans-dark-background-with-copy-space_88281-11.jpg?ga=GA1.1.1341149691.1749741454&w=740&q=80",
    alt: "Coffee beans in warehouse",
  },
  // {
  //   url: "https://img.freepik.com/premium-photo/background-with-coffee-beans_152625-2490.jpg?ga=GA1.1.1341149691.1749741454&w=740&q=80",
  //   alt: "Coffee processing facility",
  // },
  {
    url: "https://img.freepik.com/free-photo/coffee-beans-top-view-background_24972-2311.jpg?ga=GA1.1.1341149691.1749741454&semt=ais_hybrid&w=740&q=80",
    alt: "Coffee warehouse storage",
  },
  {
    url: "https://img.freepik.com/free-photo/coffee-beans-top-view-background_24972-2311.jpg?ga=GA1.1.1341149691.1749741454&semt=ais_hybrid&w=740&q=80",
    alt: "Coffee warehouse storage",
  },
];

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router=useRouter()
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % defaultCarouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + defaultCarouselImages.length) % defaultCarouselImages.length
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % defaultCarouselImages.length);
  };

  const validateEmail = (email: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      const loginData = {
        email: email,
        password: password,
      };
      setIsLoading(true);
      const res = await loginUser(loginData);
      if (res.success) {
        setEmail("");
        setPassword("");
        setIsLoading(false);
        toast.success(`Welcomeback into your ${res.data?.user.name}`);
        router.push("/dashboard")
      } else {
        setIsLoading(false);
        toast.error("Wrong credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden ">
      {/* Right Side - Image Carousel (positioned first for z-index) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
        {defaultCarouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-transparent via-80% to-transparent to-transparent z-0"></div>

        <div className="absolute bottom-6 right-8 flex items-center space-x-2 z-10">
          <button
            onClick={handlePrevImage}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
              currentImageIndex > 0
                ? "bg-primary hover:bg-primary"
                : "bg-white/90 hover:bg-white"
            }`}
            aria-label="Previous image"
          >
            <AiOutlineSwapLeft
              className={`h-5 w-5 rotate-x-180 ${
                currentImageIndex > 0 ? "text-white" : "text-gray-800"
              }`}
            />
          </button>
          <button
            onClick={handleNextImage}
            className="w-10 h-10 rounded-full bg-primary hover:bg-primary flex items-center justify-center transition-all shadow-lg cursor-pointer"
            aria-label="Next image"
          >
            <AiOutlineSwapRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Left Side - Login Form with seamless gradient blend */}
      <div className="relative z-10 flex-1 lg:flex-none lg:w-[65%] flex items-center md:items-start justify-center p-2">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full">
          <button
            className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            onClick={() => alert("Back to home")}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>

          <div className="w-full max-w-md mx-auto pt-20 md:pt-38">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CMS</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Coffee Management
                  </h2>
                  <p className="text-xs text-gray-500">System Portal</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-500">
                Please Log in to your account.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder=""
                    className="w-full h-12 px-4 border  rounded-lg border-primary ring-2 ring-primary/20 outline-none transition-all text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="* * * * * *"
                    className="w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg border-primary ring-2 ring-primary/20 outline-none transition-all text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-400 rounded ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  onClick={() =>
                    alert("Forgot password functionality coming soon!")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="button"
                className="w-full h-12 bg-primary hover:bg-primary text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                By signing in you agree to our terms and data policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
