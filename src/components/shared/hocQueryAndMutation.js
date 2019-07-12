import React from 'react'
import { Skeleton } from 'antd'
import { graphql, compose, withApollo } from 'react-apollo'

// data = [
//   { query: ``, variables: {} },
//   { query: ``, options: (props) => ({}) },
//   { mutation: ``, name: '', options: {} }
// ]
const HOCQueryMutation = data => Component => {
	if (data === undefined) return compose(withApollo)(Component)
	else {
		try {
			let k = -1
			const GraphQLComponent = data.map((QueryOrMutate, idx) => {
				if (QueryOrMutate.query) {
					// if (!!QueryOrMutate.variables) {
					// 	return graphql(QueryOrMutate.query, {
					// 		options: QueryOrMutate.options
					// 	})
					// } else

					if (!!QueryOrMutate.options) {
						return graphql(QueryOrMutate.query, {
							options: QueryOrMutate.options,
							name: QueryOrMutate.name
						})
					}
					return graphql(QueryOrMutate.query, {
						name: QueryOrMutate.name
					})
				} else {
					if (k === -1) k = idx
					return graphql(QueryOrMutate.mutation, {
						name: QueryOrMutate.name,
						options: QueryOrMutate.options
					})
				}
			})
			const WrapComponent = props => {
				if (!!props.data) {
					const { loading, error } = props.data
					if (error) {
						console.log('HOCQueryMutation error ', error)
						return <Skeleton active />
					}
					if (loading) return <Skeleton active />
				}
				let wrapProps = { ...props }
				for (let QueryOrMutate of data) {
					if (QueryOrMutate.mutation) {
						wrapProps.mutate = {
							...wrapProps.mutate,
							[QueryOrMutate.name]: props[QueryOrMutate.name]
						}
					
						delete wrapProps[QueryOrMutate.name]
						
					}
					
				}
				return <Component {...wrapProps} />
			}
			return compose(...GraphQLComponent)(WrapComponent)
		} catch (e) {
			return compose(withApollo)(Component)
		}
	}
}

export { HOCQueryMutation }
