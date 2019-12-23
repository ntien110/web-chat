class Constants {
    constructor() {
        // all the URLs
        this.url = 'http://192.168.1.224:3000';
        this.login = `${this.url}/`;
        this.register = `${this.url}/register`;
        this.getUser = `${this.url}/getUser`;
        this.editUser = `${this.url}/editUser`;
        this.checkUsername = `${this.url}/register/{username}`;
        this.getConversation = `${this.url}/getMessage`;
        this.getRooms = `${this.url}/rooms`;
        this.webSocketServer = 'http://127.0.0.1:3002';

        // initialize
        this.theWeek = makeFormattedWeek();
        this.formatDate = (dateReceived) => {
            return `${new Date(dateReceived).getDate()}/${new Date(dateReceived).getMonth() + 1}/${new Date(dateReceived).getFullYear()}/${new Date(dateReceived).getHours}/${new Date(dateReceived).getMinutes}`;
        }
        this.formatDates = (dateReceived) => {
            console.log(dateReceived);
            if (this.theWeek[dateReceived.substring(0, dateReceived.indexOf('T'))]) {
                let formattedDate = this.theWeek[dateReceived.substring(0, dateReceived.indexOf('T'))]
                return (formattedDate === 'Today') ? dateReceived.substr(dateReceived.indexOf('T') + 1, 5) : formattedDate
            } else {
                return `${new Date(dateReceived).getDate()}/${new Date(dateReceived).getMonth() + 1}/${new Date(dateReceived).getFullYear()}`
            }
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