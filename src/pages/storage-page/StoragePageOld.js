import React, {Component, useEffect, useMemo, useState} from "react";
import MOCK_DATA from "./MOCK_DATA.json"
import {SlOptions} from "react-icons/sl";
import {CiSettings} from "react-icons/ci";
import Pagination from "../../components/pagination/Pagination";
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import styles from './StoragePage.module.scss';
import {IoClose} from "react-icons/io5";
import {FaArrowDown, FaArrowRight, FaArrowUp, FaPlus} from "react-icons/fa";
import {RiDeleteBin7Line, RiEdit2Line} from "react-icons/ri";
import {LuCopyPlus} from "react-icons/lu";
import {ModalProduct} from "./modal-product/ModalProduct";
import {formatDatetime, formatNumberWithSpaces} from "../../utils/Common";
import {useNavigate} from 'react-router-dom';
import {GrTransaction} from "react-icons/gr";
import {MdDeleteOutline, MdOutlineEdit} from "react-icons/md";
import {ModalDeleteProductConfirm} from "./modal-delete-product/ModalDeleteProductConfirm";
import {FiPlus} from "react-icons/fi";
import {ModalAddProduct} from "./modal-add-product/ModalAddProduct";


function StoragePageOld() {

    // Initial setup of headers and mock data
    const headers = ['CATEGORY', 'NAME', 'STATE', 'DESCRIPTION', 'DATE'];
    const data = useMemo(() => MOCK_DATA, []);

    // State variables for managing UI interactions and data selection
    const [selectedCategories, setSelectedCategories] = useState(data.categories);
    const [selectedAll, setSelectedAll] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false)
    const [showModalCreateProduct, setShowModalCreateProduct] = useState(false)

    const [listProducts, setListProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [countElements, setCountElements] = useState(5);
    const [total, setTotal] = useState(0)

    const navigate = useNavigate();

    // create an event listener
    useEffect(() => {
        handleResize()
        window.addEventListener("resize", handleResize)
    })

    const handleChangeCountElements = (count) => {
        setCountElements(count);
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber === currentPage)
            return;
        setCurrentPage(pageNumber);
        // fetchProducts();
    };

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const handleCategoryToggle = (selectedCategory) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.some((category) => category.name === selectedCategory.name)
                ? prevSelected.filter((category) => category.name !== selectedCategory.name)
                : [...prevSelected, selectedCategory]
        );
        setSelectedAll(false);
    };

    //choose the screen size
    const handleResize = () => {
        if (window.innerWidth < 900) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    function removeCategoryFromSelected(categoryToRemove) {
        let categories = selectedCategories;
        categories = categories.filter(category => category.name !== categoryToRemove.name);
        setSelectedCategories(categories)
    }

    function handleSelectAll() {
        if (!selectedAll) {
            setSelectedCategories(data.categories)
        }
        setSelectedAll(!selectedAll);
    }

    function handleContainerCategoryOptions() {
        setDropdownVisible(false)
    }

    const goToProductPage = (product, category) => {
        const id = product.id;
        navigate(`/app/storage/product/${id}`, {state: {product: product, category}});
    }

    const handleAddProductClose = () => {
        setShowModalCreateProduct(false);
    }

    return (
        <div className={'content'}>

            <ModalAddProduct onClose={() => handleAddProductClose}/>
            <h4>Categories</h4>

            <div className={styles.buttonContainer}>
                <ul>
                    {selectedCategories.map((category =>
                            <li className={'label'}
                                key={category.name}
                                onClick={() => removeCategoryFromSelected(category)}>
                                <span>{category.name}</span>
                                <IoClose/>
                            </li>
                    ))}
                </ul>


                {/* button select categories */}
                <Button onClick={toggleDropdown}
                        type={ButtonType[3].type}
                        size={ButtonSize[1].size}
                        isIconEnd={true}
                        icon={isDropdownVisible ? <FaArrowUp/> : <FaArrowDown/>}
                        label={'Select Categories'}/>
            </div>

            {/* all options */}
            {isDropdownVisible &&
                <div>
                    <div className='container-list-options'
                         onClick={handleContainerCategoryOptions}>
                    </div>

                    <ul className={styles.selectCategories}>
                        <li key={'all'}><label>
                            <input
                                type="checkbox"
                                checked={selectedAll}
                                onChange={handleSelectAll}
                            />
                            Select all
                        </label>
                        </li>
                        {data.categories.map((category) => (
                            <li key={category.name}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.some((c) => c.name === category.name)}
                                        onChange={() => handleCategoryToggle(category)}
                                    />
                                    {category.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            }


            {!isMobile &&
                <div className={'panel'}>

                    <div className={'total'}>

                        <Button onClick={() => setShowModalCreateProduct(true)}
                                type={ButtonType[2].type}
                                size={ButtonSize[1].size}
                                isIconEnd={true}
                                icon={<FiPlus/>}
                                label={'Add product'}/>

                        <h4>Products: <span>{total}</span></h4>
                    </div>

                    {/* item's table */}
                    <table>
                        <thead>
                        <tr>
                            {headers.map((header, index) => <HeaderItem title={header}/>)}
                            <td className={'column-action'}><CiSettings size={24}/></td>
                        </tr>
                        </thead>

                        <tbody>
                        {selectedCategories.map((category) => category.items.map((item) =>
                            <TableRowGroupItem item={item}
                                               categories={data.categories}
                                               category={category}
                                               handleClick={() => goToProductPage(item, category)}/>
                        ))}
                        </tbody>
                    </table>
                </div>
            }

            {isMobile &&
                <div className={styles.containerCards}>
                    {selectedCategories.map((category) => category.items.map((item) =>
                        <CardItem item={item}
                                  categories={data.categories}
                                  category={category}
                                  gotoProductPage={() => goToProductPage(item, category)}
                        />
                    ))}
                </div>
            }

            <div className={"container-pagination"}>
                <Pagination currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            countElements={countElements}
                            changeCountElemnts={handleChangeCountElements}
                            name={'items'}/>
            </div>
        </div>
    )
}

class HeaderItem extends Component {
    render() {
        return (
            <td scope={'col'}>
                {this.props.title}
            </td>
        )
    }
}

class TableRowGroupItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showOptions: false,
            showConfirmDeleteModal: false,
            showProductModal: false,
            modalTitle: ""
        };
    }

    handleOptionsClick = () => {
        this.setState((prevState) => ({
            showOptions: !prevState.showOptions,
        }));
    };

    renderOptionsList() {
        if (!this.state.showOptions)
            return null;

        const {showConfirmDeleteModal} = this.state;
        const {showProductModal} = this.state;

        return (
            <div>

                <div className='container-list-options'
                     onClick={this.handleOptionsClick}>
                </div>

                <ModalDeleteProductConfirm onClose={() => this.setState({showConfirmDeleteModal: false})}
                                           show={showConfirmDeleteModal}/>

                <ModalProduct onClose={() => this.setState({showProductModal: false})}
                              title={this.state.modalTitle}
                              categories={this.props.categories}
                              product={this.props.item}
                              show={showProductModal}/>

                <ul className='options-list'>
                    <li onClick={() => this.setState({showProductModal: true, modalTitle: "New product"})}>
                        <LuCopyPlus/>
                        Clone
                    </li>
                    <li onClick={() => this.setState({showProductModal: true, modalTitle: "Edit product"})}>
                        <RiEdit2Line/>
                        Edit
                    </li>
                    <li onClick={() => this.setState({showConfirmDeleteModal: true})}>
                        <RiDeleteBin7Line/>
                        Delete
                    </li>
                </ul>
            </div>
        );
    }

    render() {

        return (
            <tr key={this.props.item.id}>
                <td onClick={this.props.handleClick}>{this.props.category.name}</td>
                <td onClick={this.props.handleClick}>{this.props.item.name}</td>
                <td onClick={this.props.handleClick}>{this.props.item.state}</td>
                <td onClick={this.props.handleClick}>{this.props.item.description}</td>
                <td onClick={this.props.handleClick}>{formatDatetime(this.props.item.datetime)}</td>
                <td className={'column-action'}>
                    <SlOptions className={styles.itemActions}
                               onClick={this.handleOptionsClick}/>
                    {this.renderOptionsList()}
                </td>
            </tr>
        )
    }
}

class CardItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDeleteModal: false,
            showProductModal: false,
            showTransactionModal: false,
            modalTitle: ""
        };
    }


    calculateTotalQuantity = () => {
        const variants = this.props.item.variants;
        let sum = 0;
        variants.forEach(variant => sum += variant.quantity);
        return sum;
    };

    calculateTotalValue = () => {
        const variants = this.props.item.variants;
        let sum = 0;
        variants.forEach(variant => sum += (variant.quantity * variant.price));
        return sum;
    };

    render() {
        const totalQuantity = this.calculateTotalQuantity();
        const totalValue = this.calculateTotalValue();

        const {showConfirmDeleteModal} = this.state;
        const {showProductModal} = this.state;

        return (
            <div className={styles.card}>


                {/*modal windows*/}
                <ModalDeleteProductConfirm onClose={() => this.setState({showConfirmDeleteModal: false})}
                                           show={showConfirmDeleteModal}/>

                <ModalProduct onClose={() => this.setState({showProductModal: false})}
                              title={this.state.modalTitle}
                              categories={this.props.categories}
                              product={this.props.item}
                              show={showProductModal}/>


                <p><span>Category: </span>{this.props.category.name}</p>
                <p><span>Name: </span>{this.props.item.name}</p>
                <p><span>Total quantity: </span>{formatNumberWithSpaces(totalQuantity)}</p>
                <p><span>Total value: </span>{formatNumberWithSpaces(totalValue)}</p>
                <p><span>Date: </span>{formatDatetime(this.props.item.datetime)}</p>
                <p><span>Description: </span>{this.props.item.description}</p>
                <div className={styles.cardButtons}>
                    <Button onClick={() => this.setState({showTransactionModal: true, modalTitle: "New transaction"})}
                            type={ButtonType[3].type}
                            size={ButtonSize[1].size}
                            icon={<GrTransaction/>}
                    />
                    <Button onClick={() => this.setState({showProductModal: true, modalTitle: "New product"})}
                            type={ButtonType[3].type}
                            size={ButtonSize[1].size}
                            icon={<FaPlus/>}
                    />
                    <Button onClick={() => this.setState({showProductModal: true, modalTitle: "Edit product"})}
                            type={ButtonType[3].type}
                            size={ButtonSize[1].size}
                            icon={<MdOutlineEdit/>}
                    />
                    <Button onClick={() => this.setState({showConfirmDeleteModal: true})}
                            type={ButtonType[3].type}
                            size={ButtonSize[1].size}
                            icon={<MdDeleteOutline/>}
                    />

                    <Button onClick={() => this.props.gotoProductPage()}
                            type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            label={'Variants'}
                            icon={<FaArrowRight/>}
                    />
                </div>
            </div>

        )
    }
}

export default StoragePageOld