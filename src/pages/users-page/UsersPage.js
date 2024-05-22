import React, {Component, useEffect, useState} from "react";
import {RiDeleteBinLine} from "react-icons/ri";
import {HiOutlinePencilAlt} from "react-icons/hi";
import Pagination from "../../components/pagination/Pagination";
import Button, {ButtonSize, ButtonType} from "../../components/button/Button";
import {userApi} from "../../services/api";
import {ModalDeleteProfileConfirm} from "../profile-page/modal-delete-user/ModalDeleteProfileConfirm";
import {ModalEditProfile} from "../profile-page/modal-edit-user/ModalEditProfile";
import {formatDatetime, showValue} from "../../utils/Common";
import {FiPlus} from "react-icons/fi";
import {ModalAddUser} from "./modal-add-user/ModalAddUser";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import styles from "../storage-page/StoragePage.module.scss";
import {removeToken} from "../../services/auth";
import {useNavigate} from "react-router-dom";

function UsersPage() {

    const navigate = useNavigate();

    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [countElements, setCountElements] = useState(5);
    const [showModalAddUser, setShowModalAddUser] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const sortOptions = [
        {key: 'email', option: 'Email'},
        {key: 'firstName', option: 'First name'},
        {key: 'lastName', option: 'Last name'},
        {key: 'role', option: 'Role'},
        {key: 'updatedAt', option: 'Last updated'},
    ]
    const [selectedOptionSort, setSelectedOptionSort] = useState(sortOptions[0].key);
    const [isUp, setIsUp] = useState(false);
    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        fetchUsers().then();

        handleResize()
        window.addEventListener("resize", handleResize)
    }, [totalPages, countElements, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber === currentPage)
            return;
        setCurrentPage(pageNumber);
    };

    const fetchUsers = async () => {
        try {
            const sort = selectedOptionSort;
            const order = isUp ? 'ASC' : 'DESC';
            const users = await userApi.getAllUsers(currentPage, countElements, sort, order);
            setTotalPages(users.data.totalPages);
            setTotalElements(users.data.totalElements);
            setListUsers(users.data.content);
        } catch (error) {

        }
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

        fetchUsers().then();
    }

    function getOptionByKey(key) {
        for (let i = 0; i < sortOptions.length; i++) {
            if (sortOptions[i].key === key) {
                return sortOptions[i].option;
            }
        }
        return null;
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

            <ModalAddUser onClose={() => setShowModalAddUser(false)}
                          show={showModalAddUser}/>

            <div className={'panel'}>
                <div className={'total'}>
                    <Button onClick={() => setShowModalAddUser(true)}
                            type={ButtonType[2].type}
                            size={ButtonSize[1].size}
                            isIconEnd={true}
                            icon={<FiPlus/>}
                            label={'Add user'}/>

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

                                <ul className={styles.selectCategories}>
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

                        <h4>Users: <span>{totalElements}</span></h4>
                    </div>
                </div>

                {!isMobile ?
                    <table>
                        <thead>
                        <tr>
                            <td>
                                <div className={'table-header-cell'}>
                                    USER
                                </div>
                            </td>
                            <td>
                                <div className={'table-header-cell'}>
                                    ROLE
                                </div>
                            </td>
                            <td>
                                LAST UPDATED
                            </td>
                            <td>
                                ACTIVITIES
                            </td>
                        </tr>
                        </thead>

                        <tbody>
                        {listUsers.map((user) =>
                            <TableRow user={user}
                                      key={user}/>
                        )}
                        </tbody>
                    </table>
                    :
                    <div className={styles.cards}>
                        {listUsers.map((user, index) =>
                            <CardUser user={user}
                                      key={index}
                            />
                        )}
                    </div>
                }

                <Pagination currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            countElements={countElements}
                            changeCountElemnts={handleChangeCountElements}
                            name={'users'}/>

            </div>
        </div>

    )
}

class TableRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDeleteModal: false,
            showUpdateUserModal: false
        };
    }

    handleUpdate = () => {
        this.setState(() => ({
            showUpdateUserModal: true,
        }));
    }

    handleDelete = () => {
        this.setState(() => ({
            showConfirmDeleteModal: true,
        }));
    }

    render() {
        const {showConfirmDeleteModal} = this.state;
        const {showUpdateUserModal} = this.state;

        return (
            <tr className={this.props.user?.isDeleted ? 'deleted-item' : ''}>
                <ModalDeleteProfileConfirm onClose={() => this.setState({showConfirmDeleteModal: false})}
                                           show={showConfirmDeleteModal}
                                           user={this.props.user}/>

                <ModalEditProfile onClose={() => this.setState({showUpdateUserModal: false})}
                                  show={showUpdateUserModal}
                                  user={this.props.user}/>

                <td>
                    <h6>{this.props.user?.firstName} {this.props.user?.lastName}</h6>
                    <p>{this.props.user?.email}</p>
                </td>
                <td>{this.props.user.userRole}</td>
                <td>{formatDatetime(this.props.user?.updated)}</td>
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
            </tr>
        )
    }
}

class CardUser extends Component {


    constructor(props) {
        super(props);
        this.state = {
            showConfirmDeleteModal: false,
            showUpdateUserModal: false
        };
    }

    handleUpdate = () => {
        this.setState(() => ({
            showUpdateUserModal: true,
        }));
    }

    handleDelete = () => {
        this.setState(() => ({
            showConfirmDeleteModal: true,
        }));
    }

    render() {
        const {showConfirmDeleteModal} = this.state;
        const {showUpdateUserModal} = this.state;

        return (
            <div className={(this.props.user?.isDeleted ? 'deleted-item ' : ' ').concat(styles.productCard)}>

                <ModalDeleteProfileConfirm onClose={() => this.setState({showConfirmDeleteModal: false})}
                                           show={showConfirmDeleteModal}
                                           user={this.props.user}/>

                <ModalEditProfile onClose={() => this.setState({showUpdateUserModal: false})}
                                  show={showUpdateUserModal}
                                  user={this.props.user}/>

                <h5>{showValue(this.props.user?.firstName)} {showValue(this.props.user?.lastName)}</h5>

                <p>{showValue(this.props.user?.email)}</p>
                <p>{this.props.user.userRole}</p>
                <p>{formatDatetime(this.props.user?.updated)}</p>

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

            </div>
        )
    }
}


export default UsersPage;