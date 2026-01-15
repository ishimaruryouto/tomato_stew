"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CAT_THEMES, CatKey, CatTheme } from "../theme/catTheme";

type CatThemeContextValue = {
    selectedCat: CatKey;
    setSelectedCat: (cat: CatKey) => void;
    theme: CatTheme;
};

const CatThemeContext = createContext<CatThemeContextValue | undefined>(
    undefined
);

export function CatThemeProvider({ children }: { children: React.ReactNode }) {
    // デフォは "black"
    const [selectedCat, setSelectedCatState] = useState<CatKey>("black");

    // 今のテーマ（色セット）
    const theme = CAT_THEMES[selectedCat];

    // localStorage から初期値を読む
    useEffect(() => {
        if (typeof window === "undefined") return;

        const saved = window.localStorage.getItem("selectedCat");
        if (saved === "black" || saved === "white" || saved === "blue") {
            setSelectedCatState(saved);
        }
    }, []);

    // 変更があれば localStorage に保存
    useEffect(() => {
        if (typeof window === "undefined") return;

        window.localStorage.setItem("selectedCat", selectedCat);
    }, [selectedCat]);

    // 外から呼ぶ用のラッパ
    const setSelectedCat = (cat: CatKey) => {
        setSelectedCatState(cat);
    };

    return (
        <CatThemeContext.Provider value={{ selectedCat, setSelectedCat, theme }}>
            {children}
        </CatThemeContext.Provider>
    );
}

// どこからでも使えるカスタムフック
export function useCatTheme() {
    const ctx = useContext(CatThemeContext);
    if (!ctx) {
        throw new Error("useCatTheme は CatThemeProvider の中で使ってね");
    }
    return ctx;
}