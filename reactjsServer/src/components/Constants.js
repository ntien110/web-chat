class Constants {
  constructor() {
      // all the URLs
      // this.link='blooming-cove-97725.herokuapp.com';
      // this.url = `https://${this.link}`;
      
      this.link='localhost';
      this.url = `https://${this.link}:3001`;


      this.webSocketServer = this.url;
      this.login = `${this.url}/`;
      this.register = `${this.url}/register`;
      this.getUser = `${this.url}/getUser`;
      this.editUser = `${this.url}/editUser`;
      this.checkUsername = `${this.url}/register/{username}`;
      this.getConversation = `${this.url}/getMessage`;
      this.getRooms = `${this.url}/rooms`;
      this.getListFriend = `${this.url}/listFriend`;
      this.getListWait = `${this.url}/listWait`;
      this.updateReadStatus = `${this.url}/updateReadStatus`;
      this.getAllStickers = `${this.url}/getAllStickers`;
      
      this.search = `${this.url}/searchUser`;

      // initialize
      
      this.theWeek = makeFormattedWeek();
      this.formatDates = (dateReceived) => {
          let date = (new Date(dateReceived)).toString();
          //let day = dateReceived.slice(0, 3);
          //let month = dateReceived.slice(4, 3);
          //let date = dateReceived.slice(8, 2);
          //let year = dateReceived.slice(11, 4);
          let today = date.slice(4, 15);
          let time = date.slice(16, 5);
          let datetime = date.slice(4, 21);

          return datetime;
          //}
          // if (this.theWeek[dateReceived.substring(0, dateReceived.indexOf('T'))]) {
          //     let formattedDate = this.theWeek[dateReceived.substring(0, dateReceived.indexOf('T'))]
          //     return (formattedDate === 'Today') ? dateReceived.substr(dateReceived.indexOf('T') + 1, 5) : formattedDate
          // } else {
          //return `${day}/${new Date(dateReceived).getMonth() + 1}/${new Date(dateReceived).getFullYear()}`
          // }
      }
  }
}
function makeFormattedWeek() {
  let theWeek = {}  
  // list of day names
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  for (let i = 0; i < 7; i++) {
    // reset today
    let today = new Date()

    // get the previous dates one at a time
    let prevDate = today.setDate(today.getDate() - i)

    // format previous date as per the need
    let prevDateStr = new Date(prevDate).toISOString()
    prevDateStr = prevDateStr.substring(0, prevDateStr.indexOf('T'))

    // fill the object accordingly
    theWeek[prevDateStr] = (i === 0) ? 'Today' : days[new Date(prevDate).getDay()]
  }
  return theWeek
}

export default Constants;