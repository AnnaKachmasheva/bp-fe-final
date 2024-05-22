import React, {Component, useRef} from "react";
import {userApi} from "../../../services/api";
import {Form, Formik} from "formik";
import Button, {ButtonSize, ButtonType} from "../../../components/button/Button";
import ModalWindow from "../../../components/modal/ModalWindow";
import styles from "./AddOrderPage.module.scss";
import {CiImageOff} from "react-icons/ci";
import {formatDatetime, showStatus, showValue} from "../../../utils/Common";
import stylesStorage from "../../storage-page/StoragePage.module.scss";
import {RiSlideshowView} from "react-icons/ri";
import {useNavigate} from "react-router-dom";

export const ModalAddOrder = (props) => {

    const errorFromServerRef = useRef('');
    const navigate = useNavigate();

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

            if (products.length === 0) {
                setErrorFromServer("You cannot create a new order.")
            } else if (productList.length === 0) {
                setErrorFromServer("Select at least 1 product.")
            } else {
                const response = await userApi.createOrder(order);
                if (response && response.error && response.error.message) {
                    setErrorFromServer(response.error.message);
                } else {
                    props.onClose(true)
                    window.location.reload();
                }
            }
        }

        const handleGoToProductPage = (product) => {
            const id = product.id;
            navigate(`/app/product/${id}`, {state: {product: product}});
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

                                <div className={styles.tableContainer}>

                                    {products?.length > 0 ? <label>Select products</label> : null}

                                    <h5 className={styles.wrongMessage}>{products?.length === 0 ? "Not found products for creating order." : null}</h5>

                                    {!props.isMobile ?
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
                                        :
                                        <div className={styles.cards}>
                                            {products.map((product, index) =>
                                                <CardProduct product={product}
                                                             key={index}
                                                             handleShowProduct={() => handleGoToProductPage(product)}
                                                             handleClick={() => props.addProduct(product)}
                                                />
                                            )}
                                        </div>
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

class CardProduct extends Component {

    handleCheckboxChange = () => {
        this.props.handleClick();
    };

    render() {

        return (
            <div className={styles.productCard.concat(" ").concat(this.props.product?.isDeleted ? 'deleted-item' : '')}>

                <img src={this.props.product?.image} alt="Image not found"/>
                <span className={styles.category}>
                        [{showValue(this.props.product?.category?.name)}]
                    </span>
                <h5>{showValue(this.props.product?.name)}</h5>

                <p>
                    {this.props.product.isDeleted ?
                        <span className={"deleted ".concat(stylesStorage.status)}>
                            Deleted
                        </span> :
                        <span className={this.props.product.status.name.toLowerCase()
                            .concat(" ")
                            .concat(styles.status)}>
                         {showStatus(this.props.product.status.name)}
                        </span>
                    }
                </p>
                <p>{showValue(this.props.product?.description)}</p>
                <p>{formatDatetime(this.props.product?.updatedAt)}</p>

                <p className={styles.checkbox}>
                    <input
                        type="checkbox"
                        onChange={this.handleCheckboxChange}
                    />
                    <label>Add product to order</label>
                </p>

                <Button onClick={this.props.handleShowProduct}
                        type={ButtonType[2].type}
                        size={ButtonSize[1].size}
                        isIconEnd={true}
                        icon={<RiSlideshowView/>}
                        label={'Show product'}/>

            </div>
        )
    }
}