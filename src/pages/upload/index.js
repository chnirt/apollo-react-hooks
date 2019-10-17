import React, { useState } from 'react'
import gql from 'graphql-tag'
// import { useMutation } from '@apollo/react-hooks'
import { Upload, Button, Icon } from 'antd'
import { graphql, compose } from 'react-apollo'
import './index.scss'

function UploadFile(props) {
	const [fileUpload, setFileUpload] = useState('')
	// const [singleUpload] = useMutation(UPLOAD_FILE)
	function uploadFile(e) {
		const Files = e.target.files
		setFileUpload(Files[0])
		const arr = [...fileUpload]
		console.log(arr)
	}

	function exportToDB() {
		console.log(fileUpload)
		props.uploadFile({
			variables: {
				file: fileUpload
			}
		})
	}

	const props1 = {
		// name: 'file',
		// action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
		// headers: {
		// 	authorization: 'authorization-text'
		// },
		onChange(info) {
			console.log(info)
			// if (info.file.status !== 'uploading') {
			// 	console.log(info.file, info.fileList)
			// }
			// if (info.file.status === 'done') {
			// 	message.success(`${info.file.name} file uploaded successfully`)
			// } else if (info.file.status === 'error') {
			// 	message.error(`${info.file.name} file upload failed.`)
			// }
		}
	}

	return (
		<>
			<Upload {...props1}>
				<Button>
					<Icon type="upload" /> Upload
				</Button>
			</Upload>
			<input type="file" required onChange={uploadFile} />
			<Button onClick={exportToDB}>Upload</Button>
		</>
	)
}

const UPLOAD_FILE = gql`
	mutation($file: Upload!) {
		uploadFile(file: $file)
	}
`

export default compose(
	graphql(UPLOAD_FILE, {
		name: 'uploadFile'
	})
)(UploadFile)
