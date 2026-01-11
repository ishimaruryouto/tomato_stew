"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useCatTheme } from "../providers/catThemeProvider";

type PhotoData = {
    src: string;
    station: string;
    comment: string;
};
export default function Frend() {

    const router = useRouter();
    const [loginUser, setLoginUser] = useState<{ name: string; id: string } | null>(null);
    const [modalData, setModalData] = useState<PhotoData | null>(null);
    const closeModal = () => setModalData(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoginUser({
                    name: user.displayName ?? "名無しさん",
                    id: user.uid,
                });
            } else {
                setLoginUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const photos: PhotoData[] = [
        {
            src: "/img/photo_img.png",
            station: "梅田駅",
            comment: "地図見ても今どこにおるんか謎すぎて気づいたら全然ちゃうとこ出てるんよね😂"
        },
        {
            src: "/img/photo_img.png",
            station: "本町駅",
            comment: "カフェ探してたら逆方向に歩いてた事件☕️笑"
        },
        {
            src: "/img/photo_img.png",
            station: "難波駅",
            comment: "人多すぎて方向感覚ゼロになった😂"
        },
        {
            src: "/img/photo_img.png",
            station: "心斎橋駅",
            comment: "買い物楽しすぎて帰れんくなったやつ🛍️"
        }
    ];

    const { theme } = useCatTheme();

    return (
        <>
            {modalData && (
                <div
                    className="fixed inset-0 backdrop-blur-2xl flex items-center justify-center bg-[#FEFFF5] z-[999]"
                    onClick={closeModal}
                >
                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white w-60.5 h-96.25 mx-auto rounded-bl-[6px] rounded-br-[6px] drop-shadow-[0_2px_4px_rgba(34,34,34,0.30)]">
                            <Image
                                src={modalData.src}
                                alt="photo"
                                width={300}
                                height={400}
                                className="w-51.75  h-69.25 mx-auto pt-6.5"
                            />
                        </div>

                        <h2 className="mt-6 font-bold text-lg border-b-2 border-yellow-400 w-fit mx-auto">
                            {modalData.station}
                        </h2>

                        <p className="text-gray-500 mt-2 text-center">
                            ○月○日 ○時○分
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

            <div className={`w-screen h-screen ${theme.pageBg}`}>
                <Image
                    src={`${theme.footPrints}`}
                    alt="選択中の猫の足跡"
                    width={45}
                    height={45}
                    className="absolute top-8 right-12"
                />
                <Image
                    src={`${theme.footPrints}`}
                    alt="選択中の猫の足跡"
                    width={45}
                    height={45}
                    className="absolute top-16 right-20"
                />

                <div className="pt-6">
                    <div className="flex px-6" onClick={() => { router.push("/") }}>
                        <svg className="ml-auto" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M0.417906 0.436126C0.685572 0.16831 1.04856 0.0178597 1.42704 0.0178597C1.80551 0.0178597 2.1685 0.16831 2.43616 0.436126L9.99108 7.99755L17.546 0.436126C17.6777 0.299683 17.8352 0.190851 18.0093 0.115981C18.1834 0.0411112 18.3707 0.00170225 18.5603 5.39386e-05C18.7498 -0.00159437 18.9377 0.0345506 19.1131 0.10638C19.2886 0.17821 19.4479 0.284286 19.5819 0.418419C19.716 0.552551 19.8219 0.712054 19.8937 0.88762C19.9655 1.06319 20.0016 1.2513 19.9999 1.44098C19.9983 1.63067 19.9589 1.81813 19.8841 1.99242C19.8093 2.16671 19.7006 2.32434 19.5643 2.45613L12.0093 10.0176L19.5643 17.579C19.8243 17.8484 19.9681 18.2093 19.9649 18.5838C19.9616 18.9584 19.8115 19.3167 19.5469 19.5816C19.2822 19.8464 18.9242 19.9967 18.55 19.9999C18.1757 20.0032 17.8152 19.8592 17.546 19.599L9.99108 12.0376L2.43616 19.599C2.16697 19.8592 1.80642 20.0032 1.43217 19.9999C1.05793 19.9967 0.699933 19.8464 0.435293 19.5816C0.170652 19.3167 0.0205402 18.9584 0.0172881 18.5838C0.0140361 18.2093 0.157905 17.8484 0.417906 17.579L7.97282 10.0176L0.417906 2.45613C0.150321 2.18823 0 1.82493 0 1.44613C0 1.06732 0.150321 0.704023 0.417906 0.436126Z" fill="black" />
                        </svg>
                    </div>
                    <div className={`w-38 h-38 rounded-full mx-auto flex items-center justify-center ${theme.labelBorder}`}>
                        <Image src="/img/shisa.png" alt="シーサーのイラスト" width={144} height={144} />
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-6 mt-6">
                            <div className="ml-12">
                                <h1>{loginUser?.name ?? "ゲスト"}</h1>
                            </div>
                            {/* プロフィール編集ボタン */}
                            <div>
                                <Link href="/profile/edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="11.625" fill="#FEFEFE" stroke="#222222" strokeWidth="0.75" />
                                        <mask id="mask0_862_221" className="mask-type:luminance" maskUnits="userSpaceOnUse" x="4" y="4">
                                            <path d="M20 4H4V20H20V4Z" fill="white" />
                                        </mask>
                                        <g mask="url(#mask0_862_221)">
                                            <path d="M13.9997 19.1663H9.99967C6.37967 19.1663 4.83301 17.6197 4.83301 13.9997V9.99967C4.83301 6.37967 6.37967 4.83301 9.99967 4.83301H11.333C11.6063 4.83301 11.833 5.05967 11.833 5.33301C11.833 5.60634 11.6063 5.83301 11.333 5.83301H9.99967C6.92634 5.83301 5.83301 6.92634 5.83301 9.99967V13.9997C5.83301 17.073 6.92634 18.1663 9.99967 18.1663H13.9997C17.073 18.1663 18.1663 17.073 18.1663 13.9997V12.6663C18.1663 12.393 18.393 12.1663 18.6663 12.1663C18.9397 12.1663 19.1663 12.393 19.1663 12.6663V13.9997C19.1663 17.6197 17.6197 19.1663 13.9997 19.1663Z" fill="#333333" />
                                            <path d="M9.66615 15.7933C9.25948 15.7933 8.88615 15.6467 8.61282 15.38C8.28615 15.0533 8.14615 14.58 8.21948 14.08L8.50615 12.0733C8.55948 11.6867 8.81282 11.1867 9.08615 10.9133L14.3395 5.66004C15.6662 4.33337 17.0128 4.33337 18.3395 5.66004C19.0662 6.38671 19.3928 7.12671 19.3262 7.86671C19.2662 8.46671 18.9462 9.05337 18.3395 9.65337L13.0862 14.9067C12.8128 15.18 12.3128 15.4333 11.9262 15.4867L9.91948 15.7733C9.83282 15.7933 9.74615 15.7933 9.66615 15.7933ZM15.0462 6.36671L9.79282 11.62C9.66615 11.7467 9.51948 12.04 9.49282 12.2133L9.20615 14.22C9.17948 14.4133 9.21948 14.5733 9.31948 14.6733C9.41948 14.7733 9.57948 14.8133 9.77282 14.7867L11.7795 14.5C11.9528 14.4733 12.2528 14.3267 12.3728 14.2L17.6262 8.94671C18.0595 8.51337 18.2862 8.12671 18.3195 7.76671C18.3595 7.33337 18.1328 6.87337 17.6262 6.36004C16.5595 5.29337 15.8262 5.59337 15.0462 6.36671Z" fill="#333333" />
                                            <path d="M17.2333 10.5532C17.1866 10.5532 17.14 10.5465 17.1 10.5332C15.3466 10.0399 13.9533 8.64652 13.46 6.89319C13.3866 6.62652 13.54 6.35319 13.8066 6.27319C14.0733 6.19986 14.3466 6.35319 14.42 6.61985C14.82 8.03985 15.9466 9.16652 17.3666 9.56652C17.6333 9.63985 17.7866 9.91985 17.7133 10.1865C17.6533 10.4132 17.4533 10.5532 17.2333 10.5532Z" fill="#333333" />
                                        </g>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-6">
                            <div>
                                <p className="text-base">フォト</p>
                                {/* 自身のチェキ数を反映させる（今は仮置きの16枚） */}
                                <p className="">16枚</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative mt-9.5 drop-shadow-[0_2px_4px_rgba(34,34,34,0.30)]">
                        <div className="absolute top-0 left-13 w-78.75 h-103.75 bg-[#F2EDED] z-0"></div>
                        <div className="absolute top-0 left-11 w-78.75 h-103.75 bg-[#D9D9D9] z-10"></div>

                        <div className="absolute top-0 left-6 w-78.75 h-103.75 bg-[#F9F9F9] z-20 grid grid-cols-2 gap-5 place-items-center ml-2">

                            {photos.map((p, i) => (
                                <div
                                    key={i}
                                    className="w-28 h-44.5 bg-[#FEFEFE] rounded-bl-[4px] rounded-br-[4px] drop-shadow-[0_2px_4px_rgba(34,34,34,0.30)] cursor-pointer"
                                    onClick={() => setModalData(p)}
                                >
                                    <div className="px-2 pt-3">
                                        <Image src={p.src} alt="photo" width={96} height={128} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}