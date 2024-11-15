import { useLocation, useNavigate } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { INotice, INoticeListResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";

//전달받은 데이터들 각각에게 데이터 타입 지정해주는 인터페이스
// interface INotice {
//     // 이는 배열 안의 객체들의 타입을 정해준 것이기 때문에
//     noticeIdx: number;
//     title: string;
//     content: string;
//     author: string;
//     createdDate: string;
//     // 여기부터는 지워도 되긴 함
//     updatedDate: string | null; // string이되 null이 가능하다
//     fileName: string | null;
//     phsycalPath: string | null;
//     logicalPath: string | null;
//     fileSize: number;
//     fileExt: string | null;
// }

// //위의 인터페이스를 export로 전환
// export interface INotice {
//     // 이는 배열 안의 객체들의 타입을 정해준 것이기 때문에
//     noticeIdx: number;
//     title: string;
//     content: string;
//     author: string;
//     createdDate: string;
//     // 여기부터는 지워도 되긴 함
//     updatedDate: string | null; // string이되 null이 가능하다
//     fileName: string | null;
//     phsycalPath: string | null;
//     logicalPath: string | null;
//     fileSize: number;
//     fileExt: string | null;
// }

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
    const [index, setIndex] = useState<number>();

    //페이지네이션
    const [cPage, setCPage] = useState<number>();

    //Provider 활용
    const { searchKeyWord } = useContext(NoticeContext);

    //Router 사용
    const navigate = useNavigate();

    // url에 쿼리가 들어가서 url이 바뀔 때 사용
    //  useEffect(() => {
    //      searchNoticeList();
    //  }, [search]);

    //NoticeSearch에서 변경된 searchKeyWord 값을 NoticeMain에서 받아서
    useEffect(() => {
        searchNoticeList();
    }, [searchKeyWord]); //searchKeyWord 값이 변경될 떄  searchNoticeList(); 작동

    // useEffect(() => {
    //     console.log(searchKeyWord);
    // }, [searchKeyWord]);

    const searchNoticeList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        //    const searchParam = new URLSearchParams(search);
        //    searchParam.append("currentPage", currentPage.toString());
        //    searchParam.append("pageSize", "5");
        const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: "5" };

        const searchList = await postNoticeApi<INoticeListResponse>(Notice.getListBody, searchParam);
        if (searchList) {
            setNoticeList(searchList.notice);
            setListCount(searchList.noticeCnt);

            setCPage(currentPage);
        }

        // const searchNoticeList = async (currentPage?: number) => {
        //     currentPage = currentPage || 1;
        //     const searchParam = new URLSearchParams(search);
        //     searchParam.append("currentPage", currentPage.toString());
        //     searchParam.append("pageSize", "5"); // 여기까지 하면 데이터는 json 형식으로 불러온다

        //     const searchList = await postNoticeApi<INoticeListResponse>(Notice.getList, searchParam);
        //     if (searchList) {
        //         setNoticeList(searchList.notice);
        //         setListCount(searchList.noticeCnt);

        //         setCPage(currentPage);
        //     }
        //api 형식 따로 관리하기 전
        // axios.post("/board/noticeListJson.do", searchParam).then((res) => {
        //     setNoticeList(res.data.notice);
        //     setListCount(res.data.noticeCnt);
        // });
    };

    //modalState.ts를 활용하려면 이건 주석처리
    // const handlerModal = () => {
    //     setModalState(!modalState);
    // };

    //202411141107 전
    // const handlerModal = () => {
    //     setModal(!modal);
    // };

    // 아래에서 전달받은 notice.noticeIdx를 index란 이름으로 받음
    //                여기서 이 index는 아무렇게나 명명해도 된다
    // const [index, setIndex] = useState<number>(); 의 index와는 다름
    const handlerModal = (index: number) => {
        setModal(!modal);
        setIndex(index);
    };

    const onPostSuccess = () => {
        setModal(!modal);
        searchNoticeList();
    };


    // 이제 데이터가 없으면 '데이터가 없습니다'가 뜨고
    // 있으면 출력되게 해야 한다
    return (
        <>
            총 갯수 : {listCount} 현재 페이지 : {cPage}
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

                                //noticeRouter 만들기 전
                                // <tr key={notice.noticeIdx} onClick={() => handlerModal(notice.noticeIdx)}>

                                //1115 오후 ~4시~
                                //navigate(notice.noticeIdx); 처럼 안의 값이 number일 경우엔 인식을 못함
                                //url은 string 타입이기 때문에 안에 들어가는 인자도 string밖에 못 넣기 때문에
                                //형변환을 해준다
                                // navigate(notice.noticeIdx.toString());

                                // 혹은 `${값}` 과 같은 형태로, 유동적으로 값이 들어갈 수 있게 해준다
                                // url에 다른 데이터 포함해서 보내주고 싶으면 state 사용하면 됨
                                <tr
                                    key={notice.noticeIdx}
                                    onClick={() => {
                                        navigate(`${notice.noticeIdx}`, { state: { title: notice.title } });
                                    }}
                                >
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
            {/* PagiNavigate.tsx 보면 props가 totalItemsCount, onChange, activePage, itemsCountPerPage 있으므로 여기에도 들어가야 함 */}
            <PageNavigate
                totalItemsCount={listCount}
                onChange={searchNoticeList}
                activePage={cPage}
                itemsCountPerPage={5}
            ></PageNavigate>
            {modal && (
                <Portal>
                    <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex} />
                </Portal>
            )}
        </>
    );
};
