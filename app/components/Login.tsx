"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log("ログイン成功:", userCredential.user);
            alert("ログイン成功したで！");

        } catch (err: any) {
            console.error("ログインエラー:", err);

            if (err.code === "auth/invalid-credential") {
                setError("メールアドレスかパスワードが間違ってるみたいやで");
            } else {
                setError("ログインに失敗した…もう一度試してちょ");
            }
        }
    };


    return (
        <>
            <Image src="/img/tail.png" alt="猫の尻尾" width={120} height={60} className="ml-6" />
            <div className="w-[195px] h-[195px] bg-gray-500 rounded-full mx-auto"></div>
            <div className="block w-[300px] mx-auto">
                <form
                    className="block w-[300px] mx-auto"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="email"
                        placeholder="メールアドレス"
                        className="w-[300px] h-14 border border-[#222] rounded-full pl-7 mt-[72px]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="パスワード"
                        className="w-[300px] h-14 border border-[#222] rounded-full pl-7 mt-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="w-[300px] h-14 bg-[#FFCC01] rounded-full mt-12" onClick={() => { router.push("/") }}>ログイン</button>
                </form>
            </div>
        </>
    );
}