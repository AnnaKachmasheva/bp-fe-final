import React from "react"
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {useNavigate} from "react-router-dom";


function HelloPage() {

    let navigate = useNavigate();

    const handleGoLogIn = () => {
        navigate('/login');
    };

    const handleGoRegistration = () => {
        navigate('/registration');
    };


    return (
        <div className={'main-content'}>
            <div className={'hello-content'}>

                <h1 className={'form-title '}>Welcome!</h1>

                <Button type={ButtonType[2].type}
                        onClick={handleGoLogIn}
                        size={ButtonSize[1].size}
                        label={'Log in'}/>

                <Button type={ButtonType[3].type}
                        onClick={handleGoRegistration}
                        size={ButtonSize[1].size}
                        label={'Registration'}/>
            </div>
        </div>
    )
}

export default HelloPage;