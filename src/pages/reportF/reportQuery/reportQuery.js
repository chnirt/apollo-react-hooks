import gql from 'graphql-tag'

const MENU_PUBLISH_BY_SITE = gql`
	query($siteId: String!) {
		menuPublishBySite(siteId: $siteId) {
			name
			_id
			siteId
			shopId
			dishes {
				name
				count
				_id
			}
			isLocked
			isPublished
			isActive
		}
	}
`

const LOCK_UNLOCK_MENU = gql`
	mutation($id: String!) {
		lockAndUnlockMenu(id: $id)
	}
`

const COUNT_BY_MENU = gql`
	query($menuId: String!) {
		countByMenuJ(menuId: $menuId) {
			userId
			dishId
			_id
			count
			note
		}
	}
`

const ORDER_DISH = gql`
	mutation($input: OrderJInput!) {
		orderJDish(input: $input) {
			_id
			dishId
			note
			count
		}
	}
`

const UPDATE_ORDERJ = gql`
	mutation($userId: String!, $input: OrderJInput!) {
		updateOrderJ(input: $input, userId: $userId) {
			dishId
			note
			count
		}
	}
`

const CLOSE_MENU = gql`
	mutation($id: String!) {
		closeMenu(id: $id)
	}
`

const USER = gql`
	query($_id: ID!) {
		user(_id: $_id) {
			fullName
		}
	}
`

export {
	MENU_PUBLISH_BY_SITE,
	LOCK_UNLOCK_MENU,
	COUNT_BY_MENU,
	ORDER_DISH,
	UPDATE_ORDERJ,
	CLOSE_MENU,
	USER
}
