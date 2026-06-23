"use client";

import { useState, useEffect, useRef } from "react";
import type { Station, FuelType } from "@/app/lib/stations";
import StationCard from "./StationCard";

type SortMode = "distance" | "price";

interface StationListProps {
  stations: Station[];
  fuelType: FuelType;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function StationList({ stations, fuelType, selectedId, onSelect }: StationListProps) {
  const [sortMode, setSortMode] = useState<SortMode>("price");
  const cardRefs = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    if (selectedId && cardRefs.current[selectedId]) {
      cardRefs.current[selectedId].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId]);

  const withPrice = stations.filter((s) => s.prices[fuelType] != null);
  const withoutPrice = stations.filter((s) => s.prices[fuelType] == null);

  const cheapestId = withPrice.length > 0
    ? withPrice.reduce((a, b) => (a.prices[fuelType] ?? Infinity) < (b.prices[fuelType] ?? Infinity) ? a : b).id
    : null;
  const cheapestPrice = cheapestId ? (stations.find((s) => s.id === cheapestId)?.prices[fuelType] ?? null) : null;
  const closestId = stations.length > 0 ? stations[0].id : null;

  const sortedWithPrice = [...withPrice].sort((a, b) => {
    if (sortMode === "price") {
      return (a.prices[fuelType] ?? Infinity) - (b.prices[fuelType] ?? Infinity);
    }
    return a.distance - b.distance;
  });

  const sortedWithoutPrice = [...withoutPrice].sort((a, b) => a.distance - b.distance);

  return (
    <div className="flex flex-col h-full">
      {/* Station count + sort toggle */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <span className="text-xs text-gray-500 mr-1">Ordenar:</span>
        <button
          onClick={() => setSortMode("price")}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
            sortMode === "price" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          💰 Precio
        </button>
        <button
          onClick={() => setSortMode("distance")}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
            sortMode === "distance" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          📍 Distancia
        </button>
        <span className="ml-auto text-xs text-gray-500">{stations.length} estaciones</span>
      </div>

      {/* Summary tiles */}
      {withPrice.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
          {cheapestId && (
            <button
              onClick={() => onSelect(cheapestId)}
              className="bg-green-50 border border-green-200 dark:bg-green-950/50 dark:border-green-800 rounded-lg p-3 text-left hover:bg-green-100 dark:hover:bg-green-950/80 transition-colors cursor-pointer"
            >
              <p className="text-xs text-green-600 dark:text-green-500 mb-1">💰 Más barata</p>
              <p className="text-xs text-green-700 dark:text-green-300 line-clamp-2 leading-snug mb-1">
                {stations.find((s) => s.id === cheapestId)?.name}
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ${stations.find((s) => s.id === cheapestId)?.prices[fuelType]?.toFixed(2)}
              </p>
            </button>
          )}
          {closestId && (
            <button
              onClick={() => onSelect(closestId)}
              className="bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 rounded-lg p-3 text-left hover:bg-blue-100 dark:hover:bg-blue-950/80 transition-colors cursor-pointer"
            >
              <p className="text-xs text-blue-600 dark:text-blue-500 mb-1">📍 Más cercana</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-2 leading-snug mb-1">
                {stations.find((s) => s.id === closestId)?.name}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatDistanceShort(stations.find((s) => s.id === closestId)?.distance ?? 0)}
                </p>
                {stations.find((s) => s.id === closestId)?.prices[fuelType] != null && (
                  <p className="text-sm text-blue-500 dark:text-blue-400">
                    ${stations.find((s) => s.id === closestId)?.prices[fuelType]?.toFixed(2)}
                  </p>
                )}
              </div>
            </button>
          )}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto overscroll-contain space-y-2 pr-1">
        {stations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
            <p className="text-4xl mb-3">⛽</p>
            <p>No se encontraron gasolineras</p>
            <p className="text-xs mt-1 text-center">No hay estaciones en un radio de 10 km</p>
          </div>
        ) : (
          <>
            {sortedWithPrice.map((station) => (
              <div key={station.id} ref={(el) => { if (el) cardRefs.current[station.id] = el; }}>
                <StationCard
                  station={station}
                  fuelType={fuelType}
                  isCheapest={station.id === cheapestId}
                  isClosest={station.id === closestId}
                  isSelected={station.id === selectedId}
                  cheapestPrice={cheapestPrice}
                  onClick={() => onSelect(station.id)}
                />
              </div>
            ))}
            {sortedWithoutPrice.length > 0 && (
              <>
                {withPrice.length > 0 && (
                  <p className="text-xs text-center text-gray-400 dark:text-gray-700 py-2">
                    — {sortedWithoutPrice.length} sin precio para este combustible —
                  </p>
                )}
                {sortedWithoutPrice.map((station) => (
                  <div key={station.id} ref={(el) => { if (el) cardRefs.current[station.id] = el; }}>
                    <StationCard
                      station={station}
                      fuelType={fuelType}
                      isCheapest={false}
                      isClosest={station.id === closestId}
                      isSelected={station.id === selectedId}
                      cheapestPrice={cheapestPrice}
                      onClick={() => onSelect(station.id)}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function formatDistanceShort(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
