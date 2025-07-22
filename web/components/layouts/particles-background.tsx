"use client";

import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // loads tsparticles and all the plugins

export function ParticlesBackground() {
  const particlesInit = async (main: any) => {
    await loadSlim(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent", // Make background transparent to show existing gradients
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Particles will connect to the mouse on hover
            },
            onClick: {
              enable: false, // Disable click interaction
              mode: "push",
            },
            // @ts-ignore
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.7, // Increased opacity for links
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        particles: {
          number: {
            value: 150, // Increased number of particles
            density: {
              enable: true,
              // @ts-ignore
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff", // White particles
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.8, // Increased opacity for particles
            // @ts-ignore
            random: true,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            // @ts-ignore
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          links: {
            enable: true, // Enable connecting lines
            distance: 150, // Max distance for lines
            color: "#ff4500", // Orange lines
            opacity: 0.7, // Increased opacity for links
            width: 1,
          },
          move: {
            enable: true,
            speed: 1, // Slow movement
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              // @ts-ignore
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
