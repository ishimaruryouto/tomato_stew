// app/components/WriteComment.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth, db, storage } from '../firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Stamp } from './PhotoDecoration';

type Props = {
	src: string;
	stamps: Stamp[];
	onRetake: () => void;
	onClose?: () => void;
	onComplete?: () => void;
	locationName?: string;
};

type PostDoc = {
	imageUrl: string;
	createdAt: ReturnType<typeof serverTimestamp>;
	comment?: string;
	locationName?: string;
	uid?: string;
};

const OUT_W = 1080;
const OUT_H = Math.round(OUT_W * (74 / 56));

function clamp01(v: number) {
	return Math.min(1, Math.max(0, v));
}

async function loadHtmlImage(src: string): Promise<HTMLImageElement> {
	const img = new window.Image();
	img.src = src;
	await img.decode();
	return img;
}

// object-cover を canvas で再現
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, dw: number, dh: number) {
	const iw = img.naturalWidth;
	const ih = img.naturalHeight;

	const scale = Math.max(dw / iw, dh / ih);
	const sw = dw / scale;
	const sh = dh / scale;
	const sx = (iw - sw) / 2;
	const sy = (ih - sh) / 2;

	ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
}

async function composeBlob(baseDataUrl: string, stamps: Stamp[]): Promise<Blob> {
	const canvas = document.createElement('canvas');
	canvas.width = OUT_W;
	canvas.height = OUT_H;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('canvas ctx is null');

	const baseImg = await loadHtmlImage(baseDataUrl);
	drawCover(ctx, baseImg, OUT_W, OUT_H);

	for (const s of stamps) {
		const stampImg = await loadHtmlImage(s.src);

		const x = clamp01(s.x) * OUT_W;
		const y = clamp01(s.y) * OUT_H;

		// スタンプ基準サイズ（必要なら調整）
		const baseSize = OUT_W * 0.18;
		const w = baseSize * s.scale;
		const h = baseSize * s.scale;

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(s.rotation);
		ctx.drawImage(stampImg, -w / 2, -h / 2, w, h);
		ctx.restore();
	}

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.92);
	});

	return blob;
}

export default function WriteComment({ src, stamps, onClose, onComplete, locationName }: Props) {
	const [comment, setComment] = useState('');
	const [loading, setLoading] = useState(false);

	// ★ プレビュー用（スタンプ合成後の画像URL）
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// ★ WriteComment表示時点で合成してプレビューに反映
	useEffect(() => {
		let cancelled = false;
		let objectUrl: string | null = null;

		(async () => {
			try {
				const blob = await composeBlob(src, stamps);
				if (cancelled) return;

				objectUrl = URL.createObjectURL(blob);
				setPreviewUrl(objectUrl);
			} catch (e) {
				console.error('preview compose failed:', e);
				setPreviewUrl(null);
			}
		})();

		return () => {
			cancelled = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [src, stamps]);

	const handleSubmit = async () => {
		const uid = auth.currentUser?.uid;
		if (!uid) {
			alert('ログイン状態が確認できません');
			return;
		}

		try {
			setLoading(true);

			// ★ 合成してアップロード
			const blob = await composeBlob(src, stamps);

			const fileName = `${crypto.randomUUID()}.jpg`;
			const storageRef = ref(storage, `posts/${uid}/${fileName}`);

			await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
			const imageUrl = await getDownloadURL(storageRef);

			const docData: PostDoc = {
				imageUrl,
				createdAt: serverTimestamp(),
				uid,
			};

			if (comment.trim() !== '') docData.comment = comment;
			if (locationName) docData.locationName = locationName;

			await addDoc(collection(db, 'posts'), docData);

			alert('投稿しました');
			onComplete?.();
		} catch (e) {
			console.error(e);
			alert('投稿に失敗しました');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full h-full">
			<div className="absolute right-6 top-6">
				{onClose && (
					<button type="button" onClick={onClose}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<path
								d="M0.417906 0.436126C0.685572 0.16831 1.04856 0.0178597 1.42704 0.0178597C1.80551 0.0178597 2.1685 0.16831 2.43616 0.436126L9.99108 7.99755L17.546 0.436126C17.6777 0.299683 17.8352 0.190851 18.0093 0.115981C18.1834 0.0411112 18.3707 0.00170225 18.5603 5.39386e-05C18.7498 -0.00159437 18.9377 0.0345506 19.1131 0.10638C19.2886 0.17821 19.4479 0.284286 19.5819 0.418419C19.716 0.552551 19.8219 0.712054 19.8937 0.88762C19.9655 1.06319 20.0016 1.2513 19.9999 1.44098C19.9983 1.63067 19.9589 1.81813 19.8841 1.99242C19.8093 2.16671 19.7006 2.32434 19.5643 2.45613L12.0093 10.0176L19.5643 17.579C19.8243 17.8484 19.9681 18.2093 19.9649 18.5838C19.9616 18.9584 19.8115 19.3167 19.5469 19.5816C19.2822 19.8464 18.9242 19.9967 18.55 19.9999C18.1757 20.0032 17.8152 19.8592 17.546 19.599L9.99108 12.0376L2.43616 19.599C2.16697 19.8592 1.80642 20.0032 1.43217 19.9999C1.05793 19.9967 0.699933 19.8464 0.435293 19.5816C0.170652 19.3167 0.0205402 18.9584 0.0172881 18.5838C0.0140361 18.2093 0.157905 17.8484 0.417906 17.579L7.97282 10.0176L0.417906 2.45613C0.150321 2.18823 0 1.82493 0 1.44613C0 1.06732 0.150321 0.704023 0.417906 0.436126Z"
								fill="#333333"
							/>
						</svg>
					</button>
				)}
			</div>

			<div className="w-64.5 h-102.5 bg-main-color drop-shadow-card rounded-b-md mt-31">
				<div className="w-56 h-74 overflow-hidden bg-white relative top-6.5 left-4.5">
					<div className="absolute inset-0">
						{/* ★ ここがスタンプ合成後プレビュー */}
						<Image
							src={previewUrl ?? src}
							alt="decorated"
							fill
							className="object-cover"
							unoptimized
						/>
					</div>
					<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_0_rgba(34,34,34,0.30)]" />
				</div>
			</div>

			<textarea
				className="w-64 h-24 border mt-10 rounded-xl border-gray-300 pl-2 pt-2"
				placeholder="思い出を書こう"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>

			<button
				className="block mx-auto mt-6 flex justify-center items-center w-50 h-12 rounded-full bg-accent-color text-base font-medium text-main-color drop-shadow-button"
				onClick={handleSubmit}
				disabled={loading}
			>
				{loading ? '投稿中...' : '投稿する'}
			</button>
		</div>
	);
}
