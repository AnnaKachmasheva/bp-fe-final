import React from "react";
import styles from './Button.module.scss';

const Button = (props) => {
    const handleClick = () => {
        if (props.onClick) {
            props.onClick();
        }
    };

    // determine the button's type and size styles
    const getButtonType = () => {
        const buttonType = ButtonType.find(item => item.type === props.type);
        const buttonSize = ButtonSize.find(item => item.size === props.size);
        return `${buttonType ? buttonType.style : ''} ${buttonSize ? buttonSize.style : ''}`;
    };

    return (
        <button className={getButtonType()}
                onClick={handleClick}
                disabled={props.isDisabled}
                type={props.typeSubmit ? "submit" : "button"}>
            {props.isIconStart ? (props.icon && React.cloneElement(props.icon, {className: 'button-icon'})) : null}
            {props.label}
            {props.isIconEnd ? (props.icon && React.cloneElement(props.icon, {className: 'button-icon'})) : null}
        </button>
    );
};

export default Button;

export const ButtonType = [
    {type: 'primary', style: styles.primary},
    {type: 'primaryOutline', style: styles.primaryOutline},
    {type: 'secondary', style: styles.secondary},
    {type: 'secondaryOutline', style: styles.secondaryOutline},
    {type: 'danger', style: styles.danger},
    {type: 'dangerOutline', style: styles.dangerOutline}
]

export const ButtonSize = [
    {size: 'small', style: styles.small},
    {size: 'default', style: styles.default},
    {size: 'large', style: styles.large},
    {size: 'smallest', style: styles.smallest}
]