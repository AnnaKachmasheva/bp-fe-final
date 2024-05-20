import React from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import {userApi} from "../../../services/api";
import {isAdmin, updateToken} from "../../../services/auth";


export const ModalEditProfile = (props) => {
    if (!props.show)
        return null;

    const initialValues = {
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email,
        userRole: props.user.userRole,
        isDeleted: props.user.isDeleted
    };


    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email')
    });


    const handleUpdateUser = async (values) => {
        try {
            const userId = props.user.id;

            const userRequest = {
                id: userId,
                email: values.email,
                userRole: values.userRole,
                firstName: values.firstName,
                lastName: values.lastName,
                isDeleted: values.isDeleted
            };

            const response = await userApi.updateUser(userId, userRequest);
            updateToken(response);

            props.onClose(true)
            window.location.reload();

        } catch (error) {
        }
    }

    function getContent() {
        return (
            <div className={'modal-window-body'}>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdateUser}>
                    {({
                          values,
                          errors,
                          touched,
                          isValid,
                          handleChange
                      }) => (
                        <Form className={'form'}>
                            <div className={'form-column'}>
                                <div className={'form-row'}>
                                    <div className={'form-input'}>
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

                                    <div className={'form-input'}>
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
                                </div>

                                <div className={'form-row'}>

                                    <div className={'form-input'}>
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
                                </div>
                                <div className={'form-row'}>

                                    {isAdmin() && (
                                        <div className={'form-input'}>
                                            <label>User Role*</label>
                                            <Field
                                                as="select"
                                                name="userRole"
                                                className={'form-control '
                                                    + (values.userRole === '' && !touched.userRole ?
                                                        null :
                                                        (touched.userRole && errors.userRole ?
                                                            'is-invalid' :
                                                            'is-valid'))}
                                                required
                                            >
                                                <option value="ROLE_USER">ROLE_USER</option>
                                                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                            </Field>
                                            <div className={'invalid-feedback'}>
                                                <ErrorMessage name="userRole"/>
                                            </div>
                                        </div>
                                    )}

                                    {isAdmin() && (
                                        <div className={'form-input'}>
                                            <label>Deleted*</label>
                                            <Field className={'form-check-input'}
                                                   type={'checkbox'}
                                                   name={'isDeleted'}
                                                   onChange={handleChange}/>
                                            <label className={'remember-me text-right d-inline m-lg-2'}/>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={'buttons'}>
                                <Button type={ButtonType[1].type}
                                        size={ButtonSize[1].size}
                                        onClick={props.onClose}
                                        label={'Cancel'}/>

                                <Button type={ButtonType[2].type}
                                        size={ButtonSize[1].size}
                                        isDisabled={!isValid}
                                        typeSubmit={true}
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