

const base64 = require('base-64');

export const Basic_Auth = new Headers();
Basic_Auth.append("Authorization", "Basic " + base64.encode("admin:admin@123") );

// export const Cass_BaseURL = "http://appbox.website/casstimesheet/api/"

export const Cass_BaseURL = "http://appbox.website/casstimesheet_beta/api/"

export const Cass_APIKEY = "&X-API-KEY=b8f2-bba0-bG9s-OnNlY3-VyZQ"
export const Cass_APIDetails = "b8f2-bba0-bG9s-OnNlY3-VyZQ"
export const Cass_AuthDetails = "admin:admin@123"
//.....Registration_Modules.....//
export const User_Login = Cass_BaseURL + "user/login"
export const User_ForgotPassword = Cass_BaseURL + "user/forgot_password?email="

// export const Basic_Auth_EX = new Headers({
//     'Authorization': "Basic " + base64.encode("admin:admin@123"),
//     'X-API-KEY': "b8f2-bba0-bG9s-OnNlY3-VyZQ",
// }),
//.....Main_Modules.....//

export const User_Info = Cass_BaseURL + "user/info?user_id="
export const Message_List = Cass_BaseURL + "message/list?user_id="
export const Notification_List = Cass_BaseURL + "notification/list?user_id="

//.....Settings_Modules.....//

export const User_Update = Cass_BaseURL + "user/update"
export const User_Logout = Cass_BaseURL + "user/logout"
export const User_Readstatus = Cass_BaseURL + "user/read_status"
export const User_Changepassword = Cass_BaseURL + "user/password_update"

//.....Timesheets_Modules.....//

export const User_EngineersList = Cass_BaseURL + "user/engineers_list?user_id="
export const User_DepartmentsList = Cass_BaseURL + "user/departments_list?user_id="
export const User_WorkItems = Cass_BaseURL + "user/work_items?user_id="

export const List_Timesheet = Cass_BaseURL + "timesheet/list?user_id="
export const Job_list = Cass_BaseURL + "timesheet/job_list?user_id="

export const Timesheet_Add = Cass_BaseURL + "timesheet/add"
export const Timesheet_Update = Cass_BaseURL + "timesheet/update"
export const Timesheet_Delete = Cass_BaseURL + "timesheet/delete"
export const User_Authinfo = Cass_BaseURL + "timesheet/check_login_status?user_id="

//.....Leave_Modules.....//

export const List_Leave = Cass_BaseURL + "leave/list?user_id="
export const Leave_Add = Cass_BaseURL + "leave/add"
export const Calender_Details = Cass_BaseURL + "timesheet/calendar_details?user_id="
// http://appbox.website/casstimesheet/api/leave/list?user_id=1&user_role=1&X-API-KEY=b8f2-bba0-bG9s-OnNlY3-VyZQ
