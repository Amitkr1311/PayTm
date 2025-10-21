import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const Appbar = () => {
    const [firstName, setFirstName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/me", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            //console.log("API Response:", response.data);  // Check the exact format
            setFirstName(response.data.firstname);
        });
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            navigate("/signin");
        }
    };

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                PayTM App
            </div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello, {firstName}
                </div>
                <div className="relative">
                    <div 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2 cursor-pointer hover:bg-slate-300"
                    >
                        <div className="flex flex-col justify-center h-full text-xl">
                            {firstName[0]?.toUpperCase()}
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};