import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "./data/site";
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { about } = site;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".aboutNumber", {
        x: -140,
        autoAlpha: 0,
        duration: 0.6,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      gsap.from(".aboutTitle", {
        x: 180,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      gsap.from(".aboutPortraitWrap", {
        scale: 0.7,
        rotation: -9,
        autoAlpha: 0,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".aboutPortraitWrap",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".aboutInfoPanel", {
        x: 100,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".aboutInfoPanel",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".aboutStatFill", {
        width: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".aboutStats",
          start: "top 85%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="aboutSection" id="about" ref={sectionRef}>
      <div className="aboutHeader">
        <span className="aboutNumber">{about.number}</span>
        <div>
          <span className="aboutKicker">{about.kicker}</span>
          <h2 className="aboutTitle">{about.title}</h2>
        </div>
        <span className="aboutStatus">
          {about.statusLabel}
          <strong>{about.statusValue}</strong>
        </span>
      </div>

      <div className="aboutLayout">
        <div className="aboutPortraitWrap">
          <div className="aboutPortrait">
            {about.portraitImage ? (
              <img
                className="aboutPortraitImage"
                src={about.portraitImage}
                alt={`${site.owner.name} portrait`}
                loading="lazy"
              />
            ) : (
              <div className="aboutPortraitInner">
                <span>{about.portraitLabel}</span>
                <small>{about.portraitSubLabel}</small>
              </div>
            )}
          </div>
          <span className="aboutPortraitTag">{about.playerTag}</span>
        </div>

        <div className="aboutInfoPanel">
          <span className="aboutLabel">{about.identityLabel}</span>
          <h3>
            {about.headingTop}
            <span>{about.headingBottom}</span>
          </h3>
          <p className="aboutBio">{about.bio}</p>

          <div className="aboutSpecialties">
            {about.specialties.map((specialty) => (
              <span key={specialty}>{specialty}</span>
            ))}
          </div>

          <div className="aboutStats">
            {about.stats.map((stat) => (
              <div className="aboutStat" key={stat.label}>
                <div className="aboutStatHeader">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
                <div className="aboutStatTrack">
                  <div
                    className="aboutStatFill"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="aboutFooterNote">
        <span>{about.footerLabel}</span>
        <strong>{about.footerMessage}</strong>
      </div>
    </section>
  );
}
