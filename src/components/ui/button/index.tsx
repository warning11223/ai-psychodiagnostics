import styles from '../../../styles/UI.module.scss';
import type { FC, ReactNode } from "react";

interface UIButtonProps {
    children: ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    href?: string;
    target?: string;
    downloadName?: string;
}

export const UIButton: FC<UIButtonProps> = ({
                                                children,
                                                disabled,
                                                className,
                                                onClick,
                                                href,
                                                target,
                                                downloadName
                                            }) => {
    if (href) {
        return (
            <a
                href={href}
                target={target || '_self'}
                download={downloadName || undefined}
                className={`${styles.button} ${disabled ? styles.disabled : ''} ${className ? className : ''}`}
                onClick={onClick}
            >
                {children}
            </a>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`${styles.button} ${disabled ? styles.disabled : ''} ${className ? className : ''}`}
        >
            {children}
        </div>
    );
};
