"use client";

import { useState, useEffect, useCallback } from "react";
import type { Station, FuelType } from "@/app/lib/stations";
import { FUEL_LABELS } from "@/app/lib/stations";
import StationList from "@/app/components/StationList";
import MapWrapper from "@/app/components/MapWrapper";
import { MapAppPicker } from "@/app/components/DirectionsButton";

type LocationSource = "ip" | "gps" | "fallback";

type GeoState =
  | { status: "loading" }
  | { status: "ready"; lat: number; lng: number; source: LocationSource; city?: string }
  | { status: "error" };

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; stations: Station[] }
  | { status: "error"; message: string };

const FUEL_TYPES: FuelType[] = ["magna", "premium", "diesel"];

export default function Home() {
  const [geo, setGeo] = useState<GeoState>({ status: "loading" });
  const [fuelType, setFuelType] = useState<FuelType>("magna");
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState(0);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [requestingGps, setRequestingGps] = useState(false);

  const selectStation = useCallback((id: string) => {
    setSelectedId(id);
    setFocusKey((k) => k + 1);
  }, []);

  // Load IP-based location on mount
  useEffect(() => {
    fetch("/api/location")
      .then((r) => r.json())
      .then((data: { lat: number; lng: number; city?: string; source: LocationSource }) => {
        setGeo({ status: "ready", lat: data.lat, lng: data.lng, city: data.city, source: data.source });
      })
      .catch(() => setGeo({ status: "error" }));
  }, []);

  // Upgrade to GPS
  const upgradeToGps = useCallback(() => {
    if (!navigator.geolocation) return;
    setRequestingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ status: "ready", lat: pos.coords.latitude, lng: pos.coords.longitude, source: "gps" });
        setSearchCenter(null);
        setRequestingGps(false);
      },
      () => setRequestingGps(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Fetch stations whenever location, search center, or fuel type changes
  useEffect(() => {
    if (geo.status !== "ready") return;
    setFetchState({ status: "loading" });
    setSelectedId(null);
    const center = searchCenter ?? { lat: geo.lat, lng: geo.lng };
    const url = new URL("/api/stations", window.location.origin);
    url.searchParams.set("lat", String(center.lat));
    url.searchParams.set("lng", String(center.lng));
    url.searchParams.set("fuelType", fuelType);
    fetch(url.toString())
      .then((r) => r.json())
      .then((data: { stations: Station[]; error?: string }) => {
        setFetchState({ status: "done", stations: data.stations ?? [] });
      })
      .catch((err) => setFetchState({ status: "error", message: String(err) }));
  }, [geo, fuelType, searchCenter]);

  // --- Loading screen ---
  if (geo.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4">
        <div className="text-5xl">⛽</div>
        <div className="w-6 h-6 border-2 border-gray-300 dark:border-white/40 border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (geo.status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4 px-4 text-center">
        <div className="text-5xl">⛽</div>
        <p className="text-gray-500">No se pudo cargar la aplicación. Intenta de nuevo.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-green-600 text-white rounded-xl cursor-pointer">
          Reintentar
        </button>
      </div>
    );
  }

  const stations = fetchState.status === "done" ? fetchState.stations : [];
  const isApproximate = geo.source !== "gps";

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden">

      {/* LEFT COLUMN: title + map */}
      <div className="flex flex-col h-[45dvh] md:h-auto md:flex-1 overflow-hidden">
        {/* Mobile: title only */}
        <div className="md:hidden safe-top shrink-0 flex items-center gap-3 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl">⛽</span>
          <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight mr-auto">Gasolineras MX</h1>
          <MapAppPicker />
        </div>
        {/* Desktop: title only */}
        <div className="safe-top hidden md:flex shrink-0 items-center gap-2 px-4 h-[52px] border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl">⛽</span>
          <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Gasolineras MX</h1>
        </div>
        {/* Map */}
        <div className="flex-1 p-3">
          <MapWrapper
            userLat={geo.lat}
            userLng={geo.lng}
            stations={stations}
            fuelType={fuelType}
            selectedId={selectedId}
            focusKey={focusKey}
            onSelectStation={selectStation}
            onSearchHere={(lat, lng) => setSearchCenter({ lat, lng })}
            onRecenter={() => setSearchCenter(null)}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: fuel buttons + station list */}
      <div className="flex flex-col flex-1 min-h-0 md:flex-none md:w-[420px] border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Fuel selector */}
        <div className="shrink-0 flex items-center px-4 h-[52px] border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-1.5 flex-1 justify-center">
            {FUEL_TYPES.map((ft) => (
              <button key={ft} onClick={() => setFuelType(ft)}
                className={`w-20 py-1.5 text-sm rounded-lg font-medium transition-colors text-center cursor-pointer ${
                  fuelType === ft ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}>
                {FUEL_LABELS[ft]}
              </button>
            ))}
          </div>
          {fetchState.status === "loading" && (
            <div className="w-4 h-4 border-2 border-gray-300 dark:border-white/40 border-t-transparent dark:border-t-transparent rounded-full animate-spin ml-2" />
          )}
        </div>

        {/* GPS upgrade banner */}
        {isApproximate && (
          <button
            onClick={upgradeToGps}
            disabled={requestingGps}
            className="shrink-0 flex items-center justify-between px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800 text-left cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors"
          >
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {requestingGps ? "Obteniendo ubicación exacta..." : "📍 Ubicación aproximada"}
              </p>
              {!requestingGps && (
                <p className="text-xs text-blue-500 dark:text-blue-400">Toca para usar tu ubicación exacta</p>
              )}
            </div>
            {requestingGps ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <span className="text-blue-500 text-xs shrink-0">→</span>
            )}
          </button>
        )}

        {/* Station list */}
        <div className="flex-1 overflow-hidden flex flex-col p-3">
          {fetchState.status === "error" ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-400">
              <p className="text-3xl">⚠️</p>
              <p className="text-sm">{fetchState.message}</p>
              <button onClick={() => setFuelType(fuelType)} className="text-xs text-green-600 dark:text-green-500 underline cursor-pointer">
                Reintentar
              </button>
            </div>
          ) : fetchState.status === "loading" ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-gray-300 dark:border-white/40 border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Buscando gasolineras...</span>
            </div>
          ) : (
            <StationList
              stations={stations}
              fuelType={fuelType}
              selectedId={selectedId}
              onSelect={selectStation}
            />
          )}
        </div>
      </div>

    </div>
  );
}
