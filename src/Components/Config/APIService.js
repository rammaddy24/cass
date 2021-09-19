import axios from 'axios';
import {
  User_Login, User_Update, User_ForgotPassword, User_Info,
  User_EngineersList, User_DepartmentsList, User_WorkItems,
  Job_list, Timesheet_Add, Timesheet_List, Timesheet_Update, Timesheet_Delete,
  Message_List, Notification_List,
  SerachList_URL
} from './Server';


let details = {
  "Username": "admin",
  "Password": "admin@123"
};


export default (APIService = {

  // Get_NotificationList(User_Id,User_Role,callback) {
    
  //  axios.get("https://chennai.cricket-21.com/cricketapi/api/Cricketapp/Venue?CompId=810" ,{
  //     //.get(Notification_List + "?user_id=" + User_Id+ "&user_role=" + User_Role + "&X-API-KEY=b8f2-bba0-bG9s-OnNlY3-VyZQ")
  //     // .headers({
  //     //   'Authorization': 'Basic Auth',
  //     //   auth: {
  //     //     username: '',
  //     //     password: '' // Bad password
  //     //   }
  //     // })
  //    // axios.get(Notification_List + "?user_id=1&user_role=1&X-API-KEY=b8f2-bba0-bG9s-OnNlY3-VyZQ", {
  //   //params: params,
  //  // withCredentials: true,
    
  // })
  //     .then(res => {

  //       callback(null, res.data);
  //     })
  //     .catch(err => {
  //       callback(err, null);
  //     });
  // },

  Get_NotificationList(PlayerListName, UserId, callback) {
    
      let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
      fetch('http://appbox.website/casstimesheet/api/notification/list?user_id=1&user_role=1&X-API-KEY=b8f2-bba0-bG9s-OnNlY3-VyZQ', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic Auth',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody

    })
        .then((response) => response.json())
        .then((res) => {
          callback(null, res);
         // console.error(res)
        })
        .catch((error) => {
         // console.error(err)
  
          callback(err, null);
        });
  },
  

  // Get_NotificationList(PlayerListName, UserId, callback) {
  //   axios
  //     .post("https://chennai.cricket-21.com/cricketapi/api/Cricketapp/Venue?CompId=810")
  //     .then(res => {
  //       console.error(res)

  //       callback(null, res.data)
  //     })
  //     .catch(err => {
  //       console.error(err)

  //       callback(err, null);
  //     });
  // },
  get_Authorization(callback) {

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(Authorization_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    })
      .then((response) => response.json())
      .then((res) => {
        callback(null, res);
      })
      .catch((error) => {
        callback(err, null);
      });
  },

  get_CompteamName(url, callback) {

    let token = "bearer wDZ7x3eyAEa0Z-4Jff45zc3SeLSBQU9xMka7dqOp2iLPTQT5c0dO51iToXZwsNPXuJ8cIV5S8JJqP2uuJ5mrmyJwtM0QY8sy87rsfy2-8hlewd3nwlOpfqnbMbTakwItSATLmqsKYk5Y_lXE7AD7cxvhMR5zS_GuTUEz1aF90y3O7a_IE5bcz7_oCWeaDzU-2i6_2U83892W_Xri3aVBs-8e2QF2nONkQ7X0NHy4sI9U6VaTdLSUxKFnzbscTdHLiv-tWccVv40zx_nFSozM93pw_HGDbe9pLvWW1Qqe08c";
    axios.get(CompName_Yearwise_URL + url,
      { headers: { 'Authorization': token, 'Content-Type': 'application/x-www-form-urlencoded' } })
      .then(res => {
        callback(null, res.data);
      })
      .catch((err) => {
        callback(err, null);
      });
  },


  getCreatePlayList(PlayerListName, UserId, callback) {
    axios
      .post(CreatePlayList_URL + PlayerListName + "&userid=" + UserId)
      .then(res => {
        callback(null, res.data)
      })
      .catch(err => {
        callback(err, null);
      });
  },


});



