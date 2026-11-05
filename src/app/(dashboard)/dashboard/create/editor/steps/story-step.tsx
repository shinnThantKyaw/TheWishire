"use client";

import { useEffect } from "react";
import type { StepProps } from "../types";

export const StoryStep = ({ onValidityChange }: StepProps) => {
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Story</h2>
        <p className="text-sm text-muted-foreground">Letter, poem, and birthday facts</p>
      </div>
      <p className="text-sm text-muted-foreground">Coming in the next step of this wave.</p>
    </div>
  );
};
