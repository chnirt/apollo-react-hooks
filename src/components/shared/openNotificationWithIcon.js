import { notification } from 'antd'

export default function openNotificationWithIcon(
	type,
	key,
	message,
	description
) {
	notification[type]({
		key,
		message,
		description,
		placement: 'bottomRight',
		duration: 2
	})
}
