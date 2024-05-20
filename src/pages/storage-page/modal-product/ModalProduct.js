import React, {Component} from "react";
import ModalWindow from "../../../components/modal/ModalWindow";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import styles from './ModalProduct.module.scss';
import {FaPlus} from "react-icons/fa";


// create/update/clone product
export const ModalProduct = (props) => {

    if (!props.show)
        return null;

    const handleSaveButton = async () => {

        try {
            alert("Save product")
            props.onClose(true)
        } catch (error) {
            console.log('error - save product')
        }
    }

    function addCategory() {
        //todo
    }

    function getForm(props) {

        const initialValues = {
            name: props.product == null ? '' : props.product.name,
            description: props.product == null ? '' : props.product.description,
        };

        const validationSchema = Yup.object().shape({
            email: Yup.string()
                .required('Email is required')
                .email('Invalid email')
        });

        function handleSaveProduct() {
            // todo
        }

        let numberVariants = 1;

        function addVariant() {
            numberVariants += 1
        }

        const attributes = [];

        let numberAttributes = 0;

        function renderVariants() {
            const variants = [];

            for (let i = 0; i < numberVariants; i++) {
                variants.push(<VariantForm number={i}
                                           numberAttributes={numberAttributes}/>);
            }

            return variants;
        }

        let isAddAttributeFormShow = false;

        function handleAddAttribute() {
            isAddAttributeFormShow = true;
        }

        let isAddCategoryFormShow = false;

        function handleAddCategory() {
            isAddCategoryFormShow = true;
        }

        function renderAddAttributeForm() {
            if (isAddAttributeFormShow) {
                return <AttributeForm/>
            }
        }

        return (
            <div className={'modal-window-body'}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSaveProduct}>
                    {({
                          values,
                          errors,
                          touched,
                          isValid
                      }) => (
                        <Form className={'form'}>

                            {/* main info */}
                            <div className={'form-column'}>
                                <div className={'form-row'}>

                                    <div className={'form-input'}>
                                        <label>Name*</label>
                                        <Field type={'text'}
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

                                    <div className={styles.categoryWithAddBtn}>
                                        <div className={'form-input'}>
                                            <label>Category</label>
                                            <Field as="select"
                                                   id="category"
                                                   className={'form-control'}
                                                   name="category">
                                                {props.categories.map(category =>
                                                    <option value={category.name}>{category.name}</option>
                                                )}
                                            </Field>
                                        </div>
                                        {!isAddCategoryFormShow ?
                                            <Button type={ButtonType[3].type}
                                                    onClick={() => handleAddCategory()}
                                                    size={ButtonSize[1].size}
                                                    icon={<FaPlus/>}/> : null
                                        }
                                    </div>
                                </div>

                                <div className={'form-row'}>
                                    <div className={'form-input'}>
                                        <label>Description</label>
                                        <Field className={'form-control'}
                                               as="textarea"
                                               id="description"
                                               name="description"
                                               rows="4"
                                               cols="50"
                                        />
                                    </div>
                                </div>

                                {/*variants*/}
                                <p className={'modal-subtitle '.concat('form-row')}>Variants</p>

                                {renderVariants()}

                                {renderAddAttributeForm()}

                                <div className={styles.buttonContainer}>

                                    {!isAddAttributeFormShow ?
                                        <Button type={ButtonType[3].type}
                                                onClick={() => handleAddAttribute()}
                                                size={ButtonSize[1].size}
                                                label={'Add attribute'}/> : null
                                    }

                                    <Button type={ButtonType[3].type}
                                            onClick={() => addVariant()}
                                            size={ButtonSize[1].size}
                                            label={'Add variant'}/>
                                </div>

                            </div>

                            <div className={'buttons'}>
                                <Button type={ButtonType[1].type}
                                        size={ButtonSize[1].size}
                                        onClick={props.onClose}
                                        label={'Cancel'}/>

                                <Button type={ButtonType[0].type}
                                        onClick={handleSaveButton}
                                        size={ButtonSize[1].size}
                                        label={'Save'}/>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }

    return (
        <ModalWindow show={props.show}
                     title={props.title}
                     content={getForm(props)}/>
    )
}

class CategoryForm extends Component {

}

class VariantForm extends Component {

    render() {
        return (
            <div className={'form-column '.concat(' '.concat(styles.variant))}>

                <div className={'form-row'}>
                    <div className={'form-input'}>
                        <label>Quantity*</label>
                        <Field
                            type={'number'}
                            step={1}
                            className={'form-control'}
                            placeholder={'Enter quantity'}
                            name={'quantity'.concat(this.props.number)}
                            required
                        />
                    </div>

                    <div className={'form-input'}>
                        <label>Min quantity*</label>
                        <Field
                            type={'number'}
                            step={1}
                            className={'form-control'}
                            placeholder={'Enter min quantity'}
                            name={'minQuantity'.concat(this.props.number)}
                            required
                        />
                    </div>
                </div>

                <div className={'form-row'}>
                    <div className={'form-input'}>
                        <label>Price*</label>
                        <Field
                            type={'number'}
                            step={0.1}
                            className={'form-control'}
                            placeholder={'Enter price'}
                            name={'price'.concat(this.props.number)}
                            required
                        />
                    </div>
                    <div className={'form-input'}></div>

                </div>

                {/*{renderAttributes()}*/}

            </div>
        )
    }

}


class AttributeForm extends Component {
    render() {
        function handleAddAttribute() {
            // TODO
            // this.props.addAttribute()
        }

        return (
            <div className={'form-column '.concat(' '.concat(styles.attributeForm))}>

                {/*TODO ADD STYLES*/}
                <p>New attribute</p>

                <div className={'form-row'}>

                    <div className={'form-input'}>
                        <label>Name*</label>
                        <Field
                            type={'text'}
                            className={'form-control'}
                            placeholder={'Attribute name'}
                            name={'attrName'}
                            required
                        />
                    </div>

                    <div className={'form-input'}>
                        <label>Value*</label>
                        <Field
                            type={'text'}
                            className={'form-control'}
                            placeholder={'Attribute value'}
                            name={'attrValue'}
                            required
                        />
                    </div>
                </div>

                <div className={'form-row '}>
                    <Button type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            onClick={() => handleAddAttribute()}
                            label={'Add attribute'}/>
                </div>

            </div>
        )
    }
}