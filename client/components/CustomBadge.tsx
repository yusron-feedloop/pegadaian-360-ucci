import styles from '../styles/CustomBadge.module.css'

const CustomBadge = ({color, text}) => {
    let col = styles[color];
    return (
        <div className={`${styles['custom-badge']} ${styles[color]}`}>{text}</div>
    );
}

export default CustomBadge;