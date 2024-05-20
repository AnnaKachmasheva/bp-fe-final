import React from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import AuthHeader from "../../components/general/AuthHeader";
import {AiOutlineArrowLeft, AiOutlineArrowRight} from "react-icons/ai";
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";

export default function ResetPasswordPage() {

    const initialValues = {
        email: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email')
    });

    const handleSubmit = (values) => {
        alert(JSON.stringify(values));
    };

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className={'form-content'}>
            <AuthHeader/>

            <div>

                <h1 className={'form-title'}>Reset password</h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({values, errors, touched, isValid, dirty}) => (
                        <Form className={'form'}
                              onSubmit={handleSubmit}>

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

                            <Button type={ButtonType[2].type}
                                    size={ButtonSize[1].size}
                                    disabled={!(dirty && isValid)}
                                    icon={<AiOutlineArrowRight/>}
                                    label={'Send link'}
                                    isIconEnd={true}/>

                            <Button type={ButtonType[3].type}
                                    size={ButtonSize[1].size}
                                    icon={<AiOutlineArrowLeft/>}
                                    onClick={goBack}
                                    label={'Back'}
                                    isIconStart={true}/>

                        </Form>
                    )}
                </Formik>
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