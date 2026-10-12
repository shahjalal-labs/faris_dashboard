"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 23.8103,
  lng: 90.4125,
};

type CourtResult = google.maps.places.PlaceResult;
type CourtReview = google.maps.places.PlaceReview;

export default function CourtsPage() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [courts, setCourts] = useState<CourtResult[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<CourtResult | null>(null);
  const [selectedCourtDetails, setSelectedCourtDetails] =
    useState<CourtResult | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!map || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry?.location) return;

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      map.panTo(location);

      searchBasketballCourts(location);
    });
  }, [map]);

  const searchBasketballCourts = (location: google.maps.LatLngLiteral) => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location,
        radius: 5000,
        keyword: "basketball court",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setCourts(results);
          setSelectedCourt(null);
          setSelectedCourtDetails(null);
        }
      },
    );
  };

  const openCourtDetails = (court: CourtResult) => {
    setSelectedCourt(court);
    setSelectedCourtDetails(null);
    setIsDetailsOpen(true);

    if (!map || !court.place_id) {
      return;
    }

    setIsLoadingDetails(true);

    const service = new google.maps.places.PlacesService(map);

    service.getDetails(
      {
        placeId: court.place_id,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "rating",
          "user_ratings_total",
          "reviews",
          "opening_hours",
          "website",
          "url",
          "geometry",
          "vicinity",
        ],
      },
      (details, status) => {
        setIsLoadingDetails(false);

        if (status === google.maps.places.PlacesServiceStatus.OK && details) {
          setSelectedCourtDetails(details);
        }
      },
    );
  };

  const activeCourt = selectedCourtDetails ?? selectedCourt;
  const activeLocation = activeCourt?.geometry?.location;
  const latitude = activeLocation?.lat?.();
  const longitude = activeLocation?.lng?.();
  const reviews = selectedCourtDetails?.reviews ?? [];
  const isOpenNow =
    selectedCourtDetails?.opening_hours?.isOpen?.() ??
    selectedCourt?.opening_hours?.isOpen?.() ??
    null;

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"}
      libraries={["places"]}
    >
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city or area..."
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            width: 300,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {courts.map((court, index) => {
            const location = court.geometry?.location;

            if (!location) return null;

            return (
              <Marker
                key={index}
                position={{
                  lat: location.lat(),
                  lng: location.lng(),
                }}
                title={court.name}
                onClick={() => openCourtDetails(court)}
              />
            );
          })}
        </GoogleMap>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent
            className="flex h-[80vh] max-w-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            showCloseButton={false}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                  Court Details
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {activeCourt?.name || "Selected court"}
                </h2>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label="Close court details"
              >
                <IoClose size={22} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {isLoadingDetails ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Loading court details...
                </p>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailCard
                      label="Rating"
                      value={activeCourt?.rating ?? "N/A"}
                    />
                    <DetailCard
                      label="Reviews"
                      value={activeCourt?.user_ratings_total ?? "N/A"}
                    />
                    <DetailCard
                      label="Status"
                      value={
                        isOpenNow === null
                          ? "N/A"
                          : isOpenNow
                            ? "Open now"
                            : "Closed"
                      }
                    />
                    <DetailCard
                      label="Phone"
                      value={
                        selectedCourtDetails?.formatted_phone_number || "N/A"
                      }
                    />
                  </div>

                  <DetailCard
                    label="Address"
                    value={
                      selectedCourtDetails?.formatted_address ||
                      activeCourt?.vicinity ||
                      "N/A"
                    }
                  />

                  <DetailCard
                    label="Coordinates"
                    value={
                      typeof latitude === "number" &&
                      typeof longitude === "number"
                        ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        : "N/A"
                    }
                  />

                  <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      Reviews
                    </p>
                    {reviews.length > 0 ? (
                      <div className="space-y-3">
                        {reviews
                          .slice(0, 3)
                          .map((review: CourtReview, index) => (
                            <div
                              key={`${review.author_name}-${index}`}
                              className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {review.author_name || "Anonymous"}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {review.rating ? `${review.rating}/5` : "N/A"}
                                </p>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {review.text || "No review text available."}
                              </p>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No reviews available for this court.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    {selectedCourtDetails?.website && (
                      <a
                        href={selectedCourtDetails.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      >
                        Visit website
                      </a>
                    )}
                    {selectedCourtDetails?.url && (
                      <a
                        href={selectedCourtDetails.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Open in Google Maps
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </LoadScript>
  );
}

const DetailCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
};
