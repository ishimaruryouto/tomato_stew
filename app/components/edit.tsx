"use client";
import Image from 'next/image';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";

export default function edit() {

    const [loginUser, setLoginUser] = useState<{ name: string; id: string } | null>(null);

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

    return (
        <>
            <div className="">
                <div className="flex mt-6">
                    <svg
                        className="ml-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M0.417906 0.436126C0.685572 0.16831 1.04856 0.0178597 1.42704 0.0178597C1.80551 0.0178597 2.1685 0.16831 2.43616 0.436126L9.99108 7.99755L17.546 0.436126C17.6777 0.299683 17.8352 0.190851 18.0093 0.115981C18.1834 0.0411112 18.3707 0.00170225 18.5603 5.39386e-05C18.7498 -0.00159437 18.9377 0.0345506 19.1131 0.10638C19.2886 0.17821 19.4479 0.284286 19.5819 0.418419C19.716 0.552551 19.8219 0.712054 19.8937 0.88762C19.9655 1.06319 20.0016 1.2513 19.9999 1.44098C19.9983 1.63067 19.9589 1.81813 19.8841 1.99242C19.8093 2.16671 19.7006 2.32434 19.5643 2.45613L12.0093 10.0176L19.5643 17.579C19.8243 17.8484 19.9681 18.2093 19.9649 18.5838C19.9616 18.9584 19.8115 19.3167 19.5469 19.5816C19.2822 19.8464 18.9242 19.9967 18.55 19.9999C18.1757 20.0032 17.8152 19.8592 17.546 19.599L9.99108 12.0376L2.43616 19.599C2.16697 19.8592 1.80642 20.0032 1.43217 19.9999C1.05793 19.9967 0.699933 19.8464 0.435293 19.5816C0.170652 19.3167 0.0205402 18.9584 0.0172881 18.5838C0.0140361 18.2093 0.157905 17.8484 0.417906 17.579L7.97282 10.0176L0.417906 2.45613C0.150321 2.18823 0 1.82493 0 1.44613C0 1.06732 0.150321 0.704023 0.417906 0.436126Z"
                            fill="black"
                        />
                    </svg>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h1>プロフィール編集</h1>
                    <div className="mt-6">
                        <Image src="/img/shisa.png" alt="シーサーの写真" width={112} height={112} />
                    </div>
                </div>
                {/* 線（灰色） */}
                <div className="h-0.5 bg-[#222]/20 mt-6 mb-2 -mx-6"></div>
                <div className="flex w-full ">
                    <p className="w-[30%]">名前</p>
                    <p className="w-[70%]">{loginUser?.name ?? "ゲスト"}</p>
                </div>
                {/* 線（灰色） */}
                <div className="h-0.5 bg-[#222]/20 mt-2 ml-[30%] -mr-6"></div>
                <div className="flex ">
                    <p className="w-[30%]">ID</p>
                    <p className="w-[70%]">@{loginUser?.id ?? "no-id"}</p>
                </div>
                {/* 線（灰色） */}
                <div className="h-0.5 bg-[#222]/20 mt-2 ml-[30%] -mr-6"></div>

                {/* 線（黒色） */}
                <div className=" h-0.5 bg-black mt-7.5 mb-2 -mx-6"></div>

                <h2 className="text-center mt-12">猫ちゃんを選ぶ</h2>
                <div className="flex justify-between mt-5 ">
                    <Image src="/img/black_cat.png" alt="黒猫の顔のイラスト" width={80} height={60} />
                    <Image src="/img/white_cat.png" alt="白猫の顔のイラスト" width={80} height={60} />
                    <Image src="/img/brown_cat.png" alt="茶猫の顔のイラスト" width={80} height={60} />
                </div>

                <Image
                    src="/img/black_cat_all.png"
                    alt="黒猫の全身のイラスト"
                    width={150}
                    height={170}
                    className="block mx-auto mt-14"
                />

                <button
                    type="button"
                    className="w-50 h-12 rounded-full bg-[#FFCC01] drop-shadow-[0_2px_4px_rgba(34,34,34,0.30)] mx-auto mt-12.5 block"
                >
                    決定する
                </button>
            </div>
        </>
    );
}
