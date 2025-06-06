import { useRef, useState } from 'react';
import styles from "../../styles/LoadPhotos.module.scss";
import * as React from "react";
import { UIButton } from "../ui/button";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { setStep, setTaskId } from "../../store/slices/uploadPhotosSlice.ts";

// Определяем типы для допустимых файлов и размера
const allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg'];
const maxSize: number = 5 * 1024 * 1024; // 5 MB

export function LoadPhotos() {
    const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
    const [loading, setLoading] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const { descItems, descPhotos } = useSelector((state: RootState) => state.uploadPhotos);

    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        const file = e.target.files ? e.target.files[0] : null;

        // Проверка на допустимые файлы
        if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
            const updatedPhotos = [...photos];
            updatedPhotos[index] = file;
            setPhotos(updatedPhotos);
        }
    };

    const triggerFileInput = (index: number): void => {
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]?.click();
        }
    };

    // Загрузка фото
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            photos.forEach((photo) => {
                if (photo) {
                    formData.append('files', photo);
                }
            });

            const response = await fetch('https://sirius-draw-test-94500a1b4a2f.herokuapp.com/upload', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();

                if (response.status === 202) {
                    toast.success(data?.status);
                    dispatch(setTaskId(data?.task_id));
                    dispatch(setStep(2));
                } else {
                    toast.error('Ошибка при отправке файлов!');
                    throw new Error('Ошибка при отправке файла');
                }
            } else {
                throw new Error('Ошибка при отправке файла');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            toast.error('Произошла ошибка при отправке файлов.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.photoUploadScreen}>
            <h2 className={styles.title}>Загрузите фотографии рисунков</h2>

            {descPhotos && (
                <div className={styles.errorWrapper}>
                    <img src="/icons/error.svg" alt="error" width={12} height={12} />
                    <p className={styles.errorMessage}>{descPhotos}</p>
                </div>
            )}

            <div className={styles.fileUploadContainer}>
                {photos.map((photo, index) => (
                    <div key={index}>
                        <div key={index} className={styles.fileBox}>
                            <input
                                type="file"
                                ref={(el) => { fileInputRefs.current[index] = el }}
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, index)}
                                style={{ display: 'none' }}
                            />
                            {photo ? (
                                <div className={styles.filePreview}>
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt={`preview-${index}`}
                                        className={styles.filePreviewImage}
                                    />
                                    <div className={`${styles.downloadWrapper} ${styles.absolute}`} onClick={() => triggerFileInput(index)}>
                                        <img src="/icons/update.svg" alt="update" width={36} height={36} />
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.downloadWrapper} onClick={() => triggerFileInput(index)}>
                                    <img src="/icons/download.svg" alt="download" width={36} height={36} />
                                </div>
                            )}
                        </div>
                        <p className={styles.desc}>{descItems[index]}</p>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <p className={styles.step}>Шаг 1/3</p>

                <UIButton
                    disabled={photos.filter(photo => photo !== null).length !== 3 || loading}
                    onClick={handleSubmit}
                >
                    Далее
                    <img
                        src="/icons/right.svg"
                        alt="right"
                        width={24}
                        height={24}
                    />
                </UIButton>
            </div>
        </div>
    );
}
