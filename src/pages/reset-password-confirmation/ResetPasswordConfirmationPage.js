import React, {useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import classnames from "classnames";
import {BsCheckCircle} from "react-icons/bs";
import AuthHeader from "../../components/general/AuthHeader";

export default function ResetPasswordConfirmationPage() {

    const initialValues = {
        password: '',
        repeatPassword: ''
    };

    const validationSchema = Yup.object().shape({
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

    const handleSubmit = async (values) => {
        try {
            const validatedData = await validationSchema.validate(values);

            // Send validated data to server
            alert(JSON.stringify(values));

        } catch (error) {
            // Handle validation error
        }
    };

    return (
        <div className={'container'}>

            <div className={'main-container'}>
                <AuthHeader/>

                <div className={'form-container'}>
                    <h1 className={'form-title'}>Reset password</h1>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({values, errors, touched, isValid, dirty}) => (
                            <Form onSubmit={handleSubmit}>

                                <div className="form-group">
                                    <label>Password*</label>
                                    <Field
                                        type={'password'}
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
                                                <BsCheckCircle size={22}
                                                               className={classnames('rule-icon ',
                                                                   min8Characters ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                                <span className={'w-auto'}>Min. 8 characters</span>
                                            </div>

                                            <div className={
                                                classnames('row',
                                                    hasNumber ? 'success-color-span' : 'default-color-span')}>
                                                <BsCheckCircle size={22}
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
                                                <BsCheckCircle size={22}
                                                               className={classnames('rule-icon ',
                                                                   hasUppercaseLetter ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                                <span className={'w-auto'}>A uppercase letter</span>
                                            </div>

                                            <div className={
                                                classnames('row',
                                                    hasLowercaseLetter ? 'success-color-span' : 'default-color-span')}>
                                                <BsCheckCircle size={22}
                                                               className={classnames('rule-icon ',
                                                                   hasLowercaseLetter ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                                <span className={'w-auto'}>A lowercase letter</span>
                                            </div>

                                            <div className={
                                                classnames('row',
                                                    hasSymbol ? 'success-color-span' : 'default-color-span')}>
                                                <BsCheckCircle size={22}
                                                               className={classnames('rule-icon ',
                                                                   hasSymbol ?
                                                                       'success-color-icon' :
                                                                       'default-color-icon')}/>
                                                <span className={'w-auto'}>A special symbol</span>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                <div className="form-group">
                                    <label>Repeat password*</label>
                                    <Field
                                        type={'password'}
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

                                <button type={'submit'}
                                        disabled={!(dirty && isValid)}
                                        className={'btn btn-primary'}>
                                    Contune
                                </button>

                            </Form>
                        )}
                    </Formik>
                </div>

                <div className="text-center"></div>

            </div>

            <div className={'image-form'}></div>

        </div>
    )
}