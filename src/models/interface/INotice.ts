//인터페이스를 export로 전환
export interface INotice {
    // 이는 배열 안의 객체들의 타입을 정해준 것이기 때문에
    noticeIdx: number;
    title: string;
    content: string;
    author: string;
    createdDate: string;
}

export interface IPostResponse {
    result: string;
}

//상세보기를 위해 INotice 상속받아서 씀
//이건 object에 대한 즉 객체에 대한 타입만 지정해줬을 뿐이므로
export interface INoticeDetail extends INotice {
    content: string;
    fileName: string | null;
    phsycalPath: string | null;
    logicalPath: string | null;
    fileSize: number;
    fileExt: string | null;
}

// detail(키key) : {key에 대한 value이자 지정해준 타입}  과 같은 식으로 해야 함
// 말하자면 { detail : {INoticeDetail이나 INotice 같은 거} } 와 같아야 한다
// extend로 포함하지 못하는 건 extend는 그냥 같은 요소로 전부 붙여버리는 거라서
export interface IDetailResponse {
    //detail이란 친구 안에 INoticeDetail 들어가 있음
    detail: INoticeDetail;
}

export interface INoticeListResponse {
    noticeCnt: number;
    notice: INotice[];
}
