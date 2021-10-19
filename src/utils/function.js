
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import isDate from 'date-fns/isDate'
import viLocale from "date-fns/locale/vi";

export const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementLastRows = data.length - (numColumns * numberOfFullRows);

    while (numberOfElementLastRows !== numColumns && numberOfElementLastRows !== 0) {
        data.push({ key: `blank-${numberOfElementLastRows}`, empty: true })
        numberOfElementLastRows += 1;
    }
    return data;
}

export const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",", symbolSign) => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";
        const currencySymbol = symbolSign ? symbolSign : ""
        let amountConvert = amount.toString().replace(new RegExp(thousands, 'g'), "")
        let i = parseInt(amountConvert = Math.abs(Number(amountConvert) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return currencySymbol + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amountConvert - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

export const getFormattedDate = (date) => {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
}

export const convertDataAddressFromCacheToDatatable = (dataProvince, dataDistrict, dataWard) => {
    let data = []
    data = dataProvince.map((itemp, index) => {
        //thêm trường key, label để component hoá data
        itemp.key = itemp.ProvinceID
        itemp.label = itemp.ProvinceName
        //lấy danh sách quận/huyện theo tỉnh
        let data1 = dataDistrict.filter((item1, index) => { return itemp.ProvinceID === item1.ProvinceID })
        //thay đổi data quận huyện lấy được từ trên
        data1.map((itemd) => {
            //thêm trường key, label để component hoá data
            itemd.key = itemd.DistrictID
            itemd.label = itemd.DistrictName
            //lấy danh sách phường/xã theo quận/huyện
            let data2 = dataWard.filter((item2) => { return itemd.DistrictID === item2.DistrictID })
            data2.map((itemw) => {
                //thêm trường key, label để component hoá data
                itemw.key = itemw.WardID
                itemw.label = itemw.WardName
                return itemw
            })
            itemd.children = data2
            return itemd
        })
        itemp.children = data1
        return itemp
    })
    return data;
}

export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getOnlyNumber = (value, maxLength = 0, upwardLimit, downwardLimit) => {
    let valueRevert = value;
    if (maxLength > 0) {
        valueRevert = valueRevert.substring(0, maxLength)
    }
    valueRevert = valueRevert.toString().replace(new RegExp(',', 'g'), "")
    const reg = new RegExp('^\\d+$');
    if (reg.test(valueRevert) || valueRevert == '') {
        if (valueRevert == '') {
            return valueRevert;
        }
        // else {
        //     if (valueRevert <= upwardLimit) {
        //         return formatMoney(valueRevert, 0);
        //     }
        //     else {
        //         return formatMoney(upwardLimit, 0);
        //     }
        // }
        return formatMoney(valueRevert, 0);
    }
    else {
        return formatMoney(valueRevert.slice(0, -1), 0);
    }
}


export const regExEmail = new RegExp(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
export const PrefixMobileNumber = ['099', '059', '086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039', '089', '090', '093', '070', '077', '076', '078', '088', '091', '094', '081', '082', '083', '085', '085', '092', '056', '058'];
export const regExNumber = new RegExp(/^ *[0-9]+ *$/);

export const checkPhoneNumber = (phoneNumber = '') => {
    let errorsMess = '';
    const subPhoneNumberTheFirst = phoneNumber.substring(0, 1);
    const subPhoneNumber = phoneNumber.substring(0, 3);
    switch (true) {
        case phoneNumber.length <= 0:
            errorsMess = 'Vui lòng nhập số điện thoại'
            break;
        case subPhoneNumberTheFirst != '0':
            errorsMess = 'Số điện thoại bắt đầu bằng số 0';
            break;
        case phoneNumber.indexOf('.') > -1:
            errorsMess = 'Vui lòng luôn nhập số điện thoại là số';
            break;
        case phoneNumber.length < 10:
            errorsMess = 'Số điện thoại phải đủ 10 số';
            break;
        case regExNumber.test(phoneNumber) == false:
            errorsMess = 'Số điện thoại không đúng định dạng';
            break;
        case PrefixMobileNumber.includes(subPhoneNumber) == false:
            errorsMess = 'Không đúng định dạng đầu số di động';
            break;
    };
    return errorsMess;
}

export const getDisplayDetailModalAlert = (statusID, title, content, type = 'error', action = '') => {
    switch (statusID) {
        case 18:
            title = 'Cảnh báo'
            content = 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại'
            type = 'warning'
            action = '1'
            break;
        case 23:
            title = 'Cảnh báo đăng nhập thiết bị mới'
            content = `Vui lòng xác nhận OTP để thay đổi thiết bị sử dụng tài khoản`
            type = 'warning'
            action = '1'
            break;
        default:

            break;
    }
    return { title, content, action, type }
}

const COUNT_FORMATS = [
    { // 0 - 999
        letter: '',
        limit: 1e3
    },
    { // 1,000 - 999,999
        letter: 'K',
        limit: 1e6
    },
    { // 1,000,000 - 999,999,999
        letter: 'M',
        limit: 1e9
    },
    { // 1,000,000,000 - 999,999,999,999
        letter: 'B',
        limit: 1e12
    },
    { // 1,000,000,000,000 - 999,999,999,999,999
        letter: 'T',
        limit: 1e15
    }
];

export function formatCount(value) {
    const format = COUNT_FORMATS.find(format => (value < format.limit));

    value = (1000 * value / format.limit);
    value = Math.round(value * 10) / 10; // keep one decimal number, only if needed

    return (value + format.letter);
}

export const formatDistanceToNowVi = (date = new Date().toISOString()) => {
    let result = isDate(new Date(date))
    if (result) {
        return formatDistanceToNow(new Date(date),
            { addSuffix: true, locale: viLocale }
        )
    }
    return ''
}

export function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export function validatePhoneNumber(phoneNumber) {
    var re = /^[0-9\+]{9,14}$/;
    return re.test(phoneNumber);
}