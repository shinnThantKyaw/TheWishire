"use client";

import { useEffect } from "react";
import type { StepProps } from "../types";

export const GiftStep = ({ onValidityChange }: StepProps) => {
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Gift</h2>
        <p className="text-sm text-muted-foreground">Challenge gate, main gift, and bonus rewards</p>
      </div>
      <p className="text-sm text-muted-foreground">Coming in the next step of this wave.</p>
    </div>
  );
};
