import React from "react";
import styles from './Pagination.module.scss';
import Button, {ButtonSize, ButtonType} from "../button/Button";
import {GoArrowLeft, GoArrowRight} from "react-icons/go";
import {CountItems} from "../../utils/Constants";


function Pagination(props) {

    const handlePageChange = (pageNumber) => {
        props.onPageChange(pageNumber);
    };

    return (
        <div className={styles.pagination.concat(' container-pagination')}>

            {/* count items on the page */}
            <div>
                <select value={props.countElements}
                        onChange={e => props.changeCountElemnts(e.target.value)}>
                    {CountItems.map((count, index) => (
                        <option key={index}
                                value={count}>
                            {count} {props.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination controls */}
            <div>
                {/* Display page numbers */}
                {Array.from({length: props.totalPages}, (_, index) => (
                    <Button type={index === props.currentPage - 1 ? ButtonType[2].type : ButtonType[3].type}
                            size={ButtonSize[0].size}
                            typeSubmit={true}
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            label={index + 1}/>
                ))}
            </div>

            <div>
                <Button type={ButtonType[3].type}
                        size={ButtonSize[0].size}
                        typeSubmit={true}
                        isIconStart={true}
                        icon={<GoArrowLeft/>}
                        isDisabled={props.currentPage === 1}
                        onClick={() => handlePageChange(props.currentPage - 1)}
                        label={'Previous'}/>

                <Button type={ButtonType[3].type}
                        size={ButtonSize[0].size}
                        typeSubmit={true}
                        isIconEnd={true}
                        icon={<GoArrowRight/>}
                        isDisabled={props.currentPage === props.totalPages}
                        onClick={() => handlePageChange(props.currentPage + 1)}
                        label={'Next'}/>
            </div>
        </div>
    );
}

export default Pagination;