"use client";

import { useState, useEffect } from "react";

type MapApp = "google" | "apple" | "waze";

const MAP_APPS: Record<MapApp, { name: string }> = {
  google: { name: "Google Maps" },
  apple: { name: "Apple Maps" },
  waze: { name: "Waze" },
};

export function getDirectionsUrl(app: MapApp, lat: number, lng: number): string {
  switch (app) {
    case "google": return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    case "apple": return `https://maps.apple.com/?daddr=${lat},${lng}`;
    case "waze": return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }
}

export function useMapApp(): MapApp {
  const [app, setApp] = useState<MapApp>("google");
  useEffect(() => {
    const saved = localStorage.getItem("mapApp") as MapApp | null;
    if (saved && saved in MAP_APPS) setApp(saved as MapApp);
    const handler = (e: Event) => setApp((e as CustomEvent<MapApp>).detail);
    window.addEventListener("mapapp-changed", handler);
    return () => window.removeEventListener("mapapp-changed", handler);
  }, []);
  return app;
}

// ── Card button ──────────────────────────────────────────────────────────────

interface DirectionsButtonProps {
  lat: number;
  lng: number;
  fullWidth?: boolean;
}

export default function DirectionsButton({ lat, lng, fullWidth = false }: DirectionsButtonProps) {
  const preferred = useMapApp();
  const url = typeof window !== "undefined" && window.innerWidth < 768
    ? getDirectionsUrl(preferred, lat, lng)
    : getDirectionsUrl("google", lat, lng);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 border border-gray-300 hover:bg-gray-200 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer ${fullWidth ? "w-full justify-center" : ""}`}
    >
      → Cómo llegar
    </a>
  );
}

// ── Header picker ────────────────────────────────────────────────────────────

export function MapAppPicker() {
  const [preferred, setPreferred] = useState<MapApp>("google");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mapApp") as MapApp | null;
    if (saved && saved in MAP_APPS) setPreferred(saved);
  }, []);

  function select(app: MapApp) {
    setPreferred(app);
    localStorage.setItem("mapApp", app);
    window.dispatchEvent(new CustomEvent("mapapp-changed", { detail: app }));
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="App de navegación"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors cursor-pointer text-xs"
      >
        <span>{MAP_APPS[preferred].name}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-2xl p-5 w-72 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">App de navegación</h2>
            <p className="text-xs text-gray-500 mb-4">Elige tu app preferida para "Cómo llegar"</p>
            <div className="flex flex-col gap-2">
              {(Object.entries(MAP_APPS) as [MapApp, { name: string }][]).map(([app, { name }]) => (
                <button
                  key={app}
                  onClick={() => select(app)}
                  className={`flex items-center px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                    preferred === app
                      ? "border-gray-900/40 bg-gray-100 text-gray-900 dark:border-white/40 dark:bg-gray-800 dark:text-white"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  <span className="text-sm font-medium">{name}</span>
                  {preferred === app && <span className="ml-auto text-green-500 text-sm">✓</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
