import React, { useState } from 'react'
import gql from 'graphql-tag'
// import { useMutation } from '@apollo/react-hooks'
import { Button } from 'antd'
import { graphql, compose } from 'react-apollo'

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
	return (
		<>
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
