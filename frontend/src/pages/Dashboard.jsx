import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/users"
import axios from "axios";

export const Dashboard = () => {
    const [balance, setbalance] = useState(0);

    useEffect(()=> {
        // fetching amount from backend
        axios.get("http://localhost:3000/api/v1/account/balance", {
            headers : {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            setbalance(response.data.balance);
        })
        .catch(error=> {
            console.log("Error fetching balance:", error);
        });
    }, []);
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}