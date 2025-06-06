import styles from "../../styles/Description.module.scss"

export const Description = () => {
    return (
        <div className={styles.descWrapper}>
            <div className={styles.block}>
                <img src="/icons/like.svg" alt="like" width={32} height={30} />
                <p>
                    Пожалуйста, внимательно прочитайте каждый вопрос и выберите наиболее подходящий вариант ответа, отражающий поведение и эмоциональное состояние вашего ребенка в течение последних 2-4 недель. Отвечайте максимально честно и искренне, так как от этого зависит точность оценки психоэмоционального развития Вашего ребенка.
                </p>
            </div>
            <div className={styles.bottomBlock}>
                <img src="/icons/flag.svg" alt="flag" width={32} height={31} />
                <p>Все вопросы обязательны к заполнению</p>
            </div>
        </div>
    );
};