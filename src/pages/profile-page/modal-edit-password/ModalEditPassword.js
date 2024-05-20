import React, {useEffect} from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import {ErrorMessage, Field, Form, Formik} from "formik";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import * as Yup from "yup";
import {GoEye, GoEyeClosed} from "react-icons/go";
import {userApi} from "../../../services/api";


export const ModalEditPassword = (props) => {

    let errorStr;
    useEffect(() => {
        errorStr = "";
    }, []);

    if (!props.show)
        return null;

    const initialValues = {
        passwordOld: '',
        password: '',
        confirmPassword: ''
    };

    // todo
    const validationSchema = Yup.object().shape({
        passwordOld: Yup.string()
            .required('Password is required')
            .min(8, 'Too short'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Too short'),
        confirmPassword: Yup.string()
            .required('Repeat password is required')
            .oneOf([Yup.ref("password"), null], "Password must match")
    });

    const handleUpdatePassword = async (values) => {
        try {
            const userId = props.user.id;

            const request = {
                passwordOld: values.passwordOld,
                passwordNew: values.password
            };

            const response = await userApi.changePassword(userId, request);
            if (response.error) {
                props.setErrorChangePassword(response?.error?.message);
            } else {
                props.onClose(true)
                window.location.reload();
            }
        } catch (error) {
        }
    }

    const handleTogglePassword = () => {
        props.onTogglePassword();
    };

    const handleToggleRepeatPassword = () => {
        props.onToggleRepeatPassword();
    };

    const handleToggleOldPassword = () => {
        props.onToggleOldPassword();
    };

    function getContent() {
        return (
            <div className={'modal-window-body'}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdatePassword}>
                    {({
                          values,
                          errors,
                          touched,
                          isValid
                      }) => (
                        <Form className={'form'}>
                            <p className={'invalid-feedback'}>{props.errorChangePassword}</p>

                            <div className={'form-column'}>
                                <div className={'form-row'}>
                                    <div className={'form-input'}>
                                        <div className={'password-label'}>
                                            <label>Old password*</label>
                                            <button className={'password-hidden-show'}
                                                    type="button"
                                                    onClick={handleToggleOldPassword}
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent'
                                                    }}>
                                                {props.showOldPassword ? <GoEye size={20}/> : <GoEyeClosed size={20}/>}
                                            </button>
                                        </div>
                                        <Field
                                            type={props.showOldPassword ? 'text' : 'password'}
                                            className={'form-control '
                                                + (values.passwordOld === '' && !touched.passwordOld ?
                                                    null :
                                                    (touched.passwordOld && errors.passwordOld ?
                                                        'is-invalid' :
                                                        'is-valid'))}
                                            name={'passwordOld'}
                                            required
                                            placeholder={'Enter old password'}
                                        />
                                        <div className={'invalid-feedback'}>
                                            <ErrorMessage name="passwordOld"/>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className={'form-column'}>
                                <div className={'form-row'}>
                                    <div className={'form-input'}>
                                        <div className={'password-label'}>
                                            <label>New password*</label>
                                            <button
                                                className={'password-hidden-show'}
                                                type="button"
                                                onClick={handleTogglePassword}
                                                style={{
                                                    border: 'none',
                                                    background: 'transparent'
                                                }}>
                                                {props.showPassword ? <GoEye size={20}/> : <GoEyeClosed size={20}/>}
                                            </button>
                                        </div>
                                        <Field
                                            type={props.showPassword ? 'text' : 'password'}
                                            className={'form-control '
                                                + (values.password === '' && !touched.password ?
                                                    null :
                                                    (touched.password && errors.password ?
                                                        'is-invalid' :
                                                        'is-valid'))}
                                            name={'password'}
                                            required
                                            placeholder={'Enter new password'}
                                        />
                                        <div className={'invalid-feedback'}>
                                            <ErrorMessage name="password"/>
                                        </div>
                                    </div>

                                    <div className={'form-input'}>
                                        <div className={'password-label'}>
                                            <label>Confirm password*</label>
                                            <button
                                                className={'password-hidden-show'}
                                                type="button"
                                                onClick={handleToggleRepeatPassword}
                                                style={{
                                                    border: 'none',
                                                    background: 'transparent'
                                                }}>
                                                {props.showRepeatPassword ? <GoEye size={20}/> :
                                                    <GoEyeClosed size={20}/>}
                                            </button>
                                        </div>
                                        <Field
                                            type={props.showRepeatPassword ? 'text' : 'password'}
                                            className={'form-control '
                                                + (values.confirmPassword === '' && !touched.confirmPassword ?
                                                    null :
                                                    (touched.confirmPassword && errors.confirmPassword ?
                                                        'is-invalid' :
                                                        'is-valid'))}
                                            name={'confirmPassword'}
                                            placeholder={'Repeat your new password'}
                                            required
                                        />
                                        <div className={'invalid-feedback'}>
                                            <ErrorMessage name="confirmPassword"/>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            <div className={'buttons'}>
                                <Button type={ButtonType[3].type}
                                        size={ButtonSize[1].size}
                                        onClick={props.onClose}
                                        label={'Cancel'}/>

                                <Button type={ButtonType[0].type}
                                        size={ButtonSize[1].size}
                                        typeSubmit={true}
                                        isDisabled={!isValid}
                                        label={'Save changes'}/>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     title={"Edit profile"}
                     content={getContent()}/>
    )
}
