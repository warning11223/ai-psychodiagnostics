export interface SubmitSurveyRequest {
    task_id: string;
    survey: Record<string, string | number | boolean>;
}

export interface SubmitSurveySuccessResponse {
    message: string;
}

export interface ValidationErrorResponse {
    errors?: Record<string, string[]>;
    message?: string;
}

export type SubmitSurveyResponse = SubmitSurveySuccessResponse | ValidationErrorResponse;

const API_BASE_URL = 'https://sirius-draw-test-94500a1b4a2f.herokuapp.com';

export const submitSurvey = async (
    data: SubmitSurveyRequest
): Promise<SubmitSurveySuccessResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/submit-survey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData: SubmitSurveyResponse = await response.json();

        if (!response.ok) {
            if (response.status === 422) {
                const errorMessage = (responseData as ValidationErrorResponse).message || 'Заполните все поля';
                throw new Error(errorMessage);
            }
            throw new Error('Ошибка при отправке данных');
        }

        return responseData as SubmitSurveySuccessResponse;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};