import React, {useRef} from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {UserRole} from "../../../utils/Constants";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import {userApi} from "../../../services/api";


export const ModalAddUser = (props) => {

    const errorFromServerRef = useRef('');

    if (!props.show)
        return null;

    function getContent() {
        const initialValues = {
            firstName: props.firstName,
            lastName: props.lastName,
            email: props.email,
            password: props.password,
            userRole: props.userRole
        };

        const lowercaseRegex = /(?=.*[a-z])/;
        const uppercaseRegex = /(?=.*[A-Z])/;
        const digitRegex = /(?=.*\d)/;
        const specialCharRegex = /(?=.*[@$!%*?&])/;

        const validationSchema = Yup.object().shape({
            email: Yup.string()
                .required('Email is required')
                .email('Invalid email'),
            password: Yup.string()
                .required('Password is required')
                .matches(lowercaseRegex, 'One lowercase letter required')
                .matches(uppercaseRegex, 'One uppercase letter required')
                .matches(digitRegex, 'One number required')
                .matches(specialCharRegex, 'One special character required')
                .min(8, 'Min. 8 characters')
        });

        const setErrorFromServer = (error) => {
            errorFromServerRef.current = error;
        };

        const handleSubmitForm = async (e) => {
            setErrorFromServer('');

            const email = e.email;
            const userRole = e.userRole || UserRole.USER;
            const password = e.password;
            const firstName = e.firstName;
            const lastName = e.lastName;

            const user = {
                email,
                userRole,
                password,
                firstName,
                lastName
            };

            const response = await userApi.createUser(user);
            if (response && response.error && response.error.message) {
                setErrorFromServer(response.error.message);
            } else {
                props.onClose(true);
                window.location.reload();
            }
        }

        return (
            <div className={'modal-window-body'}>
                {props.show && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitForm}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              isValid
                          }) => (
                            <Form className={'form'}>
                            <span className={errorFromServerRef.current !== '' ? 'error-span' : 'hidden-span'}>
                                {errorFromServerRef.current}
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
                                    </div>

                                    <Field
                                        type={'password'}
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

                                <div className={'form-group select'}>
                                    <label>User role</label>
                                    <select onChange={e => values.userRole = e.target.value}>
                                        <option value={UserRole.USER}>{UserRole.USER}</option>
                                        <option value={UserRole.ADMIN}>{UserRole.ADMIN}</option>
                                    </select>
                                </div>

                                <div className={'buttons'}>
                                    <Button type={ButtonType[1].type}
                                            size={ButtonSize[1].size}
                                            onClick={() => {
                                                setErrorFromServer('');
                                                props.onClose(true);
                                            }}
                                            label={'Cancel'}/>

                                    <Button type={ButtonType[2].type}
                                            disabled={!isValid}
                                            size={ButtonSize[1].size}
                                            typeSubmit={true}
                                            label={'Save'}/>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        );
    }

    return (
        <ModalWindow show={props.show}
                     title={"Create user"}
                     content={getContent()}/>
    )
}
