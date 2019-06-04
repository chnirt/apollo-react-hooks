import React, { useState } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { AgGridReact } from 'ag-grid-react'
import CustomLoadingOverlay from '../../../components/shared/customLoadingOverlay'
import CustomNoRowsOverlay from '../../../components/shared/customNoRowsOverlay'

function Dashboard(props) {
	const [rowData, setRowData] = useState(null)
	const columnDefs = [
		{
			headerName: 'Id',
			field: '_id',
			filter: 'agTextColumnFilter',
			// suppressMenu: true,
			// enablePivot: true,
			// rowGroup: true
			// suppressSizeToFit: true,
			checkboxSelection: function(params) {
				return params.columnApi.getRowGroupColumns().length === 0
			},
			headerCheckboxSelection: function(params) {
				return params.columnApi.getRowGroupColumns().length === 0
			}
		},
		{
			headerName: 'Email',
			field: 'email',
			filter: 'agTextColumnFilter'
		},
		{
			headerName: 'Username',
			field: 'username',
			filter: 'agTextColumnFilter'
		}
	]
	const defaultColDef = {
		sortable: true,
		filter: true,
		resizable: true
	}
	const frameworkComponents = {
		customLoadingOverlay: CustomLoadingOverlay,
		customNoRowsOverlay: CustomNoRowsOverlay
	}
	const loadingOverlayComponent = 'customLoadingOverlay'
	// const loadingOverlayComponentParams = {
	// 	loadingMessage: 'One moment please...'
	// }
	const noRowsOverlayComponent = 'customNoRowsOverlay'
	// const noRowsOverlayComponentParams = {
	// 	noRowsMessageFunc: 'Sorry - no rows! at: ' + new Date()
	// }
	// const autoGroupColumnDef = {
	// 	headerName: 'Model',
	// 	field: 'model',
	// 	cellRenderer: 'agGroupCellRenderer',
	// 	cellRendererParams: {
	// 		checkbox: true
	// 	}
	// }
	const statusBar = {
		statusPanels: [
			{
				statusPanel: 'agTotalRowCountComponent',
				align: 'left'
			},
			{ statusPanel: 'agFilteredRowCountComponent' },
			{ statusPanel: 'agSelectedRowCountComponent' },
			{ statusPanel: 'agAggregationComponent' }
		]
	}
	function onGridReady(params) {
		this.gridApi = params.api
		this.gridColumnApi = params.columnApi
		props.client
			.query({ query: USERS })
			.then(res => {
				setRowData(res.data.users)
			})
			.catch(err => {
				console.log(err)
			})
		this.gridApi.sizeColumnsToFit()
	}
	return (
		<>
			Dashboard
			<div
				className="ag-theme-balham"
				style={{
					height: '500px',
					width: '100%'
				}}
			>
				<AgGridReact
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					animateRows={true}
					rowData={rowData}
					onGridReady={onGridReady}
					floatingFilter={true}
					rowSelection={'multiple'}
					// groupSelectsChildren={true}
					// autoGroupColumnDef={autoGroupColumnDef}
					frameworkComponents={frameworkComponents}
					loadingOverlayComponent={loadingOverlayComponent}
					// loadingOverlayComponentParams={
					// 	loadingOverlayComponentParams
					// }
					noRowsOverlayComponent={noRowsOverlayComponent}
					// noRowsOverlayComponentParams={
					// 	noRowsOverlayComponentParams
					// }
					// onFirstDataRendered={this.onFirstDataRendered.bind(this)}
					enableRangeSelection={true}
					statusBar={statusBar}
					pagination={true}
					// debug={true}
				/>
			</div>
		</>
	)
}

const USERS = gql`
	query {
		users {
			_id
			username
			email
			firstLetterOfEmail
			chats {
				_id
				users {
					_id
				}
				messages {
					_id
				}
				lastMessage {
					_id
				}
			}
		}
	}
`

export default withApollo(Dashboard)
