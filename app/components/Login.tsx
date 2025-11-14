import { initializeApp } from "firebase/app";
import Image from "next/image";
export default function Login() {
    return (
        <>
            <Image src="/img/tail.png" alt="猫の尻尾" width={200} height={110} className="ml-6" />
            <div className="w-[195px] h-[195px] bg-gray-500 rounded-full mx-auto"></div>
            <div className="block w-[300px] mx-auto">
                <input type="email" placeholder="メールアドレス" className="w-[300px] h-14 border border-[#222] rounded-full pl-7 mt-[72px]" />
                <input type="passward" placeholder="パスワード" className="w-[300px] h-14 border border-[#222] rounded-full pl-7 mt-4" />
                <button type="button" className="w-[300px] h-14 bg-[#FFCC01] rounded-full mt-12">登録</button>
            </div>
        </>
    );
}