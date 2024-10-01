import React from 'react'
import { Link } from "react-router-dom"

interface HeaderProps {
    signOut: any
}

export default function Header({signOut}: HeaderProps) {
  return (
    <div>
      <Link to={"/"}>Home</Link>
      <Link to={"/industries"}>Industries</Link>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
