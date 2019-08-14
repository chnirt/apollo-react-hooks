import gql from 'graphql-tag'

const GET_ALL_SITES = gql`
	query {
		sites {
			_id
			name
		}
	}
`

const GET_MENU_ORDERS = gql`
	query($siteId: String!) {
		menuOrder(siteId: $siteId) {
			menuId
			dishes {
				dishId
				name
				MyOrderQuantity
				orderQuantityNow
				orderQuantityMax
			}
		}
	}
`

const ORDER_DISH = gql`
	mutation($input: OrderInput!) {
		orderDish(input: $input) {
			_id
			userId
			menuId
			dishId
			note
			count
			isConfirmed
			createdAt
			updatedAt
		}
	}
`

const GET_MENU_PUBLISH_BY_SITE_ID = gql`
	query($siteId: String!) {
		findMenuPublishBySiteId(siteId: $siteId) {
			_id
			name
			shopId
			siteId
		}
	}
`

const ORDER_SUBSCRIPTION = gql`
	subscription {
		isUpdated
	}
`
export {
	GET_ALL_SITES,
	GET_MENU_PUBLISH_BY_SITE_ID,
	GET_MENU_ORDERS,
	ORDER_DISH,
	ORDER_SUBSCRIPTION
}
