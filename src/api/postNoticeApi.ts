import axios, { AxiosResponse } from "axios";

//url은 url끼리 한곳에 모아서 쓴다 (선생님 방식임)
export const postNoticeApi = async <T>(api: string, param: object) => {
    try {
        // <T>는 가변적인 데이터
        const result: AxiosResponse<T> = await axios.post(api, param);
        console.log(result.data);
        return result.data;
    } catch (error) {
        alert(error);
    }
};
