import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import Loader from "../Loader";
import { UIButton } from "../ui/button";
import styles from "../../styles/Report.module.scss";

export const Report = () => {
    const [reportStatus, setReportStatus] = useState('loading'); // Статус отчета
    const [pdfUrl, setPdfUrl] = useState(''); // Ссылка на PDF

    const { taskId } = useSelector((state: RootState) => state.uploadPhotos);

    // Функция для получения статуса отчета
    const fetchReportStatus = async () => {
        try {
            const response = await fetch(`https://sirius-draw-test-94500a1b4a2f.herokuapp.com/report/${taskId}`);

            if (response.ok) {
                const contentType = response.headers.get("Content-Type");

                // Проверяем, является ли содержимое PDF или JSON
                if (contentType && contentType.includes("application/pdf")) {
                    const blob = await response.blob();
                    const pdfObjectUrl = URL.createObjectURL(blob);
                    setPdfUrl(pdfObjectUrl);
                    setReportStatus('ready');
                } else if (contentType && contentType.includes("application/json")) {
                    // Если это JSON, разбираем как JSON
                    const json = await response.json();

                    if (json.status === "в обработке") {
                        setReportStatus('inProgress');
                    }
                } else {
                    throw new Error("Неподдерживаемый формат данных");
                }
            } else {
                setReportStatus('inProgress');
            }
        } catch (error) {
            console.error('Ошибка при получении статуса отчета:', error);
            setReportStatus('error');
        }
    };

    // Таймер для повторного запроса в случае ошибки
    useEffect(() => {
        if (reportStatus === 'error' || reportStatus === 'inProgress') {
            const retryTimer = setTimeout(() => {
                fetchReportStatus();
                setReportStatus('loading');
            }, 10000); // 10 секунд

            return () => clearTimeout(retryTimer);
        }
    }, [reportStatus]);

    useEffect(() => {
        if (taskId) {
            fetchReportStatus();
        }
    }, [taskId]);

    return (
        <div className={styles.reportWrapper}>
            {reportStatus === 'loading' && (
                <Loader />
            )}
            {reportStatus === 'inProgress' && (
                <p className={styles.title}>
                    Анализ в процессе, ожидайте...
                </p>
            )}
            {reportStatus === 'ready' && (
                <div className={styles.reportReady}>
                    <p className={styles.title}>
                        Отчет готов!
                    </p>
                    <div className={styles.container}>
                        <p className={styles.desc}>Шаг 3/3</p>
                        <div className={styles.btnsWrapper}>
                            <UIButton href={pdfUrl} downloadName="my-report.pdf">
                                Скачать PDF-файл
                                <img src="/icons/download-white.svg" alt="download" width={24} height={24} />
                            </UIButton>
                            <UIButton href={pdfUrl} target="_blank">
                                Открыть PDF-файл
                                <img src="/icons/send.svg" alt="send" width={24} height={24} />
                            </UIButton>
                        </div>
                    </div>
                </div>
            )}
            {reportStatus === 'error' && (
                <p className={styles.title}>
                    Произошла ошибка при получении отчета. Пожалуйста, попробуйте позже.
                </p>
            )}
        </div>
    );
};
