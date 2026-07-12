"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ExploreCardProps {
  title: string;
  description: string;
  bgImage: string;
  href: string;
  index: number;
}

export default function ExploreCard({ title, description, bgImage, href, index }: ExploreCardProps) {
  return (
    <Link href={href} className="block relative w-full h-[400px] sm:h-[450px] group rounded-3xl overflow-hidden shadow-2xl">
      <motion.div
        className="w-full h-full relative"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover="hover"
      >
        {/* Background Image Wrapper for Scaling */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          variants={{
            hover: { scale: 1.03 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500"
          variants={{
            hover: { opacity: 0.8 } // Brighten image by making overlay slightly more transparent/lighter if needed, wait actually the requirement was "increase image brightness on hover". Let's use CSS brightness filter.
          }}
        />
        
        {/* Actual brightness increase on the whole card or just image? The requirement: "scale to 1.03 on hover, increase image brightness on hover". We can add brightness to the image wrapper or just reduce the overlay opacity. Let's do both. */}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 text-white">
          <motion.h3 
            className="text-3xl sm:text-4xl font-bold tracking-wide mb-3 drop-shadow-lg"
            variants={{
              hover: { y: -5 }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="text-gray-300 text-lg sm:text-xl max-w-xl font-medium drop-shadow-md"
            variants={{
              hover: { y: -5, color: "#ffffff" }
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </Link>
  );
}
