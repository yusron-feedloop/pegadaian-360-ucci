import dayjs from "dayjs";
import 'dayjs/locale/id'
import  customParseFormat from 'dayjs/plugin/customParseFormat'


dayjs.locale('id')
dayjs.extend(customParseFormat)


export {
    dayjs as dateTime
}
