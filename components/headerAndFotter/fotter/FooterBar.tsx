"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "../../ui/BackButton";
import ToggleVisibilityButton from "./ToggleVisibilityButton";
import DynmicLangSwicher from "./language/DynamicLangSwicher";
import DynmicThemeSwicher from "./theme/DynamicLangSwicher";
import DynamicWhatsAppButton from "./whatapp/DynamicWhatsAppButton";
import DynamicContactUs from "./contactus/DynamicWhatsAppButton";
import DynmicLogout from "./logout/DynmicLogout";

export default function FooterBar() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed right-4 bottom-20 h-[300px] w-[50px] flex items-center justify-center transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, height: 0, scale: 0.9 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          height: isVisible ? "300px" : 0,
          scale: isVisible ? 1 : 0.9,
        }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.3 },
          scale: { duration: 0.4 },
        }}
        className="border border-border/40 rounded-full flex flex-col w-[50px] items-center 
                  transition-all bg-background/80 backdrop-blur-sm h-[300px] justify-around 
                  shadow-lg hover:shadow-xl hover:bg-background/90 
                  dark:shadow-secondary/20"
      >
        <div className="flex flex-col gap-4 py-4">
          <DynamicWhatsAppButton />
          <DynamicContactUs />
          <DynmicLangSwicher />
          <DynmicThemeSwicher />
          <DynmicLogout />
        </div>
      </motion.div>
      <div className="absolute -right-1 bottom-0 flex flex-col gap-2">
        <ToggleVisibilityButton
          onClick={toggleVisibility}
          isVisible={isVisible}
        />
        <BackButton />
      </div>
    </div>
  );
}