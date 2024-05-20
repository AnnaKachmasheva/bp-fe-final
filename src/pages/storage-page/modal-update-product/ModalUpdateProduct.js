import React, {useRef} from "react";
import * as Yup from "yup";
import {userApi} from "../../../services/api";
import {Field, Form, Formik} from "formik";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import ModalWindow from "../../../components/modal/ModalWindow";


export const ModalUpdateProduct = (props) => {

    const errorFromServerRef = useRef('');

    if (!props.show)
        return null;

    function getContent() {

        const initialValues = {
            category: props.product.category?.name,
            status: props.product.status?.name,
            name: props.product.name,
            description: props.product.description,
            photos: props.product.photos,
            isDeleted: props.product.isDeleted
        };

        const validationSchema = Yup.object().shape({
            name: Yup.string()
                .required('Name is required')
        });

        const setErrorFromServer = (error) => {
            errorFromServerRef.current = error;
        }

        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        const handleSubmitForm = async (e) => {
            try {
                const id = props.product.id;
                console.log("id=" + id)

                const product = {
                    category: {name: e.category},
                    status: {name: e.status},
                    name: e.name,
                    description: e.description,
                    images: [],
                    isDeleted: e.isDeleted
                };

                await userApi.updateProduct(id, product);

                props.onClose(true)
                window.location.reload();
            } catch (error) {
                console.log('error - update product' + error)
            }
        }

        // const handlePhotoChange = (event) => {
        //     const newFiles = Array.from(event.target.files);
        //     props.onPhotoChange(newFiles);
        // };
        //
        // const removeImage = (index) => {
        //     const updatedPhotos = [...props.photos];
        //     updatedPhotos.splice(index, 1);
        //     props.onPhotoSet(updatedPhotos);
        // };

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
                              isValid,
                              handleChange
                          }) => (
                            <Form className={'form'}>

                                <span className={errorFromServerRef.current !== '' ? 'error-span' : 'hidden-span'}>
                                {errorFromServerRef.current}
                            </span>

                                <div className={'form-group select'}>
                                    <label>Category*</label>
                                    <select defaultValue={props.product.category?.name}
                                            onChange={e => values.category = e.target.value}>
                                        <option key={0}
                                                value={'-'}>
                                            -
                                        </option>
                                        {props.categories.map(category => (
                                            <option key={category.name}
                                                    value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={'form-group select'}>
                                    <label>State*</label>
                                    <select defaultValue={props.product.status?.name}
                                            onChange={e => values.status = e.target.value}>
                                        <option key={0}
                                                value={'-'}>
                                            -
                                        </option>
                                        {props.statuses.map(status => (
                                            <option key={status.name}
                                                    value={status.name}>
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={'form-group'}>
                                    <label>Name*</label>
                                    <Field
                                        type={'text'}
                                        className={'form-control '
                                            + (values.name === '' && !touched.name ?
                                                null :
                                                (touched.name && errors.name ?
                                                    'is-invalid' :
                                                    'is-valid'))}
                                        placeholder={'Enter name'}
                                        name={'name'}
                                    />
                                </div>

                                <div className={'form-group'}>
                                    <label>Description</label>
                                    <Field
                                        as="textarea"
                                        className={'form-control '
                                            + (values.description === '' && !touched.description ?
                                                null :
                                                (touched.description && errors.description ?
                                                    'is-invalid' :
                                                    'is-valid'))}
                                        placeholder={'Enter description'}
                                        name={'description'}
                                    />
                                </div>

                                <div className={'form-input '}>
                                    <label>Deleted*</label>
                                    <Field className={'form-check-input'}
                                           type={'checkbox'}
                                           checked={values.isDeleted}
                                           name={'isDeleted'}
                                           onChange={handleChange}/>
                                    <label className={'remember-me text-right d-inline m-lg-2'}/>
                                </div>


                                <div className={'buttons'}>
                                    <Button type={ButtonType[1].type}
                                            size={ButtonSize[1].size}
                                            onClick={() => {
                                                setErrorFromServer('');
                                                props.onClose(true);
                                                window.location.reload();
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
                )
                }
            </div>
        )
            ;
    }

    return (
        <ModalWindow show={props.show}
                     title={"Update product"}
                     content={getContent()}/>
    )
}