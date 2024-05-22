import React, {useState} from "react"
import {Link, Navigate} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import {userApi} from "../../services/api";
import AuthHeader from "../../components/general/AuthHeader";
import {isAdmin, isAuthenticated, isUser, saveToken} from "../../services/auth";
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {GoEye, GoEyeClosed} from "react-icons/go";


function LoginPage() {

    const [errorFromServer, setErrorFromServer] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const initialValues = {
        email: localStorage.getItem('email') != null ? localStorage.getItem('email') : '',
        password: localStorage.getItem('password') != null ? localStorage.getItem('password') : '',
        rememberMe: localStorage.getItem('rememberMe') === null
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Too short'),
    });

    const handleSubmit = async (values) => {
        // remember me?
        const rememberMe = values.rememberMe;
        const email = values.email;
        const password = values.password;
        if (rememberMe === true) {
            localStorage.setItem("rememberMe", rememberMe);
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
        }

        // send login request
        try {
            const response = await userApi.login(email, password);

            if (response && response.error) {
                setErrorFromServer(response.error.message);
            } else {
                saveToken(response);
                window.location.reload();
            }
        } catch (error) {
        }
    }


    if (isAuthenticated() === true) {
        if (isAdmin()) {
            return <Navigate replace to="/app/dashboard"/>;
        } else {
            return <Navigate replace to="/app/orders"/>;
        }
    }

    return (
        <div className={'form-content'}>
            <AuthHeader/>

            <div className={'form-title'}>

                <h1 className={'form-title'}>Welcome back!</h1>
                <h5 className={'form-subtitle'}>Log in to your account.</h5>

                <Formik
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                >
                    {({
                          values,
                          errors,
                          touched,
                          isValid,
                          handleChange
                      }) => (
                        <Form className={'form'}>

                                <span
                                    className={errorFromServer?.length !== 0 ? 'error-span' : 'hidden-span'}>
                                    {errorFromServer}
                                </span>

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
                                            (touched.password && errors.password ?
                                                'is-invalid' :
                                                'is-valid'))}
                                    placeholder={'Enter password'}
                                    name={'password'}
                                    required
                                >
                                </Field>

                                <div className={'invalid-feedback'}>
                                    <ErrorMessage name="password"/>
                                </div>
                            </div>

                            <div className={'row w-100 mt-1'}>
                                <div className={'col float-start d-inline'}>
                                    <Field className={'form-check-input'}
                                           type={'checkbox'}
                                           name={'rememberMe'}
                                           onChange={handleChange}/>
                                    <label className={'remember-me text-right d-inline m-lg-2'}>
                                        Remember me
                                    </label>
                                </div>

                            </div>

                            <Button type={ButtonType[2].type}
                                    isDisabled={!isValid}
                                    size={ButtonSize[1].size}
                                    typeSubmit={true}
                                    label={'Continue'}/>

                        </Form>
                    )}
                </Formik>

                <h5>If you want to log in as an Admin:</h5>
                <h6>email: admin@gmail.com</h6>
                <h6>password: AdminRole1!</h6>
            </div>

            <div className="text-center">
                <p>
                    New here?
                    <Link to={'/registration'}>Create your account now</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage