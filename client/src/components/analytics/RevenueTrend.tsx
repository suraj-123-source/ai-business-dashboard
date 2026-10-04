import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import api from "../../services/api";


interface RevenueData {
    month:string;
    revenue:number;
}


export default function RevenueTrend(){

    const [data,setData] = useState<RevenueData[]>([]);


    useEffect(()=>{

        api.get("/analytics/monthly-revenue")
        .then((response)=>{

            setData(response.data);

        })
        .catch((error)=>{
            console.log(error);
        })


    },[]);



    return(

        <div className="bg-white rounded-xl shadow p-6">


            <h2 className="text-xl font-semibold mb-5">
                Monthly Revenue Trend
            </h2>


            <ResponsiveContainer width="100%" height={350}>


                <LineChart data={data}>


                    <CartesianGrid 
                        strokeDasharray="3 3"
                    />


                    <XAxis 
                        dataKey="month"
                    />


                    <YAxis/>


                    <Tooltip/>


                    <Line
                        type="monotone"
                        dataKey="revenue"
                        strokeWidth={3}
                    />


                </LineChart>


            </ResponsiveContainer>


        </div>

    )

}