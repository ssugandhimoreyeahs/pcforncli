export const CONNECTION_ABORTED = "Error in server, please try later";
export const INVALID_CREDENTIALS = "Invalid Credentials";
export const TRY_AGAIN = "Error, Try Again!";
export const USER_EXIST = "User Already Exist";
export const SETTING_UPDATED = "User Setting Successfully Updated";
export const PASSWORD_UPDATED = "Password Successfully Updated";
export const INVALID_OLD_PASSWORD = "Invalid Old Password";
export const BUSINESS_PROFILE_CREATED = "You have successfully created your business profile.";
export const BUSINESS_PROFILE_UPDATED = "You have successfully updated your business profile.";
export const FORGET_PASSWORD_SEND = "Your password was successfully sent to your business email address.";
export const SURE_UNLINK_ACCOUNT = "Do you really want to Disconnect the account?";
export const SURE_RELINK_ACCOUNT = "Do you really want to Connect the account?";
export const ERROR = {
    title: "Something went wrong",
    message: "Please try again."
}

export const INSIGHTS = {
    title: `Coming soon`,
    message: `We are building your personalized Pocket Insights. We will notify you when they are ready.`,
    button1 : `Okay` 
}
export const TERMINOLOGY = {
    
    OUTOFCASHDATE : {
        title : 'OUT OF CASH DATE',
        message : `Out-of-Cash Date is the date at which your company will run out of money based on your current cash on hand and burn rate. The duration of time from now to your out-of-cash date is called runway.`,
        button1: "Okay"
    },
    CASHONHAND : {
        title : 'CASH ON HAND',
        message : 'Cash on Hand is the money in your bank that is immediately available to your business.',
        button1: "Okay"
    },
    CHANGEINCASH: {
        title : 'CHANGE IN CASH',
        message : 'The change in cash is the difference between the inflows (deposits, accounts receivables, equity or debt proceeds) and outflows (debits for bills, etc). ',
        button1: "Okay"
    },
    EXPENSEBYCATEGORY : {
        title : "EXPENSE BY CATEGORY",
        message : "Your expenses are categorized into these default categories to help you see where you spent the money. You can edit these categories here or connect your ledge to import your categories.",
        button1: "Okay"
    }
    
}
export const CHANGECATEGORY = {
    title : "Category Change",
    message : "Are you sure to change this category?",
    button1: "Cancel",button2: "Confirm"
}
export const ERRORCATEGORY = {
    title : "Message",
    message : "Something went wrong!",
    button1: "Cancel"
}
export const ADDEDCATEGORY = {
    title : "Message",
    message : "Category Successfully Added",
    button1: "Okay"
}
export const DELETECATEGORY = {
    title: "Delete Category",
    message: (categoryName="") => { return `Are you sure to delete category - ${categoryName} of the category?` },
    button1: "Cancel",
    button2: "Delete"

}

export const BANK_CONNECTION = {
    title: "Bank Connection",
    message: "Connect your bank and get a complete picture of your cash flow in one place.",
    button1: "Cancel",
    button2: "Connect"
}
export const BANK_CREDENTIALS_CHANGE = {
    title: "Bank Connection",
    message: "Bank Credentials Changed Please Connect to Bank Again",
    button1: "Cancel",
    button2: "Connect"
}

export const QUICKBOOKS_ERROR = {
    title: "Quickbooks Connection",
    message: "Somethings went wrong with Quickbooks Please Reconnect Quickbooks",
    button1: "Cancel",
    button2: "Connect"
}

export const EXIT_APP = {
    title: 'Exit App',
    message: "Sure exit from PocketCFO?",
    button1: "Cancel",
    button2: "Exit"
}