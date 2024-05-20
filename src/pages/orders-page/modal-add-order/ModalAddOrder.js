import React, {Component, useRef} from "react";
import {userApi} from "../../../services/api";
import {Form, Formik} from "formik";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import ModalWindow from "../../../components/modal/ModalWindow";
import styles from "./AddOrderPage.module.scss";
import {CiImageOff} from "react-icons/ci";
import {showValue} from "../../../utils/Common";

export const ModalAddOrder = (props) => {

    const errorFromServerRef = useRef('');

    if (!props.show)
        return null;

    const products = props.products;

    function getContent() {

        const initialValues = {
            selectedProducts: []
        };

        const setErrorFromServer = (error) => {
            errorFromServerRef.current = error;
        }

        const handleSubmitForm = async (e) => {
            setErrorFromServer('');

            const productList = props.selectedProducts;
            const description = "";

            const order = {
                productList,
                description
            };

            const response = await userApi.createOrder(order);
            if (response && response.error && response.error.message) {
                setErrorFromServer(response.error.message);
            } else {
                props.onClose(true)
                window.location.reload();
            }
        }


        return (
            <div className={'modal-window-body '.concat(styles.container)}>
                {props.show && (
                    <Formik
                        initialValues={initialValues}
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

                                {/*<div className={'form-group '.concat(styles.description)}>*/}
                                {/*    <label>Description</label>*/}
                                {/*    <Field*/}
                                {/*        as="textarea"*/}
                                {/*        className={'form-control '*/}
                                {/*            + (values.description === '' && !touched.description ?*/}
                                {/*                null :*/}
                                {/*                (touched.description && errors.description ?*/}
                                {/*                    'is-invalid' :*/}
                                {/*                    'is-valid'))}*/}
                                {/*        placeholder={'Enter description'}*/}
                                {/*        name={'description'}*/}
                                {/*        maxLength={255}*/}
                                {/*    />*/}
                                {/*</div>*/}
                                {/*<div className={'character-count'}>*/}
                                {/*    {values.description?.length || 0}/255*/}
                                {/*</div>*/}

                                <div className={styles.tableContainer}>
                                    <label>Select products</label>
                                    <table>
                                        <thead>
                                        <tr>
                                            <td className={styles.checkbox}>
                                            </td>
                                            <td className={styles.imageColumn}>
                                                IMAGE
                                            </td>
                                            <td>
                                                CATEGORY
                                            </td>
                                            <td>
                                                NAME
                                            </td>
                                            <td>
                                                DESCRIPTION
                                            </td>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {products.map((prod, index) =>
                                            <TableRow product={prod}
                                                      key={index}
                                                      handleClick={() => props.addProduct(prod)}
                                            />
                                        )}
                                        </tbody>
                                    </table>
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
                     title={"Add order"}
                     content={getContent()}/>
    )
}

class TableRow extends Component {
    handleCheckboxChange = () => {
        this.props.handleClick();
    };

    render() {
        const {product} = this.props;
        return (
            <tr>
                <td className={styles.checkbox}>
                    <input
                        type="checkbox"
                        onChange={this.handleCheckboxChange}
                    />
                </td>
                <td className={styles.imageColumn}>
                    {product?.image !== null ? (
                        <img src={product?.image} alt="First product image"/>
                    ) : (
                        <CiImageOff className={styles.noImage} size={32}/>
                    )}
                </td>
                <td>{showValue(product?.category?.name)}</td>
                <td>{showValue(product?.name)}</td>
                <td>{showValue(product?.description)}</td>
            </tr>
        );
    }
}
