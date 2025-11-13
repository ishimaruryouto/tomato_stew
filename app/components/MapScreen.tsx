'use client';
import { useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function MapScreen() {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<mapboxgl.Map | null>(null);
	const useMarkerRef = useRef<mapboxgl.Marker | null>(null);

	const lng = 135.4959;
	const lat = 34.7024;

	const zoom = 14;
	const [isInRange, setIsInRange] = useState(false);
	const [locationError, setLocationError] = useState<string>('');
	const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
	const watchIdRef = useRef<number | null>(null);

	return <div className="w-full"></div>;

	// useEffect(()) => {

	// }
}
