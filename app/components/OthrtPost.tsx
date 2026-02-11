// app/components/OtherPost.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { useEffect, useMemo, useState } from 'react';

import { collection, onSnapshot, orderBy, query, where, Timestamp } from 'firebase/firestore';

type PostDoc = {
	imageUrl: string;
	comment?: string;
	locationId: string;
	locationName?: string;
	createdAt?: Timestamp;
	uid?: string;
};

type PhotoData = {
	src: string;
	station: string;
	comment: string;
	createdAt?: Date | null;
};

const DEST_META: Record<string, { ja: string; en: string; img: string }> = {
	nakazakicho: { ja: '中崎町', en: 'Nakazakicho', img: '/img/nakazakicho.webp' },
	tukamoto: { ja: '塚本', en: 'Tsukamoto', img: '/img/tukamoto.webp' },
	yamamoto: { ja: '山本（宝塚）', en: 'Yamamoto', img: '/img/nakazakicho.webp' },
};

export default function OtherPost() {
	const router = useRouter();
	const sp = useSearchParams();
	const loc = sp.get('loc'); // MapScreen から渡される locationId

	const [loginUser, setLoginUser] = useState<{ name: string; id: string } | null>(null);
	const [modalData, setModalData] = useState<PhotoData | null>(null);
	const closeModal = () => setModalData(null);

	const [photos, setPhotos] = useState<PhotoData[]>([]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setLoginUser({
					name: user.displayName ?? '名無しさん',
					id: user.uid,
				});
			} else {
				setLoginUser(null);
			}
		});
		return () => unsubscribe();
	}, []);

	// Firestore から取得（再判定なし）
	useEffect(() => {
		if (!loc) {
			router.replace('/');
			return;
		}

		// where + orderBy なので composite index が必要になる（初回だけ）
		const q = query(
			collection(db, 'posts'),
			where('locationId', '==', loc),
			orderBy('createdAt', 'desc'),
		);

		const unsub = onSnapshot(
			q,
			(snap) => {
				const list: PhotoData[] = snap.docs.map((d) => {
					const data = d.data() as PostDoc;

					const meta = DEST_META[data.locationId] ?? {
						ja: data.locationId,
						en: data.locationId,
						img: '/img/nakazakicho.webp',
					};

					return {
						src: data.imageUrl,
						station: data.locationName ?? meta.ja,
						comment: data.comment ?? '',
						createdAt: data.createdAt ? data.createdAt.toDate() : null,
					};
				});

				setPhotos(list);
			},
			(e) => {
				console.error('onSnapshot error:', e);
				setPhotos([]);
			},
		);

		return () => unsub();
	}, [loc, router]);

	const meta = useMemo(() => {
		if (!loc) return { ja: '梅田駅', en: 'Umeda station', img: '/img/nakazakicho.webp' };
		return DEST_META[loc] ?? { ja: loc, en: loc, img: '/img/nakazakicho.webp' };
	}, [loc]);

	return (
		<>
			{modalData && (
				<div
					className="fixed inset-0 backdrop-blur-2xl flex items-center justify-center z-[999]"
					onClick={closeModal}
				>
					<div className="relative" onClick={(e) => e.stopPropagation()}>
						<div className="bg-white w-60.5 h-96.25 mx-auto rounded-bl-[6px] rounded-br-[6px] drop-shadow-[0_2px_4px_rgba(34,34,34,0.30)]">
							<Image
								src={modalData.src}
								alt="photo"
								width={300}
								height={400}
								className="w-51.75  h-69.25 mx-auto pt-6.5"
								unoptimized
							/>
						</div>

						<h2 className="mt-6 font-bold text-lg border-b-2 border-yellow-400 w-fit mx-auto">
							{modalData.station}
						</h2>

						<p className="text-gray-500 mt-2 text-center">
							{modalData.createdAt
								? `${modalData.createdAt.getMonth() + 1}月${modalData.createdAt.getDate()}日`
								: '○月○日 ○時○分'}
						</p>

						<div className="mt-4 px-15.5">
							<p className="font-bold">コメント</p>
							<p className="mt-2 leading-relaxed">{modalData.comment}</p>
						</div>

						<button
							onClick={closeModal}
							className="absolute bottom-[-70] left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FFCC01] rounded-full flex items-center justify-center text-black text-xl"
						>
							✕
						</button>
					</div>
				</div>
			)}

			<div className="pt-6">
				<div
					className="px-6"
					onClick={() => {
						router.push('/');
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						className="ml-auto"
					>
						<circle cx="16" cy="16" r="16" fill="#D9D9D9" fillOpacity="0.5" />
						<circle cx="16" cy="16" r="15.2" fill="#FEFEFE" />
						<path
							d="M8.33432 8.3489C8.54846 8.13465 8.83884 8.01429 9.14163 8.01429C9.44441 8.01429 9.7348 8.13465 9.94893 8.3489L15.9929 14.398L22.0368 8.3489C22.1421 8.23975 22.2681 8.15268 22.4074 8.09278C22.5468 8.03289 22.6966 8.00136 22.8482 8.00004C22.9998 7.99872 23.1502 8.02764 23.2905 8.0851C23.4308 8.14257 23.5583 8.22743 23.6656 8.33473C23.7728 8.44204 23.8576 8.56964 23.915 8.7101C23.9724 8.85055 24.0013 9.00104 24 9.15279C23.9986 9.30454 23.9671 9.4545 23.9073 9.59393C23.8475 9.73337 23.7605 9.85948 23.6514 9.9649L17.6075 16.014L23.6514 22.0632C23.8594 22.2787 23.9745 22.5674 23.9719 22.8671C23.9693 23.1667 23.8492 23.4534 23.6375 23.6653C23.4258 23.8772 23.1394 23.9974 22.84 24C22.5406 24.0026 22.2522 23.8874 22.0368 23.6792L15.9929 17.63L9.94893 23.6792C9.73357 23.8874 9.44513 24.0026 9.14574 24C8.84634 23.9974 8.55995 23.8772 8.34823 23.6653C8.13652 23.4534 8.01643 23.1667 8.01383 22.8671C8.01123 22.5674 8.12632 22.2787 8.33432 22.0632L14.3783 16.014L8.33432 9.9649C8.12026 9.75058 8 9.45995 8 9.1569C8 8.85386 8.12026 8.56322 8.33432 8.3489Z"
							fill="#333333"
						/>
					</svg>
				</div>

				<div className="relative mt-19 drop-shadow-[0_2px_4px_rgba(34,34,34,0.30)]">
					<div className="absolute top-0 left-15 w-78.75 h-103.75 bg-[#F2EDED] z-0"></div>
					<div className="absolute top-0 left-13 w-78.75 h-103.75 bg-[#D9D9D9] z-10"></div>

					<div className="absolute top-0 left-11 w-78.75 h-103.75 bg-[#F9F9F9] z-20 grid grid-cols-2 gap-5 place-items-center ml-2">
						{photos.map((p, i) => (
							<div
								key={i}
								className="w-28 h-44.5 bg-[#FEFEFE] rounded-bl-[4px] rounded-br-[4px] drop-shadow-[0_2px_4px_rgba(34,34,34,0.30)] cursor-pointer"
								onClick={() => setModalData(p)}
							>
								<div className="px-2 pt-3">
									{/* <Image
										src="/img/YEAH!.png"
										alt="YEAH!"
										width={90}
										height={65}
										className="absolute z-20"
									/> */}
									<Image
										src={p.src}
										alt="photo"
										width={96}
										height={128}
										className="absolute z-10"
										unoptimized
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="px-6 mt-155.5">
					<div className="relative w-full h-28 border border-[#FFCC01] rounded-xl drop-shadow-[0_2px_4px_rgba(34,34,34,0.20)]">
						<div className="flex items-center justify-end pt-2 pr-12">
							<div className="absolute top-[-30%] left-[15] h-20 w-20 overflow-hidden rounded-xl">
								<Image
									src={meta.img}
									alt="梅田駅の写真"
									width={80}
									height={80}
									className="w-full h-full object-cover "
								/>
							</div>
							<p className="text-right">{photos.length}人が投稿</p>
						</div>

						<div className="pl-3.75 mt-6">
							<h1>{meta.ja}</h1>
							<p>{meta.en}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
