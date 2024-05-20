import React, {useRef} from "react";
import * as Yup from "yup";
import {userApi} from "../../../services/api";
import {Field, Form, Formik} from "formik";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import ModalWindow from "../../../components/modal/ModalWindow";

export const ModalAddProduct = (props) => {

    const errorFromServerRef = useRef('');

    if (!props.show)
        return null;

    function getContent() {

        const initialValues = {
            category: '',
            status: '',
            name: '',
            description: ''
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
            setErrorFromServer('');

            const product = {
                category: {name: (!e.category ? props.categories[0].name : e.category)},
                status: {name: (!e.status ? props.statuses[0].name : e.status)},
                name: e.name,
                description: e.description,
            };


            const response = await userApi.createProduct(product,props.photos[0]);
            if (response && response.error && response.error.message) {
                setErrorFromServer(response.error.message);
            } else {
                props.onClose(true)
                window.location.reload();
            }
        }

        const handlePhotoChange = (event) => {
            const newFiles = Array.from(event.target.files);
            props.onPhotoChange(newFiles);
        };

        const removeImage = (index) => {
            const updatedPhotos = [...props.photos];
            updatedPhotos.splice(index, 1);
            props.onPhotoSet(updatedPhotos);
        };

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

                                <div className={'form-group select'}>
                                    <label>Category*</label>
                                    <select onChange={e => values.category = e.target.value}>
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
                                    <select onChange={e => values.status = e.target.value}>
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
                                        maxLength={255}
                                    />
                                </div>
                                <div className={'character-count'}>
                                    {values.description.length}/255
                                </div>

                                <div className={'form-group'}>
                                    <label id="image-label"
                                           for="image-file"
                                           style={{ display: props.photos.length > 0 ? 'none' : 'block' }}>>
                                        + Add photo
                                    </label>
                                    <input
                                        id="image-file"
                                        className={'input-image'}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoChange}
                                    />
                                </div>

                                <div className={'grid-images'}>
                                    {props.photos.map((preview, index) => (
                                        <div key={index}
                                             className="image-wrapper">
                                            <img key={index}
                                                 src={URL.createObjectURL(preview)}
                                                 alt={`Preview ${index}`}
                                                 onClick={() => removeImage(index)}
                                                 className={'preview-image'}/>
                                            <div className="delete-overlay"
                                                 onClick={() => removeImage(index)}>
                                                <span>X</span>
                                            </div>
                                        </div>
                                    ))
                                    }
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
                     title={"Add product"}
                     content={getContent()}/>
    )
}