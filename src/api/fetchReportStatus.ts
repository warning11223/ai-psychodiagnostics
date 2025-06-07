export interface ReportStatusResponse {
    status: "в обработке" | "error" | "ready";
    errors?: {
        analysis?: string;
    };
}

const API_BASE_URL = 'https://sirius-draw-test-94500a1b4a2f.herokuapp.com';

export const fetchReportStatus = async (
    taskId: string,
    setPdfUrl: (url: string) => void,
    setReportStatus: (status: string) => void
): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/report/${taskId}`);

        if (response.ok) {
            const contentType = response.headers.get("Content-Type");

            if (contentType?.includes("application/pdf")) {
                const blob = await response.blob();
                const pdfObjectUrl = URL.createObjectURL(blob);
                setPdfUrl(pdfObjectUrl);
                setReportStatus('ready');
                return;
            }

            if (contentType?.includes("application/json")) {
                const json: ReportStatusResponse = await response.json();

                if (json.status === "в обработке") {
                    setReportStatus('inProgress');
                } else if (json.status === "error") {
                    setReportStatus('error');
                    console.error('Ошибка анализа:', json.errors?.analysis);
                }
                return;
            }

            throw new Error("Неподдерживаемый формат данных");
        }

        setReportStatus('inProgress');
    } catch (error) {
        console.error('Ошибка при получении статуса отчета:', error);
        setReportStatus('error');
    }
};