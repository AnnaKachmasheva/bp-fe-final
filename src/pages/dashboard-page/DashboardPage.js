import React, {Component, useEffect, useState} from "react";
import styles from './Dashboard.module.scss';
import {formatNumberWithSpaces} from "../../utils/Common";
import {userApi} from "../../services/api";

function DashboardPage() {

    const [errorFromServer, setErrorFromServer] = useState("");

    const [numberProducts, setNumberProducts] = useState(0);
    const [numberProductsInStock, setNumberProductsInStock] = useState(0);
    const [numberProductsPDelevered, setNumberPDelevered] = useState(0);
    const [numberProductsDelevered, setNumberDelevered] = useState(0);

    const [numberCategories, setNumberCategories] = useState(0);
    const [numberUsers, setNumberUsers] = useState(0);

    const [numberOrders, setNumberOrders] = useState(0);
    const [numberOrdersCreated, setNumberOrdersCreated] = useState(0);
    const [numberOrdersProcessing, setNumberOrdersProcessing] = useState(0);
    const [numberOrdersCompleted, setNumberOrdersCompleted] = useState(0);
    const [numberOrdersBackordered, setNumberOrdersBackordered] = useState(0);
    const [numberOrdersCanceled, setNumberOrdersCanceled] = useState(0);

    useEffect(() => {
        fetchStatistics().then();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await userApi.getStatistics();
            if (response && response.error) {
                setErrorFromServer(response.error.message);
            } else {
                setNumberProducts(response.data.allProducts);
                setNumberProductsInStock(response.data.inStockProducts);
                setNumberPDelevered(response.data.pendingDeliveredProducts);
                setNumberDelevered(response.data.deliveredProducts);
                setNumberCategories(response.data.allCategories);
                setNumberUsers(response.data.allUsers);
                setNumberOrders(response.data.allOrders);
                setNumberOrdersCreated(response.data.createdOrders);
                setNumberOrdersCompleted(response.data.completedOrders);
                setNumberOrdersProcessing(response.data.processedOrders);
                setNumberOrdersBackordered(response.data.backorderedOrders);
                setNumberOrdersCanceled(response.data.canceledOrders);
            }
        } catch (error) {
            setErrorFromServer(error !== 0 || null);
        }
    };


    const getDataProducts = () => {
        return [
            {'In stock': numberProductsInStock},
            {'Pending delivery': numberProductsPDelevered},
            {'Delivered': numberProductsDelevered}
        ]
    }

    const getDataOrders = () => {
        return [
            {'In stock': numberOrdersCreated},
            {'Processed': numberOrdersProcessing},
            {'Completed': numberOrdersCompleted},
            {'Backordered': numberOrdersBackordered},
            {'Canceled': numberOrdersCanceled},
        ]
    }

    return (
        <div className={styles.container}>

            {errorFromServer}

            <Card title={"Products"}
                  count={numberProducts}
                  subData={getDataProducts()}/>

            <Card title={"Orders"}
                  count={numberOrders}
                  subData={getDataOrders()}/>

            <Card title={"Categories"}
                  count={numberCategories}/>

            <Card title={"Users"}
                  count={numberUsers}/>

        </div>
    )

}

class Card extends Component {

    render() {
        return (
            <div className={styles.card}>

                <p>{formatNumberWithSpaces(this.props.count)}</p>
                <span>{this.props.title}</span>

                {this.props.subData?.map((data) => {
                    const key = Object.keys(data)[0];
                    const value = data[key];
                    return (
                        <li key={key}>
                            <span className={styles.subtitle}>{key}</span>: {value}
                        </li>
                    );
                })}
            </div>
        )
    }
}

export default DashboardPage