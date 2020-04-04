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
export const TERMINOLOGY = {

}