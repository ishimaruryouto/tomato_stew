'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

import CameraClient from './CameraClient';
import LocationDetail from './LocationDetail';
import PhotoDecoration from './PhotoDecoration';
import NavigationBar from './NavigationBar';

// ✅ 追加：ログインUID取得用
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

const DEST_RADIUS_IN_KM = 0.2;
const DEFAULT_ZOOM = 16;

// ✅ 追加：デモ用env（範囲外固定）
const DEMO_OUT_UID = process.env.NEXT_PUBLIC_DEMO_OUT_UID || '';
const DEMO_OUT_LNG = Number(process.env.NEXT_PUBLIC_DEMO_OUT_LNG);
const DEMO_OUT_LAT = Number(process.env.NEXT_PUBLIC_DEMO_OUT_LAT);
const DEMO_OUT_LOCATION: [number, number] | null =
	Number.isFinite(DEMO_OUT_LNG) && Number.isFinite(DEMO_OUT_LAT)
		? [DEMO_OUT_LNG, DEMO_OUT_LAT]
		: null;

type Destination = {
	id: string;
	lng: number;
	lat: number;
	nameJa: string;
	nameEn: string;
	bgColor: string;
};

const DESTINATIONS: Destination[] = [
	{
		id: 'nakazakicho',
		lng: 135.5052,
		lat: 34.707,
		nameJa: '中崎町',
		nameEn: 'Nakazakicho',
		bgColor: '#FFCC01',
	},
	{
		id: 'tukamoto',
		lng: 135.4692,
		lat: 34.7127,
		nameJa: '塚本',
		nameEn: 'Tsukamoto',
		bgColor: '#E6A2C5',
	},
	{
		id: 'yamamoto',
		lng: 135.395043,
		lat: 34.819787,
		nameJa: '山本（宝塚）',
		nameEn: 'Yamamoto',
		bgColor: '#90D4F9',
	},
];

const DEST_IMAGE_MAP: Record<Destination['id'], string> = {
	nakazakicho: '/img/nakazakicho.webp',
	tukamoto: '/img/tukamoto.webp',
	yamamoto: '/img/yamamoto.webp', // ← ここは実ファイル名に合わせてね
};

export default function MapScreen() {
	const router = useRouter();

	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
	const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);

	const pollIdRef = useRef<number | null>(null);
	const pollingRef = useRef(false);

	const [isInRange, setIsInRange] = useState(false);
	const [locationError, setLocationError] = useState<string>('');
	const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

	const [showCamera, setShowCamera] = useState(false);
	const [capturedImg, setCapturedImg] = useState<string | null>(null);

	const [capturedLocationId, setCapturedLocationId] = useState<string | null>(null);
	const [capturedLocationName, setCapturedLocationName] = useState<string | null>(null);

	const [showLocationDetail, setShowLocationDetail] = useState(false);
	const [cameraOpenedFromLocationDetail, setCameraOpenedFromLocationDetail] = useState(false);

	const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);

	// ✅ 追加：今ログインしてるUID（デモ判定に使う）
	const [currentUid, setCurrentUid] = useState<string>('');

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			setCurrentUid(user?.uid ?? '');
		});
		return () => unsub();
	}, []);

	// ✅ 追加：このUIDは範囲外デモか？
	const isDemoOutUser =
		DEMO_OUT_UID !== '' && currentUid !== '' && currentUid === DEMO_OUT_UID && DEMO_OUT_LOCATION !== null;

	// Map初期化
	useEffect(() => {
		if (mapRef.current || !mapContainerRef.current) return;

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [DESTINATIONS[0].lng, DESTINATIONS[0].lat],
			zoom: DEFAULT_ZOOM,
		});

		mapRef.current = map;

		map.on('load', () => {
			const destinationCircles = DESTINATIONS.map((dest) => {
				const center: [number, number] = [dest.lng, dest.lat];
				const circle = turf.circle(center, DEST_RADIUS_IN_KM, {
					steps: 64,
					units: 'kilometers',
				});
				return { dest, circle };
			});

			destinationCircles.forEach(({ dest, circle }) => {
				const center: [number, number] = [dest.lng, dest.lat];

				destinationMarkerRef.current = new mapboxgl.Marker({
					color: '#FFD600',
				})
					.setLngLat(center)
					.addTo(map);

				const sourceId = `range-circle-${dest.id}`;
				const fillLayerId = `range-circle-fill-${dest.id}`;
				const borderLayerId = `range-circle-border-${dest.id}`;

				map.addSource(sourceId, {
					type: 'geojson',
					data: circle,
				});

				map.addLayer({
					id: fillLayerId,
					type: 'fill',
					source: sourceId,
					paint: {
						'fill-color': dest.bgColor,
						'fill-opacity': 0.5,
					},
				});

				map.addLayer({
					id: borderLayerId,
					type: 'line',
					source: sourceId,
					paint: {
						'line-color': dest.bgColor,
						'line-width': 2,
					},
				});
			});

			const updateUserLocation = (rawLocation: [number, number]) => {
				// ✅ 追加：範囲外デモユーザーなら、位置を固定に差し替え
				const location: [number, number] =
					isDemoOutUser && DEMO_OUT_LOCATION ? DEMO_OUT_LOCATION : rawLocation;

				setUserLocation(location);

				const point = turf.point(location);
				const hit = destinationCircles.find(({ circle }) => turf.booleanPointInPolygon(point, circle));

				if (hit) {
					setIsInRange(true);
					setCurrentDestination(hit.dest);
				} else {
					setIsInRange(false);
					setCurrentDestination(null);
				}

				if (userMarkerRef.current) {
					userMarkerRef.current.setLngLat(location);
				} else {
					userMarkerRef.current = new mapboxgl.Marker({
						color: '#FF0000',
					})
						.setLngLat(location)
						.addTo(map);
				}

				map.easeTo({
					center: location,
					duration: 500,
				});
			};

			const getLocation = () => {
				if (!navigator.geolocation) {
					setLocationError('お使いのブラウザは位置情報をサポートしていません。');
					return;
				}

				const options: PositionOptions = {
					enableHighAccuracy: true,
					timeout: 30000,
					maximumAge: 0,
				};

				const success = (position: GeolocationPosition) => {
					const location: [number, number] = [position.coords.longitude, position.coords.latitude];
					updateUserLocation(location);
					setLocationError('');
				};

				const fail = (error: GeolocationPositionError) => {
					console.warn('位置情報の取得に失敗:', error);
					setLocationError(
						'ブラウザの位置情報取得に失敗しました。位置情報の使用を許可してください。',
					);
				};

				navigator.geolocation.getCurrentPosition(success, fail, options);

				pollIdRef.current = window.setInterval(() => {
					if (pollingRef.current) return;
					pollingRef.current = true;

					navigator.geolocation.getCurrentPosition(
						(pos) => {
							pollingRef.current = false;
							success(pos);
						},
						(err) => {
							pollingRef.current = false;
							fail(err);
						},
						options,
					);
				}, 3000);
			};

			getLocation();
		});

		return () => {
			if (userMarkerRef.current) {
				userMarkerRef.current.remove();
				userMarkerRef.current = null;
			}
			if (destinationMarkerRef.current) {
				destinationMarkerRef.current.remove();
				destinationMarkerRef.current = null;
			}

			if (pollIdRef.current !== null) {
				clearInterval(pollIdRef.current);
				pollIdRef.current = null;
			}
			pollingRef.current = false;

			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [isDemoOutUser]);

	const handlePhotoButton = () => {
		if (!isInRange) return;
		setCapturedImg(null);
		setShowLocationDetail(true);
		setShowCamera(false);
	};

	const handleCloseLocationDetail = () => setShowLocationDetail(false);

	const handleStartCapture = () => {
		if (!currentDestination) return;
		setCapturedLocationId(currentDestination.id);
		setShowLocationDetail(false);
		setShowCamera(true);
		setCameraOpenedFromLocationDetail(true);
	};

	const handleCameraClose = () => {
		setShowCamera(false);
		if (cameraOpenedFromLocationDetail) {
			setShowLocationDetail(true);
			setCameraOpenedFromLocationDetail(false);
		}
	};

	const handleCapture = (dataUrl: string) => {
		setCapturedImg(dataUrl);

		setCapturedLocationId(currentDestination?.id || null);

		setCapturedLocationName(currentDestination?.nameEn || null);

		setShowCamera(false);
		setCameraOpenedFromLocationDetail(false);
	};

	const handleRetake = () => {
		setCapturedImg(null);
		setShowCamera(true);
	};

	const handleBack = () => {
		if (!mapRef.current) return;
		const center: [number, number] = userLocation ?? [DESTINATIONS[0].lng, DESTINATIONS[0].lat];
		mapRef.current.easeTo({ center, zoom: DEFAULT_ZOOM, duration: 500 });
	};

	const handleProfile = () => console.log('Profile button clicked');

	return (
		<section className="relative flex min-h-screen justify-center bg-sky-200">
			<div className="relative h-screen w-full overflow-hidden bg-sky-200">
				<div ref={mapContainerRef} className="h-full w-full" />

				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-sky-300/40" />

				<div className="pointer-events-none absolute left-5 top-8 text-4xl leading-snug .text-main-color">
					<p>今日はどこに</p>
					<p>行こうかな。</p>
				</div>

				{isInRange && (
					<div
						className="pointer-events-auto absolute right-0 top-40 w-80 h-25 rounded-l-xl bg-white/95 px-3 drop-shadow-map"
						onClick={() => {
							if (!isInRange || !currentDestination) return;
							router.push(`/otherpost?loc=${encodeURIComponent(currentDestination.id)}`);
						}}
					>
						<div className="flex items-center gap-8">
							<div className="flex-col text-base .text-main-color h-25 justify-center flex">
								<p>{currentDestination?.nameJa}に到着しました。</p>
								<p>みんなの投稿を見てみよう</p>
							</div>
							<div className="h-21 w-13 rounded-b-sm drop-shadow-card-small">
								<div className="h-full w-full overflow-hidden rounded-b-sm bg-main-color pt-1.25 px-1">
									<Image src="/img/group_photo.webp" alt="group_photo" width={62} height={45} className="object-cover" />
								</div>
							</div>
						</div>
					</div>
				)}

				{isInRange && (
					<div className="pointer-events-auto absolute left-1/2 bottom-32 w-68 h-28 -translate-x-1/2 bg-main-color rounded-xl drop-shadow-map">
						<div className="relative h-full w-full">
							<div className="absolute left-4 -top-10">
								<div className="h-20 w-20 overflow-hidden rounded-xl">
									<Image
										src={currentDestination ? (DEST_IMAGE_MAP[currentDestination.id] ?? '/img/nakazakicho.webp') : '/img/nakazakicho.webp'}
										alt={currentDestination?.id ?? 'destination'}
										width={1000}
										height={1000}
										className="h-full w-full object-cover"
									/>
								</div>
							</div>

							<div className="absolute right-6 top-2">
								<p className="text-base tracking-tighter">○○人が投稿</p>
							</div>

							<div className="absolute left-4 top-12">
								<p className="text-2xl font-regular tracking-tighter">{currentDestination?.nameJa}</p>
								<p className="text-base font-regular text-slate-300">{currentDestination?.nameEn}</p>
							</div>
						</div>
					</div>
				)}

				{capturedImg && capturedLocationId && (
					<div className="w-full h-full pointer-events-auto absolute top-0 left-0 bg-main-color pt-6 px-6 flex flex-col items-center">
						<div className="flex justify-center">
							<PhotoDecoration
								src={capturedImg}
								locationId={capturedLocationId}
								onRetake={handleRetake}
								onClose={() => {
									setCapturedImg(null);
									setCapturedLocationId(null);
									setCapturedLocationName(null);
								}}
								onComplete={() => {
									setCapturedImg(null);
									setCapturedLocationId(null);
									setCapturedLocationName(null);
									setShowCamera(false);
									setShowLocationDetail(false);
								}}
							/>
						</div>
					</div>
				)}

				<CameraClient open={showCamera} onClose={handleCameraClose} onCapture={handleCapture} />

				{showLocationDetail && (
					<div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
						<LocationDetail
							onClose={handleCloseLocationDetail}
							locationId={currentDestination?.id ?? null}
							nameJa={currentDestination?.nameJa ?? null}
							nameEn={currentDestination?.nameEn ?? null}
							onStartCapture={handleStartCapture}
						/>
					</div>
				)}

				{!showLocationDetail && !capturedImg && (
					<div className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2">
						<div className="pointer-events-auto">
							<NavigationBar onBack={handleBack} onCamera={handlePhotoButton} onProfile={handleProfile} isCameraDisabled={!isInRange} />
						</div>
					</div>
				)}

				{!showLocationDetail && !capturedImg && (
					<div className="pointer-events-none absolute inset-x-4 bottom-10 text-center text-[10px] text-slate-300">
						{locationError && <p className="mb-1 text-yellow-700">⚠️ {locationError}</p>}
						<p>{isInRange ? 'あなたの素敵な写真をみんなにシェアしよう！' : '指定された場所で写真を撮ろう！'}</p>
					</div>
				)}
			</div>
		</section>
	);
}