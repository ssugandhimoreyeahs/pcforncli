
import Moment from "moment";

export function getUpdatedForecast1(outOfCastDate,coh, expense, sales){

    console.log("forecast recieve here -------------- ");
    console.log(outOfCastDate,coh,expense,sales);
    console.log("--------------------------------");
    expense = -expense;
    console.log("real expense value  here --- ",expense);
    let finalData;
    let avgPerDay = (expense+sales)/90;
    let dayCount = coh/avgPerDay;
    let  finalDays = Math.abs(parseInt(dayCount));
    let remainingDays = new Date(new Date(outOfCastDate).getFullYear(), new Date(outOfCastDate).getMonth(), new Date(outOfCastDate).getDate() + finalDays);
    let updateDateOne = Moment(remainingDays).format("YYYY-MM-DD");
    console.log("Moment working here --- ",Moment("2020-03-01").format("DD-MM-YYYY"));
    if (avgPerDay < 0) {
        //finalData = `${remainingDays[1]} ${remainingDays[2]},${remainingDays[3]}`;
        finalData = updateDateOne;
    } else {
        finalData = "Positive Cash Flow";
        avgPerDay = 0;
    }
    return { updatedOutofCashDate:finalData, daysAdded:finalDays };

}


export function getUpdatedForecast2(outOfCastDate,coh, expense, sales){
    let finalData;
    let cool = parseFloat(-expense).toFixed(2);
    let toocool = parseFloat(sales).toFixed(2);
    let avgPerDay = (parseFloat((cool+toocool)).toFixed(2))/90;
    let dayCount = coh/avgPerDay;
    let  finalDays = Math.abs(parseInt(dayCount));
    let remainingDays = new Date(new Date(outOfCastDate).getFullYear(), new Date(outOfCastDate).getMonth(), new Date(outOfCastDate).getDate() + finalDays);
    let updateDateOne = Moment(remainingDays).format("YYYY-MM-DD");
    if (avgPerDay < 0) {
        //finalData = `${remainingDays[1]} ${remainingDays[2]},${remainingDays[3]}`;
        finalData = updateDateOne;
    } else {
        finalData = "Positive Cash Flow";
        avgPerDay = 0;
    }
    return { updatedOutofCashDate:finalData, daysAdded:finalDays };

}


export function getUpdatedForecast3(outOfCastDate,coh, expense, sales,mainCoh, mainDate, isPositive){
    console.log("-----------getting main coh--------------------- ", mainCoh);
    //coh = 0;
    let finalData;
    let remainingDays;
    let cool = -parseFloat(expense).toFixed(2);
    let toocool = parseFloat(sales).toFixed(2);
    let avgPerDay = (parseFloat((cool+toocool)).toFixed(2))/90;
    let dayCount = coh/avgPerDay;
    let  finalDays = Math.abs(parseInt(dayCount));
    if(mainCoh < coh){
    remainingDays = new Date(new Date(mainDate).getFullYear(), new Date(mainDate).getMonth(), new Date(mainDate).getDate() + finalDays);
    }else{
    remainingDays = new Date(new Date(mainDate).getFullYear(), new Date(mainDate).getMonth(), new Date(mainDate).getDate() - finalDays);

    }
    let updateDateOne = Moment(remainingDays).format("YYYY-MM-DD");
    if (avgPerDay < 0) {
        //finalData = `${remainingDays[1]} ${remainingDays[2]},${remainingDays[3]}`;
        finalData = updateDateOne;
    } else {
        finalData = "Positive Cash Flow";
        avgPerDay = 0;
    }
    return { updatedOutofCashDate:finalData, daysAdded:finalDays };

}


export function getUpdatedForecast(outOfCastDate,coh, expense, sales,mainCoh, mainDate, isPositive){
    if(isPositive == true){
        mainDate = Moment(new Date()).format("YYYY-MM-DD");
       // console.log("Trigger her ");
    }
    // console.log("response recieve here --- ");
    // console.log("main coh - ",mainCoh);
    // console.log("Coh - ",coh);
    // console.log("expense - ",expense);
    // console.log("sales - ",sales);
    // console.log("Ends here --");
    let finalData;
    let remainingDays;
    let newExpenses= -Math.abs(parseFloat(expense));
    let newSales= Math.abs(parseFloat(sales));
    let avgPerDay = (parseFloat((newExpenses+newSales)).toFixed(2))/90;
    let dayCount = coh/avgPerDay;
    let  finalDays = Math.abs(parseInt(dayCount));
    //console.log("Getting the avg here  - ",avgPerDay);
    if(coh == 0){

        remainingDays = Moment(new Date()).format("YYYY-MM-DD");
        finalData = remainingDays;
        
    }else if(mainCoh <= coh){
    
    remainingDays = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + finalDays);

    let updateDateOne = Moment(remainingDays).format("YYYY-MM-DD");
    if (avgPerDay < 0) {
        //finalData = `${remainingDays[1]} ${remainingDays[2]},${remainingDays[3]}`;
        finalData = updateDateOne;
    } else {
        finalData = "Positive Cash Flow";
        avgPerDay = 0;
    }
    }else if(mainCoh > coh){
       
        remainingDays = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + finalDays);
    //console.log("case here ---- ",remainingDays);
    let updateDateOne = Moment(remainingDays).format("YYYY-MM-DD");
    if (avgPerDay < 0) {
        //finalData = `${remainingDays[1]} ${remainingDays[2]},${remainingDays[3]}`;
        finalData = updateDateOne;
    } else {
        finalData = "Positive Cash Flow";
        avgPerDay = 0;
    }
    

    }
    
    return { updatedOutofCashDate:finalData, daysAdded:finalDays };

}


// export function getUpdatedForecast4(outOfCastDate,coh, expense, sales,mainCoh, mainDate, isPositive){
//     let finalData;
//     let remainingDays;
//     let newExpenses= -parseFloat(expense).toFixed(2);
//     let newSales= parseFloat(sales).toFixed(2);
//     avgPerDay = (parseFloat((newExpenses+newSales)).toFixed(2))/90;
//     console.log(avgPerDay);
//     const dayCount = currentBalance.amount / avgPerDay;
//     const finalDays = Math.abs(parseInt(dayCount));
//     console.log(finalDays);
//     const remainingDays = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + finalDays).toDateString().split(" ");
//     console.log(remainingDays);
//     if(mainCoh < coh){
//     remainingDays = new Date(new Date(mainDate).getFullYear(), new Date(mainDate).getMonth(), new Date(mainDate).getDate() + finalDays);
//     }else{
//     remainingDays = new Date(new Date(mainDate).getFullYear(), new Date(mainDate).getMonth(), new Date(mainDate).getDate() - finalDays);

//     }
//     let updateDateOne = Moment(remainingDays).format("YYYY-MM-DD");
//     if (avgPerDay < 0) {
//     finalData = updateDateOne;
//     } else {
//     finalData = "Positive Cash Flow";
//     }
//     return { updatedOutofCashDate:finalData, daysAdded:finalDays };
//     }