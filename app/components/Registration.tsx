"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function Registration() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage("");



        if (password.length < 8) {
            setErrorMessage("パスワードは8文字以上必要です。");
            return;
        }

        if (username.length < 4) {
            setErrorMessage("ユーザーネームは4文字以上必要です。");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("登録成功:", userCredential.user);

            if (username) {
                await updateProfile(userCredential.user, {
                    displayName: username,
                });
            }

            router.push("/");
        } catch (error) {
            setErrorMessage("メールアドレスかパスワードに誤りがあるか登録されていません");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFCC01] flex items-center justify-center px-4">
            {/* 白いカード */}
            <div className="w-full max-w-sm bg-[#FEFEFE] rounded-[24px] shadow-md pt-14 pb-10 px-6 relative">
                <Image
                    src="/img/cat_footprints.png"
                    alt="猫の足跡"
                    width={45}
                    height={45}
                    className="absolute top-3 right-6"
                />
                <Image
                    src="/img/cat_footprints.png"
                    alt="猫の足跡"
                    width={45}
                    height={45}
                    className="absolute top-10 right-16"
                />

                <div className="mt-14">
                    {/* ロゴ */}
                    <div className="flex flex-col items-center">
                        <Image
                            src="/img/logo.png"
                            alt="ロゴ"
                            width={182}
                            height={166}
                            className="w-[182px] h-[166px]"
                        />
                    </div>
                    {/* フォーム */}
                    <form
                        className="mt-10 space-y-4"
                        onSubmit={handleSubmit}
                    >
                        {/* メールアドレス */}
                        <div className="space-y-1">
                            <label className="text-sm text-[#FFCC01] flex items-center gap-1">
                                <span>@</span>
                                <span>メールアドレス</span>
                            </label>
                            <input
                                type="email"
                                placeholder="メールアドレス"
                                className="w-full h-14 border border-[#222] rounded-full px-7 text-sm placeholder:text-gray-300 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* パスワード */}
                        <div className="space-y-1">
                            <label className="text-sm text-[#FFCC01] flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.99984 1.33337C6.16184 1.33337 4.6665 2.82871 4.6665 4.66671V6.66671H3.99984C3.64622 6.66671 3.30708 6.80718 3.05703 7.05723C2.80698 7.30728 2.6665 7.64642 2.6665 8.00004V13.3334C2.6665 13.687 2.80698 14.0261 3.05703 14.2762C3.30708 14.5262 3.64622 14.6667 3.99984 14.6667H11.9998C12.3535 14.6667 12.6926 14.5262 12.9426 14.2762C13.1927 14.0261 13.3332 13.687 13.3332 13.3334V8.00004C13.3332 7.64642 13.1927 7.30728 12.9426 7.05723C12.6926 6.80718 12.3535 6.66671 11.9998 6.66671H11.3332V4.66671C11.3332 2.82871 9.83784 1.33337 7.99984 1.33337ZM5.99984 4.66671C5.99984 3.56404 6.89717 2.66671 7.99984 2.66671C9.1025 2.66671 9.99984 3.56404 9.99984 4.66671V6.66671H5.99984V4.66671ZM8.6665 11.8154V13.3334H7.33317V11.8154C7.10009 11.6819 6.91294 11.4809 6.79639 11.2389C6.67984 10.997 6.63936 10.7253 6.68029 10.4599C6.72123 10.1944 6.84165 9.94763 7.02568 9.75199C7.20971 9.55636 7.44871 9.4211 7.71117 9.36404C7.90613 9.32081 8.10831 9.32192 8.30278 9.36729C8.49725 9.41266 8.67905 9.50113 8.83474 9.62618C8.99044 9.75122 9.11606 9.90964 9.20233 10.0897C9.2886 10.2698 9.33331 10.467 9.33317 10.6667C9.33279 10.8999 9.27096 11.1288 9.15392 11.3305C9.03688 11.5321 8.86877 11.6994 8.6665 11.8154Z" fill="#FFCC01" />
                                </svg>
                                <span>パスワード</span>
                            </label>
                            <input
                                type="password"
                                placeholder="パスワード（8文字以上）"
                                className="w-full h-14 border border-[#222] rounded-full px-7 text-sm placeholder:text-gray-300 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* ユーザネーム */}
                        <div className="space-y-1">
                            <label className="text-sm text-[#FFCC01] flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 6.66667C8.30642 6.66667 8.60984 6.60631 8.89293 6.48905C9.17602 6.37179 9.43325 6.19992 9.64992 5.98325C9.86659 5.76658 10.0385 5.50935 10.1557 5.22626C10.273 4.94317 10.3333 4.63975 10.3333 4.33333C10.3333 4.02692 10.273 3.7235 10.1557 3.44041C10.0385 3.15731 9.86659 2.90009 9.64992 2.68342C9.43325 2.46675 9.17602 2.29488 8.89293 2.17761C8.60984 2.06035 8.30642 2 8 2C7.38116 2 6.78767 2.24583 6.35008 2.68342C5.9125 3.121 5.66667 3.71449 5.66667 4.33333C5.66667 4.95217 5.9125 5.54566 6.35008 5.98325C6.78767 6.42083 7.38116 6.66667 8 6.66667ZM2 13.6V14H14V13.6C14 12.1067 14 11.36 13.7093 10.7893C13.4537 10.2876 13.0457 9.87966 12.544 9.624C11.9733 9.33333 11.2267 9.33333 9.73333 9.33333H6.26667C4.77333 9.33333 4.02667 9.33333 3.456 9.624C2.95426 9.87966 2.54633 10.2876 2.29067 10.7893C2 11.36 2 12.1067 2 13.6Z" fill="#FFCC01" stroke="#FFCC01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>ユーザネーム</span>
                            </label>
                            <input
                                type="text"
                                placeholder="ユーザネーム"
                                className="w-full h-14 border border-[#222] rounded-full px-7 text-sm placeholder:text-gray-300 outline-none"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            {errorMessage && (
                                <p className="mt-4 text-xs text-[#FF6B6B] text-center">
                                    {errorMessage}
                                </p>
                            )}
                        </div>
                        {/* 登録ボタン */}
                        <button
                            type="submit"
                            className="w-full h-14 bg-[#FFCC01] rounded-full text-sm font-medium mt-8 drop-shadow-[0_4px_4px_rgba(34,34,34,0.30)]"
                        >
                            登録
                        </button>
                    </form>
                    {/* 下のテキスト */}
                    <p className="mt-6 text-center text-sm text-gray-400">
                        すでにアカウントをお持ちの方は
                        <button className="text-[#FFCC01]"
                            onClick={() => { router.push("/Login") }}> ログイン</button>
                    </p>
                </div>
            </div>
        </div>
    );
}