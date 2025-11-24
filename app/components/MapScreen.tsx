// app/components/MapScreen.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // ← 追加：マーカー表示に必須
import * as turf from '@turf/turf';
import CameraClient from './CameraClient';
import NavigationBar from './NavigationBar';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

const DESTINATION = {
	lng: 136.9857,
	lat: 35.1318,
	radiusInKm: 0.5,
	zoom: 16,
};

export default function MapScreen() {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
	const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
	const watchIdRef = useRef<number | null>(null);

	const [isInRange, setIsInRange] = useState(false);
	const [locationError, setLocationError] = useState<string>('');
	const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

	const [showCamera, setShowCamera] = useState(false);
	const [capturedImg, setCapturedImg] = useState<string | null>(null);

	// Map初期化
	useEffect(() => {
		if (mapRef.current || !mapContainerRef.current) return;

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [DESTINATION.lng, DESTINATION.lat],
			zoom: DESTINATION.zoom,
		});

		mapRef.current = map;

		map.on('load', () => {
			const center: [number, number] = [DESTINATION.lng, DESTINATION.lat];

			const circle = turf.circle(center, DESTINATION.radiusInKm, {
				steps: 64,
				units: 'kilometers',
			});

			// ✅ 目的地マーカー（黄色ピン）
			destinationMarkerRef.current = new mapboxgl.Marker({
				color: '#FFD600', // 黄色
			})
				.setLngLat(center)
				.addTo(map);

			// 円
			map.addSource('range-circle', {
				type: 'geojson',
				data: circle,
			});

			map.addLayer({
				id: 'range-circle-fill',
				type: 'fill',
				source: 'range-circle',
				paint: {
					'fill-color': '#4264fb',
					'fill-opacity': 0.25,
				},
			});

			map.addLayer({
				id: 'range-circle-border',
				type: 'line',
				source: 'range-circle',
				paint: {
					'line-color': '#4264fb',
					'line-width': 2,
				},
			});

			const updateUserLocation = (location: [number, number]) => {
				setUserLocation(location);

				const point = turf.point(location);
				const inside = turf.booleanPointInPolygon(point, circle);
				setIsInRange(inside);

				// ✅ ユーザー現在地マーカー（赤ピン）
				if (userMarkerRef.current) {
					// 位置だけ更新
					userMarkerRef.current.setLngLat(location);
				} else {
					userMarkerRef.current = new mapboxgl.Marker({
						color: '#FF0000', // 赤
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
					enableHighAccuracy: false,
					timeout: 30000,
					maximumAge: 5000,
				};

				navigator.geolocation.getCurrentPosition(
					(position) => {
						const location: [number, number] = [
							position.coords.longitude,
							position.coords.latitude,
						];
						updateUserLocation(location);
						setLocationError('');
					},
					(error) => {
						console.warn('位置情報の取得に失敗:', error);
						setLocationError(
							'ブラウザの位置情報取得に失敗しました。位置情報の使用を許可してください。',
						);
					},
					options,
				);

				const watchId = navigator.geolocation.watchPosition(
					(position) => {
						const location: [number, number] = [
							position.coords.longitude,
							position.coords.latitude,
						];
						updateUserLocation(location);
					},
					(error) => {
						console.warn('位置情報の監視に失敗:', error);
					},
					options,
				);

				return watchId;
			};

			const watchId = getLocation();
			if (watchId !== undefined) {
				watchIdRef.current = watchId;
			}
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
			if (watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
				watchIdRef.current = null;
			}
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, []);

	// ボタン系
	const handlePhotoButton = () => {
		if (!isInRange) return;
		setCapturedImg(null);
		setShowCamera(true);
	};

	const handleCapture = (dataUrl: string) => {
		setCapturedImg(dataUrl);
		setShowCamera(false);
	};

	const handleRetake = () => {
		setCapturedImg(null);
		setShowCamera(true);
	};

	const handleBack = () => {
		if (!mapRef.current) return;
		const center: [number, number] = userLocation ?? [DESTINATION.lng, DESTINATION.lat];
		mapRef.current.easeTo({
			center,
			zoom: DESTINATION.zoom,
			duration: 500,
		});
	};

	const handleProfile = () => {
		console.log('Profile button clicked');
	};

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
					<div className="pointer-events-auto absolute right-0 top-40 w-80 h-25 rounded-2xl bg-white/95 px-3 shadow-lg">
						<div className="flex items-center gap-8">
							<div className="flex-col text-base .text-main-color h-25 justify-center flex">
								<p>梅田に到着しました。</p>
								<p>みんなの投稿を見てみよう</p>
							</div>
							{/* ポラロイドの部分 */}
							<div className="h-21 w-13 rounded-b-sm drop-shadow-card-small">
								<div className="h-full w-full overflow-hidden rounded-b-sm bg-main-color pt-1.25 px-1">
									<Image
										src="/img/group_photo.webp"
										alt="group_photo"
										width={62}
										height={45}
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				)}

				{isInRange && (
					<div className="pointer-events-auto absolute left-1/2 bottom-32 w-[280px] -translate-x-1/2 rounded-3xl bg-white/95 p-3 shadow-xl">
						<div className="flex items-center gap-3">
							<div className="h-16 w-16 overflow-hidden rounded-2xl bg-sky-300">
								<div className="h-full w-full bg-gradient-to-br from-sky-400 to-sky-600" />
							</div>
							<div className="flex-1">
								<div className="flex items-center justify-between text-[11px] text-slate-500">
									<span>梅田駅</span>
									<span>○○人が投稿</span>
								</div>
								<p className="text-sm font-semibold text-slate-900">梅田駅</p>
								<p className="text-[11px] text-slate-500">Umeda station</p>
							</div>
							<div className="text-xl text-slate-400">↻</div>
						</div>
					</div>
				)}

				{capturedImg && (
					<div className="pointer-events-auto absolute inset-x-4 bottom-32 rounded-2xl bg-white/95 p-3 shadow-xl">
						<p className="mb-1 text-center text-[11px] text-gray-500">撮影結果プレビュー</p>
						<div className="flex justify-center">
							<Image
								src={capturedImg}
								alt="captured"
								width={260}
								height={360}
								className="rounded-xl object-cover"
							/>
						</div>
						<div className="mt-2 flex justify-center">
							<button
								onClick={handleRetake}
								className="rounded-full bg-blue-500 px-4 py-1 text-xs font-medium text-white hover:bg-blue-600"
							>
								撮り直す
							</button>
						</div>
					</div>
				)}

				<CameraClient
					open={showCamera}
					onClose={() => setShowCamera(false)}
					onCapture={handleCapture}
				/>

				<div className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2">
					<div className="pointer-events-auto">
						<NavigationBar
							onBack={handleBack}
							onCamera={handlePhotoButton}
							onProfile={handleProfile}
							isCameraDisabled={!isInRange}
						/>
					</div>
				</div>

				<div className="pointer-events-none absolute inset-x-4 bottom-10 text-center text-[10px] text-slate-700">
					{locationError && <p className="mb-1 text-yellow-700">⚠️ {locationError}</p>}
					<p>
						{isInRange
							? '指定範囲内です。カメラボタンから撮影できます。'
							: '大阪駅から1km以内に移動してください。'}
					</p>
				</div>
			</div>
		</section>
	);
}
