"use client";

import { useEffect } from "react";
import type { StepProps } from "../types";

export const ExperienceStep = ({ onValidityChange }: StepProps) => {
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Experience</h2>
        <p className="text-sm text-muted-foreground">Gate, start action, flow mode, decorations, music</p>
      </div>
      <p className="text-sm text-muted-foreground">Coming in the next step of this wave.</p>
    </div>
  );
};
