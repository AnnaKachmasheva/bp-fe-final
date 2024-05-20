import React, {Component, useEffect, useState} from "react"
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {useNavigate} from "react-router-dom";
import {userApi} from "../../services/api";
import {isAdmin, removeToken} from "../../services/auth";
import {FiPlus} from "react-icons/fi";
import styles from "./OrdersPage.module.scss";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import {IoIosMore, IoMdClose} from "react-icons/io";
import Pagination from "../../components/pagination/Pagination";
import {ModalDeleteProductConfirm} from "../storage-page/modal-delete-product/ModalDeleteProductConfirm";
import {ModalUpdateProduct} from "../storage-page/modal-update-product/ModalUpdateProduct";
import {formatDatetime, showValue} from "../../utils/Common";
import {ModalAddOrder} from "./modal-add-order/ModalAddOrder";
import {RiSlideshowView} from "react-icons/ri";


function OrdersPage() {

    const navigate = useNavigate();

    const [showModalAddOrder, setShowModalAddOrder] = useState(false);
    const [listProducts, setListProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [listOrders, setListOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [countElements, setCountElements] = useState(5);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const sortOptions = [
        {key: 'createdAt', option: 'Creation date'},
        {key: 'updatedAt', option: 'Date of last update'}
    ]
    const [selectedOptionSort, setSelectedOptionSort] = useState(sortOptions[0].key);
    const [isUp, setIsUp] = useState(false);

    // add product window
    const [isDropdownSelectStatusVisible, setIsDropdownSelectStatusVisible] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectAllStatuses, setSelectAllStatuses] = useState(true);

    const [statusesFetched, setStatusesFetched] = useState(false);
    const [statuses, setStatuses] = useState([]);

    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        fetchOrderStatuses().then(() => {
            setStatusesFetched(true);
        });
        handleResize()
        window.addEventListener("resize", handleResize)

    }, []);

    useEffect(() => {
        if (statusesFetched) {
            fetchOrders().then(() => {
                fetchInStockProducts().then()
            });
        }
    }, [statusesFetched, selectAllStatuses, selectedStatuses, selectedOptionSort, isUp, totalPages, countElements, currentPage]);


    const fetchOrderStatuses = async () => {
        try {
            const data = await userApi.getAllOrderStatuses();
            setStatuses(data.data);
            setSelectedStatuses(data.data);
        } catch (error) {
            removeToken();
            navigate('/app/logout');
        }
    };

    const fetchOrders = async () => {
        try {
            const sort = selectedOptionSort;
            const order = isUp ? 'ASC' : 'DESC';

            const products = await userApi.getAllOrders(selectedStatuses, currentPage, countElements, sort, order);

            setListOrders(products.data.content);
            setTotalPages(products.data.totalPages);
            setTotalElements(products.data.totalElements);
        } catch (error) {
            removeToken();
            navigate('/app/logout');
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber === currentPage)
            return;
        setCurrentPage(pageNumber);
    };

    const handleChangeCountElements = (count) => {
        setCountElements(count);
    }

    const sortList = (key) => {
        const selectedOption = sortOptions.find(option => option.key === key);
        if (selectedOption.key === selectedOptionSort) {
            setIsUp(!isUp);
        } else {
            setIsUp(false);
            setSelectedOptionSort(selectedOption.key);
        }
    }

    function getOptionByKey(key) {
        for (let i = 0; i < sortOptions?.length; i++) {
            if (sortOptions[i].key === key) {
                return sortOptions[i].option;
            }
        }
        return null;
    }

    const handleSelectAllStatuses = () => {
        if (!selectAllStatuses) {
            setSelectedStatuses(statuses);
        }
        setSelectAllStatuses(!selectAllStatuses);
    }

    const handleIsCheckedCategory = (name) => {
        for (let i = 0; i < selectedStatuses.length; i++) {
            if (selectedStatuses[i].name === name) {
                return true;
            }
        }
        return false;
    }

    const handleSelectStatus = (status) => {
        const isAlreadySelected = selectedStatuses.includes(status);

        if (isAlreadySelected) {
            setSelectedStatuses(selectedStatuses.filter(cat => cat.name !== status.name));
        } else {
            setSelectedStatuses([...selectedStatuses, status]);
        }
    }

    const handleRemoveSelectedStatus = (status) => {
        setSelectedStatuses(selectedStatuses.filter(cat => cat.name !== status.name));
    }

    const fetchInStockProducts = async () => {
        try {
            const products = await userApi.getAllInStockProducts();
            setListProducts(products.data);
        } catch (error) {
            removeToken();
            navigate('/app/logout');
        }
    };

    const handleGoToOrderPage = (order) => {
        const id = order.id;
        navigate(`/app/order/${id}`, {state: {order: order}});
    }

    const handleIsCheckedStatus = (name) => {
        for (let i = 0; i < selectedStatuses.length; i++) {
            if (selectedStatuses[i].name === name) {
                return true;
            }
        }
        return false;
    }

    const handleAddProduct = (product) => {
        const id = product?.id;

        const existedProduct = selectedProducts.some(product => product.id === id)

        if (!existedProduct) {
            setSelectedProducts([...selectedProducts, product])
        } else {
            const updatedProducts = selectedProducts.filter(prod => prod.id !== id);
            setSelectedProducts(updatedProducts);
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

            <ModalAddOrder onClose={() => {
                setShowModalAddOrder(false)
            }}
                           show={showModalAddOrder}
                           products={listProducts}
                           selectedProducts={selectedProducts}
                           addProduct={(product) => handleAddProduct(product)}
                           isMobile={isMobile}
            />

            <div className={'panel'}>
                <div className={'total'}>
                    {isAdmin() ?
                        <Button onClick={() => setShowModalAddOrder(true)}
                                type={ButtonType[2].type}
                                size={ButtonSize[1].size}
                                isIconEnd={true}
                                icon={<FiPlus/>}
                                label={'Add order'}/>
                        : <div/>}

                    <div className={styles.sortContainer}>
                        {/* button select sorting */}
                        <Button onClick={() => setDropdownVisible(!isDropdownVisible)}
                                type={ButtonType[3].type}
                                size={ButtonSize[1].size}
                                isIconEnd={true}
                                icon={isUp ? <FaArrowUp/> : <FaArrowDown/>}
                                label={getOptionByKey(selectedOptionSort)}/>

                        {/* sort */}
                        {isDropdownVisible &&
                            <div>
                                <div className={'container-list-options'}
                                     onClick={() => setDropdownVisible(false)}/>

                                <ul className={styles.selectStatuses}>
                                    {sortOptions.map((option, index) => (
                                        <li key={index}
                                            onClick={() => sortList(option.key)}
                                            className={selectedOptionSort === option.option ? 'selected-option' : null}>
                                            {option.option}
                                            {selectedOptionSort === option.option && isUp && <FaArrowUp/>}
                                            {selectedOptionSort === option.option && !isUp && <FaArrowDown/>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }

                        <h4>Orders: <span>{totalElements}</span></h4>
                    </div>
                </div>

                <div className={styles.selectCategoriesWrapper}>
                    <Button onClick={() => setIsDropdownSelectStatusVisible(!isDropdownSelectStatusVisible)}
                            type={ButtonType[3].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={isDropdownSelectStatusVisible ? <FaArrowUp/> : <FaArrowDown/>}
                            label={'Select order status'}/>

                    {isDropdownSelectStatusVisible &&
                        <div className={styles.optionsWrapper}>
                            <div className={'container-list-options'}
                                 onClick={() => setIsDropdownSelectStatusVisible(false)}/>

                            <ul className={styles.selectStatuses}>
                                <li key={0}>
                                    <input type={"checkbox"}
                                           checked={selectAllStatuses}
                                           onChange={handleSelectAllStatuses}/>
                                    Select All
                                </li>
                                {statuses.map((status, index) => (
                                    <li key={index + 1}>
                                        <input
                                            type="checkbox"
                                            checked={handleIsCheckedStatus(status.name)}
                                            onChange={() => handleSelectStatus(status)}/>
                                        {status.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                    <ul className={styles.statuses}>
                        {selectedStatuses.map((status, index) =>
                            <li key={index}
                                onClick={() => handleRemoveSelectedStatus(status)}>
                                {status.name} <IoMdClose/>
                            </li>
                        )}
                    </ul>
                </div>

                {!isMobile ?
                    <table>
                        <thead>
                        <tr>
                            <td>
                                NUMBER
                            </td>
                            <td>
                                CREATION DATE
                            </td>
                            <td>
                                DATE OF LAST UPDATE
                            </td>
                            <td>
                                STATE
                            </td>
                            {/*<td>*/}
                            {/*    DESCRIPTION*/}
                            {/*</td>*/}
                            <td className={styles.actions}>

                            </td>

                        </tr>
                        </thead>

                        <tbody>
                        {listOrders.map((order, index) =>
                            <TableRow order={order}
                                      key={index}
                                      handleClick={() => handleGoToOrderPage(order)}
                            />
                        )}
                        </tbody>
                    </table>
                    :
                    <div className={styles.cards}>
                        {listOrders.map((order, index) =>
                            <CardOrder order={order}
                                       key={index}
                                       handleClick={() => handleGoToOrderPage(order)}
                            />
                        )}
                    </div>
                }
            </div>

            <Pagination currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        countElements={countElements}
                        changeCountElemnts={handleChangeCountElements}
                        name={'orders'}/>
        </div>
    )
}

class TableRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDeleteProduct: false,
            showUpdateProduct: false,
            showOptions: false
        };
    }

    handleShowOptions = () => {
        this.setState(prevState => ({
            showOptions: !prevState.showOptions
        }));
    }

    toggleDeleteModal = () => {
        this.setState(prevState => ({
            showConfirmDeleteProduct: !prevState.showConfirmDeleteProduct
        }));
    };

    toggleEditModal = () => {
        this.setState(prevState => ({
            showUpdateProduct: !prevState.showUpdateProduct
        }));
    };

    render() {
        const {showConfirmDeleteProduct} = this.state;
        const {showUpdateProduct} = this.state;
        const {showOptions} = this.state;

        return (
            <tr className={this.props.order.isDeleted ? 'deleted-item' : ''}>
                <ModalDeleteProductConfirm onClose={() => this.setState({showConfirmDeleteProduct: false})}
                                           show={showConfirmDeleteProduct}
                                           product={this.props.product}/>

                <ModalUpdateProduct onClose={() => this.setState({showUpdateProduct: false})}
                                    show={showUpdateProduct}
                                    product={this.props.product}
                                    Statuses={this.props.Statuses}
                                    statuses={this.props.statuses}/>

                <td onClick={this.props.handleClick}>{showValue(this.props.order?.id)}</td>

                <td onClick={this.props.handleClick}>{formatDatetime(this.props.order?.createdAt)}</td>
                <td onClick={this.props.handleClick}>{formatDatetime(this.props.order?.updatedAt)}</td>

                <td onClick={this.props.handleClick}>
                   <span className={this.props.order.status.name.toLowerCase()
                       .concat(" ")
                       .concat(styles.status)}>
                    {this.props.order.status.name.toLowerCase()}
                </span>
                </td>

                <td className={styles.actions}
                    onClick={this.handleShowOptions}>
                    {showOptions ? <IoMdClose/> : <IoIosMore/>}
                    <ul className={showOptions ? styles.showActions : styles.hiddenActions}>
                        {this.props.product?.isDeleted ? null : <li onClick={this.toggleDeleteModal}>Delete</li>}
                        <li onClick={this.toggleEditModal}>Edit</li>
                    </ul>
                </td>
            </tr>
        )
    }
}

class CardOrder extends Component {

    render() {

        return (
            <div className={styles.productCard.concat(" ").concat(this.props.product?.isDeleted ? 'deleted-item' : '')}>

                <span>{showValue(this.props.order?.id)}</span>
                <p>
                    <span className={this.props.order.status.name.toLowerCase()
                        .concat(" ")
                        .concat(styles.status)}>
                    {this.props.order.status.name.toLowerCase()}
                    </span>
                </p>
                <p>{formatDatetime(this.props.order?.createdAt)}</p>
                <p>{formatDatetime(this.props.order?.updatedAt)}</p>

                <Button onClick={this.props.handleClick}
                        type={ButtonType[2].type}
                        size={ButtonSize[1].size}
                        isIconEnd={true}
                        icon={<RiSlideshowView/>}
                        label={'Show order'}/>

            </div>
        )
    }
}


export default OrdersPage;