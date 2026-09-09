// 한국의 결 — script.js

gsap.registerPlugin(ScrollTrigger);

const SCENE_IDS = ["hero", "seoraksan", "jeju", "suncheon-bay", "boseong-tea-fields", "outro"];

const mm = gsap.matchMedia();

// ---------------------------------------------------------------------
// Desktop journey: one pinned .journey element + one master scrubbed
// timeline (research.md §2). No per-scene pins, no scroll-snap, no
// wheel hijacking — scrub tracks native scroll position continuously.
// ---------------------------------------------------------------------
mm.add("(prefers-reduced-motion: no-preference) and (min-width: 900px)", () => {
  document.body.classList.add("is-pinned-journey");

  const journey = document.querySelector(".journey");
  const scenes = SCENE_IDS.map((id) => document.getElementById(id));

  const SLOT = 1; // arbitrary timeline units per scene
  const OVERLAP = 0.25; // 25% overlap between consecutive scenes (FR-008)
  const STEP = SLOT * (1 - OVERLAP);

  const tl = gsap.timeline({
    defaults: { ease: "none" },
  });

  scenes.forEach((scene, i) => {
    const startTime = i * STEP;
    const image = scene.querySelector(".scene__image");
    const panel = scene.querySelector(".scene__panel");
    const textEls = panel ? Array.from(panel.children) : [];

    // Incoming: image scales down into frame while fading in (research.md §4's
    // "tunnel" approach). First scene is already fully in from time 0.
    if (i === 0) {
      gsap.set(scene, { opacity: 1 });
      gsap.set(image, { scale: 1, opacity: 1 });
    } else {
      gsap.set(scene, { opacity: 0 });
      gsap.set(image, { scale: 1.15, opacity: 0 });
      tl.to(scene, { opacity: 1, duration: OVERLAP }, startTime);
      tl.to(image, { scale: 1, opacity: 1, duration: OVERLAP }, startTime);
    }

    // Text: fades + translates in with a slight stagger after the image,
    // and holds for the bulk of the slot so body copy stays readable
    // (FR-009) before the next scene's overlap begins.
    if (textEls.length) {
      gsap.set(textEls, { opacity: 0, y: 24 });
      tl.to(
        textEls,
        { opacity: 1, y: 0, duration: OVERLAP * 0.8, stagger: 0.06 },
        startTime + OVERLAP * 0.2
      );
    }

    // Outgoing: continue fading this scene out across the overlap window
    // shared with the next scene's incoming tween (the cross-fade).
    if (i < scenes.length - 1) {
      const exitStart = startTime + SLOT - OVERLAP;
      tl.to(image, { scale: 1.05, opacity: 0, duration: OVERLAP }, exitStart);
      tl.to(scene, { opacity: 0, duration: OVERLAP }, exitStart);
      if (textEls.length) {
        tl.to(textEls, { opacity: 0, y: -24, duration: OVERLAP * 0.6 }, exitStart);
      }
    }
  });

  const st = ScrollTrigger.create({
    trigger: journey,
    start: "top top",
    end: `+=${scenes.length * 100}%`,
    pin: journey,
    scrub: 1.2,
    animation: tl,
  });

  return () => {
    document.body.classList.remove("is-pinned-journey");
    st.kill();
    tl.kill();
    gsap.set([...scenes, ...scenes.map((s) => s.querySelector(".scene__image"))], {
      clearProps: "all",
    });
    scenes.forEach((scene) => {
      const panel = scene.querySelector(".scene__panel");
      if (panel) gsap.set(Array.from(panel.children), { clearProps: "all" });
    });
  };
});

// ---------------------------------------------------------------------
// Mobile viewport and/or prefers-reduced-motion: plain stacked flow,
// no pin/scrub. Under reduced motion, content is simply visible with no
// animation at all (FR-012). Otherwise (mobile with motion allowed), a
// lightweight IntersectionObserver fade/translate-in per scene (FR-011).
// ---------------------------------------------------------------------
mm.add("(prefers-reduced-motion: reduce), (max-width: 899px)", () => {
  const scenes = SCENE_IDS.map((id) => document.getElementById(id));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    scenes.forEach((scene) => scene.classList.add("is-visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  scenes.forEach((scene) => {
    scene.classList.add("will-fade");
    observer.observe(scene);
  });

  return () => {
    observer.disconnect();
    scenes.forEach((scene) => scene.classList.remove("is-visible"));
  };
});

// ---------------------------------------------------------------------
// Restart button: always return to the top of the journey (Hero).
// Works in both the pinned desktop mode and the plain stacked fallback,
// since scrolling to the top of `.journey` lands on the Hero scene in
// either layout (FR-014).
// ---------------------------------------------------------------------
document.getElementById("restart-journey").addEventListener("click", () => {
  document.querySelector(".journey").scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------------------------------------------------------------------
// Recalculate pin/scrub positions only once images and fonts have
// finished loading, so the journey's scroll math is correct from the
// very first scroll (research.md §2; avoids layout-shift-driven drift).
// ---------------------------------------------------------------------
const imageLoadPromises = Array.from(document.querySelectorAll("img")).map((img) =>
  img.decode ? img.decode().catch(() => {}) : Promise.resolve()
);

Promise.all([...imageLoadPromises, document.fonts ? document.fonts.ready : Promise.resolve()]).then(
  () => {
    ScrollTrigger.refresh();
  }
);
