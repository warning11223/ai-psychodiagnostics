import { LoadPhotos } from "../LoadPhotos";
import styles from "../../styles/LoadPhotos.module.scss";
import { Questions } from "../Questions";
import { Report } from "../Report";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

function Test() {
    const { step } = useSelector((state: RootState) => state.uploadPhotos);

    const getProgress = (step: number) => {
        return step * 33.33333;
    };

    return (
        <div className={`${styles.block} ${step === 3 && styles.height}`}>
            <div className={styles.progressContainer}>
                <div
                    className={`${styles.progressBar} ${step === 3 && styles.borderRight}`}
                    style={{ width: `${getProgress(step)}%` }}
                />
            </div>

            {step === 1 && <LoadPhotos />}
            {step === 2 && <Questions />}
            {step === 3 && <Report />}
        </div>
    );
}

export default Test;
