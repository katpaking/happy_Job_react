import { useLocation, useParams } from "react-router-dom";

// react-router-dom = url 관리할 때 사용하는 라이브러리
export const NoticeRouter = () => {
    const { noticeIdx } = useParams();
    const { state } = useLocation();

    return (
        <>
            다이나믹 라우터로 변경된 url의 값 : {noticeIdx} <br></br>
            url이 변경될 때 상태값 state를 넘겨서 받아온 값 : {state.title}
        </>
    );
};
