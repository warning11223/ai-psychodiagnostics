import { useEffect } from 'react';
import styles from '../../styles/Questions.module.scss';
import { UIButton } from "../ui/button";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {setAnswer, setLoading} from "../../store/slices/questionsSlice";
import { setStep } from "../../store/slices/uploadPhotosSlice.ts";
import { fetchSurveyData } from "../../store/slices/questionsSlice";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Description } from "../Description";
import Loader from "../Loader";
import type {AppDispatch, RootState} from "../../store";

export function Questions() {
    const dispatch: AppDispatch  = useDispatch();
    const { answers, loading, surveyData } = useSelector((state: RootState) => state.questions);
    const { taskId } = useSelector((state: RootState) => state.uploadPhotos);

    const handleAnswerChange = (questionId: number | string, value: string) => {
        dispatch(setAnswer({ questionId, value }));
    };

    const handleSubmit = async () => {
        const dataToSubmit = {
            task_id: taskId, // Передаем task_id
            survey: answers, // Ответы пользователя
        };

        try {
            dispatch(setLoading(true));

            const response = await fetch('https://sirius-draw-test-94500a1b4a2f.herokuapp.com/submit-survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (response.ok) {
                const data = await response.json();

                if (data?.message) {
                    dispatch(setStep(3));
                    toast.success(data?.message);
                }
            } else {
                if (response.status === 422) {
                    toast.error('Заполните все поля');
                } else {
                    toast.error('Ошибка при отправке данных');
                }
            }
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            toast.error('Ошибка при отправке данных');
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Загружаем данные анкеты
    useEffect(() => {
        dispatch(fetchSurveyData());
    }, [dispatch]);

    if (loading) return <Loader />;

    return (
        <div className={styles.formContainer}>
            {surveyData ? (
                surveyData.map((item, index) => (
                    <div key={item.section} className={styles.section}>
                        <p className={`${styles.title} ${index !== 0 && styles.itemTitle}`}>{item.section}</p>
                        {item.questions.map((question) => (
                            <div key={question.id} className={`${styles.questionWrapper} ${question.type === "radio" && styles.radio}`}>
                                {question.question && (
                                    <p className={`${styles.desc} ${question.id === "childDOB" && styles.margin}`}>{question.question}</p>
                                )}
                                {question.type === 'text' && (
                                    <input
                                        name={`question-${question.id}`}
                                        className={styles.input}
                                        type="text"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    />
                                )}
                                {question.type === 'date' && (
                                    <DatePicker
                                        selected={answers[question.id] ? new Date(answers[question.id] as string) : null}
                                        onChange={(date: Date | null) => {
                                            handleAnswerChange(question.id, date ? date.toISOString().split('T')[0] : '');
                                        }}
                                        dateFormat="dd.MM.yyyy"
                                        className={styles.date}
                                    />
                                )}
                                {question.type === 'radio' && (
                                    <div className={styles.radioWrapper}>
                                        {question.options?.map((option, index) => (
                                            <label key={index} className={styles.option}>
                                                <input
                                                    type="radio"
                                                    name={`question-${question.id}`}
                                                    value={index + 1}
                                                    checked={answers[question.id] === String(index + 1)}
                                                    onChange={() => handleAnswerChange(question.id, String(index + 1))}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {question.type === 'textarea' && (
                                    <textarea
                                        name={`question-${question.id}`}
                                        className={styles.textarea}
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    />
                                )}
                                {question.type === "descriptionBlock" && (
                                    <Description />
                                )}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <Loader />
            )}

            <div className={styles.footer}>
                <p className={styles.desc}>Шаг 2/3</p>

                <div className={styles.buttonsWrapper}>
                    <UIButton
                        onClick={() => dispatch(setStep(1))}
                        className={styles.backBtn}>
                        <img src="/icons/arrow-left.svg" alt="arrow-left" width={24} height={24} />
                        К загрузке рисунков
                    </UIButton>
                    <UIButton
                        disabled={Object.keys(answers).length < 49 || loading}
                        onClick={handleSubmit}>
                        Узнать результаты
                        <img src="/icons/forward-right.svg" alt="forward-right" width={24} height={24} />
                    </UIButton>
                </div>
            </div>
        </div>
    );
}
