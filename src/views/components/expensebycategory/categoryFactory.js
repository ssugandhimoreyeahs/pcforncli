import Store from "../../../reducers/store";

class CategoryFactory{
    
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
}

export default new CategoryFactory;


