import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";

export const NoticeSearch = () => {
    // const title = useRef<HTMLInputElement>();
    // const [startDate, setStartdate] = useState<string>();
    // const [endDate, setEndDate] = useState<string>();

    //1115오후
    //위의 세 검색 조건을 하나의 object로 만들어 searchKeyWord에 넣어보자
    const [searchValue, setSearchValue] = useState<{
        //여기에 타입 하드코딩
        searchTitle: string;
        searchStDate: string;
        searchEndDate: string;
    }>({
        // 여긴 초기값
        searchTitle: "",
        searchStDate: "",
        searchEndDate: "",
    });

    const navigate = useNavigate();
    const [modal, setModal] = useRecoilState<boolean>(modalState);

    //1115오후
    const { setSearchKeyWord } = useContext(NoticeContext);

    useEffect(() => {
        window.location.search && navigate(window.location.pathname, { replace: true });
    }, [navigate]);

    const handlerSearch = () => {
        // const query: string[] = [];

        // !title.current.value || query.push(`searchTitle=${title.current.value}`);
        // !startDate || query.push(`searchStDate=${startDate}`);
        // !endDate || query.push(`searchEdDate=${endDate}`);

        // console.log(query);

        // const queryString = query.length > 0 ? `?${query.join("&")}` : "";
        // navigate(`/react/board/notice.do${queryString}`);

        //1115 오후
        setSearchKeyWord(searchValue);
    };

    const handlerModal = () => {
        setModal(!modal);
    };

    return (
        <NoticeSearchStyled>
            <div className="input-box">
                {/*1115 오후 이전  searchValue 안 쓸 때
                <input ref={title}></input>
                <input type="date" onChange={(e) => setStartdate(e.target.value)}></input>
                <input type="date" onChange={(e) => setEndDate(e.target.value)}></input> */}
                <input onChange={(e) => setSearchValue({ ...searchValue, searchTitle: e.target.value })}></input>
                <input
                    type="date"
                    onChange={(e) => setSearchValue({ ...searchValue, searchStDate: e.target.value })}
                ></input>
                <input
                    type="date"
                    onChange={(e) => setSearchValue({ ...searchValue, searchEndDate: e.target.value })}
                ></input>
                <Button onClick={handlerSearch}>검색</Button>
                <Button onClick={handlerModal}>등록</Button>
            </div>
        </NoticeSearchStyled>
    );
};
