document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const stage = document.querySelector(".cards-stage");
  const cards = gsap.utils.toArray(".card");

  const settings = [
    { x: -36, y: 24,  rotation: -6, scale: 0.96, z: 2 },
    { x: -12, y: 8,   rotation: 4,  scale: 0.98, z: 1 },
    { x: 12,  y: -8,  rotation: -3, scale: 1,    z: 3 },
    { x: 36,  y: -24, rotation: 5,  scale: 0.98, z: 4 },
  ];

  cards.forEach((card, i) => {
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50,
      transformPerspective: 1200,
      zIndex: settings[i].z,
    });
  });

  gsap.to(".hero-title", {
    opacity: 0,
    y: -40,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  const tl = gsap.timeline();

  cards.forEach((card, i) => {
    const s = settings[i];
    const side = i % 2 === 0 ? 1 : -1;
    const startTime = i * 0.72;

    tl.fromTo(
      card,
      {
        x: "90vw",
        y: s.y + side * 5 + "vh",
        rotation: s.rotation + side * 12,
        rotationY: side * -24,
        rotationX: side * 5,
        scale: 0.86,
        skewY: side * 2,
        opacity: 0,
      },
      {
        x: s.x + "vw",
        y: s.y + "vh",
        rotation: s.rotation,
        rotationY: 0,
        rotationX: 0,
        scale: s.scale,
        skewY: 0,
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      },
      startTime
    );
  });

  let landed = false;

  ScrollTrigger.create({
    trigger: ".cards-section",
    start: "top top",
    end: () => "+=" + window.innerHeight * 4,
    animation: tl,
    pin: true,
    scrub: 0.7,
    anticipatePin: 1,
    onUpdate: () => {
      landed = tl.progress() >= 0.99;
    },
  });

  gsap.from(".outro-title", {
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".outro-section",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  cards.forEach((card, i) => {
    const s = settings[i];
    let dragging = false;
    let mouseX, mouseY, cardX, cardY, lastX;

    const moveX = gsap.quickTo(card, "x", { duration: 0.45, ease: "power3.out" });
    const moveY = gsap.quickTo(card, "y", { duration: 0.45, ease: "power3.out" });
    const rotate = gsap.quickTo(card, "rotation", { duration: 0.45, ease: "power3.out" });

    card.addEventListener("pointerdown", (e) => {
      if (!landed) return;

      dragging = true;
      mouseX = lastX = e.clientX;
      mouseY = e.clientY;
      cardX = gsap.getProperty(card, "x", "px");
      cardY = gsap.getProperty(card, "y", "px");
      card.setPointerCapture(e.pointerId);

      gsap.set(card, { zIndex: 9 });
      gsap.to(card, {
        scale: s.scale * 1.05,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto" 
      });
    });


  });
});