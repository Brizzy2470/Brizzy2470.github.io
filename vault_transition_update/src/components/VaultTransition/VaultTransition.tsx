import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "./vaultTransition.css";

type Direction = "enter" | "exit";

type VaultActions = {
  enterArchive: () => void;
  returnToWork: () => void;
};

const VaultContext = createContext<VaultActions | null>(null);

export function useVaultTransition(): VaultActions {
  const actions = useContext(VaultContext);
  if (!actions) {
    throw new Error("useVaultTransition must be used inside VaultTransitionProvider");
  }
  return actions;
}

/** Keep this provider mounted *outside* the Routes so the doors survive navigation. */
export function VaultTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  // React Router may change navigate identity when the route changes. Keep the
  // running GSAP timeline stable across navigation by reading from a ref.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const [direction, setDirection] = useState<Direction | null>(null);
  const activeRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const begin = useCallback(
    (next: Direction) => {
      if (activeRef.current) return; // Prevent rapid double clicks.
      const destination = next === "enter" ? "/archive" : "/#work";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        navigate(destination);
        return;
      }
      activeRef.current = true;
      setDirection(next);
    },
    [navigate],
  );

  const enterArchive = useCallback(() => begin("enter"), [begin]);
  const returnToWork = useCallback(() => begin("exit"), [begin]);

  useLayoutEffect(() => {
    if (!direction) return;

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const lock = lockRef.current;
    const wheel = wheelRef.current;
    if (!overlay || !backdrop || !left || !right || !lock || !wheel) {
      activeRef.current = false;
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const destination = direction === "enter" ? "/archive" : "/#work";
    const go = () => {
      navigateRef.current(destination);
      if (direction === "enter") {
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
      }
    };

    gsap.killTweensOf([overlay, backdrop, left, right, lock, wheel]);
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(wheel, { rotation: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = previousOverflow;
        activeRef.current = false;
        setDirection(null);
      },
    });

    if (direction === "enter") {
      // A closed steel vault fills the screen, then unlocks. Navigate while
      // obscured so the new archive is only revealed when the doors separate.
      gsap.set([left, right], { xPercent: 0 });
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(lock, { autoAlpha: 1, scale: 0.88 });
      gsap.set(overlay, { autoAlpha: 0 });

      timeline
        .to(overlay, { autoAlpha: 1, duration: 0.19, ease: "power1.out" })
        .to(lock, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.14)
        .to(wheel, { rotation: 150, duration: 0.6, ease: "power3.inOut" }, 0.3)
        .to(lock, { scale: 1.08, duration: 0.14, yoyo: true, repeat: 1 }, 0.87)
        .add(go, 1.03)
        .to(lock, { autoAlpha: 0, scale: 0.77, duration: 0.19 }, 1.07)
        .to(left, { xPercent: -103, duration: 1.0, ease: "power3.inOut" }, 1.12)
        .to(right, { xPercent: 103, duration: 1.0, ease: "power3.inOut" }, 1.12)
        .to(backdrop, { opacity: 0, duration: 0.22, ease: "power1.out" }, 1.17)
        .to(overlay, { autoAlpha: 0, duration: 0.1 }, 2.06);
    } else {
      // When returning to Work, the doors close over the archive, lock,
      // then dissolve over the portfolio so nothing flashes mid-route.
      gsap.set(left, { xPercent: -103 });
      gsap.set(right, { xPercent: 103 });
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(lock, { autoAlpha: 0, scale: 0.85 });

      timeline
        .to(left, { xPercent: 0, duration: 0.77, ease: "power3.inOut" }, 0)
        .to(right, { xPercent: 0, duration: 0.77, ease: "power3.inOut" }, 0)
        .set(backdrop, { opacity: 1 }, 0.75)
        .to(lock, { autoAlpha: 1, scale: 1, duration: 0.19 }, 0.74)
        .to(wheel, { rotation: -90, duration: 0.27, ease: "power2.inOut" }, 0.82)
        .add(go, 1.08)
        .to(overlay, { autoAlpha: 0, duration: 0.35, ease: "power2.inOut" }, 1.14);
    }

    return () => {
      timeline.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [direction]);

  return (
    <VaultContext.Provider value={{ enterArchive, returnToWork }}>
      {children}
      {direction && (
        <div
          ref={overlayRef}
          className={`vaultTransition vaultTransition--${direction}`}
          aria-hidden="true"
        >
          <div ref={backdropRef} className="vaultBackdrop" />
          <div ref={leftRef} className="vaultDoor vaultDoor--left">
            <div className="vaultDoorRivets" />
            <div className="vaultDoorInset" />
            <div className="vaultDoorMark">00 / SECURE</div>
          </div>
          <div ref={rightRef} className="vaultDoor vaultDoor--right">
            <div className="vaultDoorRivets" />
            <div className="vaultDoorInset" />
            <div className="vaultDoorMark">PERSONA / FILES</div>
          </div>
          <div ref={lockRef} className="vaultLock">
            <div className="vaultLockFrame">
              <div ref={wheelRef} className="vaultWheel">
                <span className="vaultWheelSpoke vaultWheelSpoke--one" />
                <span className="vaultWheelSpoke vaultWheelSpoke--two" />
                <span className="vaultWheelSpoke vaultWheelSpoke--three" />
                <span className="vaultWheelSpoke vaultWheelSpoke--four" />
                <span className="vaultWheelHub" />
              </div>
            </div>
            <span className="vaultLockLabel">
              {direction === "enter" ? "UNLOCKING // ARCHIVE" : "SECURING // ARCHIVE"}
            </span>
          </div>
        </div>
      )}
    </VaultContext.Provider>
  );
}
