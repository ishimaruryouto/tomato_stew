// app/theme/catTheme.ts

import { describe } from "node:test";

export const CAT_THEMES = {
    black: {
        pageBg: "bg-[#FFF7CA]",            // 外側背景
        footPrints: "/img/footprints_yellow.png", //黄色の猫の足跡
        catBorderWrap: "border-[#FFCC01]",  //猫を選ぶ一番外枠のborder
        catSelectBorder: "border-[#FFCC01]", //猫を選ぶ見出しの下線
        labelBorder: "bg-[#FFF7CA]", // 説明文の背景色
        buttonBg: "bg-[#FFCC01]",          // ボタン
        bigCatSrc: "/img/yellow_eyes_cat_all.png",  //猫の全体イラストの画像
        cameraIconSrc: "/img/camera_yellow.png",    //アイコン画像変更のカメライラスト
        description: "黄色中心に、黒猫のイメージになるよ",
    },
    white: {
        pageBg: "bg-[#FFFAFC]",            // 外側背景
        footPrints: "/img/footprints_pink.png", //ピンク色の猫の足跡
        catBorderWrap: "border-[#E6A2C5]",  //猫を選ぶ一番外枠のborder
        catSelectBorder: "border-[#E6A2C5]", //猫を選ぶ見出しの下線
        labelBorder: "bg-[#FFE0F0]", // 説明文の背景色
        buttonBg: "bg-[#E6A2C5]",          // ボタン
        bigCatSrc: "/img/pink_eyes_cat_all.png",  //猫の全体イラストの画像
        cameraIconSrc: "/img/footprints_pink.png",    //アイコン画像変更のカメライラスト
        description: "ピンク色中心に、白猫のイメージになるよ",
    },
    blue: {
        pageBg: "bg-[#EEF9FF]",            // 外側背景
        footPrints: "/img/footprints_blue.png", //青色の猫の足跡
        catBorderWrap: "border-[#90D4F9]",  //猫を選ぶ一番外枠のborder
        catSelectBorder: "border-[#90D4F9]", //猫を選ぶ見出しの下線
        labelBorder: "bg-[#C5EAFF]", // 説明文の背景色
        buttonBg: "bg-[#90D4F9]",          // ボタン
        bigCatSrc: "/img/blue_eyes_cat_all.png",  //猫の全体イラストの画像
        cameraIconSrc: "/img/camera_pink.png",    //アイコン画像変更のカメライラスト
        description: "空色中心に、バイカラーのイメージになるよ",
    },
} as const;

// "black" | "white" | "blue"
export type CatKey = keyof typeof CAT_THEMES;

// theme の型（必要なら使う）
export type CatTheme = (typeof CAT_THEMES)[CatKey];