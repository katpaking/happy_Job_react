import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

//전달받은 데이터들 각각에게 데이터 타입 지정해주는 인터페이스
interface INotice {
    // 이는 배열 안의 객체들의 타입을 정해준 것이기 때문에
    noticeIdx: number;
    title: string;
    content: string;
    author: string;
    createdDate: string;
    // 여기부터는 지워도 되긴 함
    updatedDate: string | null; // string이되 null이 가능하다
    fileName: string | null;
    phsycalPath: string | null;
    logicalPath: string | null;
    fileSize: number;
    fileExt: string | null;
}

export const NoticeMain = () => {
    // 그냥 search 라고 변수에 담아주기만 하면 내용이 너무 많으므로 {search} 라는 형태로
    // 구조 분해 할당 해주기
    const { search } = useLocation();

    //json 형식으로 불러온 데이터를 뿌려줘야 한다
    // INotice는  열 안의 객체들의 타입을 정해준 것이기 때문에
    //const [noticeList, setNoticeList] = useState<INotice>(); 가 아니라 아래같아야 한다
    const [noticeList, setNoticeList] = useState<INotice[]>();
    const [listCount, setListCount] = useState<number>(0);

    //modalState.ts 쓰려면 이 이전 것은 주석처리
    // const [modalState, setModalState] = useState<boolean>(false);

    //recoil에 저장된 state
    const [modal, setModal] = useRecoilState<boolean>(modalState);

    useEffect(() => {
        searchNoticeList();
    }, [search]);

    const searchNoticeList = (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5"); // 여기까지 하면 데이터는 json 형식으로 불러온다

        axios.post("/board/noticeListJson.do", searchParam).then((res) => {
            setNoticeList(res.data.notice);
            setListCount(res.data.noticeCnt);
        });
    };

    //modalState.ts를 활용하려면 이건 주석처리
    // const handlerModal = () => {
    //     setModalState(!modalState);
    // };

    const handlerModal = () => {
        setModal(!modal);
    };

    // 이제 데이터가 없으면 '데이터가 없습니다'가 뜨고
    // 있으면 출력되게 해야 한다
    return (
        <>
            총 갯수 : {listCount} 현재 페이지 : 0
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={10}>작성자</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {noticeList?.length > 0 ? (
                        noticeList?.map((notice) => {
                            // for문처럼 루프를 map으로 루프 돌림
                            return (
                                //map을 돌려도 key(id)가 있어야 원하는 걸 전달해줄 수 있음

                                //modalState.ts 만들기 전
                                //  <tr key={notice.noticeIdx} onClick={handlerModal}>
                                <tr key={notice.noticeIdx} onClick={handlerModal}>
                                    <StyledTd>{notice.noticeIdx}</StyledTd>
                                    <StyledTd>{notice.title}</StyledTd>
                                    <StyledTd>{notice.author}</StyledTd>
                                    <StyledTd>{notice.createdDate}</StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            {modal && (
                <Portal>
                    <NoticeModal />
                </Portal>
            )}
        </>
    );
};
