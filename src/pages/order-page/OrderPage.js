import React, {Component, useEffect, useState} from "react"
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {useNavigate, useParams} from "react-router-dom";
import {isAdmin, isUser} from "../../services/auth";
import styles from "../storage-page/StoragePage.module.scss";
import stylesStorage from "../storage-page/StoragePage.module.scss";
import {CiImageOff} from "react-icons/ci";
import {formatDatetime, showStatus, showValue} from "../../utils/Common";
import {FaCheck, FaPen} from "react-icons/fa";
import {MdChecklistRtl, MdDeleteOutline, MdOutlineCancel} from "react-icons/md";
import {RiDeleteBinLine, RiListCheck3} from "react-icons/ri";
import {userApi} from "../../services/api";
import {BsQuestionCircle} from "react-icons/bs";
import {GiBackwardTime} from "react-icons/gi";
import {ModalDeleteOrderConfirm} from "./modal-delete-order/ModalDeleteOrderConfirm";
import {ModalUpdateOrder} from "../orders-page/modal-update-order/ModalUpdateOrder";
import {ModalScanCode} from "./modal-scan-code/ModalScanCode";
import {HiOutlinePencilAlt} from "react-icons/hi";
import {LuListRestart} from "react-icons/lu";


function OrderPage() {

    const navigate = useNavigate();
    const admin = isAdmin();
    const [errorFromServer, setErrorFromServer] = useState("");
    const [helpVisible, setHelpVisible] = useState(false);
    const [order, setOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState(" ");
    const [products, setProducts] = useState([]);
    const [isDeleted, setIsDeleted] = useState(false);
    const {id} = useParams();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showScanModal, setShowScanModal] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const [isSomeDeletedProducts, setIsSomeDeletedProducts] = useState(false);
    const [isAccept, setIsAccept] = useState(false);
    const [scannedProducts, setScannedProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        fetchOrder().then();

        handleResize()
        window.addEventListener("resize", handleResize)
    }, []);

    const fetchOrder = async () => {
        try {
            const response = await userApi.getOrderById(id);
            if (response && response.error) {
                setErrorFromServer(response.error.message);
            } else {
                setOrder(response.data);
                setOrderStatus(response.data?.status.name || "");
                setProducts(response.data?.product || []);
                setIsDeleted(response.data?.isDeleted || false)
                let isAnyDeleted = false;
                response.data?.product.forEach((product) => {
                    if (product.isDeleted) {
                        isAnyDeleted = true;
                    }
                });

                setIsSomeDeletedProducts(isAnyDeleted);
            }
        } catch (error) {
            navigate(-1);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            const orderId = id;
            const status = {
                "name": newStatus
            };

            const response = await userApi.updateStatusOrder(orderId, status);

            if (response && response.error) {
                setErrorFromServer(response.error.message);
            } else {
                window.location.reload();
            }

        } catch (error) {
            setErrorFromServer("Error updating status");
        }
    }

    const goToProductPage = (product) => {
        const id = product.id;
        navigate(`/app/storage/product/${id}`, {state: {product: product}});
    };

    const updateOrder = () => {
        //todo
    };

    const completeWithoutMissingItems = () => {
        changeStatus("COMPLETED")
    };

    const changeStatus = (status) => {
        updateStatus(status).then();
    }

    const handleClickProduct = (product) => {
        if (isProductAlreadySelected(product)) {
            // none
        } else if (!isAccept) {
            goToProductPage(product)
        } else {
            setSelectedProduct(product)
            setShowScanModal(true)
        }
    }

    const isProductAlreadySelected = (newProduct) => {
        return scannedProducts.some(product => product === newProduct);
    }

    const addProductToScanned = () => {
        if (!isProductAlreadySelected(selectedProduct)) {
            setScannedProducts([...scannedProducts, selectedProduct]);
        }
    }

    const handleResize = () => {
        if (window.innerWidth < 900) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }


    return (
        <div className={'content'}>

            <ModalDeleteOrderConfirm onClose={() => setShowConfirmDelete(false)}
                                     show={showConfirmDelete}
                                     orderId={id}/>

            <ModalUpdateOrder onClose={() => setShowUpdate(false)}
                              show={showUpdate}
                              products={products}
                              idOrder={id}
                              updateOrder={() => updateOrder()}/>

            <ModalScanCode onClose={() => setShowScanModal(false)}
                           show={showScanModal}
                           code={scannedCode}
                           product={selectedProduct}
                           scanedCode={setScannedCode}
                           rescan={() => setScannedCode('')}
                           addProductToScanned={addProductToScanned}/>

            <div className={styles.mainInfoOrder}>
                <h3>{id}</h3>

                <span className={styles.error}>{errorFromServer}</span>

                <h1 className={'form-title '}>
                <span className={orderStatus.toLowerCase()
                    .concat(" ")
                    .concat(styles.status)}>
                    {orderStatus.toLowerCase()}
                </span>
                </h1>

                {(isSomeDeletedProducts && isUser()) ?
                    <span className={styles.errorMessage}>
                    Some products have been deleted,
                    please postpone this order.
                    It cannot be completed.
                </span> : null}

                {(isSomeDeletedProducts && isAdmin()) ?
                    <span className={styles.errorMessage}>
                    Some products have been removed, please check this order.
                </span> : null}

                <p>{order?.description}</p>

                <p><span>Admin creator:</span> {order?.creator?.firstName} {order?.creator?.lastName}</p>
                <p><span>User acceptor:</span> {order?.acceptor?.firstName} {order?.acceptor?.lastName}</p>
                <p><span>Created:</span> {order?.createdAt}</p>
                <p><span>Last updated:</span> {order?.updatedAt}</p>

            </div>

            <h5>Products</h5>

            {!isMobile ?
                <table>
                    <thead>
                    <tr>
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
                            STATE
                        </td>
                        <td>
                            DESCRIPTION
                        </td>
                    </tr>
                    </thead>

                    <tbody>
                    {products.map((product, index) =>
                        <TableRow product={product}
                                  key={index}
                                  isProductAlreadySelected={isProductAlreadySelected(product)}
                                  handleClick={() => handleClickProduct(product)}
                        />
                    )}
                    </tbody>
                </table>
                : <div className={styles.cards}>
                    {products.map((product, index) =>
                        <CardProduct product={product}
                                     key={index}
                                     isProductAlreadySelected={isProductAlreadySelected(product)}
                                     handleClick={() => handleClickProduct(product)}
                                     isStratScan={isAccept}
                        />
                    )}
                </div>
            }


            <div className={styles.buttons}>

                <span>{errorFromServer.message}</span>

                {!admin && (orderStatus === 'CREATED') ?
                    <Button onClick={() => changeStatus("PROCESSING")}
                            type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={<FaCheck/>}
                            label={'Start order'}/>
                    : null
                }

                {admin && orderStatus === 'CREATED' ?
                    <Button onClick={() => setShowUpdate(true)}
                            type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={<FaPen/>}
                            label={'Update'}/>
                    : null
                }

                {admin && orderStatus === 'CREATED' && !isDeleted ?
                    <Button onClick={() => setShowConfirmDelete(true)}
                            type={ButtonType[4].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={<MdDeleteOutline/>}
                            label={'Delete'}/>
                    : null
                }


                {!admin && orderStatus === 'PROCESSING' && isAccept ?
                    <Button onClick={() => changeStatus("COMPLETED")}
                            type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            isDisabled={products.length !== scannedProducts.length}
                            icon={<MdChecklistRtl/>}
                            label={'Complete'}/>
                    : null
                }

                {!admin && orderStatus === 'PROCESSING' && !isAccept && !isSomeDeletedProducts ?
                    <Button onClick={() => setIsAccept(true)}
                            type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={<LuListRestart/>}
                            label={'Start scan'}/>
                    : null
                }

                {!admin && ((orderStatus === 'PROCESSING')) ?
                    <Button onClick={() => changeStatus("BACKORDERED")}
                            type={ButtonType[0].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={<GiBackwardTime/>}
                            isDisabled={products.length === scannedProducts.length}
                            label={'Postpone'}/>
                    : null
                }

                {admin && orderStatus === 'BACKORDERED' ?
                    <Button onClick={() => changeStatus("CANCELED")}
                            type={ButtonType[4].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={<MdOutlineCancel/>}
                            label={'Cancel'}/>
                    : null
                }

                {admin && orderStatus === 'BACKORDERED' ?
                    <div className={styles.completeButtinContainer}>
                        <Button onClick={completeWithoutMissingItems}
                                type={ButtonType[2].type}
                                size={ButtonSize[1].size}
                                isIconEnd={true}
                                icon={<RiListCheck3/>}
                                label={'Submit'}/>
                        <div
                            onMouseEnter={() => setHelpVisible(true)}
                            onMouseLeave={() => setHelpVisible(false)}>
                            <BsQuestionCircle size={24}
                                              className={styles.iconHelp}/>
                        </div>
                        <p className={`${styles.helpMessage} ${helpVisible ? styles.visible : styles.notVisible}`}>
                            Submit without missing items
                        </p>
                    </div>
                    : null
                }

            </div>

        </div>
    )
}

class TableRow extends Component {

    render() {
        return (
            <tr className={(this.props.product?.isDeleted ? 'deleted-item ' : ' ')
                .concat(this.props.isProductAlreadySelected ? 'selected-row' : '')}>
                <td className={styles.imageColumn}
                    onClick={this.props.handleClick}>
                    {this.props.product?.image !== null ?
                        <img src={this.props.product.image}
                             alt="Image not found"/> :
                        <CiImageOff className={styles.noImage}
                                    size={32}/>
                    }
                </td>
                <td onClick={this.props.handleClick}>{showValue(this.props.product?.category?.name)}</td>
                <td onClick={this.props.handleClick}>{showValue(this.props.product?.name)}</td>
                <td onClick={this.props.handleClick}>
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
                </td>
                <td onClick={this.props.handleClick}>{showValue(this.props.product?.description)}</td>
                {(isUser() && (this.props.order?.status?.name === "PROCESSING")) ?
                    <td>
                        <div className={'buttons-container'}>
                            <Button type={ButtonType[3].type}
                                    size={ButtonSize[0].size}
                                    label={'Edit'}
                                    onClick={this.handleUpdate}
                                    isIconStart={true}
                                    icon={<HiOutlinePencilAlt/>}/>

                            {this.props.user.isDeleted ? null
                                : <Button type={ButtonType[5].type}
                                          size={ButtonSize[0].size}
                                          label={'Delete'}
                                          onClick={this.handleDelete}
                                          isIconStart={true}
                                          icon={<RiDeleteBinLine/>}/>
                            }
                        </div>


                    </td>
                    : null}
            </tr>
        )
    }
}

class CardProduct extends Component {

    render() {
        return (
            <div className={styles.productCard.concat(" ")
                .concat(this.props.product?.isDeleted ? 'deleted-item ' : ' ')
                .concat(this.props.isProductAlreadySelected ? 'selected-row' : '')}>

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


                {this.props.isProductAlreadySelected ? null :
                    <Button onClick={this.props.handleClick}
                            type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                        // isIconEnd={true}
                        // icon={<RiSlideshowView/>}
                            label={this.props.isStratScan ? 'Scan' : 'Show product'}/>
                }
            </div>
        )
    }
}

export default OrderPage;