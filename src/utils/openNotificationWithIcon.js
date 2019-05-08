import { notification } from 'antd'

const openNotificationWithIcon = (type, key, message, description) => {
	notification[type]({
		key,
		message,
		description,
		placement: 'bottomRight'
	})
}

export default openNotificationWithIcon
