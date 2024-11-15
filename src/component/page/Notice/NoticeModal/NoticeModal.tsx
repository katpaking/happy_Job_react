import { useRecoilState } from "recoil";
import { NoticeModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import axios, { AxiosResponse } from "axios";
import { INoticeDetail, IDetailResponse, IPostResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";

// interface IPostResponse {
//     result: string;
// }
interface INoticeModalProps {
    //props에서 만들어지는 타입을 가져옴

    //함수이며 받는 것도 없고 그냥 void
    onSuccess: () => void;

    //상세보기를 위해 받은 noticeSeq(전 index)
    noticeSeq: number;
    setNoticeSeq: (noticeSeq: number) => void;
}

// //상세보기를 위해 INotice 상속받아서 씀
// //이건 object에 대한 즉 객체에 대한 타입만 지정해줬을 뿐이므로
// interface INoticeDetail extends INotice {
//     content: string;
//     fileName: string | null;
//     phsycalPath: string | null;
//     logicalPath: string | null;
//     fileSize: number;
//     fileExt: string | null;
// }

// // detail(키key) : {key에 대한 value이자 지정해준 타입}  과 같은 식으로 해야 함
// // 말하자면 { detail : {INoticeDetail이나 INotice 같은 거} } 와 같아야 한다
// // extend로 포함하지 못하는 건 extend는 그냥 같은 요소로 전부 붙여버리는 거라서
// interface IDetailResponse {
//     detail: INoticeDetail;
// }

//onSuccess는 NoticeMain에서 전달받은 props
//먼저 onSuccess 받고
//상세보기 할 때 index 추가됨
//noticeSeq 없애주기 위해 setNoticeSeq 추가
export const NoticeModal: FC<INoticeModalProps> = ({ onSuccess, noticeSeq, setNoticeSeq }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const title = useRef<HTMLInputElement>();
    const context = useRef<HTMLInputElement>();
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();

    const [imageUrl, setImageUrl] = useState<string>();
    const [fileData, setFileData] = useState<File>();

    console.log(noticeSeq);

    useEffect(() => {
        //컴포넌트가 드러났을 때(생성됐을 때)
        alert("컴포넌트 등장");
        //seq가 없으면 searchDetail 타지 않음
        noticeSeq && searchDetail();

        //등록 버튼을 켜서 모달을 켰을 땐 noticeSeq는 원래도 없기 때문에 굳이 없애줄 필요 없다

        //의존성배열이 없어서 모달이 언마운트 될 때만 실행된다?

        //props는 기본적으로 readonly라 useEffect를 써야 함
        //가져와서 useState를 쓴다 해도 처음 가져온 props 초기값은 그대로이기 때문에
        //부모 컴퍼넌트에서 변경해줘야 한다

        // 리턴 이하의 콜백 함수는 컴포넌트가 사라지기 직전에 실행
        return () => {
            // setNoticeSeq(undefined);
            alert("컴포넌트 닫힘");

            // 클린업 함수
            //상세보기/수정/삭제 등에서는 noticeSeq가 존재하는데
            //글 클릭 후 수정이나 나가기 누르면 컴포넌트는 사라지게 된다
            // 그럼 딸려있던 noticeSeq도 같이 없어져야 한다
            // 그러므로 noticeSeq가 있으면 (= noticeSeq &&)
            // 컴포넌트가 닫히기 직전 noticeSeq를 undefined로 없애줘야 한다 = setNoticeSeq(undefined)
            noticeSeq && setNoticeSeq(undefined);
        };
    }, []);

    // NoticeMapper의 noticeDetail의 값과 일치시키기
    // 1115 오전 마지막
    const searchDetail = async () => {
        const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, { noticeSeq });
        if (detail) {
            setNoticeDetail(detail.detail);

            // 여기부터 1115 오전 마지막
            // TypeScript에 의해 IDetailResponse 안에 정의되어 있어서 바로 .fileExt 등이 완성됨
            // const fileExt = detail.detail.fileExt;

            //구조 분해 할당!
            const { fileExt, logicalPath } = detail.detail;
            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(logicalPath);
            } else {
                setImageUrl("");
            }
        }
        // //원래 INoticeDetail 이었으나 IDetailResponse 로 바뀜
        // axios.post("/board/noticeDetailBody.do", { noticeSeq }).then((res: AxiosResponse<IDetailResponse>) => {
        //     setNoticeDetail(res.data.detail);
        //});
    };

    const handlerModal = () => {
        setModal(!modal);
    };

    //파일 없이 제목/내용만 저장
    const handlerSave = async () => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            loginId: userInfo.loginId,
        };
        const save = await postNoticeApi<IPostResponse>(Notice.saveNotice, param);
        if (save.result === "success") {
            onSuccess();
        }
    };

    const handlerFileSave = async () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current.value,
            context: context.current.value,
            loginId: userInfo.loginId,
        };
        //fileData가 있으면 fileForm에 file이란 이름으로 fileData 넣기
        fileData && fileForm.append("file", fileData);
        fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

        const save = await postNoticeApi<IPostResponse>(Notice.saveFileNotice, fileForm);
        if (save.result === "success") {
            onSuccess();
        }

        // axios.post("/board/noticeSaveFileForm.do", fileForm).then((res: AxiosResponse<IPostResponse>) => {
        //     res.data.result === "success" && onSuccess();
        // });
    };

    const handlerFileUpdate = async () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current.value,
            context: context.current.value,
            noticeSeq,
        };
        //fileData가 있으면 fileForm에 file이란 이름으로 fileData 넣기
        fileData && fileForm.append("file", fileData);
        fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

        const update = await postNoticeApi<IPostResponse>(Notice.updateFileNotice, fileForm);
        if (update.result === "success") {
            onSuccess();
        }

        // axios.post("/board/noticeSaveFileForm.do", fileForm).then((res: AxiosResponse<IPostResponse>) => {
        //     res.data.result === "success" && onSuccess();
        // });
    };

    const handlerUpdate = async () => {
        const param = {
            title: title.current.value,
            context: context.current.value,
            noticeSeq,
        };
        const update = await postNoticeApi<IPostResponse>(Notice.updateNotice, param);
        if (update.result === "success") {
            onSuccess();
        }
    };

    const handlerDelete = async () => {
        const param = {
            noticeSeq,
        };
        const deleteNotice = await postNoticeApi<IPostResponse>(Notice.deleteNotice, param);
        if (deleteNotice.result === "success") {
            onSuccess();
        }
    };

    //e라는 event 파라미터를 받는다
    //e라는 데이터에서도 files 부분 활용?
    //타입을 지정해줘야 사용 가능?
    //타입 스크립트에서 제공해주는 ChangeEvent 사용
    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        if (fileInfo?.length > 0) {
            const fileInfoSplit = fileInfo[0].name.split(".");
            const fileExtension = fileInfoSplit[1].toLowerCase();
            if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
                console.log(URL.createObjectURL(fileInfo[0]));
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            } else {
                //사진에 url 데이터가 있으면 미리보기가 뜨고 없으면 안 뜨고
                setImageUrl("");
            }

            //이미지 파일이 아니어도 파일의 이름이 뜨게 하기 위해 if문 바깥에 두기
            setFileData(fileInfo[0]);
        }
    };

    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" ref={title} defaultValue={noticeDetail?.title}></input>
                </label>
                <label>
                    내용 : <input type="text" ref={context} defaultValue={noticeDetail?.content}></input>
                </label>
                파일 :<input type="file" id="fileInput" style={{ display: "none" }} onChange={handlerFile}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div>
                    {imageUrl ? (
                        <div>
                            <label>미리보기</label>
                            <img src={imageUrl} />
                            {fileData?.name || noticeDetail.fileName}
                        </div>
                    ) : (
                        <div>{fileData?.name} </div>
                    )}
                </div>
                <div className={"button-container"}>
                    {/* noticeSeq가 있으면 저장 되고 없으면 수정 */}
                    {/* 저장만 있을 때
                    <button onClick={handlerSave}>저장</button> 
                      fileForm으로 저장하기 전 버전
                     <button onClick={noticeSeq ? handlerUpdate : handlerSave}> 
                    */}
                    <button onClick={noticeSeq ? handlerFileUpdate : handlerFileSave}>
                        {noticeSeq ? "수정" : "등록"}
                    </button>

                    {/* noticeSeq가 있을 때만 삭제 */}
                    {noticeSeq && <button onClick={handlerDelete}>삭제</button>}
                    <button onClick={handlerModal}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};
