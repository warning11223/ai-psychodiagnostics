import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import Loader from "../Loader";
import { UIButton } from "../ui/button";
import styles from "../../styles/Report.module.scss";
import {fetchReportStatus} from "../../api/fetchReportStatus.ts";

export const Report = () => {
    const [reportStatus, setReportStatus] = useState('loading'); // Статус отчета
    const [pdfUrl, setPdfUrl] = useState(''); // Ссылка на PDF

    const { taskId } = useSelector((state: RootState) => state.uploadPhotos);

    // Таймер для повторного запроса в случае ошибки
    useEffect(() => {
        if (reportStatus === 'error' || reportStatus === 'inProgress') {
            const retryTimer = setTimeout(() => {
                fetchReportStatus(taskId, setPdfUrl, setReportStatus);
                setReportStatus('loading');
            }, 10000); // 10 секунд

            return () => clearTimeout(retryTimer);
        }
    }, [reportStatus]);

    useEffect(() => {
        if (taskId) {
            fetchReportStatus(taskId, setPdfUrl, setReportStatus);
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
                    Произошла ошибка при получении отчета. Повторный запрос через 10 секунд.
                </p>
            )}
        </div>
    );
};
