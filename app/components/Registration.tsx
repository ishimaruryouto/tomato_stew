"use client";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";

import Image from "next/image";
import { use, useState } from "react";

export default function Registration() {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            alert("パスワード8文字以上でお願いー")
            return;
        }

        if (username.length < 4) {
            alert("お名前4文字以上でお願いー")
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            console.log("登録成功:", userCredential.user);

            if (username) {
                await updateProfile(userCredential.user, {
                    displayName: username,
                });
            }
            alert("登録成功したで--------------")
        } catch (error) {
            console.error("登録できんかった:", error);
            alert("あら、登録できてないわぁ")
        }
    }
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    return (
        <>
            <Image src="/img/tail.png" alt="猫の尻尾" width={120} height={60} className="ml-6" />
            <div className="w-[195px] h-[195px] bg-gray-500 rounded-full mx-auto"></div>
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

                <input
                    type="text"
                    placeholder="ユーザネーム"
                    className="w-[300px] h-14 border border-[#222] rounded-full pl-7 mt-4"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <button type="submit" className="w-[300px] h-14 bg-[#FFCC01] rounded-full mt-12">登録</button>
            </form>
        </>
    );
}