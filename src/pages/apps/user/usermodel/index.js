import React from 'react'


export default function Usermodel(props) {
  console.log(props)
  return props.id ? 
    <div>UserModel Update</div> : 
    <div>UserModel Create</div>
  
}