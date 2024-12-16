"use client";

import React, { useEffect, useState } from "react";
import { getImages } from "@/lib/awsImages";
import { TaskCounterProps } from "@/constant/type";
import { cn } from "@/lib/utils";

const TaskCounter: React.FC<TaskCounterProps> = ({ prefix }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [taskCounter, setTaskCounter] = useState<number>(0);

  useEffect(() => {
    const fetchTaskCounter = async () => {
      setLoading(true);
      try {
        const images = await getImages(prefix);
        setTaskCounter(images.length);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskCounter();
  }, [prefix]);

  return (
    <div className={cn(
      "absolute right-2 top-2",
      "min-w-[22px] h-[22px]",
      "flex items-center justify-center",
      "text-[10px] font-medium",
      "text-primary",
      "bg-primary/10",
      "border border-primary/30",
      "rounded-full px-1.5",
      "transition-all duration-300",
      "group-hover:bg-primary/20",
      "group-hover:border-primary/50",
      "group-hover:scale-110",
      "z-20"
    )}>
      {loading ? <CircularLoader /> : taskCounter}
    </div>
  );
};

const CircularLoader: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className={cn(
      "h-3 w-3",
      "animate-spin",
      "rounded-full",
      "border-2 border-primary/20",
      "border-t-primary",
      "transition-colors duration-300"
    )}></div>
  </div>
);

export default TaskCounter;