import { atom } from "recoil";

export const modalState = atom<boolean>({
    key: 'modalState',   // 그냥, 이름을 정해주는 것
    default: false,
})