//createContext = react 라이브러리, () 안에 초기값 넣어주기

import { createContext, FC, useState } from "react";

interface Context {
    searchKeyWord: object;
    setSearchKeyWord: (keyWord: object) => void;
}
const defaultValue: Context = {
    searchKeyWord: {},
    setSearchKeyWord: () => {
        // 빈 함수 하나 만들어줌
    },
};
export const NoticeContext = createContext(defaultValue);

export const NoticeProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    const [searchKeyWord, setSearchKeyWord] = useState({});
    // children에 대한 타입을 넣어줘야 함
    return <NoticeContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>{children}</NoticeContext.Provider>;
};
