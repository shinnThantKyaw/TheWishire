/**
 * Confetti preset configurations for different occasions.
 * Uses canvas-confetti with emoji shapes via shapeFromText.
 */

const loadConfetti = async () => {
  const mod = await import("canvas-confetti");
  return mod.default;
};

/** Birthday celebration — balloons + cake emojis */
export const birthdayBurst = async () => {
  const confetti = await loadConfetti();
  const balloon = confetti.shapeFromText({ text: "🎈", scalar: 1.5 });
  const cake = confetti.shapeFromText({ text: "🎂", scalar: 1.5 });
  const star = confetti.shapeFromText({ text: "⭐", scalar: 1.2 });

  const defaults = {
    spread: 360,
    ticks: 80,
    gravity: 0.6,
    decay: 0.94,
    startVelocity: 25,
    zIndex: 100,
  };

  confetti({ ...defaults, particleCount: 30, shapes: [balloon], scalar: 1.5 });
  setTimeout(
    () => confetti({ ...defaults, particleCount: 20, shapes: [cake], scalar: 1.8 }),
    150,
  );
  setTimeout(
    () => confetti({ ...defaults, particleCount: 40, shapes: [star], scalar: 1 }),
    300,
  );
};

/** Love / Anniversary — hearts + roses */
export const loveBurst = async () => {
  const confetti = await loadConfetti();
  const heart = confetti.shapeFromText({ text: "❤️", scalar: 1.5 });
  const rose = confetti.shapeFromText({ text: "🌹", scalar: 1.3 });
  const sparkle = confetti.shapeFromText({ text: "✨", scalar: 1.2 });

  const defaults = {
    spread: 360,
    ticks: 80,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 22,
    zIndex: 100,
    colors: ["#E91E63", "#F48FB1", "#CE93D8", "#FF80AB"],
  };

  confetti({ ...defaults, particleCount: 25, shapes: [heart], scalar: 1.5 });
  setTimeout(
    () => confetti({ ...defaults, particleCount: 20, shapes: [rose], scalar: 1.3 }),
    200,
  );
  setTimeout(
    () => confetti({ ...defaults, particleCount: 30, shapes: [sparkle] }),
    350,
  );
};

/** Generic celebration — party poppers */
export const celebrationBurst = async () => {
  const confetti = await loadConfetti();

  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 1,
    decay: 0.92,
    startVelocity: 35,
    zIndex: 100,
  };

  confetti({ ...defaults, particleCount: 100, origin: { x: 0.5, y: 0.5 } });
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 60,
      origin: { x: 0.3, y: 0.5 },
      startVelocity: 30,
    });
    confetti({
      ...defaults,
      particleCount: 60,
      origin: { x: 0.7, y: 0.5 },
      startVelocity: 30,
    });
  }, 150);
};

/** Gift reveal — presents + stars */
export const giftRevealBurst = async () => {
  const confetti = await loadConfetti();
  const gift = confetti.shapeFromText({ text: "🎁", scalar: 1.5 });
  const star = confetti.shapeFromText({ text: "⭐", scalar: 1.2 });

  const defaults = {
    spread: 360,
    ticks: 70,
    gravity: 0.7,
    decay: 0.93,
    startVelocity: 28,
    zIndex: 100,
  };

  confetti({ ...defaults, particleCount: 30, shapes: [gift], scalar: 1.5 });
  setTimeout(
    () => confetti({ ...defaults, particleCount: 40, shapes: [star] }),
    200,
  );
};

/** Winning moment — trophy + confetti */
export const winBurst = async () => {
  const confetti = await loadConfetti();
  const trophy = confetti.shapeFromText({ text: "🏆", scalar: 1.8 });

  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.4,
    decay: 0.95,
    startVelocity: 20,
    zIndex: 100,
    colors: ["#FFD700", "#FFA000", "#FF6F00", "#F48FB1"],
  };

  confetti({ ...defaults, particleCount: 15, shapes: [trophy], scalar: 2 });
  setTimeout(
    () =>
      confetti({
        ...defaults,
        particleCount: 80,
        shapes: ["circle", "square"],
      }),
    300,
  );
};
