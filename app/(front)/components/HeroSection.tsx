"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#1B0F06] via-[#2C170C] to-[#3D1F10] overflow-hidden">
      {/* Dark background blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-12 left-6 w-[30rem] h-[30rem] bg-[#3D1F10] rounded-full blur-[200px]"></div>
        <div className="absolute bottom-12 right-6 w-[30rem] h-[30rem] bg-[#2C170C] rounded-full blur-[200px]"></div>
      </div>

      {/* Texture overlay */}
      <div className="absolute inset-0 bg-[url('/subtle-coffee-texture-pattern.jpg')] opacity-15 mix-blend-overlay"></div>

      <div className="container relative mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Side - New Darker Image Design */}
          <div className="relative order-2 lg:order-1 flex justify-center items-center">
            <div className="relative w-[30rem] h-[30rem] lg:w-[30rem] lg:h-[35rem] rounded-[.5rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
              {/* Dark gradient base */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-[#3D1F10]/20 to-black/60 rounded-[2rem] blur-2xl"></div>

              {/* Main coffee image */}
              <Image
                src="/1.png"
                alt="Premium coffee beans in C shape"
                fill
                className="object-cover"
                priority
              />

              {/* Floating golden highlights */}
              <div className="absolute -top-8 -left-6 w-24 h-24 bg-[#FFD9A6]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-12 w-36 h-36 bg-[#FFD9A6]/15 rounded-full blur-3xl animate-pulse"></div>

              {/* Abstract floating coffee beans (circles) */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full bg-[#D2A679]/30 ${
                    i % 2 === 0
                      ? `w-5 h-5 top-[${10 + i * 5}%] left-[${5 + i * 10}%] animate-bounce-slow`
                      : `w-3 h-3 bottom-[${5 + i * 8}%] right-[${10 + i * 7}%] animate-bounce-slow`
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="inline-block relative">
              <p className="text-[#FFF3E0] text-xs md:text-sm font-bold tracking-[0.25em] uppercase relative z-10">
                Exceptional Quality
              </p>
              <span className="absolute inset-0 bg-[#D2A679]/15 blur-lg rounded-full"></span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#FFF3E0] leading-[1.1] drop-shadow-lg">
              Coffee is more than
              <br />
              <span className="text-[#FFD9A6]">just a cashcrop</span>
            </h1>

            <p className="text-base md:text-lg text-[#FFF3E0]/85 max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-md">
              Discover the depth and richness of hand-picked, sustainably
              sourced coffee beans. Our coffee system delivers elegance in every
              cup.
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#D2A679] to-[#C17F3A] hover:from-[#C17F3A] hover:to-[#8B4513] text-white font-semibold px-10 py-7 text-base rounded-full shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-[#8B4513]/50 transition-all duration-300 hover:scale-105"
              >
                Explore the Coffee System
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 opacity-70">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#FFD9A6] rounded-full"
                  ></div>
                ))}
              </div>
              <span className="text-[#FFF3E0]/70 text-xs uppercase tracking-wider">
                Premium Selection
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
