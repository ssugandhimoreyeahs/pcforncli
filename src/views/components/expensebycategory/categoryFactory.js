import Store from "../../../reducers/store";


export const getCategoryId = ( CategoryName = "" ) => {

    const plaidCategories = Store.getState().plaidCategoryData.category;
    let categoryId = "";
    for(let i=0;i < plaidCategories.length; i++){
        if(plaidCategories[i].categoryName === CategoryName){
            categoryId = plaidCategories[i].id;
            break;
        }  
    }

    return categoryId;
}

export const getCategoryName = ( CategoryId = "" ) => {

    const plaidCategories = Store.getState().plaidCategoryData.category;
    let categoryName = "";
    for(let i=0;i < plaidCategories.length; i++){
        if(plaidCategories[i].id === CategoryId){
            categoryName = plaidCategories[i].categoryName;
            break;
        }  
    }
    return categoryName;
}

export const getPlaidCategories = () => {
    return Store.getState().plaidCategoryData.category;
}

export const isCategoryExist = ( CategoryName = "" ) => {

    const plaidCategories = Store.getState().plaidCategoryData.category;
    let isCategoryExistFlag = false;
    for(let i=0;i < plaidCategories.length; i++){
        if(plaidCategories[i].categoryName.toLowerCase() === CategoryName.toLowerCase()){
            isCategoryExistFlag = true;
            break;
        }  
    }
    return isCategoryExistFlag;
}

/* class CategoryFactory{
    
    constructor(){
        this.plaidCategories = Store.getState().plaidCategoryData.category;
    }
    getCategoryId = ( CategoryName = "" ) => {
        const { plaidCategories } = this;
        let categoryId = "";
        for(let i=0;i < plaidCategories.length; i++){
            if(plaidCategories[i].categoryName === CategoryName){
                categoryId = plaidCategories[i].id;
                break;
            }  
        }

        return categoryId;
    }
    getCategoryName = ( CategoryId = "" ) => {

        const { plaidCategories } = this;
        let categoryName = "";
        for(let i=0;i < plaidCategories.length; i++){
            if(plaidCategories[i].id === CategoryId){
                categoryName = plaidCategories[i].categoryName;
                break;
            }  
        }

        return categoryName;

    }
    getPlaidCategories= () => {
        return this.plaidCategories;
    }
    isCategoryExist = ( CategoryName = "" ) => {

        const { plaidCategories } = this;
        let isCategoryExistFlag = false;
        for(let i=0;i < plaidCategories.length; i++){
            if(plaidCategories[i].categoryName.toLowerCase() === CategoryName.toLowerCase()){
                isCategoryExistFlag = true;
                break;
            }  
        }

        return isCategoryExistFlag;

    }
}

export default new CategoryFactory; */


