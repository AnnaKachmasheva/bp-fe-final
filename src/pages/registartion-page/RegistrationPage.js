import React, {useState} from "react"
import {Link, Navigate} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import {BsCheckCircleFill} from "react-icons/bs";
import classnames from 'classnames';
import {userApi} from "../../services/api";
import AuthHeader from "../../components/general/AuthHeader";
import {isAuthenticated, saveToken} from "../../services/auth";
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {GoEye, GoEyeClosed} from "react-icons/go";


function RegistrationPage() {

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email'),
        password: Yup.string()
            .required('Password is required'),
        repeatPassword: Yup.string()
            .required('Repeat password is required')
            .oneOf([Yup.ref("password"), null], "Password must match")
    });


    const [min8Characters, setMin8Characters] = useState(false)
    const [hasNumber, setHasNumber] = useState(false)
    const [hasLowercaseLetter, setHasLowercaseLetter] = useState(false)
    const [hasUppercaseLetter, setHasUppercaseLetter] = useState(false)
    const [hasSymbol, setHasSymbol] = useState(false)

    const [twoConditionsForPassword, setTwoConditionsForPassword] = useState(false)
    const [fourConditionsForPassword, setFourConditionsForPassword] = useState(false)
    const [fiveConditionsForPassword, setFiveConditionsForPassword] = useState(false)

    const [errorFromServer, setErrorFromServer] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);


    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleRepeatPassword = () => {
        setShowRepeatPassword(!showRepeatPassword);
    };

    const handleChangePassword = (e) => {
        const password = e.target.value;

        const passwordHasMin8Characters = password.length > 7;
        setMin8Characters(passwordHasMin8Characters);

        const passwordHasNumber = /[0-9]/.test(password);
        setHasNumber(passwordHasNumber);

        const passwordHasLowCaseLetter = /[a-z]/.test(password);
        setHasLowercaseLetter(passwordHasLowCaseLetter);

        const passwordHasUpperCaseLetter = /[[A-Z]/.test(password);
        setHasUppercaseLetter(passwordHasUpperCaseLetter);

        const passwordHasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        setHasSymbol(passwordHasSymbol);

        let countConditions = 0;
        countConditions += passwordHasMin8Characters ? 1 : 0;
        countConditions += passwordHasNumber ? 1 : 0;
        countConditions += passwordHasLowCaseLetter ? 1 : 0;
        countConditions += passwordHasUpperCaseLetter ? 1 : 0;
        countConditions += passwordHasSymbol ? 1 : 0;

        setTwoConditionsForPassword(countConditions >= 2);
        setFourConditionsForPassword(countConditions >= 4);
        setFiveConditionsForPassword(countConditions >= 5);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const repeatPassword = e.target.repeatPassword.value;

        const user = {
            firstName,
            lastName,
            email,
            password,
            repeatPassword
        };

        try {
            // registration
            const response = await userApi.registration(user);
            if (response && response.error && response.error.message) {
                setErrorFromServer(response.error.message);
            } else {
                // login
                try {
                    const response = await userApi.login(email, password);

                    if (response && response.error) {
                        setErrorFromServer(response.error.message);
                    } else {
                        saveToken(response);
                        window.location.reload();
                    }
                } catch (error) {
                    console.log('Login error: ' + error)
                }
            }
        } catch (error) {
            console.log('Registration error: ' + error)
        }
    };

    if (isAuthenticated() === true) {
        return <Navigate replace to="/app/dashboard"/>;
    }

    return (
        <div className={'form-content'}>

            <AuthHeader/>

            <div>
                <h1 className={'form-title'}>Registration</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                          values,
                          errors,
                          touched,
                          isValid, dirty
                      }) => (
                        <Form className={'form'}
                              onSubmit={handleSubmit}>

                            <span className={errorFromServer !== '' ? 'error-span' : 'hidden-span'}>
                                    {errorFromServer}
                            </span>

                            <div className={'form-group'}>
                                <label>First name</label>
                                <Field
                                    type={'text'}
                                    className={'form-control '
                                        + (values.firstName === '' && !touched.firstName ?
                                            null :
                                            (touched.firstName && errors.firstName ?
                                                'is-invalid' :
                                                'is-valid'))}
                                    placeholder={'Enter first name'}
                                    name={'firstName'}
                                />
                            </div>

                            <div className={'form-group'}>
                                <label>Last name</label>
                                <Field
                                    type={'text'}
                                    className={'form-control '
                                        + (values.lastName === '' && !touched.lastName ?
                                            null :
                                            (touched.lastName && errors.lastName ?
                                                'is-invalid' :
                                                'is-valid'))}
                                    placeholder={'Enter last name'}
                                    name={'lastName'}
                                />
                            </div>

                            <div className={'form-group'}>
                                <label>Email address*</label>
                                <Field
                                    type={'email'}
                                    className={'form-control '
                                        + (values.email === '' && !touched.email ?
                                            null :
                                            (touched.email && errors.email ?
                                                'is-invalid' :
                                                'is-valid'))}
                                    placeholder={'Enter email'}
                                    name={'email'}
                                    required
                                />
                                <div className={'invalid-feedback'}>
                                    <ErrorMessage name="email"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className={'password-label'}>
                                    <label>Password*</label>

                                    <button
                                        className={'password-hidden-show'}
                                        type="button"
                                        onClick={handleTogglePassword}
                                        style={{
                                            border: 'none',
                                            background: 'transparent'
                                        }}
                                    >
                                        {showPassword ? <GoEye size={20}/> : <GoEyeClosed size={20}/>}
                                    </button>
                                </div>

                                <Field
                                    type={showPassword ? 'text' : 'password'}
                                    className={'form-control '
                                        + (values.password === '' && !touched.password ?
                                            null :
                                            (touched.password && (!fiveConditionsForPassword || errors.password) ?
                                                'is-invalid' :
                                                'is-valid'))}
                                    placeholder={'Enter password'}
                                    name={'password'}
                                    onKeyUp={(e) => handleChangePassword(e)}
                                    required
                                />
                                <div className={'invalid-feedback'}>
                                    <ErrorMessage name="password"/>
                                </div>
                            </div>

                            <div className={'password-rules'}>
                                <div className={'password-rules-progress'}>
                                    <div className={classnames('password-bar',
                                        twoConditionsForPassword ?
                                            'password-bar-success-color' :
                                            'password-bar-default-color')}>
                                    </div>
                                    <div className={classnames('password-bar',
                                        fourConditionsForPassword ?
                                            'password-bar-success-color' :
                                            'password-bar-default-color')}>
                                    </div>
                                    <div className={classnames('password-bar',
                                        fiveConditionsForPassword ?
                                            'password-bar-success-color' :
                                            'password-bar-default-color')}>
                                    </div>
                                </div>

                                <div className={'rules row'}>

                                    <div className={'column-rules col'}>

                                        <div className={
                                            classnames('row',
                                                min8Characters ? 'success-color-span' : 'default-color-span')}>
                                            <BsCheckCircleFill size={22}
                                                               className={classnames('rule-icon ',
                                                                   min8Characters ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                            <span className={'w-auto'}>Min. 8 characters</span>
                                        </div>

                                        <div className={
                                            classnames('row',
                                                hasNumber ? 'success-color-span' : 'default-color-span')}>
                                            <BsCheckCircleFill size={22}
                                                               className={classnames('rule-icon ',
                                                                   hasNumber ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                            <span className={'w-auto'}>
                                                        A number
                                                    </span>
                                        </div>

                                    </div>

                                    <div className={'column-rules col'}>

                                        <div className={
                                            classnames('row',
                                                hasUppercaseLetter ? 'success-color-span' : 'default-color-span')}>
                                            <BsCheckCircleFill size={22}
                                                               className={classnames('rule-icon ',
                                                                   hasUppercaseLetter ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                            <span className={'w-auto'}>A uppercase letter</span>
                                        </div>

                                        <div className={
                                            classnames('row',
                                                hasLowercaseLetter ? 'success-color-span' : 'default-color-span')}>
                                            <BsCheckCircleFill size={22}
                                                               className={classnames('rule-icon ',
                                                                   hasLowercaseLetter ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                            <span className={'w-auto'}>A lowercase letter</span>
                                        </div>

                                        <div className={
                                            classnames('row',
                                                hasSymbol ? 'success-color-span' : 'default-color-span')}>
                                            <BsCheckCircleFill size={22}
                                                               className={classnames('rule-icon ',
                                                                   hasSymbol ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                            <span className={'w-auto'}>A special symbol</span>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            <div className="form-group  mb-4">
                                <div className={'password-label'}>
                                    <label>Repeat password*</label>

                                    <button
                                        className={'password-hidden-show'}
                                        type="button"
                                        onClick={handleToggleRepeatPassword}
                                        style={{
                                            border: 'none',
                                            background: 'transparent'
                                        }}
                                    >
                                        {showRepeatPassword ? <GoEye size={20}/> : <GoEyeClosed size={20}/>}
                                    </button>
                                </div>
                                <Field
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    className={'form-control '
                                        + (values.repeatPassword === '' && !touched.repeatPassword ?
                                            null :
                                            (touched.repeatPassword && errors.repeatPassword ?
                                                'is-invalid' :
                                                'is-valid'))}
                                    placeholder={'Repeat your password'}
                                    name={'repeatPassword'}
                                    required
                                />
                                <div className={'invalid-feedback'}>
                                    <ErrorMessage name="repeatPassword"/>
                                </div>
                            </div>

                            <Button type={ButtonType[2].type}
                                    disabled={!isValid}
                                    size={ButtonSize[1].size}
                                    typeSubmit={true}
                                    label={'Create account'}/>
                        </Form>
                    )}
                </Formik>
            </div>


            <div className="text-center">
                <p>
                    Already have an account?
                    <Link to={'/login'}>Log in</Link>
                </p>
            </div>

        </div>
    )
}

export default RegistrationPage