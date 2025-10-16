"use client";

import { useState, useEffect } from "react";

export function useBasicHouses() {
  const [levels, setLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock levels data
    setLevels([{ id: "level-1", title: "WhereHouse one" }]);
    setIsLoading(false);
  }, []);

  return { levels, isLoading };
}
