import { toast } from "react-toastify";

interface UploadPhotosResponse {
    status: string;
    task_id: string;
}

interface ApiResponse<T = UploadPhotosResponse> {
    body: ReadableStream<Uint8Array> | null;
    bodyUsed: boolean;
    headers: Headers;
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    type: ResponseType;
    url: string;
    json(): Promise<T>;
    blob(): Promise<Blob>;
    text(): Promise<string>;
}

const API_BASE_URL = "https://sirius-draw-test-94500a1b4a2f.herokuapp.com";

// Загрузка фотографий
export const uploadPhotos = async (photos: (File | null)[]): Promise<UploadPhotosResponse> => {
    try {
        const formData = new FormData();

        photos.forEach((photo) => {
            if (photo) {
                formData.append("files", photo);
            }
        });

        const response: ApiResponse = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Ошибка при отправке файлов");
        }

        const data: UploadPhotosResponse = await response.json();

        if (response.status === 202) {
            toast.success(data?.status);
            return data;
        } else {
            throw new Error("Неверный статус ответа");
        }
    } catch (error) {
        console.error("Ошибка при загрузке фото:", error);
        toast.error("Произошла ошибка при отправке файлов.");
        throw error;
    }
};